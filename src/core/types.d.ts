export interface Computation {
  dependencies: Set<Set<Computation>>;
  execute: () => void;
  dirty: boolean;
  value?: any;
}

export interface Segnale<T> {
  read: () => T;
  write: (value: T | ((prevValue: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export type SegnaleType<T> = T extends any[]
  ? Segnale<T>
  : T extends object
    ? SegnaleObject<T>
    : Segnale<T>;

export type SegnaleObject<T extends object> = {
  [K in keyof T]: SegnaleType<T[K]>;
};
