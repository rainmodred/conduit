if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}
import { useState } from 'react';
import { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//     },
//   },
// });

interface AllProvidersProps {
  children: React.ReactNode;
  pageProps: any;
}

function AllProviders({ children, pageProps }: AllProvidersProps): JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AllProviders pageProps={pageProps}>
      <Component {...pageProps} />
    </AllProviders>
  );
}

export default MyApp;
