import { useQuery } from '@tanstack/react-query'
import { getLogs } from '../../api/logs.api'
import { queryKeys } from '../queryKeys'

export const useLogs = (params) => {
  return useQuery({
    queryKey: queryKeys.serverLogs.list(params),
    queryFn: () => getLogs(params),
  })
}
