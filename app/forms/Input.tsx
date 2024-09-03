import React from "react";

interface InputProps {
    label: string;
    name: string;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({
                                         label,
                                         name,
                                         placeholder,
                                         type = "text",
                                     }) => {

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                   {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
        </div>
    );
};

export default Input;