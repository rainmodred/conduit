import * as z from 'zod';

import { render, screen, waitFor, userEvent } from '../../../test/test-utils';
import Button from '../Button/Button';

import Form from './Form';
import InputField from './InputField/InputField';

const testData = {
  title: 'Hello World',
};

const schema = z.object({
  title: z.string().min(1, 'Required'),
});

describe('Form', () => {
  it('should render and submit a basic Form component', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form<typeof testData, typeof schema>
        onSubmit={val => handleSubmit(val)}
        schema={schema}
      >
        {({ register }) => (
          <>
            <InputField label={'Title'} registration={register('title')} />

            <Button>Submit</Button>
          </>
        )}
      </Form>,
    );

    await userEvent.type(screen.getByLabelText(/title/i), testData.title);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith(testData));
  });

  it('should fail submission if validation fails', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form<typeof testData, typeof schema>
        onSubmit={val => handleSubmit(val)}
        schema={schema}
      >
        {({ register }) => (
          <>
            <InputField label={'Title'} registration={register('title')} />

            <Button>Submit</Button>
          </>
        )}
      </Form>,
    );

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await screen.findByRole(/alert/i, { name: /required/i });

    expect(handleSubmit).toHaveBeenCalledTimes(0);
  });

  it('should show api errors', () => {
    const errors = { title: { message: 'error message' } };
    render(
      <Form<typeof testData, typeof schema>
        onSubmit={jest.fn()}
        schema={schema}
        authErrors={errors}
      >
        {({ register }) => (
          <>
            <InputField label={'Title'} registration={register('title')} />

            <Button>Submit</Button>
          </>
        )}
      </Form>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(errors.title.message);
  });
});
