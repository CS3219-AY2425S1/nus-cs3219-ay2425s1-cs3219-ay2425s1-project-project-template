import { IDatatableProps, LanguageMode, SortDirection } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import CustomSelect from './custom-select'
import { LeftIcon, RightIcon } from '@/assets/icons'
import { Button } from '../ui/button'
import SortIcon from './sort-icon'

export default function Datatable({
    data,
    columns,
    hideIdx,
    pagination,
    sortBy,
    paginationHandler,
    sortHandler,
}: IDatatableProps) {
    const pageOptions = [5, 10, 20, 50]

    const handleSort = (key: string) => {
        if (sortBy?.sortKey === key) {
            switch (sortBy.direction) {
                case SortDirection.ASC:
                    sortHandler({ sortKey: key, direction: SortDirection.DESC })
                    break
                case SortDirection.DESC:
                    sortHandler({ sortKey: key, direction: SortDirection.NONE })
                    break
                case SortDirection.NONE:
                    sortHandler({ sortKey: key, direction: SortDirection.ASC })
                    break
            }
        } else {
            sortHandler({ sortKey: key, direction: SortDirection.ASC })
        }
    }

    const setPageLimit = (newLimit: number | string) => {
        if (typeof newLimit === 'string') {
            newLimit = parseInt(newLimit)
        }
        paginationHandler(pagination.currentPage, newLimit)
    }

    const setCurrentPage = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) {
            return
        }
        paginationHandler(newPage, pagination.limit)
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{hideIdx ? null : 'No.'}</TableHead>
                        {columns.map((elem) => {
                            if (elem.isHidden) {
                                return null
                            }
                            return (
                                <TableHead
                                    key={elem.key}
                                    className="capitalize"
                                    style={elem.maxWidth ? { width: elem.maxWidth } : {}}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        {elem.key}
                                        {elem.isSortable && (
                                            <Button
                                                variant="ghostTab"
                                                size="icon"
                                                className="rounded-xl"
                                                onClick={() => handleSort(elem.key)}
                                            >
                                                <SortIcon
                                                    sortDir={
                                                        elem.key === sortBy?.sortKey
                                                            ? sortBy.direction
                                                            : SortDirection.NONE
                                                    }
                                                />
                                            </Button>
                                        )}
                                    </div>
                                </TableHead>
                            )
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((elem, idx) => (
                        <TableRow key={idx}>
                            {hideIdx ? null : <TableCell>{idx + 1}</TableCell>}
                            {columns.map((col) => {
                                if (col.isHidden) {
                                    return null
                                }
                                return (
                                    <TableCell key={col.key}>
                                        {col.formatter ? col.formatter(elem[col.key]) : elem[col.key]}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* <Pagination /> */}
            <div className="w-100 p-3 rounded-xl flex items-center justify-between bg-slate-100 border-[1px] border-slate-100 border-t-0 rounded-t-none text-xs text-gray-400">
                <div className="flex items-center gap-3">
                    Rows per page
                    <CustomSelect
                        options={pageOptions}
                        defaultValue={pagination.limit || 10}
                        onSelectChange={(limit: string | number) => setPageLimit(limit)}
                        className="bg-slate-50"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="icon"
                        size={'icon'}
                        onClick={() => setCurrentPage(pagination.currentPage - 1)}
                        className="bg-slate-50"
                    >
                        <LeftIcon color="#9ca3af" />
                    </Button>
                    <span>
                        {' '}
                        {pagination.currentPage} of {pagination.totalPages}{' '}
                    </span>
                    <Button
                        variant="icon"
                        size={'icon'}
                        onClick={() => setCurrentPage(pagination.currentPage + 1)}
                        className="bg-slate-50"
                    >
                        <RightIcon color="#9ca3af" />
                    </Button>
                </div>
            </div>
        </>
    )
}
