import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getSuppliers,
  deleteSupplier,
  createSupplier,
  updateSupplier,
  getSupplierById,
  getSupplierLedger,
  getSupplierPurchaseHistory,
  getSupplierPaymentHistory,
} from "../../api/suppliers.api";

export const useSuppliers = (params) => {
  return useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => getSuppliers(params),
  });
};

export const useSupplierById = (id) => {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};

export const useSupplierLedger = (id) => {
  return useQuery({
    queryKey: queryKeys.suppliers.ledger(id),
    queryFn: () => getSupplierLedger(id),
    enabled: !!id,
  });
};

export const useSupplierPurchaseHistory = (id, params) => {
  return useQuery({
    queryKey: queryKeys.suppliers.purchaseHistory(id, params),
    queryFn: () => getSupplierPurchaseHistory(id, params),
    enabled: !!id,
  });
};

export const useSupplierPaymentHistory = (id, params) => {
  return useQuery({
    queryKey: queryKeys.suppliers.paymentHistory(id, params),
    queryFn: () => getSupplierPaymentHistory(id, params),
    enabled: !!id,
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
  });
};
