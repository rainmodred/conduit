import usePagination from './usePagination';
import { useRouter } from 'next/router';
import { renderHook } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('usePagination', () => {
  const push = jest.fn();
  useRouter.mockImplementation(() => ({
    push,
    pathname: '/',
    route: '/',
    asPath: '/',
    query: '',
  }));
  it('should return range and activePage', () => {
    const { result } = renderHook(() => usePagination(5));
    const { range, activePage } = result.current;
    const expectedRange = [1, 2, 3, 4, 5];

    expect(range).toHaveLength(expectedRange.length);
    expect(range).toEqual(expectedRange);
    expect(activePage).toBe(1);
  });

  it('should work with query', () => {
    useRouter.mockImplementation(() => ({
      query: { page: 2 },
    }));
    const { result } = renderHook(() => usePagination(5));
    const { activePage } = result.current;

    expect(activePage).toBe(2);
  });
});
