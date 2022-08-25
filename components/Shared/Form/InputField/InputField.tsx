import { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  type?: 'text' | 'email' | 'password';
  label: string;
  placeholder?: string;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
}

export default function InputField({
  type = 'text',
  label,
  placeholder,
  disabled = false,
  registration,
}: InputFieldProps): JSX.Element {
  return (
    <fieldset disabled={disabled} className="form-group">
      <label htmlFor={`input-${label}`} hidden>
        {label}
      </label>
      <input
        {...registration}
        className="form-control form-control-lg"
        type={type}
        placeholder={placeholder ? placeholder : label}
        id={`input-${label}`}
      />
    </fieldset>
  );
}
