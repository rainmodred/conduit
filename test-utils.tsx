import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import Layout from './components/Layout';
import { AuthProvider } from './AuthContext';

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>;
    </AuthProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
