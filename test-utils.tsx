import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';

import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

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

interface AllTheProvidersProps {
  children: React.ReactNode;
  router?: Partial<NextRouter>;
}

const AllTheProviders = ({ children, router }: AllTheProvidersProps) => {
  return (
    <RouterContext.Provider value={{ ...mockRouter, ...router }}>
      <AuthProvider>{children}</AuthProvider>
    </RouterContext.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { router: Partial<NextRouter> },
) => {
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders router={options?.router}>{children}</AllTheProviders>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
