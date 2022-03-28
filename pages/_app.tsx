import Layout from '../components/Layout';
import '../styles/globals.css';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  if (typeof window === 'undefined') {
    const { server } = require('../mocks/server');
    server.listen();
  } else {
    const { worker } = require('../mocks/browser');
    worker.start();
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
