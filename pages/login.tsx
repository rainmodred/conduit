import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '../api';
import { useState } from 'react';
import { ApiErrorsType } from '../types';
import { useRouter } from 'next/router';

type FormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
});

export default function Login() {
  const [, setUser] = useAuth();
  const [apiErrors, setApiErrors] = useState<ApiErrorsType>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const router = useRouter();

  function onSubmit({ email, password }: FormValues) {
    setApiErrors({});
    signIn(email, password).then(
      response => {
        setUser(response.user);
        router.push('/');
      },
      error => {
        setApiErrors(error.errors);
      },
    );
  }

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
              <fieldset className="form-group">
                <input
                  {...register('email')}
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  {...register('password')}
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
