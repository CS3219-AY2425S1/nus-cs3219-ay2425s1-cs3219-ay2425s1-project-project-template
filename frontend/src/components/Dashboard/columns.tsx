interface header {
    Header: string;
    accessor: string;
}

export const COLUMNS: header[] = [
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