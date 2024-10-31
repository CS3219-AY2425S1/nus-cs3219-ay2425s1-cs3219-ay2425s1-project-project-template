export const formatTestInput = (input: any) => {
    if (Array.isArray(input)) {
        return input.join(' ')
    }
    return String(input)
}