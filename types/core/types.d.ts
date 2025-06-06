export interface Computation<T = unknown> {
  dependencies: Set<Set<Computation<unknown>>>;
  execute: () => void;
  dirty: boolean;
  value?: T;
  isEffect?: boolean; // For effect lazy execution
}

export interface Segnale<T> {
  read: () => T;
  write: (value: T | ((prevValue: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export type SegnaleType<T> = T extends unknown[]
  ? Segnale<T>
  : T extends object
    ? SegnaleObject<T>
    : Segnale<T>;

export type SegnaleObject<T extends object> = {
  [K in keyof T]: SegnaleType<T[K]>;
};
