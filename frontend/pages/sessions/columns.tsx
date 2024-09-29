import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { IDatatableColumn, QuestionStatus } from '@/types'

const convertTimestamp = (millis: number) => {
    const date = new Date(millis)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}

export const columns: IDatatableColumn[] = [
    {
        key: 'name',
    },
    {
        key: 'question',
    },
    {
        key: 'description',
        maxWidth: '40%',
        offAutoCapitalize: true,
    },
    {
        key: 'status',
        formatter: (value) => {
            return (
                <div className="flex items-center justify-center">
                    {value === QuestionStatus.COMPLETED ? (
                        <TickIcon />
                    ) : value === QuestionStatus.FAILED ? (
                        <ExclamationIcon />
                    ) : null}
                </div>
            )
        },
    },
    {
        key: 'difficulty',
        isSortable: true,
        formatter: (value) => {
            return <DifficultyLabel difficulty={value} />
        },
    },
    {
        key: 'time',
        formatter: (value) => {
            return <span>{convertTimestamp(value)}</span>
        },
    },
]

export default function None() {
    ;<></>
}
