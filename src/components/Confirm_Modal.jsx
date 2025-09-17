import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function DeleteModal({ open, setOpen, onConfirm, nurseName }) {
    const handleClose = () => setOpen(false);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Delete Confirmation
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2, mb: 3 }}>
                    Are you sure you want to delete <strong>{nurseName}</strong>?
                </Typography>
                <Box className="flex justify-end gap-2">
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Yes, Delete
                    </Button>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
