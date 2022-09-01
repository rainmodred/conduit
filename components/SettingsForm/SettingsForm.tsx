import { useRouter } from 'next/router';
import { z } from 'zod';

import Form from '../Shared/Form/Form';
import { useAuth } from '../../context/AuthContext';
import InputField from '../Shared/Form/InputField/InputField';
import Button from '../Shared/Button/Button';
import { updateUser } from '../../utils/api';

export type SettingsFormValues = {
  email: string;
  username: string;
  password: string;
  bio: string;
  image: string;
};

const schema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  bio: z.string(),
  image: z.string(),
});

export default function SettingsForm() {
  const { push } = useRouter();
  const { user, setUser } = useAuth();

  function handleSubmit({
    email,
    username,
    password,
    bio,
    image,
  }: SettingsFormValues) {
    updateUser(
      { email, username, password, bio, image },
      user?.token as string,
    ).then(
      updatedUser => {
        setUser({
          email: updatedUser.email,
          username: updatedUser.username,
          image: updatedUser.image,
          bio: updatedUser.bio,
          token: updatedUser.token,
        });
        push(`/profile/${updatedUser.username}`);
      },
      error => console.log('error', error),
    );
  }

  return (
    <Form
      defaultValues={{
        image: user?.image ?? '',
        bio: user?.bio ?? '',
        email: user?.email ?? '',
        username: user?.username ?? '',
      }}
      onSubmit={handleSubmit}
      schema={schema}
    >
      {({ register }) => (
        <>
          <InputField
            label="profile picture"
            type="text"
            placeholder="URL of profile picture"
            registration={register('image')}
          />
          <InputField
            size="lg"
            type="text"
            label="username"
            placeholder="Your Name"
            registration={register('username')}
          />
          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              {...register('bio')}
            ></textarea>
          </fieldset>
          <InputField
            size="lg"
            label="email"
            type="email"
            placeholder="Email"
            registration={register('email')}
          />
          <InputField
            size="lg"
            label="password"
            type="password"
            placeholder="New Password"
            registration={register('password')}
          />
          <Button>Update settings</Button>
        </>
      )}
    </Form>
  );
}
