import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getInventoryItems,
  deleteInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  getInventoryItemById,
  getInventoryFormOptions,
} from "../../api/inventory.api";

export const useInventoryItems = (params) => {
  return useQuery({
    queryKey: queryKeys.inventory.list(params),
    queryFn: () => getInventoryItems(params),
  });
};

export const useInventoryItemById = (id) => {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => getInventoryItemById(id),
    enabled: !!id,
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
};

export const useInventoryFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.inventory.formOptions(),
    queryFn: getInventoryFormOptions,
  });
};
