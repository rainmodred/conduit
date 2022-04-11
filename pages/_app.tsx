import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  if (typeof window === 'undefined') {
    const { server } = require('../mocks/server');
    server.listen({ onUnhandledRequest: 'bypass' });
  } else {
    const { worker } = require('../mocks/browser');
    worker.start({ onUnhandledRequest: 'bypass' });
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface AllProvidersProps {
  children: React.ReactNode;
}

function AllProviders({ children }: AllProvidersProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>{children}</Layout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AllProviders>
      <Component {...pageProps} />
    </AllProviders>
  );
}

export default MyApp;
