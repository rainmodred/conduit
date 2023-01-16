import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { signUp } from '../../utils/api';

import { FormattedAuthErrors } from '../../utils/types';
import { formatAuthErrors } from '../../utils/utils';
import Button from '../Shared/Button/Button';
import Form from '../Shared/Form/Form';
import InputField from '../Shared/Form/InputField/InputField';

export type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, 'email is required'),
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

export default function RegisterForm(): JSX.Element {
  const router = useRouter();
  const { setUser } = useAuth();
  const [authErrors, setAuthErrors] = useState<FormattedAuthErrors>({});

  function handleSubmit({ email, username, password }: RegisterFormValues) {
    setAuthErrors({});
    return signUp(email, username, password).then(
      response => {
        setUser(response.user);
        // TODO: remove?
        router.push('/');
      },
      error => {
        const formattedErrors = formatAuthErrors(error);
        setAuthErrors(formattedErrors);
      },
    );
  }

  return (
    <Form authErrors={authErrors} onSubmit={handleSubmit} schema={schema}>
      {({ register, formState }) => (
        <>
          <InputField
            size="lg"
            disabled={formState.isSubmitting}
            label="Username"
            registration={register('username')}
          />
          <InputField
            size="lg"
            disabled={formState.isSubmitting}
            label="Email"
            registration={register('email')}
            type="email"
          />
          <InputField
            size="lg"
            disabled={formState.isSubmitting}
            label="Password"
            registration={register('password')}
            type="password"
          />

          <Button type="submit" disabled={formState.isSubmitting}>
            Sign up
          </Button>
        </>
      )}
    </Form>
  );
}
