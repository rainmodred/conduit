import { AuthProvider } from '../AuthContext';
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

interface AllProvidersProps {
  children: React.ReactNode;
}

function AllProviders({ children }: AllProvidersProps): JSX.Element {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
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