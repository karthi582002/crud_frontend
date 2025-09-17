import React, { useState } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./Confirm_Modal.jsx";
import { deleteNurse } from "../server.js";

const columns = [
    { id: "nurseName", label: "Name", minWidth: 170 },
    { id: "licenseNumber", label: "License Number", minWidth: 150 },
    { id: "dob", label: "DOB", minWidth: 120 },
    { id: "age", label: "Age", minWidth: 50, align: "right" },
    { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

export default function StickyHeadTable({rows, setNurses, page, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange,setEditingNurse,setOpen}) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState(null);

    const handleDelete = (nurse) => {
        setSelectedNurse(nurse);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteNurse(selectedNurse.id);
            setNurses((prev) => prev.filter((n) => n.id !== selectedNurse.id));
            setDeleteOpen(false);
            setSelectedNurse(null);
        } catch (error) {
            console.error("Failed to delete nurse:", error);
        }
    };

    return (
        <>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="nurse table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || "left"}
                                        sx={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No data
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => (
                                    <TableRow hover key={row.id}>
                                        {columns.map((column) => {
                                            if (column.id === "actions") {
                                                return (
                                                    <TableCell key={column.id} align="center">
                                                        <IconButton color="primary"
                                                        onClick={() => {
                                                            setEditingNurse(row)
                                                            setOpen(true)
                                                            console.log(row)
                                                        }
                                                        }>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleDelete(row)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                );
                                            } else {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align || "left"}
                                                        sx={{ fontWeight: 500, fontSize: "15px" }}
                                                    >
                                                        {row[column.id] ?? "-"}
                                                    </TableCell>
                                                );
                                            }
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => onPageChange(newPage)}
                    onRowsPerPageChange={(e) => onRowsPerPageChange(+e.target.value)}
                />
            </Paper>

            {selectedNurse && (
                <DeleteModal
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    nurseName={selectedNurse.nurseName}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}
