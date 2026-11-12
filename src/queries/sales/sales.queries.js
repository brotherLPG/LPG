import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getSales,
  getSaleById,
  getSaleFormOptions,
  createSale,
  updateSale,
  deleteSale,
} from "../../api/sales.api";
import { getLpgReceipts } from "../../api/lpgReceipts.api";
import { getFillingBatches } from "../../api/fillingBatches.api";
import { buildGasRate } from "../../utils/gasCost";

export const useSales = (params, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sales.list(params),
    queryFn: () => getSales(params),
    enabled: options.enabled ?? true,
  });
};

export const useSaleById = (id) => {
  return useQuery({
    queryKey: queryKeys.sales.detail(id),
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });
};

export const useGetSaleFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.sales.formOptions(),
    queryFn: () => getSaleFormOptions(),
  });
};

async function fetchAllPages(fetcher) {
  const first = await fetcher({ page: 1, limit: 100 });
  const items = [...(first?.data?.items || [])];
  const totalPages = Number(first?.data?.pagination?.totalPages) || 1;
  const pageCount = Math.min(totalPages, 20);
  for (let page = 2; page <= pageCount; page += 1) {
    const next = await fetcher({ page, limit: 100 });
    items.push(...(next?.data?.items || []));
  }
  return items;
}

export const useSaleGasRate = (serverGasRate) => {
  const hasServer = serverGasRate != null;
  const fallback = useQuery({
    queryKey: ["sales", "gas-rate-fallback"],
    enabled: !hasServer,
    retry: false,
    queryFn: async () => {
      const [receipts, batches] = await Promise.all([
        fetchAllPages(getLpgReceipts),
        fetchAllPages(getFillingBatches),
      ]);
      return buildGasRate(receipts, batches);
    },
  });

  if (hasServer) return serverGasRate;
  return fallback.data || null;
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    },
  });
};
