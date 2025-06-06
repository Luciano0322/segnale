import { useEffect } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { Computation, Segnale } from '../core/types';
import {
  cleanupDependencies,
  runWithContext,
  scheduleComputation,
  withContext,
} from '../core';

export function useSegnale<T>(signal: Segnale<T>): T {
  const value = useSyncExternalStore(
    (onStoreChange) => {
      return signal.subscribe(onStoreChange);
    },
    () => signal.read(),
    () => signal.read()
  );

  return value;
}

export function useSegnaleEffect(fn: () => void, dependencies: unknown[]) {
  useEffect(() => {
    const running: Computation<void> = {
      execute: () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        runWithContext(running, fn);
      },
      dependencies: new Set(),
      dirty: true,
      isEffect: true,
    };

    scheduleComputation(running);

    return () => {
      cleanupDependencies(running);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...dependencies]);
}

export function useSegnaleAsyncEffect(
  effect: () => Promise<void>,
  dependencies: unknown[]
) {
  useEffect(() => {
    const running: Computation<void> = {
      execute: async () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        await withContext(running, effect);
      },
      dependencies: new Set(),
      dirty: true,
      isEffect: true,
    };

    scheduleComputation(running);

    return () => {
      cleanupDependencies(running);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...dependencies]);
}
