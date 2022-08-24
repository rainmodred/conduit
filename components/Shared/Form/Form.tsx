import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ErrorField from './ErrorField/ErrorField';
import { FormattedAuthErrors } from '../../../utils/types';
import { useEffect } from 'react';

interface FormProps<TFormValues, Schema> {
  authErrors?: FormattedAuthErrors;
  schema: Schema;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  onSubmit: SubmitHandler<TFormValues>;
  className?: string;
}

export default function Form<
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >,
>({
  authErrors,
  schema,
  className,
  children,
  onSubmit,
}: FormProps<TFormValues, Schema>): JSX.Element {
  const methods = useForm<TFormValues>({ resolver: zodResolver(schema) });
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <ul className="error-messages">
        {Object.values(errors).map((error, index) => (
          <ErrorField message={error.message} key={`error-${index}`} />
        ))}

        {authErrors &&
          Object.values(authErrors).map((error, index) => (
            <ErrorField message={error.message} key={`error-${index}`} />
          ))}
      </ul>
      <form className={className} onSubmit={handleSubmit(onSubmit)}>
        {children(methods)}
      </form>
    </>
  );
}
