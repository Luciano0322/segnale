import * as React from 'react';
import { renderHook, act, render } from '@testing-library/react';
import { createSegnale } from '../src/core';
import { useSegnale, useSegnaleAsyncEffect, useSegnaleEffect } from '../src/react/hooks';

describe('useSegnale', () => {
  it('should read the initial value of the signal', () => {
    const signal = createSegnale(0);

    const { result } = renderHook(() => useSegnale(signal));

    expect(result.current).toBe(0);
  });

  it('should update when the signal value changes', () => {
    const signal = createSegnale(0);

    const { result } = renderHook(() => useSegnale(signal));

    expect(result.current).toBe(0);

    act(() => {
      signal.write(1);
    });

    expect(result.current).toBe(1);
  });
});

describe('useSegnaleEffect', () => {
  it('should execute effect on signal change', async () => {
    const signal = createSegnale(0);
    const effectFn = jest.fn();

    const TestComponent: React.FC = () => {
      useSegnaleEffect(() => {
        signal.read();
        effectFn();
      }, []);

      return null;
    };

    // 渲染组件，并等待初始 Effect 执行
    await act(async () => {
      render(<TestComponent />);
      // 等待所有微任务执行完毕
      await Promise.resolve();
    });

    // 现在 Effect 应该已经执行过一次
    expect(effectFn).toHaveBeenCalledTimes(1);

    // 更新信号值，并等待 Effect 重新执行
    await act(async () => {
      signal.write(1);
      // 等待所有微任务执行完毕
      await Promise.resolve();
    });

    // Effect 应该被再次调用
    expect(effectFn).toHaveBeenCalledTimes(2);
  });
});

describe('useSegnaleAsyncEffect', () => {
  it('should execute async effect on signal change', async () => {
    const signal = createSegnale(0);
    const effectFn = jest.fn();

    const TestComponent: React.FC = () => {
      useSegnaleAsyncEffect(async () => {
        signal.read();
        effectFn();
      }, []);

      return null;
    };

    // 渲染组件，并等待初始 Effect 执行
    await act(async () => {
      render(<TestComponent />);
      // 等待所有微任务和异步任务执行完毕
      await Promise.resolve();
    });

    // 现在 Effect 应该已经执行过一次
    expect(effectFn).toHaveBeenCalledTimes(1);

    // 更新信号值，并等待 Effect 重新执行
    await act(async () => {
      signal.write(1);
      // 等待所有微任务和异步任务执行完毕
      await Promise.resolve();
      await Promise.resolve(); // 如果异步操作嵌套，需要多等待一次
    });

    // Effect 应该被再次调用
    expect(effectFn).toHaveBeenCalledTimes(2);
  });
});