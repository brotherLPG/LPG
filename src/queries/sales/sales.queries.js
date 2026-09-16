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
