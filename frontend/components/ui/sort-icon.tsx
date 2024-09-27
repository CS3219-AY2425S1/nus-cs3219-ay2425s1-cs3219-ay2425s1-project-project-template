import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons'
import { SortDirection } from '@tanstack/react-table'

export default function SortIcon({ sortDir }: { sortDir: false | SortDirection }) {
    return (
        <div>
            <TriangleUpIcon className={`h-4 w-4 -mb-2 ${sortDir === 'asc' ? 'text-black' : 'text-gray-400'} `} />
            <TriangleDownIcon className={`h-4 -mt-2 w-4" ${sortDir === 'desc' ? 'text-black' : 'text-gray-400'} `} />
        </div>
    )
}
