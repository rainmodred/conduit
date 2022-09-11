import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import LoginForm from '../components/LoginForm/LoginForm';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link href="/register">
                  <a>Need an account?</a>
                </Link>
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
