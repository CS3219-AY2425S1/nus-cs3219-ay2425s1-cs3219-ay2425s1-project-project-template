'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Datatable from '@/components/customs/datatable'
import { Difficulty, IPagination, IQuestion, ISortBy, Modification, QuestionStatus, SortDirection } from '@/types'
import { columns, formFields } from './props'
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
        type: Modification.CREATE,
    })

    const [questionData, setQuestionData] = useState<IQuestion>({
        id: '1',
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

    const handleSubmitQuestionData = () => {}

    const clearFormData = () => {
        setQuestionData({
            ...questionData,
            title: '',
            description: '',
            category: [],
            difficulty: Difficulty.Easy,
            status: QuestionStatus.NOT_ATTEMPTED,
        })
    }

    const actionsHandler = (modicationType: Modification, elemId?: string) => {
        if (!elemId) return
        console.log(modicationType, elemId)
    }

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
                    onClick={() =>
                        setModalData({
                            ...modalData,
                            title: 'Create new question',
                            isOpen: true,
                            type: Modification.CREATE,
                        })
                    }
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
                actionsHandler={actionsHandler}
            />
            {modalData.isOpen && (
                <CustomModal title={modalData.title} className="h-3/4 w-3/4" closeHandler={handleCloseModal}>
                    <CustomForm fields={formFields} data={questionData} submitHandler={handleSubmitQuestionData} />
                </CustomModal>
            )}
        </div>
    )
}
