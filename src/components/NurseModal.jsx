import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

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

export default function NurseModal({ open, setOpen, onSubmit, editingNurse, errors,setErrors }) {
    const [form, setForm] = useState({
        nurseName: "",
        licenseNumber: "",
        dob: "",
        age: "",
    });
    console.log(editingNurse);


    // Prefill data if editing
    function formatDobForInput(dob) {
        if (!dob) return "";
        // dob is in "DD/MM/YYYY"
        const parts = dob.split("/");
        if (parts.length !== 3) return "";
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    useEffect(() => {
        if (editingNurse) {
            setForm({
                nurseName: editingNurse.nurseName || "",
                licenseNumber: editingNurse.licenseNumber || "",
                dob: formatDobForInput(editingNurse.dob),
                age: editingNurse.age || "",
            });
        } else {
            setForm({ nurseName: "", licenseNumber: "", dob: "", age: "" });
        }
    }, [editingNurse]);



    // Calculate age automatically when DOB changes
    useEffect(() => {
        if (form.dob) {
            const today = new Date();
            const birthDate = new Date(form.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setForm((prev) => ({ ...prev, age }));
        }
    }, [form.dob]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nurseName.trim()) newErrors.nurseName = "Name is required";
        if (!form.licenseNumber.trim()) {
            newErrors.licenseNumber = "License number is required";
        } else if (!/^\d{10}$/.test(form.licenseNumber)) {
            newErrors.licenseNumber = "License number must be 10 digits";
        }
        if (!form.dob) newErrors.dob = "Date of birth is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return; // Stop if validation fails
        onSubmit(form);
        // setOpen(false);
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    {editingNurse ? "Edit Nurse" : "Add New Nurse"}
                </Typography>
                <TextField
                    fullWidth
                    label="Name"
                    name="nurseName"
                    value={form.nurseName}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.nurseName}
                    helperText={errors.nurseName}
                />
                <TextField
                    fullWidth
                    label="License Number"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber}
                />
                <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dob}
                    helperText={errors.dob}
                />
                <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={form.age}
                    disabled
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {editingNurse ? "Update" : "Add"}
                    </Button>
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
