import CustomLabel from '../ui/label'
import { Difficulty } from '@/tyoes/difficulty'

import { FC } from 'react'

interface DifficultyLabelProps {
    difficulty: Difficulty
}

export const DifficultyLabel: FC<DifficultyLabelProps> = ({ difficulty }) => {
    let textColor = ''
    let bgColor = ''
    switch (difficulty) {
        case Difficulty.Easy:
            textColor = 'text-green-600'
            bgColor = 'bg-green-100'
            break
        case Difficulty.Medium:
            textColor = 'text-amber-600'
            bgColor = 'bg-amber-100'
            break
        case Difficulty.Hard:
            textColor = 'text-red-600'
            bgColor = 'bg-red-100'
            break
        default:
            textColor = 'text-purple-600'
            bgColor = 'bg-purple-100'
    }

    return <CustomLabel title={difficulty} textColor={textColor} bgColor={bgColor} />
}
