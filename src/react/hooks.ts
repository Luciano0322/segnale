import { useEffect, useSyncExternalStore } from 'react';
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

export function useSegnaleEffect(fn: () => void, dependencies: any[]) {
  useEffect(() => {
    const running: Computation = {
      execute: () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        runWithContext(running, fn);
      },
      dependencies: new Set(),
      dirty: true,
    };

    scheduleComputation(running);

    // Cleanup when dependencies change or component unmounts
    return () => {
      cleanupDependencies(running);
    };
  }, dependencies);
}

export function useSegnaleAsyncEffect(
  effect: () => Promise<void>,
  dependencies: any[]
) {
  useEffect(() => {
    const running: Computation = {
      execute: async () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        await withContext(running, effect);
      },
      dependencies: new Set(),
      dirty: true,
    };

    scheduleComputation(running);

    return () => {
      cleanupDependencies(running);
    };
  }, dependencies);
}
