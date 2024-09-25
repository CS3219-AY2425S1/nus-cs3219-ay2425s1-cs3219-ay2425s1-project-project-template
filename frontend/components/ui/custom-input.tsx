interface InputFieldProps {
    id: string
    label: string
    type: string
    placeholder: string
    icon?: React.ReactNode
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({ id, label, type, placeholder, icon, value, onChange }: InputFieldProps): JSX.Element => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
                {icon && <span className="absolute right-3 top-1/2 transform -translate-y-1/2">{icon}</span>}
            </div>
        </div>
    )
}

export default InputField
