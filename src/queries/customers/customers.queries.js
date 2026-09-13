import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getCustomers,
  deleteCustomer,
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomerSalesHistory,
  getCustomerPaymentHistory,
} from "../../api/customers.api";

export const useCustomers = (params) => {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => getCustomers(params),
  });
};

export const useCustomerById = (id) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerSalesHistory = (id, params) => {
  return useQuery({
    queryKey: queryKeys.customers.salesHistory(id, params),
    queryFn: () => getCustomerSalesHistory(id, params),
    enabled: !!id,
  });
};

export const useCustomerPaymentHistory = (id, params) => {
  return useQuery({
    queryKey: queryKeys.customers.paymentHistory(id, params),
    queryFn: () => getCustomerPaymentHistory(id, params),
    enabled: !!id,
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
};
