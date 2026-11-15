import {
  keepPreviousData,
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
    placeholderData: keepPreviousData,
  });
};

function invoiceNumberParts(invoiceNumber) {
  return String(invoiceNumber || "").match(/\d+/g)?.map((part) => Number(part)) || [];
}

function compareLatestInvoice(left, right) {
  const leftParts = invoiceNumberParts(left?.invoiceNumber);
  const rightParts = invoiceNumberParts(right?.invoiceNumber);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (rightParts[index] || 0) - (leftParts[index] || 0);
    if (diff) return diff;
  }

  return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
}

async function fetchSalesLatestFirst(filters) {
  const limit = 100;
  const first = await getSales({ ...filters, page: 1, limit });
  const totalPages = Math.min(Number(first?.data?.pagination?.totalPages) || 1, 30);
  const rest = totalPages > 1
    ? await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          getSales({ ...filters, page: index + 2, limit })
        )
      )
    : [];
  const items = [
    ...(first?.data?.items || []),
    ...rest.flatMap((page) => page?.data?.items || []),
  ].sort(compareLatestInvoice);
  const total = Number(first?.data?.pagination?.total);

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
    summary: first?.data?.summary,
    meta: first?.data?.meta,
  };
}

export const useSalesLatestFirst = (params = {}, options = {}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const filters = { ...params };
  delete filters.page;
  delete filters.limit;

  const query = useQuery({
    queryKey: queryKeys.sales.list({ ...filters, order: "invoiceNumberDesc" }),
    queryFn: () => fetchSalesLatestFirst(filters),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
  });

  const allItems = query.data?.items || [];
  const total = query.data?.total ?? allItems.length;
  const start = (page - 1) * limit;

  return {
    ...query,
    data: query.data
      ? {
          data: {
            items: allItems.slice(start, start + limit),
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.max(1, Math.ceil(total / limit)),
            },
            summary: query.data.summary,
            meta: query.data.meta,
          },
        }
      : undefined,
  };
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
