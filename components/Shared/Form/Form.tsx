import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ErrorField from './ErrorField/ErrorField';
import { FormattedAuthErrors } from '../../../utils/types';

interface FormProps<TFormValues, Schema> {
  authErrors?: FormattedAuthErrors;
  schema: Schema;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  onSubmit: SubmitHandler<TFormValues>;
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
  children,
  onSubmit,
}: FormProps<TFormValues, Schema>): JSX.Element {
  const methods = useForm<TFormValues>({ resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

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
      <form onSubmit={handleSubmit(onSubmit)}>{children(methods)}</form>
    </>
  );
}
