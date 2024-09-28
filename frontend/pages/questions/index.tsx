'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Datatable from '@/components/customs/datatable'
import {
    Difficulty,
    FormType,
    IFormFields,
    IPagination,
    IQuestion,
    ISortBy,
    QuestionStatus,
    SortDirection,
} from '@/types'
import { columns } from './questions-datatable-columns'
import { mockQuestionsData } from '@/mock-data'
import CustomModal from '@/components/customs/custom-modal'
import CustomForm from '@/components/customs/custom-form'

async function getData(): Promise<IQuestion[]> {
    return mockQuestionsData
}

export default function Questions() {
    const [data, setData] = useState<IQuestion[]>([])
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 10,
        currentPage: 1,
        totalItems: 96,
        limit: 10,
    })
    const [sortBy, setSortBy] = useState({
        sortKey: 'id',
        direction: SortDirection.NONE,
    })
    const [modalData, setModalData] = useState({
        title: '',
        content: '',
        isOpen: false,
    })

    const [questionData, setQuestionData] = useState<IQuestion>({
        title: '',
        description: '',
        category: [],
        difficulty: Difficulty.Easy,
        status: QuestionStatus.NOT_ATTEMPTED,
    })

    const sortHandler = (sortBy: ISortBy) => {
        setSortBy(sortBy)
    }

    const paginationHandler = (page?: number, limit?: number) => {}

    const handleCloseModal = () => {
        clearFormData()
        setModalData({
            ...modalData,
            isOpen: false,
        })
    }

    const clearFormData = () => {
        setQuestionData({
            title: '',
            description: '',
            category: [],
            difficulty: Difficulty.Easy,
            status: QuestionStatus.NOT_ATTEMPTED,
        })
    }

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

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [])

    return (
        <div className="m-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Questions</h2>
                <Button
                    variant={'primary'}
                    onClick={() => setModalData({ ...modalData, title: 'Create new question', isOpen: true })}
                >
                    Create
                </Button>
            </div>
            <Datatable
                data={data}
                columns={columns}
                pagination={pagination}
                sortBy={sortBy}
                sortHandler={sortHandler}
                paginationHandler={paginationHandler}
            />
            {modalData.isOpen && (
                <CustomModal title={modalData.title} className="h-3/4 w-3/4" closeHandler={handleCloseModal}>
                    <CustomForm fields={formFields} data={questionData} submitHandler={() => {}} />
                </CustomModal>
            )}
        </div>
    )
}
