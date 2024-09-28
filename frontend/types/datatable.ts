interface IRowData {
    [key: string]: any
}

interface IDatatableColumn {
    key: string
    isHidden?: boolean
    maxWidth?: string
    formatter?: (value: any) => React.ReactNode
    isSortable?: boolean
    sortingFn?: (value: any) => any
    isEdit?: boolean
    isDelete?: boolean
}

interface IPagination {
    totalItems: number
    currentPage: number
    totalPages: number
    limit: number
}

interface ISortBy {
    sortKey: string
    direction: SortDirection
}

interface IDatatableProps {
    data: IRowData[]
    columns: IDatatableColumn[]
    hideIdx?: boolean
    pagination: IPagination
    sortBy?: ISortBy
    paginationHandler: (page: number, limit: number) => void
    sortHandler: (sortBy: ISortBy) => void
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
    NONE = 'null',
}

export type { IRowData, IDatatableColumn, IDatatableProps, IPagination, ISortBy }
