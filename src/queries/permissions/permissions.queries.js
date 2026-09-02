import { useQuery } from '@tanstack/react-query'
import { getPermissions } from '../../api/permissions.api'
import { queryKeys } from '../queryKeys'

export const usePermissions = () => useQuery({
  queryKey: queryKeys.permissions.list(),
  queryFn: getPermissions,
})