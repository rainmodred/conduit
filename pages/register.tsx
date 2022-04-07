import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '../api';
import { useEffect, useState } from 'react';
import { ApiErrorsType } from '../types';
import { useRouter } from 'next/router';

type FormValues = {
  email: string;
  username: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, 'email is required'),
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

export default function Register() {
  const [user, setUser] = useAuth();
  const [apiErrors, setApiErrors] = useState<ApiErrorsType>({});
  const [IsFormDisabled, setIsFormDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const router = useRouter();

  function onSubmit({ email, username, password }: FormValues) {
    setApiErrors({});
    signUp(email, username, password).then(
      response => {
        setIsFormDisabled(false);
        setUser(response.user);
        router.push('/');
      },
      error => {
        setIsFormDisabled(false);
        setApiErrors(error.errors);
      },
    );
  }

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>

            <ul className="error-messages">
              {Object.values(errors).map((error, index) => (
                <li key={`error-${index}`}>{error.message}</li>
              ))}

              {Object.keys(apiErrors).map(errorKey => {
                return (
                  <li key={`apiError-${errorKey}`}>
                    {errorKey} {apiErrors[errorKey]}
                  </li>
                );
              })}
            </ul>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={IsFormDisabled} className="form-group">
                <input
                  {...register('username')}
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                />
              </fieldset>
              <fieldset disabled={IsFormDisabled} className="form-group">
                <input
                  {...register('email')}
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset disabled={IsFormDisabled} className="form-group">
                <input
                  {...register('password')}
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
