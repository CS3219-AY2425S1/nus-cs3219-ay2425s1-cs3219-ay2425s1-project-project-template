interface CustomLabelProps {
    title: string
    textColor: string
    bgColor: string
}

export default function CustomLabel({ title, textColor, bgColor }: CustomLabelProps) {
    return (
        <span className={`${textColor} ${bgColor} px-3 py-1 rounded-xl text-center margin-auto capitalize w-fit`}>
            {title}
        </span>
    )
}
