import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Edit3,
  Landmark,
  MapPin,
  Package,
  UserRound,
  Wallet,
  Wrench,
  Hash,
  Clock3,
  ClipboardList
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMaintenanceRecordById } from '../../queries/maintenanceRecords/maintenanceRecords.queries'
import { usePermissions } from '../../contexts/PermissionContext'

const META_KEYS = new Set([
  '$__',
  '$isNew',
  '$locals',
  '$op',
  'errors',
  'isNew',
  '_doc',
  'form',
  'message',
  'success'
])

const flattenRecord = raw => {
  if (!raw || typeof raw !== 'object') return {}
  const doc = raw._doc && typeof raw._doc === 'object' ? raw._doc : {}
  const next = { ...doc }
  Object.entries(raw).forEach(([key, value]) => {
    if (META_KEYS.has(key) || value === undefined) return
    next[key] = value
  })
  return next
}

const textValue = value => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'object') {
    return (
      value.label ||
      value.fullName ||
      value.accountName ||
      value.assetName ||
      ''
    )
  }
  return String(value)
}

const formatLabel = str => {
  const value = textValue(str)
  if (!value) return ''
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatRs = amount => `Rs. ${Number(amount || 0).toLocaleString()}`

const formatDate = value => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const typeStyles = {
  preventive: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  corrective: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  inspection: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  emergency: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
}

const statusStyles = {
  'in-use': 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  idle: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'under-maintenance': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  disposed: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
}

function Field ({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-linear-to-br from-slate-50 to-white dark:from-gray-800/60 dark:to-gray-900/40 px-4 py-3 transition hover:border-blue-200 dark:hover:border-blue-800">
        {Icon && (
          <div className="mt-0.5 shrink-0 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 p-1.5">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        {label}
          </p>
          <p className="mt-0.5 wrap-break-word text-sm font-semibold text-slate-800 dark:text-gray-200">{textValue(value) || '-'}</p>
        </div>
      </div>
      <div
        
        
        
        className='hidden'
      />
    </div>
  )
}

function SummaryCard ({
  label,
  value,
  hint,
  icon: Icon,
  iconClass,
  iconWrapClass,
  cardClass,
  valueClass
}) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm font-semibold text-slate-600 dark:text-gray-400'>{label}</p>
          <p className={`mt-1 text-2xl font-extrabold ${valueClass}`}>{value}</p>
          {hint ? <p className='mt-1 text-[11px] text-slate-400 dark:text-gray-500'>{hint}</p> : null}
        </div>
        <div className={`rounded-lg p-2 ${iconWrapClass}`}>
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
      </div>
    </div>
  )
}

function ViewMaintenanceRecord () {
  const navigate = useNavigate()
  const { can } = usePermissions()
  const { id } = useParams()
  const { data, isLoading, error } = useMaintenanceRecordById(id)
  const record = flattenRecord(data?.data)

  if (isLoading) {
    return (
      <main className='flex min-h-full items-center justify-center bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-slate-500 dark:text-gray-400'>
        Loading maintenance record details...
      </main>
    )
  }

  if (error || (!record._id && !record.maintenanceNumber)) {
    return (
      <main className='flex min-h-full flex-col items-center justify-center gap-4 bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-red-500 dark:text-red-400'>
        <p>Unable to load maintenance record details.</p>
        <button
          type='button'
          onClick={() => navigate('/assets?tab=maintenance-records')}
          className='inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800'
        >
          <ArrowLeft className='h-4 w-4' /> Back to Maintenance Records
        </button>
      </main>
    )
  }

  const asset =
    record.assetId && typeof record.assetId === 'object'
      ? record.assetId
      : record.maintenanceAssetId &&
        typeof record.maintenanceAssetId === 'object'
      ? record.maintenanceAssetId
      : null

  const employee =
    record.performedByEmployeeId &&
    typeof record.performedByEmployeeId === 'object'
      ? record.performedByEmployeeId
      : null

  const approvedBy =
    record.approvedByUserId && typeof record.approvedByUserId === 'object'
      ? record.approvedByUserId
      : null

  const account =
    record.accountId && typeof record.accountId === 'object'
      ? record.accountId
      : null

  const accountValue = account
    ? account.label ||
      [account.accountCode, account.accountName].filter(Boolean).join(' – ') ||
      ''
    : textValue(record.accountName)

  const paymentMethodValue =
    textValue(record.paymentMethodLabel) || formatLabel(record.paymentMethod)

  const typeKey = record.maintenanceType || ''
  const cost = Number(record.maintenanceCostAmount || 0)

  const nextDate = record.nextMaintenanceDate
    ? new Date(record.nextMaintenanceDate)
    : null
  let nextHint = 'No follow-up scheduled'
  if (nextDate && !Number.isNaN(nextDate.getTime())) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compare = new Date(nextDate)
    compare.setHours(0, 0, 0, 0)
    const diffDays = Math.round((compare - today) / 86400000)
    if (diffDays < 0)
      nextHint = `Overdue by ${Math.abs(diffDays)} day${
        Math.abs(diffDays) === 1 ? '' : 's'
      }`
    else if (diffDays === 0) nextHint = 'Due today'
    else nextHint = `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`
  }

  const assetIdValue =
    asset?._id || (typeof record.assetId === 'string' ? record.assetId : '')

  return (
    <main className='min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8'>
      <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='mb-2 text-xs'>
            <button
              type='button'
              onClick={() => navigate('/dashboard')}
              className='cursor-pointer font-medium text-4th-color transition-colors duration-200'
            >
              Dashboard
            </button>
            <span className='px-1 text-slate-400 dark:text-gray-500'>/</span>
            <button
              type='button'
              onClick={() => navigate('/assets?tab=maintenance-records')}
              className='cursor-pointer font-medium text-4th-color transition-colors duration-200'
            >
              Maintenance Records
            </button>
            <span className='px-1 text-slate-400 dark:text-gray-500'>/</span>
            <span className='font-semibold'>Record Details</span>
          </p>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold tracking-tight text-BLUE-dark'>
              {record.maintenanceNumber || 'Maintenance Record'}
            </h1>
            {typeKey ? (
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  typeStyles[typeKey] ||
                  'bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700'
                }`}
              >
                {formatLabel(typeKey)}
              </span>
            ) : null}
          </div>
          <p className='mt-1 text-sm text-tertiary'>
            Service details, cost, payment, and the asset this work was logged
            against
          </p>
        </div>
        <div className='flex gap-2'>
          {can('maintenance-records', 'update') && (
            <button
              type='button'
              onClick={() =>
                navigate(`/maintenance-records/edit/${record._id}`)
              }
              className='inline-flex items-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545]'
            >
              <Edit3 className='h-4 w-4' /> Edit Record
            </button>
          )}
        </div>
      </div>

      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <SummaryCard
          label='Maintenance Cost'
          value={formatRs(cost)}
          hint={paymentMethodValue || 'No payment method'}
          icon={Wallet}
          cardClass='border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40' iconWrapClass='bg-blue-200/70 dark:bg-blue-800/60' valueClass='text-blue-700 dark:text-blue-300'
          iconClass='text-blue-600 dark:text-blue-400'
        />
        <SummaryCard
          label='Maintenance Date'
          value={formatDate(record.maintenanceDate)}
          hint={`Logged ${formatDate(record.createdAt)}`}
          icon={CalendarDays}
          cardClass='border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40' iconWrapClass='bg-emerald-200/70 dark:bg-emerald-800/60' valueClass='text-emerald-700 dark:text-emerald-300'
          iconClass='text-emerald-600 dark:text-emerald-400'
        />
        <SummaryCard
          label='Next Maintenance'
          value={formatDate(record.nextMaintenanceDate)}
          hint={nextHint}
          icon={Wrench}
          cardClass='border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40' iconWrapClass='bg-amber-200/70 dark:bg-amber-800/60' valueClass='text-amber-700 dark:text-amber-300'
          iconClass='text-amber-600 dark:text-amber-400'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <h2 className='text-[16px] font-bold text-BLUE-dark'>
                <ClipboardList className='mr-2 inline h-4 w-4 text-blue-600 dark:text-blue-400' />Record Information
              </h2>
            </div>
            <div className='grid grid-cols-1 gap-5 p-5 md:grid-cols-2'>
              <Field
                label='Maintenance Number'
                icon={Hash}
                value={record.maintenanceNumber}
              />
              <Field
                label='Maintenance Type'
                icon={Wrench}
                value={formatLabel(record.maintenanceType)}
              />
              <Field
                label='Maintenance Date'
                icon={CalendarDays}
                value={formatDate(record.maintenanceDate)}
              />
              <Field
                label='Next Maintenance Date'
                icon={Clock3}
                value={formatDate(record.nextMaintenanceDate)}
              />
            </div>
          </section>

          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Payment</h2></div>
            </div>
            <div className='grid grid-cols-1 gap-5 p-5 md:grid-cols-2'>
              <Field label='Maintenance Cost' value={formatRs(cost)} icon={Wallet} />
              <Field label='Payment Method' value={paymentMethodValue} icon={CreditCard} />
              <Field label='Account' value={accountValue} icon={Landmark} />
            </div>
          </section>

          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <h2 className='text-[16px] font-bold text-BLUE-dark'>
                <Wrench className='mr-2 inline h-4 w-4 text-amber-600 dark:text-amber-400' />Diagnostics & Work
              </h2>
            </div>
            <div className='space-y-5 p-5'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500'>
                  Problem Description
                </p>
                <div className='min-h-22 rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-slate-800 dark:text-gray-100'>
                  {record.problemDescription ||
                    'No problem description specified.'}
                </div>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500'>
                  Work Performed
                </p>
                <div className='min-h-22 rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-slate-800 dark:text-gray-100'>
                  {record.workPerformed ||
                    'No details provided for work performed.'}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className='space-y-6'>
          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <div className="flex items-center gap-2"><Package className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-[16px] font-bold text-BLUE-dark">Asset</h2></div>
            </div>
            <div className='p-5'>
              {asset ? (
                <>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-lg bg-slate-100 dark:bg-gray-800 p-2'>
                      <Package className='h-5 w-5 text-slate-600 dark:text-gray-400' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-gray-100'>
                        {asset.assetName || asset.label || '-'}
                      </p>
                      <p className='mt-0.5 text-xs text-slate-500 dark:text-gray-400'>
                        {asset.assetCode || 'AST'}
                        {asset.assetCategory
                          ? ` · ${formatLabel(asset.assetCategory)}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  {asset.assetStatus ? (
                    <span
                      className={`mt-4 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        statusStyles[asset.assetStatus] ||
                        'bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700'
                      }`}
                    >
                      {formatLabel(asset.assetStatus)}
                    </span>
                  ) : null}
                  <div className='mt-4 flex items-center gap-2 rounded-md border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-300'>
                    <MapPin className='h-4 w-4 text-slate-400 dark:text-gray-500' />
                    {asset.locationName || 'No location'}
                  </div>
                  {asset.serialNumber ? (
                    <div className='mt-2 rounded-md border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-300'>
                      Serial: {asset.serialNumber}
                    </div>
                  ) : null}
                  {assetIdValue ? (
                    <button
                      type='button'
                      onClick={() => navigate(`/assets/view/${assetIdValue}`)}
                      className='mt-4 w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 transition hover:bg-slate-50 dark:hover:bg-gray-800'
                    >
                      View Asset
                    </button>
                  ) : null}
                </>
              ) : (
                <p className='text-sm text-slate-500 dark:text-gray-400'>
                  No asset linked to this record
                </p>
              )}
            </div>
          </section>

          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <h2 className='text-[16px] font-bold text-BLUE-dark'>
                <UserRound className='mr-2 inline h-4 w-4 text-blue-600 dark:text-blue-400' />Personnel
              </h2>
            </div>
            <div className='space-y-4 p-5'>
              <div>
                <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500'>
                  Performed By
                </p>
                {employee ? (
                  <div className='flex items-start gap-3'>
                    <div className='rounded-lg bg-slate-100 dark:bg-gray-800 p-2'>
                      <UserRound className='h-5 w-5 text-slate-600 dark:text-gray-400' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-gray-100'>
                        {employee.fullName || employee.label || '-'}
                      </p>
                      <p className='mt-0.5 text-xs text-slate-500 dark:text-gray-400'>
                        {employee.employeeCode || 'EMP'}
                        {employee.jobTitle ? ` · ${employee.jobTitle}` : ''}
                      </p>
                      {employee.departmentName ? (
                        <p className='mt-0.5 text-xs text-slate-400 dark:text-gray-500'>
                          {employee.departmentName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-slate-500 dark:text-gray-400'>Not assigned</p>
                )}
              </div>

              <div className='border-t border-slate-100 dark:border-gray-800 pt-4'>
                <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500'>
                  Approved By
                </p>
                {approvedBy ? (
                  <div className='flex items-start gap-3'>
                    <div className='rounded-lg bg-slate-100 dark:bg-gray-800 p-2'>
                      <UserRound className='h-5 w-5 text-slate-600 dark:text-gray-400' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-gray-100'>
                        {approvedBy.fullName || '-'}
                      </p>
                      <p className='mt-0.5 text-xs text-slate-500 dark:text-gray-400'>
                        {approvedBy.emailAddress || ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-slate-500 dark:text-gray-400'>Not approved yet</p>
                )}
              </div>
            </div>
          </section>

          <section className='overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'>
            <div className='border-b border-slate-200 dark:border-gray-700 p-4'>
              <h2 className='text-[16px] font-bold text-BLUE-dark'>
                <Wallet className='mr-2 inline h-4 w-4 text-emerald-600 dark:text-emerald-400' />Payment Summary
              </h2>
            </div>
            <div className='space-y-4 p-5'>
              <div className='flex items-center justify-between text-sm'>
                <span className='inline-flex items-center gap-2 text-slate-600 dark:text-gray-400'>
                  <CreditCard className='h-4 w-4 text-slate-400 dark:text-gray-500' />
                  Method
                </span>
                <span className='font-medium text-slate-900 dark:text-gray-100'>
                  {paymentMethodValue || '-'}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='inline-flex items-center gap-2 text-slate-600 dark:text-gray-400'>
                  <Landmark className='h-4 w-4 text-slate-400 dark:text-gray-500' />
                  Account
                </span>
                <span className='max-w-[60%] truncate text-right font-medium text-slate-900 dark:text-gray-100'>
                  {accountValue || '-'}
                </span>
              </div>
              <div className='border-t border-slate-200 dark:border-gray-700 pt-4 flex items-center justify-between'>
                <span className='text-sm font-bold text-BLUE-dark'>Cost</span>
                <span className='text-lg font-extrabold text-accent-blue'>
                  {formatRs(cost)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ViewMaintenanceRecord
