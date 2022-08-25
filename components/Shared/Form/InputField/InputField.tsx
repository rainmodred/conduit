import { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  size?: 'md' | 'lg';
  type?: 'text' | 'email' | 'password';
  label: string;
  placeholder?: string;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
}

export default function InputField({
  size = 'md',
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
        className={`form-control ${size === 'lg' && 'form-control-lg'}`}
        type={type}
        placeholder={placeholder ? placeholder : label}
        id={`input-${label}`}
      />
    </fieldset>
  );
}
