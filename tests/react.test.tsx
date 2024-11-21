import * as React from 'react';
import { renderHook, act, render } from '@testing-library/react';
import { createSegnale } from '../src/core';
import {
  useSegnale,
  useSegnaleAsyncEffect,
  useSegnaleEffect,
} from '../src/react/hooks';

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

    // 渲染組件，並等待初始 Effect 執行
    await act(async () => {
      render(<TestComponent />);
      // 等待所有微任務執行完畢
      await Promise.resolve();
    });

    // 現在 Effect 應該已經執行過一次
    expect(effectFn).toHaveBeenCalledTimes(1);

    // 更新信號值，並等待 Effect 重新執行
    await act(async () => {
      signal.write(1);
      // 等待所有為任務執行完畢
      await Promise.resolve();
    });

    // Effect 應該被再次調用
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

    // 渲染組件，並等待初始 Effect 執行
    await act(async () => {
      render(<TestComponent />);
      // 等待所有微任務和異步執行完畢
      await Promise.resolve();
    });

    // 現在 Effect 應該已經執行過一次
    expect(effectFn).toHaveBeenCalledTimes(1);

    // 更新信號值，並等待 Effect 重新執行
    await act(async () => {
      signal.write(1);
      // 等待所有微任務和異步執行完畢
      await Promise.resolve();
    });

    // Effect 應該被再次調用
    expect(effectFn).toHaveBeenCalledTimes(2);
  });
});
