import { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';

const columns = [
  { id: 'question', label: 'Question', minWidth: 170 },
  { id: 'partner', label: 'Partner', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 50 },
  { id: 'datetime', label: 'Date/Time', minWidth: 80 }
];

export default function ActivityTable({ activities }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ maxHeight: 440, maxWidth: '1200px', margin: 'auto' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#1C1678', color: 'white', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const rowIndex = index + page * rowsPerPage + 1;
                const isEvenRow = index % 2 === 0;
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} style={{ backgroundColor: isEvenRow ? '#EBEBEB' : '#F7F7F7' }}>
                    <TableCell>
                      <Button 
                        color="primary" 
                        onClick={() => null}
                        disableRipple
                        sx={{
                          fontSize: '20px', 
                          fontFamily: 'Poppins', 
                          fontWeight: '600',
                          textTransform: 'none',
                          textDecoration: 'underline',
                          color: '#41AFFF',
                          padding: 0,
                          minWidth: 0,
                          textAlign: 'left',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          }
                        }}>
                        {row.question}
                      </Button>
                    </TableCell>

                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>{row.partner}</TableCell>

                    <TableCell 
                      style={{
                        color: 
                          row.status.toLowerCase() === 'attempted' ? '#FFB800' :
                          row.status.toLowerCase() === 'solved' ? '#00C000' : 'black',
                        fontSize: 20, 
                        fontFamily: 'Poppins', 
                        fontWeight: '600', 
                        wordWrap: 'break-word'
                      }}
                    >
                      {row.status}
                    </TableCell>
                    
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>{row.datetime}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={activities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
