import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getLpgReceipts,
  deleteLpgReceipt,
  createLpgReceipt,
  updateLpgReceipt,
  getLpgReceiptById,
} from "../../api/lpgReceipts.api";

export const useLpgReceipts = (params) => {
  return useQuery({
    queryKey: queryKeys.lpgReceipts.list(params),
    queryFn: () => getLpgReceipts(params),
  });
};

export const useLpgReceiptById = (id) => {
  return useQuery({
    queryKey: queryKeys.lpgReceipts.detail(id),
    queryFn: () => getLpgReceiptById(id),
    enabled: !!id,
  });
};

export const useDeleteLpgReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLpgReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lpgReceipts.all });
    },
  });
};

export const useCreateLpgReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLpgReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lpgReceipts.all });
    },
  });
};

export const useUpdateLpgReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateLpgReceipt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lpgReceipts.all });
    },
  });
};
