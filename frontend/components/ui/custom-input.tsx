import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ErrorIconToast } from '@/assets/icons/error-icon'

interface InputFieldProps {
    id: string
    label: string
    type: string
    placeholder: string
    icon?: React.ReactNode
    value?: string
    error?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface OptionsFieldProps {
    id: string
    label: string
    error?: string
    onChange?: (e: string) => void
}

export const InputField = ({
    id,
    label,
    type,
    placeholder,
    icon,
    value,
    error,
    onChange,
}: InputFieldProps): JSX.Element => {
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
                {icon && <span className="absolute right-3 top-5 transform -translate-y-1/2">{icon}</span>}
                {error ? (
                    <div className="flex flex-row gap-1 h-min mt-1">
                        <ErrorIconToast />
                        <p className="text-xs text-red-delete">{error}</p>
                    </div>
                ) : (
                    <div className="flex flex-row gap-1 h-min mt-1">
                        <p className="text-xs text-red-delete">&nbsp;</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export const OptionsField = ({ id, label, error, onChange }: OptionsFieldProps): JSX.Element => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Select onValueChange={onChange}>
                <SelectTrigger className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    <SelectValue placeholder="Select one..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            {error ? (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <ErrorIconToast />
                    <p className="text-xs text-red-delete">{error}</p>
                </div>
            ) : (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <p className="text-xs text-red-delete">&nbsp;</p>
                </div>
            )}
        </div>
    )
}
