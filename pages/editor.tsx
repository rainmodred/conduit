import { useRouter } from 'next/router';
import { useEffect } from 'react';

import CreateArticleForm from '../components/CreateArticleForm/CreateArticleForm';
import { useAuth } from '../context/AuthContext';

export default function Editor() {
  const { push } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user === undefined) {
      push('/');
    }
  }, [user]);

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <CreateArticleForm />
          </div>
        </div>
      </div>
    </div>
  );
}
