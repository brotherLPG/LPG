import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalTable from '../../utils/GlobalTable'
import { useAuditLogs } from '../../queries/auditLogs/auditLogs.queries'

const titleCase = (value = '') =>
  value
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

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

function AuditLogs () {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState('All Users')
  const [selectedModule, setSelectedModule] = useState('All Modules')
  const [selectedAction, setSelectedAction] = useState('All Actions')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: auditLogsData,
    isLoading,
    error
  } = useAuditLogs({
    page: currentPage,
    limit: 10
  })

  const auditLogsResponse = auditLogsData?.data
  const pagination = auditLogsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  }
  const meta = auditLogsResponse?.meta || {}

  const auditLogs = useMemo(
    () =>
      (auditLogsResponse?.items || []).map(log => ({
        id: log._id,
        timestamp: formatTimestamp(log.timestamp),
        user: log.user?.fullName || 'System',
        userId: log.user?._id,
        action: titleCase(log.actionName),
        actionValue: log.actionName,
        module: titleCase(log.moduleName),
        moduleValue: log.moduleName,
        entity: log.entityName || '—',
        entityId: log.entityId || '—',
        ip: log.ipAddress || '—'
      })),
    [auditLogsResponse?.items]
  )

  const users = meta.users || []
  const modules = meta.modules || []
  const actions = meta.actions || []

  const resetPageAndSet = setter => value => {
    setter(value)
    setCurrentPage(1)
  }

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim()

    return auditLogs.filter(log => {
      const matchesSearch =
        !query ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query)

      return (
        matchesSearch &&
        (selectedUser === 'All Users' || log.userId === selectedUser) &&
        (selectedModule === 'All Modules' ||
          log.moduleValue === selectedModule) &&
        (selectedAction === 'All Actions' || log.actionValue === selectedAction)
      )
    })
  }, [auditLogs, search, selectedUser, selectedModule, selectedAction])

  const getActionClass = action => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'text-emerald-500'
      case 'update':
        return 'text-blue-600'
      case 'delete':
        return 'text-red-500'
      case 'login':
        return 'text-slate-700'
      default:
        return 'text-slate-600'
    }
  }

  const auditLogColumns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      isRowHeader: true,
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3',
      renderCell: item => (
        <span className='text-slate-500 text-[13px]'>{item.timestamp}</span>
      )
    },
    {
      key: 'user',
      label: 'User',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3',
      renderCell: item => (
        <span className='font-medium text-slate-700 text-[13px]'>
          {item.user}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3',
      renderCell: item => (
        <span
          className={`font-semibold text-[13px] ${getActionClass(item.action)}`}
        >
          {item.action}
        </span>
      )
    },
    {
      key: 'module',
      label: 'Module',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-600 text-[13px]'
    },
    {
      key: 'entity',
      label: 'Entity Description',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-500 text-[13px]'
    },
    {
      key: 'entityId',
      label: 'Entity ID',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3',
      renderCell: item =>
        item.entityId === '—' ? (
          <span className='text-slate-400 text-[13px]'>—</span>
        ) : (
          <span className='font-medium text-blue-600 text-[13px]'>
            {item.entityId}
          </span>
        )
    },
    {
      key: 'ip',
      label: 'IP Address',
      className: 'bg-slate-50/80 text-[13px] font-bold text-slate-700',
      cellClassName: 'px-4 py-3 text-slate-500 text-[13px]'
    }
  ]

    const logs = auditLogsData?.data ?? [];
    console.log(logs);

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
          <span>Audit Logs</span>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Audit Trail
          </h1>
          <p className="text-sm text-tertiary">
            Complete activity log for compliance and security review
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
                placeholder="Search by entity ID or user..."
                className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <div className="relative">
              <select
                value={selectedUser}
                onChange={(event) =>
                  resetPageAndSet(setSelectedUser)(event.target.value)
                }
                className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-600 outline-none focus:border-[#008951]"
              >
                <option value="All Users">All Users</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={selectedModule}
                onChange={(event) =>
                  resetPageAndSet(setSelectedModule)(event.target.value)
                }
                className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-600 outline-none focus:border-[#008951]"
              >
                <option value="All Modules">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {titleCase(module)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={selectedAction}
                onChange={(event) =>
                  resetPageAndSet(setSelectedAction)(event.target.value)
                }
                className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-600 outline-none focus:border-[#008951]"
              >
                <option value="All Actions">All Actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {titleCase(action)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <button
              type="button"
              className="flex h-9 w-64 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <span>All dates</span>
              <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
            </button>
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
              Error loading audit logs. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={auditLogColumns}
              data={filteredLogs}
              ariaLabel="Audit logs"
              className="w-full"
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No audit logs found."
              pagination={true}
              rowsPerPage={10}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default AuditLogs
