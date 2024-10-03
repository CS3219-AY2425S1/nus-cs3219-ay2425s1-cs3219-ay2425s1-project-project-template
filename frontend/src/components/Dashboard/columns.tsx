import { Question } from "../../types/Question";
import { Column } from "react-table";

export const COLUMNS: Column<Question>[] = [
    // {
    //     Header: 'Id',
    //     accessor: 'id'
    // },
    {
        Header: 'Title',
        accessor: 'title'
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Categories',
        accessor: 'categories'

    },
    {
        Header: 'Complexity',
        accessor: 'complexity'
    },
];