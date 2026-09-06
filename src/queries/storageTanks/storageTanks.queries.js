import {
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getStorageTankDashboard,
} from "../../api/storageTanks.api";

export const useStorageTankDashboard = () => {
  return useQuery({
    queryKey: queryKeys.storageTanks.dashboard(),
    queryFn: getStorageTankDashboard,
  });
};
