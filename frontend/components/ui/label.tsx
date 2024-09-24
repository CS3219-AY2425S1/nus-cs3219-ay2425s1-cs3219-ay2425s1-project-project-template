interface CustomLabelProps {
    title: string
    textColor: string
    bgColor: string
}

export default function CustomLabel({ title, textColor, bgColor }: CustomLabelProps) {
    return <span className={`${textColor} ${bgColor} px-3 rounded-xl text-center margin-auto`}>{title}</span>
}
