import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { Difficulty, FormType, IDatatableColumn, IFormFields, QuestionStatus } from '@/types'

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

const formFields: IFormFields[] = [
    {
        label: 'Title',
        accessKey: 'title',
        formType: FormType.TEXT,
        placeholder: 'Enter title',
        required: true,
    },
    {
        label: 'Category',
        accessKey: 'category',
        formType: FormType.MULTISELECT,
        required: true,
        selectOptions: ['Algorithm', 'String', 'Hashtable', 'Dynamic Programming'], // Todo: retrieve set from BE
    },
    {
        label: 'Difficulty',
        accessKey: 'difficulty',
        formType: FormType.SELECT,
        required: true,
        selectOptions: Object.values(Difficulty),
    },
    {
        label: 'Description',
        accessKey: 'description',
        formType: FormType.TEXTAREA,
        placeholder: 'Enter description',
        required: true,
    },
]

export { columns, formFields }

export default function None() {
    ;<></>
}
