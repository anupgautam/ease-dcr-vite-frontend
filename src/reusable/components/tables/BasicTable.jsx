import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

export default function BasicTable(props) {
  const { headers, data, isDelete, isEdit, isAdd, addColor, editColor, deleteColor } = props;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.length === 0 ? <></> :

              <>{headers.length === 1 ? <>
                <TableCell align="center">{headers[0]}</TableCell>
                <TableCell align="center">Actions</TableCell>
              </> : <>
                {headers.map((key, i) => (
                  <TableCell align="center">{key}</TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </>}</>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {headers.map((key) => (
                <>
                  {row[key] ?
                    <TableCell align="center" component="th" scope="row">
                      {row[key]}
                    </TableCell> : <></>}</>
              ))}

              {isDelete || isEdit || isAdd ?
                <TableCell align="center">
                  {isAdd ?
                    <AddCircleOutlineSharpIcon
                      sx={{ m: 0.5 }}
                      style={{ color: addColor }}
                    /> : <></>}
                  {isEdit ?
                    <ModeEditSharpIcon
                      sx={{ m: 0.5 }}
                      style={{ color: editColor }}
                    /> : <></>}
                  {isDelete ?
                    <DeleteSharpIcon
                      sx={{ m: 0.5 }}
                      style={{ color: deleteColor }}
                    /> : <></>}
                </TableCell> : <></>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}