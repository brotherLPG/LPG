const listeners = new Set();

export function subscribeSync(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitSync() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A status listener must not stop the sync engine.
    }
  });
}
