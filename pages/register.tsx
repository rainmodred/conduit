import { useEffect } from 'react';
import { useRouter } from 'next/router';

import RegisterForm from '../components/RegisterForm/RegisterForm';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Head from 'next/head';

export default function Register() {
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
        <title>Sign Un</title>
      </Head>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link href="/login">
                  <a>Have an account?</a>
                </Link>
              </p>

              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
