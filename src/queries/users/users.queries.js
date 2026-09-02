import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
  changeUserPassword,
  getUserById,
} from "../../api/users.api";

export const useUsers = (params) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useChangeUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => changeUserPassword(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
};
