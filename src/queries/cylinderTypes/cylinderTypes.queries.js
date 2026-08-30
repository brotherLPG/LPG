import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getCylinderTypes,
  deleteCylinderType,
  createCylinderType,
  updateCylinderType,
  getCylinderTypeById,
} from "../../api/cylinderTypes.api";

export const useCylinderTypes = (params) => {
  return useQuery({
    queryKey: queryKeys.cylinderTypes.list(params),
    queryFn: () => getCylinderTypes(params),
  });
};

export const useCylinderTypeById = (id) => {
  return useQuery({
    queryKey: queryKeys.cylinderTypes.detail(id),
    queryFn: () => getCylinderTypeById(id),
    enabled: !!id,
  });
};

export const useDeleteCylinderType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCylinderType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cylinderTypes.all });
    },
  });
};

export const useCreateCylinderType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCylinderType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cylinderTypes.all });
    },
  });
};

export const useUpdateCylinderType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCylinderType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cylinderTypes.all });
    },
  });
};
