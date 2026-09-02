import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from '../../api/employees.api'

export const useEmployees = (params) => useQuery({
  queryKey: queryKeys.employees.list(params),
  queryFn: () => getEmployees(params),
})

export const useEmployeeById = (id) => useQuery({
  queryKey: queryKeys.employees.detail(id),
  queryFn: () => getEmployeeById(id),
  enabled: !!id,
})

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
  })
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
  })
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
  })
}