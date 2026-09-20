import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getOperationsOverview,
  getInventoryAlerts,
} from "../../api/dashboard.api";

export const DEFAULT_OPERATIONS_PARAMS = {
  days: 7,
  alertLimit: 10,
  recentLimit: 5,
};

export const DEFAULT_INVENTORY_ALERTS_PARAMS = {
  limit: 10,
};

export const useOperationsOverview = (params = DEFAULT_OPERATIONS_PARAMS, options = {}) => {
  return useQuery({
    queryKey: queryKeys.dashboard.operations(params),
    queryFn: () => getOperationsOverview(params),
    enabled: options.enabled ?? true,
  });
};

export const useInventoryAlerts = (
  params = DEFAULT_INVENTORY_ALERTS_PARAMS,
  options = {}
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.inventoryAlerts(params),
    queryFn: () => getInventoryAlerts(params),
    enabled: options.enabled ?? true,
  });
};
