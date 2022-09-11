import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import SettingsForm from '../components/SettingsForm/SettingsForm';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { push } = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user === undefined) {
      push('/login');
    }
  }, [user]);

  function handleLogout() {
    logout();
    push('/all');
  }

  return (
    <div className="settings-page">
      <Head>
        <title>Settings</title>
      </Head>
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <SettingsForm />
            <hr />
            {user && (
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Or click here to logout.
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
