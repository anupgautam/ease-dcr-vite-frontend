import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import ModeEditSharpIcon from "@mui/icons-material/ModeEditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { Link } from "react-router-dom";
import { Box, Modal, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { red, green } from "@mui/material/colors";
import checkIfImageExists from "../forms/utils/checkIfImageExists";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

const RedButton = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: red[500],
  margin: "0 auto",
  width: 100,
  "&:hover": {
    backgroundColor: red[700],
  },
  paddingTop: "7px",
  paddingBottom: "7px",
  fontSize: "12px",
  fontWeight: "600",
  borderRadius: "30px",
  cursor:'pointer'
}));

const GreenButton = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: green[500],
  width: 100,
  margin: "0 auto",
  textAlign: "center",
  "&:hover": {
    backgroundColor: green[700],
  },
  paddingTop: "7px",
  paddingBottom: "7px",
  fontSize: "12px",
  fontWeight: "600",
  borderRadius: "30px",
  cursor:'pointer'
}));

export default function BasicTable(props) {
  const [open, setOpen] = useState(false);
  const [thisId, setThisId] = useState(null);
  const handleOpen = (e, id) => {
    setOpen(true);
    setThisId(id);
  };

  const handleClose = () => setOpen(false);
  const {
    headers,
    data,
    isDelete,
    isEdit,
    isAdd,
    addColor,
    editColor,
    deleteColor,
    tableName,
    deleteCancel,
    deleteConfirm,
    activeSign = [],
  } = props;
  
  const deleteConfirmHere = (e, id) => {
    deleteConfirm(e, id);
    setOpen(false);
  };
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.length === 0 ? (
              <></>
            ) : (
              <>
                {headers.length === 1 ? (
                  <>
                    <TableCell align="center">
                      <Typography
                        style={{ fontSize: "15px", fontWeight: "600" }}
                      >
                        {headers[0]}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        style={{ fontSize: "15px", fontWeight: "600" }}
                      >
                        Actions
                      </Typography>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {headers.map((key, i) => (
                      <TableCell align="center">
                        <Typography
                          style={{ fontSize: "15px", fontWeight: "600" }}
                        >
                          {key}
                        </Typography>
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Typography
                        style={{ fontSize: "15px", fontWeight: "600" }}
                      >
                        Actions
                      </Typography>
                    </TableCell>
                  </>
                )}
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {headers.map((key) => (
                <>
                  {activeSign.includes(key) ? (
                    <TableCell align="center">
                      {row[key] ? (
                        <GreenButton>True</GreenButton>
                      ) : (
                        <RedButton>False</RedButton>
                      )}
                    </TableCell>
                  ) : (
                    <>
                      {row[key] ? (
                        <>
                          {checkIfImageExists(row[key]) ? (
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <img className="table-image" src={row[key]}></img>
                            </TableCell>
                          ) : (
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {row[key]}
                            </TableCell>
                          )}
                        </>
                      ) : (
                        <TableCell
                          align="center"
                          component="th"
                          scope="row"
                        ></TableCell>
                      )}
                    </>
                  )}
                </>
              ))}

              {isDelete || isEdit || isAdd ? (
                <TableCell align="center">
                  {isAdd ? (
                    <Link to={`/dashboard/${tableName}/view/${row["id"]}`}>
                      <AddCircleOutlineSharpIcon
                        sx={{ m: 0.5 }}
                        style={{ color: addColor }}
                      />
                    </Link>
                  ) : (
                    <></>
                  )}
                  {isEdit ? (
                    <Link to={`/dashboard/${tableName}/edit/${row["id"]}`}>
                      <ModeEditSharpIcon
                        sx={{ m: 0.5 }}
                        style={{ color: editColor }}
                      />
                    </Link>
                  ) : (
                    <></>
                  )}
                  {isDelete ? (
                    <a onClick={(e) => handleOpen(e, row["id"])}>
                      <DeleteSharpIcon
                        sx={{ m: 0.5 }}
                        style={{ color: deleteColor }}
                      />
                    </a>
                  ) : (
                    <></>
                  )}
                </TableCell>
              ) : (
                <></>
              )}
            </TableRow>
          ))}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" className="modal-text-design" variant="h6" component="h2">
                Do you want to delete?
              </Typography>
              <button className="yes-button" onClick={(e) => deleteConfirmHere(e, thisId)}>Yes</button>
              <button className="no-button" onClick={handleClose}>No</button>
            </Box>
          </Modal>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
