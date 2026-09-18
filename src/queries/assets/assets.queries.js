import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetFormOptions,
} from "../../api/assets.api";

export const useAssets = (params) => {
  return useQuery({
    queryKey: queryKeys.assets.list(params),
    queryFn: () => getAssets(params),
  });
};

export const useAssetById = (id) => {
  return useQuery({
    queryKey: queryKeys.assets.detail(id),
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });
};

export const useAssetFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.assets.formOptions(),
    queryFn: getAssetFormOptions,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
    },
  });
};
