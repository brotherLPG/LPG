import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from "../../api/maintenanceRecords.api";

export const useMaintenanceRecords = (params) => {
  return useQuery({
    queryKey: queryKeys.maintenanceRecords.list(params),
    queryFn: () => getMaintenanceRecords(params),
  });
};

export const useMaintenanceRecordById = (id) => {
  return useQuery({
    queryKey: queryKeys.maintenanceRecords.detail(id),
    queryFn: () => getMaintenanceRecordById(id),
    enabled: !!id,
  });
};

export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceRecords.all });
    },
  });
};

export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMaintenanceRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceRecords.all });
    },
  });
};

export const useDeleteMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceRecords.all });
    },
  });
};
