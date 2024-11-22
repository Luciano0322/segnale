import { Segnale } from '../core/types';
export declare function useSegnale<T>(signal: Segnale<T>): T;
export declare function useSegnaleEffect(fn: () => void, dependencies: unknown[]): void;
export declare function useSegnaleAsyncEffect(effect: () => Promise<void>, dependencies: unknown[]): void;
