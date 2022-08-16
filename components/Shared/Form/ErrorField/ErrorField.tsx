interface ErrorFieldProps {
  message: string;
}

export default function ErrorField({ message }: ErrorFieldProps): JSX.Element {
  return (
    <li role="alert" aria-label={message}>
      {message}
    </li>
  );
}
