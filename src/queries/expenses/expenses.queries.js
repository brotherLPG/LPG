import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import {
  getExpenses,
  getExpenseById,
  getExpenseFormOptions,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenses.api";

export const useExpenses = (params) => {
  return useQuery({
    queryKey: queryKeys.expenses.list(params),
    queryFn: () => getExpenses(params),
  });
};

export const useExpenseById = (id) => {
  return useQuery({
    queryKey: queryKeys.expenses.detail(id),
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });
};

export const useExpenseFormOptions = () => {
  return useQuery({
    queryKey: queryKeys.expenses.formOptions(),
    queryFn: getExpenseFormOptions,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
  });
};
