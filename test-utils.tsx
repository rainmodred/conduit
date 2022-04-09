import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { User } from './types';
import { AuthContext } from './context/AuthContext';

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
      {children}
    </RouterContext.Provider>
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
  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}

const mockUser: User = {
  username: 'user',
  bio: 'test',
  email: 'email@example.com',
  image: 'https://test.com/image.jpg',
  token: '12345',
};

export * from '@testing-library/react';
export { customRender as render, renderWithAuthProvider, mockUser };
