import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { signIn } from '../../utils/api';

import { FormattedAuthErrors } from '../../utils/types';
import { formatAuthErrors } from '../../utils/utils';
import Button from '../Shared/Button/Button';
import Form from '../Shared/Form/Form';
import InputField from '../Shared/Form/InputField/InputField';

export type LoginFormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
});

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const { setUser } = useAuth();
  const [authErrors, setAuthErrors] = useState<FormattedAuthErrors>({});

  function handleSubmit({ email, password }: LoginFormValues) {
    setAuthErrors({});
    return signIn(email, password).then(
      response => {
        setUser(response.user);
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
            Sign in
          </Button>
        </>
      )}
    </Form>
  );
}
