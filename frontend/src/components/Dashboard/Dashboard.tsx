import React, { useEffect, useMemo, useState } from 'react';
import { useTable, Column } from 'react-table'; // Import the 'Column' type
import { COLUMNS } from './columns';

const Dashboard: React.FC = () => {
    const [Data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/questions', {
                    mode: "cors",
                    headers: {
                      "Access-Control-Allow-Origin": "http://localhost:8080",
                    },
                  });
                const data = await response.json();
                setData(data._embedded.questionList);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchData();
    }, []);

    const columns: Column[] = useMemo(() => COLUMNS, []);
    const data = useMemo(() => Data, [Data]);
    
    const tableInstance = useTable({
        columns: columns,
        data: data
    });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <div className="overflow-x-auto">
            {/* Add your table or other components here */}
            <table 
            {...getTableProps()}
            className="min-w-full bg-off-white shadow-md rounded-lg">
                <thead className="bg-white text-gray-700 uppercase text-sm leading-normal">
                    {
                        headerGroups.map(headerGroup => (
                            <tr 
                            {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}
                            className="py-3 px-6 text-left font-medium tracking-wider border-t border-b border-gray-200">
                                {
                                    headerGroup.headers.map(column => (
                                        <th 
                                        {...column.getHeaderProps()} 
                                        key={column.id}
                                        className="py-2 pl-2">{column.render('Header')}</th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody 
                {...getTableBodyProps()}
                className="text-gray-600 text-sm font-light">
                    {
                        rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr 
                                {...row.getRowProps()} 
                                key={row.id}
                                className={`border-b border-gray-200 hover:bg-gray-100 ${
                                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                  }`}>
                                    {
                                        row.cells.map(cell => {
                                            return (cell.column.Header === 'Categories') ? (
                                                <td 
                                                {...cell.getCellProps()} 
                                                key={cell.column.id}
                                                className="py-3 px-6 text-left">{cell.render('Cell')}</td>
                                            ) : (
                                                <td 
                                                {...cell.getCellProps()} 
                                                key={cell.column.id}
                                                className="py-3 px-6 text-left"
                                                onClick={() => console.log(cell)}>{cell.render('Cell')}</td>
                                            )
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;