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
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  function handleSubmit({ email, password }: LoginFormValues) {
    setAuthErrors({});
    setIsFormDisabled(true);
    signIn(email, password).then(
      response => {
        setIsFormDisabled(false);
        setUser(response.user);
        router.push('/');
      },
      error => {
        setIsFormDisabled(false);
        const formattedErrors = formatAuthErrors(error);
        setAuthErrors(formattedErrors);
      },
    );
  }

  return (
    <Form authErrors={authErrors} onSubmit={handleSubmit} schema={schema}>
      {({ register }) => (
        <>
          <InputField
            disabled={isFormDisabled}
            label="Email"
            registration={register('email')}
          />
          <InputField
            disabled={isFormDisabled}
            label="Password"
            registration={register('password')}
          />

          <Button>Sign in</Button>
        </>
      )}
    </Form>
  );
}
