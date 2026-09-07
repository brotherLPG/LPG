import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getReturnSales,
  getReturnSaleById,
  createReturnSale,
  updateReturnSale,
  deleteReturnSale,
  getReturnSaleFormOptions,
} from "../../api/returnsale.api";

export const useReturnSales = (params) => {
  return useQuery({
    queryKey: queryKeys.returnSales.list(params),
    queryFn: () => getReturnSales(params),
  });
};

export const useReturnSaleById = (id) => {
  return useQuery({
    queryKey: queryKeys.returnSales.detail(id),
    queryFn: () => getReturnSaleById(id),
    enabled: !!id,
  });
};

export const useCreateReturnSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturnSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returnSales.all });
    },
  });
};

export const useUpdateReturnSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateReturnSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returnSales.all });
    },
  });
};

export const useDeleteReturnSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReturnSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returnSales.all });
    },
  });
};

export const useReturnSaleFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.returnSales.formOptions(),
    queryFn: getReturnSaleFormOptions,
  });
};
