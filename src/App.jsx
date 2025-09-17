import React, {useEffect, useState} from "react";
import StickyHeadTable from "./components/Table.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {addNurse, getAllNurses, updateNurse} from "./server.js";
import NurseModal from "./components/NurseModal.jsx";

const App = () => {
    // Sample nurse data (replace with API fetch)
    const [nurses, setNurses] = useState([]);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [editingNurse, setEditingNurse] = useState(null);


    // Fetch data from API on component mount
    const fetchData = async (pageNumber = page, pageSize = limit) => {
        const result = await getAllNurses(pageNumber, pageSize);
        const formattedNurses = result.data.map((nurse) => ({
            ...nurse,
            dob: nurse.dob ? new Date(nurse.dob).toLocaleDateString("en-GB") : "",
        }));
        setNurses(formattedNurses);
        setPage(result.page);
        setLimit(result.limit);
        setTotal(result.total);
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (newPage) => {
        fetchData(newPage + 1, limit); // TablePagination is 0-indexed
    };

    const handleRowsPerPageChange = (newLimit) => {
        fetchData(1, newLimit); // reset to first page
    };

    // Filter nurses based on search term
    const filteredNurses = nurses.filter((n) =>
        (n.nurseName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        (n.licenseNumber || "").includes(searchTerm) ||
        (n.age !== undefined && n.age !== null ? n.age.toString() : "").includes(searchTerm)
    );


    // Download table as Excel
    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredNurses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Nurses");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "nurses.xlsx");
    };



    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Heading */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Nurse Management System</h1>
                <p className="text-gray-600 mt-2">Manage all nurse records </p>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between align-items-center">
                    <div className="flex gap-5 items-center mb-4 w-1/2">
                        {/* Search Box */}
                        <input
                            type="text"
                            placeholder="Search by name, license or age..."
                            className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Download Button */}
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add New Nurse
                        </button>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <StickyHeadTable
                        rows={filteredNurses}
                        setNurses={setNurses}
                        page={page - 1} // TablePagination is 0-indexed
                        rowsPerPage={limit}
                        totalRows={total}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        setEditingNurse={setEditingNurse}
                        setOpen={setOpen}
                    />
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition mt-5"
                >
                    Download Excel
                </button>
            </div>
            <NurseModal
                open={open}
                setOpen={setOpen}
                errors={errors}
                setErrors={setErrors}
                editingNurse={editingNurse || ""}
                onSubmit={async (formData) => {
                    try {
                        if (editingNurse) {
                            // Call API to update nurse (you may need nurse id)
                            await updateNurse(editingNurse.id, formData);

                            // Update state locally
                            setNurses((prev) =>
                                prev.map((n) =>
                                    n.id === editingNurse.id ? { ...n, ...formData } : n
                                )
                            );
                        } else {
                            // Add new nurse
                            await addNurse(formData);
                            setNurses((prev) => [...prev, formData]);
                        }
                        setOpen(false);
                        setEditingNurse(null); // reset edit mode
                    } catch (error) {
                        console.error(error);
                        alert(error.response?.data?.message || "Something went wrong");
                    }
                }}

            />
        </div>
    );
};

export default App;
