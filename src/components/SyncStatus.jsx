import { useEffect, useState } from 'react';
import {
  discardFailedOperation,
  exportOfflineBackup,
  getSyncSummary,
  retryOperation,
} from '../offline/repository';
import { subscribeSync } from '../offline/status';
import { syncNow } from '../offline/syncEngine';

function formatTime(value) {
  if (!value) return 'Not yet';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function labelFor(summary) {
  if (summary.authRequired) return 'Authentication required';
  if (!summary.online) return 'Offline';
  if (summary.syncing) return 'Synchronizing';
  if (summary.failed.length) return 'Synchronization failed';
  if (summary.pending) return 'Pending transactions';
  return 'Synced';
}

export function SyncStatus() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      getSyncSummary().then((next) => {
        if (alive) setSummary(next);
      });
    };
    load();
    const unsubscribe = subscribeSync(load);
    window.addEventListener('online', load);
    window.addEventListener('offline', load);
    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener('online', load);
      window.removeEventListener('offline', load);
    };
  }, []);

  if (!summary) return null;
  const label = labelFor(summary);
  const tone = !summary.online || summary.authRequired
    ? 'bg-amber-50 text-amber-800 ring-amber-200'
    : summary.failed.length
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : 'bg-white text-slate-600 ring-slate-200';

  return (
    <section className={`mb-4 rounded-xl px-4 py-3 text-sm ring-1 ${tone}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-semibold text-slate-800">{label}</span>
          <span>{summary.online ? 'Internet connected' : 'No internet connection'}</span>
          <span>{summary.pending} pending</span>
          <span>{summary.synced} synchronized</span>
          <span>Last sync {formatTime(summary.lastSyncAt)}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => syncNow()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Sync now
          </button>
          <button
            type="button"
            onClick={() => exportOfflineBackup()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Backup
          </button>
        </div>
      </div>
      {summary.authRequired && (
        <p className="mt-2 text-xs">
          Saved sales and payments are still on this computer. Sign in online to send them.
        </p>
      )}
      {summary.failed.length > 0 && (
        <ul className="mt-3 space-y-2">
          {summary.failed.map((item) => (
            <li key={item.operationId} className="rounded-lg bg-white/80 px-3 py-2 text-xs text-slate-700">
              <p className="font-semibold capitalize">{item.entity} {item.action}</p>
              <p className="mt-1">{item.lastError}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="font-semibold text-emerald-700" onClick={() => retryOperation(item.operationId).then(() => syncNow())}>
                  Retry
                </button>
                <button type="button" className="font-semibold text-rose-700" onClick={() => discardFailedOperation(item.operationId)}>
                  Discard failed copy
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function SyncBadge() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      getSyncSummary().then((next) => {
        if (alive) setSummary(next);
      });
    };
    load();
    return subscribeSync(load);
  }, []);

  if (!summary) return null;
  const text = !summary.online
    ? `Offline${summary.pending ? ` · ${summary.pending} pending` : ''}`
    : summary.pending
      ? `${summary.pending} to sync`
      : summary.failed.length
        ? 'Sync needs attention'
        : '';
  if (!text) return null;

  return (
    <p className="mt-1 text-[11px] font-medium text-white/70">{text}</p>
  );
}
