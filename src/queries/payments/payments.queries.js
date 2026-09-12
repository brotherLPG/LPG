import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentFormOptions,
} from "../../api/payments.api";

export const DEFAULT_PAYMENTS_LIST_PARAMS = {
  page: 1,
  limit: 10,
};

export const useGetPayments = (params = DEFAULT_PAYMENTS_LIST_PARAMS) => {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => getPayments(params),
    // staleTime: 5 * 60 * 1000,
  });
};

export const useGetPaymentById = (id) => {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
};

export const useGetPaymentFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.payments.formOptions(),
    queryFn: () => getPaymentFormOptions(),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};
