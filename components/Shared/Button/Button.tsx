export default function Button(
  props: React.ComponentPropsWithoutRef<'button'>,
): JSX.Element {
  return <button {...props} className="btn btn-lg btn-primary pull-xs-right" />;
}
