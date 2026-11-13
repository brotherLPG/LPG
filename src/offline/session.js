import db from './db';

const ITERATIONS = 150000;
const OFFLINE_FLAG = 'offlineSession';

function bytesToHex(bytes) {
  return Array.from(bytes).map((value) => value.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function deriveHash(password, saltHex) {
  const salt = hexToBytes(saltHex);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function sameHash(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function saveOfflineVerifier({ email, password, user }) {
  const normalized = String(email || user?.emailAddress || '').trim().toLowerCase();
  if (!normalized || !password) return;
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await deriveHash(password, salt);
  await db.auth.put({
    email: normalized,
    passwordHash,
    salt,
    iterations: ITERATIONS,
    user: {
      _id: user?._id || user?.id || '',
      fullName: user?.fullName || '',
      emailAddress: normalized,
      roleName: user?.role?.roleName || user?.roleName || '',
      roleId: user?.roleId || user?.role?._id || '',
    },
    updatedAt: new Date().toISOString(),
  });
}

export async function updateOfflinePassword(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const existing = normalized
    ? await db.auth.get(normalized)
    : (await db.auth.toArray())[0];
  if (!existing || !password) return;
  await saveOfflineVerifier({
    email: existing.email,
    password,
    user: existing.user,
  });
}

export async function unlockOffline(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const profile = await db.auth.get(normalized);
  if (!profile) {
    const any = (await db.auth.toArray())[0];
    if (!any) return { ok: false, message: 'Sign in online once before using the plant PC offline.' };
    return { ok: false, message: `Offline sign-in is saved for ${any.email}.` };
  }
  const hash = await deriveHash(password, profile.salt);
  if (!sameHash(hash, profile.passwordHash)) {
    return { ok: false, message: 'Incorrect password.' };
  }
  sessionStorage.setItem(OFFLINE_FLAG, '1');
  localStorage.setItem('user', JSON.stringify(profile.user));
  return { ok: true, user: profile.user };
}

export function hasOfflineSession() {
  return sessionStorage.getItem(OFFLINE_FLAG) === '1';
}

export function endBrowserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem(OFFLINE_FLAG);
}

export async function hasOfflineProfile() {
  return (await db.auth.count()) > 0;
}
