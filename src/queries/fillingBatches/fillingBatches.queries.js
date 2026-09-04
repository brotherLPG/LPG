import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getFillingBatches,
  getFillingBatchFormOptions,
  deleteFillingBatch,
  createFillingBatch,
  updateFillingBatch,
  getFillingBatchById,
} from "../../api/fillingBatches.api";

export const useFillingBatchFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.fillingBatches.formOptions(),
    queryFn: getFillingBatchFormOptions,
  });
};

export const useFillingBatches = (params) => {
  return useQuery({
    queryKey: queryKeys.fillingBatches.list(params),
    queryFn: () => getFillingBatches(params),
  });
};

export const useFillingBatchById = (id) => {
  return useQuery({
    queryKey: queryKeys.fillingBatches.detail(id),
    queryFn: () => getFillingBatchById(id),
    enabled: !!id,
  });
};

export const useDeleteFillingBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFillingBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fillingBatches.all });
    },
  });
};

export const useCreateFillingBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFillingBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fillingBatches.all });
    },
  });
};

export const useUpdateFillingBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateFillingBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fillingBatches.all });
    },
  });
};
