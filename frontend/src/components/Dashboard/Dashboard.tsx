import React, { useEffect, useMemo, useState } from "react";
import { useTable, Column } from "react-table"; // Import the 'Column' type
import { COLUMNS } from "./columns";
import EditQuestionModal from "../EditQuestionModal";

const Dashboard: React.FC = () => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions", {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8080",
          },
        });
        const data = await response.json();
        setData(data._embedded.questionList);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchData();
  }, []);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const closeEditModal = () => setEditModalIsOpen(false);

  const [questionTitleToEdit, setQuestionTitleToEdit] = useState("");
  const [oldDifficulty, setOldDifficulty] = useState("");
  const [oldTopic, setOldTopic] = useState([""]);
  const [oldTitle, setOldTitle] = useState("");
  const [oldDetails, setOldDetails] = useState("");
  const [questionID, setQuestionID] = useState("");

  const openEditModal = (
    oldDifficulty: string,
    oldTopic: string[],
    oldTitle: string,
    oldDetails: string,
    questionID: string
  ) => {
    setEditModalIsOpen(true);
    setOldDifficulty(oldDifficulty);
    setOldTopic(oldTopic);
    setOldTitle(oldTitle);
    setOldDetails(oldDetails);
    setQuestionID(questionID);
  };

  const columns: Column[] = useMemo(() => COLUMNS, []);
  const data = useMemo(() => Data, [Data]);

  const tableInstance = useTable({
    columns: columns,
    data: data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="overflow-x-auto">
      {editModalIsOpen && (
        <EditQuestionModal
          onClose={closeEditModal}
          oldDifficulty={oldDifficulty}
          oldTopic={oldTopic}
          oldTitle={oldTitle}
          oldDetails={oldDetails}
          questionID={questionID}
        />
      )}
      {/* Add your table or other components here */}
      <table
        {...getTableProps()}
        className="min-w-full bg-off-white shadow-md rounded-lg"
      >
        <thead className="bg-white text-gray-700 uppercase text-sm leading-normal">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id}
              className="py-3 px-6 text-left font-medium tracking-wider border-t border-b border-gray-200"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className="py-2 pl-2"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="text-gray-600 text-sm font-light"
        >
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className={`border-b border-gray-200 hover:bg-gray-100 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="py-3 px-6 text-left"
                      onClick={() => {
                        openEditModal(
                          row.allCells[3].value,
                          row.allCells[2].value,
                          row.allCells[0].value,
                          row.allCells[1].value,
                          (row.original as any).id
                        );
                      }}
                    >
                      {cell.column.Header === "Categories"
                        ? (cell.value.reduce(
                            (total: string, category: string) =>
                              total + category + "\n",
                            ""
                          ) as string)
                        : cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
