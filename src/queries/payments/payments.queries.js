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

export const useGetPayments = (params) => {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => getPayments(params),
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
