import { Computation, Segnale, SegnaleObject, SegnaleType } from './types';

export const context: Computation[] = [];

let batching = false;
const pendingComputations = new Set<Computation>();

export let batchUpdates = (callback: () => void) => {
  callback();
};

export function setBatchUpdates(fn: (callback: () => void) => void) {
  batchUpdates = fn;
}

export function startBatch() {
  batching = true;
}

export function endBatch() {
  batching = false;
  const computations = Array.from(pendingComputations);
  pendingComputations.clear();

  batchUpdates(() => {
    computations.forEach((comp) => comp.execute());
  });
}

export function runInBatch(fn: () => void) {
  startBatch();
  try {
    fn();
  } finally {
    endBatch();
  }
}

export function subscribe(
  running: Computation,
  subscriptions: Set<Computation>
): void {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

export function cleanupDependencies(computation: Computation) {
  computation.dependencies.forEach((subscription) => {
    subscription.delete(computation);
  });
  computation.dependencies.clear();
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createSegnale<T>(initialValue: T): SegnaleType<T> {
  if (Array.isArray(initialValue)) {
    return createPrimitiveSignal(initialValue) as SegnaleType<T>;
  } else if (isObject(initialValue)) {
    return createSegnaleObject(initialValue as T & object) as SegnaleType<T>;
  } else {
    return createPrimitiveSignal(initialValue) as SegnaleType<T>;
  }
}

export function createSegnaleObject<T extends object>(
  initialValue: T
): SegnaleObject<T> {
  const signals = {} as SegnaleObject<T>;

  for (const key in initialValue) {
    if (Object.prototype.hasOwnProperty.call(initialValue, key)) {
      const typedKey = key as keyof T;
      const value = initialValue[typedKey];
      signals[typedKey] = createSegnale(value) as SegnaleType<
        T[typeof typedKey]
      >;
    }
  }

  return signals;
}

export function createPrimitiveSignal<T>(initialValue: T): Segnale<T> {
  const subscriptions = new Set<Computation>();
  const externalListeners = new Set<() => void>();
  let value = initialValue;

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: T | ((prevValue: T) => T)) => {
    const newValue =
      typeof nextValue === 'function'
        ? (nextValue as (prevValue: T) => T)(value)
        : nextValue;

    if (newValue !== value) {
      value = newValue;
      for (const sub of subscriptions) {
        if (!sub.dirty) {
          sub.dirty = true;
          scheduleComputation(sub);
        }
      }
      // 通知外部订阅者
      for (const listener of externalListeners) {
        listener();
      }
    }
  };

  const subscribeExternal = (listener: () => void) => {
    externalListeners.add(listener);
    return () => {
      externalListeners.delete(listener);
    };
  };

  return {
    read,
    write,
    subscribe: subscribeExternal,
  };
}

export function runWithContext<T>(computation: Computation, fn: () => T): T {
  context.push(computation);
  try {
    return fn();
  } finally {
    context.pop();
  }
}

export async function withContext<T>(
  computation: Computation,
  fn: () => Promise<T>
): Promise<T> {
  context.push(computation);
  try {
    return await fn();
  } finally {
    context.pop();
  }
}

export function createEffect(fn: () => void | Promise<void>) {
  const running: Computation<void> = {
    execute: () => {
      if (!running.dirty) return;
      running.dirty = false;
      cleanupDependencies(running);
      const result = runWithContext(running, fn);
      if (result instanceof Promise) {
        result.catch((e) => {
          console.error('Effect encountered an error:', e);
        });
      }
    },
    dependencies: new Set(),
    dirty: true,
  };

  scheduleComputation(running);
}

export function createMemo<T>(fn: () => T): () => T {
  const running: Computation<T> = {
    execute: () => {
      if (!running.dirty) return;
      running.dirty = false;
      cleanupDependencies(running);
      running.value = runWithContext(running, fn);
    },
    dependencies: new Set(),
    dirty: true,
    value: undefined,
  };

  return () => {
    if (running.dirty) {
      running.execute();
    }
    return running.value as T;
  };
}

const dirtyComputations = new Set<Computation>();
let isFlushing = false;

export function scheduleComputation(computation: Computation) {
  dirtyComputations.add(computation);

  if (!isFlushing) {
    isFlushing = true;
    queueMicrotask(flushComputations);
  }
}

function flushComputations() {
  batchUpdates(() => {
    for (const computation of dirtyComputations) {
      computation.execute();
    }
    dirtyComputations.clear();
    isFlushing = false;
  });
}
