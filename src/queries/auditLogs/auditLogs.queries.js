import { useQuery } from '@tanstack/react-query'
import { getAuditLogs } from '../../api/auditLogs.api'
import { queryKeys } from '../queryKeys'

export const useAuditLogs = (params) => {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: () => getAuditLogs(params),
  })
}
