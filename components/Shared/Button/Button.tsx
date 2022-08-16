interface ButtonProps {
  children: React.ReactNode;
}

export default function Button({ children }: ButtonProps): JSX.Element {
  return (
    <button
      name="submit"
      type="submit"
      className="btn btn-lg btn-primary pull-xs-right"
    >
      {children}
    </button>
  );
}
