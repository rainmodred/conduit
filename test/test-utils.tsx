import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { User } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: () => new Promise(resolve => resolve),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

afterEach(() => {
  queryClient.clear();
});

interface AllTheProvidersProps {
  children: React.ReactNode;
  router?: Partial<NextRouter>;
}

const AllTheProviders = ({ children, router }: AllTheProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        {children}
      </RouterContext.Provider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { router: Partial<NextRouter> },
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders router={options?.router}>{children}</AllTheProviders>
    ),
    ...options,
  });
};

function renderWithAuthProvider(
  children: React.ReactNode,
  user: User | null = null,
) {
  const setUser = jest.fn();
  const logout = jest.fn();
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export * from '@testing-library/react';
export { customRender as render, renderWithAuthProvider, userEvent };
