import { useMemo, useState } from 'react'
import { ChevronDown, Eye, Search, X } from 'lucide-react'
import { Button, Tooltip } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import GlobalTable from '../../utils/GlobalTable'
import { useLogs } from '../../queries/serverLogs/serverLogs.queries'

const formatTimestamp = timestamp => {
  if (!timestamp) return '—'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(timestamp))
}

const getLevelClass = level => {
  switch ((level || '').toLowerCase()) {
    case 'error':
      return 'bg-red-50 text-red-600 border border-red-100'
    case 'warn':
    case 'warning':
      return 'bg-amber-50 text-amber-600 border border-amber-100'
    case 'debug':
      return 'bg-slate-100 text-slate-600 border border-slate-200'
    default:
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  }
}

const getStatusClass = statusCode => {
  if (!statusCode) return 'text-slate-400'
  if (statusCode >= 500) return 'text-red-600 font-semibold'
  if (statusCode >= 400) return 'text-amber-600 font-semibold'
  return 'text-emerald-600 font-semibold'
}

function ServerLogs () {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedKind, setSelectedKind] = useState('All Types')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewLog, setViewLog] = useState(null)

  const {
    data: logsData,
    isLoading,
    error
  } = useLogs({
    page: currentPage,
    limit: 20
  })

  const logsResponse = logsData?.data
  const pagination = logsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  }
  const retentionDays = logsResponse?.retentionDays

  const logs = useMemo(
    () =>
      (logsResponse?.items || []).map(log => ({
        id: log._id,
        timestamp: formatTimestamp(log.timestamp),
        level: log.level || 'info',
        kind: log.kind || '—',
        method: log.method || '—',
        path: log.path || '—',
        statusCode: log.statusCode,
        durationMs: log.durationMs,
        ipAddress: log.ipAddress || '—',
        userId: log.userId || null,
        meta: log.meta ?? null,
        message: log.message || '—'
      })),
    [logsResponse?.items]
  )

  const levels = useMemo(
    () => [...new Set(logs.map(log => log.level))].sort(),
    [logs]
  )
  const kinds = useMemo(
    () => [...new Set(logs.map(log => log.kind))].sort(),
    [logs]
  )

  const resetPageAndSet = setter => value => {
    setter(value)
    setCurrentPage(1)
  }

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim()

    return logs.filter(log => {
      const matchesSearch =
        !query ||
        log.message.toLowerCase().includes(query) ||
        log.path.toLowerCase().includes(query) ||
        log.method.toLowerCase().includes(query) ||
        log.ipAddress.toLowerCase().includes(query) ||
        String(log.statusCode || '').includes(query)

      return (
        matchesSearch &&
        (selectedLevel === 'All Levels' || log.level === selectedLevel) &&
        (selectedKind === 'All Types' || log.kind === selectedKind)
      )
    })
  }, [logs, search, selectedLevel, selectedKind])

  const logColumns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      isRowHeader: true,
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 whitespace-nowrap',
      renderCell: item => (
        <span className='text-slate-500 text-[13px]'>{item.timestamp}</span>
      )
    },
    {
      key: 'level',
      label: 'Level',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 whitespace-nowrap',
      renderCell: item => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getLevelClass(item.level)}`}
        >
          {item.level}
        </span>
      )
    },
    {
      key: 'kind',
      label: 'Type',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-600 text-[13px] capitalize whitespace-nowrap'
    },
    {
      key: 'method',
      label: 'Method',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 whitespace-nowrap',
      renderCell: item => (
        <span className='font-semibold text-slate-700 text-[13px]'>{item.method}</span>
      )
    },
    {
      key: 'path',
      label: 'Path',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-600 text-[13px] max-w-[280px] truncate'
    },
    {
      key: 'statusCode',
      label: 'Status',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 whitespace-nowrap',
      renderCell: item => (
        <span className={`text-[13px] ${getStatusClass(item.statusCode)}`}>
          {item.statusCode ?? '—'}
        </span>
      )
    },
    {
      key: 'durationMs',
      label: 'Duration',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-500 text-[13px] whitespace-nowrap',
      renderCell: item =>
        item.durationMs != null ? `${item.durationMs} ms` : '—'
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-500 text-[13px] whitespace-nowrap'
    },
    {
      key: 'message',
      label: 'Message',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-600 text-[13px] max-w-[320px] truncate'
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3',
      renderCell: item => (
        <Tooltip delay={0}>
          <Button
            aria-label="View log details"
            onClick={() => setViewLog(item)}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Tooltip.Content>
            <p>View Log</p>
          </Tooltip.Content>
        </Tooltip>
      )
    }
  ]

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>
        <div className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>
          <span className="px-1">/</span>
          <span>Server Logs</span>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Server Logs
          </h1>
          <p className="text-sm text-tertiary">
            API request and application logs
            {retentionDays ? ` (retained for ${retentionDays} days)` : ''}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) =>
                  resetPageAndSet(setSearch)(event.target.value)
                }
                placeholder="Search by path, message, IP, or status..."
                className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(event) =>
                  resetPageAndSet(setSelectedLevel)(event.target.value)
                }
                className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-600 outline-none focus:border-[#008951]"
              >
                <option value="All Levels">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level} className="capitalize">
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={selectedKind}
                onChange={(event) =>
                  resetPageAndSet(setSelectedKind)(event.target.value)
                }
                className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-600 outline-none focus:border-[#008951]"
              >
                <option value="All Types">All Types</option>
                {kinds.map((kind) => (
                  <option key={kind} value={kind} className="capitalize">
                    {kind}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg
                className="h-6 w-6 animate-spin text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-sm text-red-500">
              Error loading server logs. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={logColumns}
              data={filteredLogs}
              ariaLabel="Server logs"
              className="w-full"
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No logs found."
              pagination={true}
              rowsPerPage={pagination.limit || 20}
              page={pagination.page}
              totalCount={pagination.total}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>

        {viewLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-bold text-slate-800">Log Details</h2>
                <button
                  type="button"
                  onClick={() => setViewLog(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
                <dl className="space-y-3 text-sm">
                  {[
                    ['Timestamp', viewLog.timestamp],
                    ['Level', viewLog.level],
                    ['Type', viewLog.kind],
                    ['Method', viewLog.method],
                    ['Path', viewLog.path],
                    ['Status Code', viewLog.statusCode ?? '—'],
                    ['Duration', viewLog.durationMs != null ? `${viewLog.durationMs} ms` : '—'],
                    ['IP Address', viewLog.ipAddress],
                    ['User ID', viewLog.userId || '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="shrink-0 font-medium text-slate-500">{label}</dt>
                      <dd className="text-right font-semibold text-slate-800 break-all">{value}</dd>
                    </div>
                  ))}
                  <div>
                    <dt className="font-medium text-slate-500">Message</dt>
                    <dd className="mt-1 rounded-md bg-slate-50 p-3 text-slate-800 break-all">
                      {viewLog.message}
                    </dd>
                  </div>
                  {viewLog.meta != null && (
                    <div>
                      <dt className="font-medium text-slate-500">Meta</dt>
                      <dd className="mt-1 rounded-md bg-slate-50 p-3 text-xs text-slate-700 break-all">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(viewLog.meta, null, 2)}</pre>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default ServerLogs
