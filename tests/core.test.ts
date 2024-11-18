import {
  createSegnale,
  createEffect,
  createMemo,
  runInBatch,
  setBatchUpdates,
  withContext,
  context,
} from '../src/core';

describe('Core Functionality Tests', () => {
  beforeEach(() => {
    // 重置 batchUpdates 为默认实现
    setBatchUpdates((callback) => {
      callback();
    });
  });

  test('createSegnale should create a signal with initial value', () => {
    const signal = createSegnale(0);
    expect(signal.read()).toBe(0);
  });

  test('Signal write should update value', () => {
    const signal = createSegnale(0);
    signal.write(1);
    expect(signal.read()).toBe(1);
  });

  test('Signal write should notify internal subscribers', () => {
    const signal = createSegnale(0);
    let effectValue = 0;

    createEffect(() => {
      effectValue = signal.read();
    });

    // 初始执行 effect
    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(effectValue).toBe(0);

        // 更新信号值
        signal.write(1);

        queueMicrotask(() => {
          expect(effectValue).toBe(1);
          resolve();
        });
      });
    });
  });

  test('createMemo should compute derived value and update when dependency changes', () => {
    const signal = createSegnale(2);
    const memo = createMemo(() => signal.read() * 2);

    expect(memo()).toBe(4);

    signal.write(3);

    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(memo()).toBe(6);
        resolve();
      });
    });
  });

  test('runInBatch should batch updates', () => {
    const signal1 = createSegnale(0);
    const signal2 = createSegnale(0);
    let effectRunCount = 0;

    createEffect(() => {
      signal1.read();
      signal2.read();
      effectRunCount++;
    });

    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(effectRunCount).toBe(1);

        runInBatch(() => {
          signal1.write(1);
          signal2.write(2);
        });

        queueMicrotask(() => {
          expect(effectRunCount).toBe(2); // 应该只触发一次 effect
          resolve();
        });
      });
    });
  });

  test('batchUpdates should be customizable', () => {
    const signal = createSegnale(0);
    let effectValue = 0;

    // 自定义 batchUpdates
    const mockBatchUpdates = jest.fn((callback) => {
      callback();
    });
    setBatchUpdates(mockBatchUpdates);

    createEffect(() => {
      effectValue = signal.read();
    });

    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        expect(effectValue).toBe(0);
        // 此时，effect 的初始执行已经调用了一次 batchUpdates
        expect(mockBatchUpdates).toHaveBeenCalledTimes(1);

        signal.write(1);

        queueMicrotask(() => {
          expect(effectValue).toBe(1);
          expect(mockBatchUpdates).toHaveBeenCalledTimes(2);
          resolve();
        });
      });
    });
  });

  test('External listeners should be notified on signal write', () => {
    const signal = createSegnale(0);
    let listenerCalled = false;

    const unsubscribe = signal.subscribe(() => {
      listenerCalled = true;
    });

    signal.write(1);

    expect(listenerCalled).toBe(true);

    listenerCalled = false;
    unsubscribe();
    signal.write(2);

    expect(listenerCalled).toBe(false);
  });

  test('createSegnaleObject should create signals for object properties', () => {
    const objSignal = createSegnale({ a: 1, b: 2 });
    expect(objSignal.a.read()).toBe(1);
    expect(objSignal.b.read()).toBe(2);

    objSignal.a.write(3);
    expect(objSignal.a.read()).toBe(3);
  });

  test('withContext should preserve computation context in async functions', async () => {
    const signal = createSegnale(0);
    let effectValue = 0;

    createEffect(() => {
      const running = context[context.length - 1];
      withContext(running, async () => {
        await Promise.resolve();
        effectValue = signal.read();
      });
    });

    // 等待 effect 执行
    await new Promise<void>((resolve) => {
      queueMicrotask(() => {
        // 初始执行
        expect(effectValue).toBe(0);
        resolve();
      });
    });

    // 更新信号值
    signal.write(1);

    // 等待 effect 执行
    await new Promise<void>((resolve) => {
      queueMicrotask(() => {
        // 等待异步操作完成
        queueMicrotask(() => {
          expect(effectValue).toBe(1);
          resolve();
        });
      });
    });
  });
});
