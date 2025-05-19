import React from 'react';

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const Input = ({
  label,
  type,
  value,
  onChange,
  required = false,
  placeholder = '',
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-blue-900 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
      />
    </div>
  );
};

export default Input;
