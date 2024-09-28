import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { IDatatableColumn, QuestionStatus } from '@/types'

const columns: IDatatableColumn[] = [
    {
        key: 'id',
        isHidden: true,
    },
    {
        key: 'category',
    },
    {
        key: 'description',
        maxWidth: '45%',
        formatter: (value) => {
            return (
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {value}
                </div>
            )
        },
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
]

export { columns }

export default function None() {
    ;<></>
}
