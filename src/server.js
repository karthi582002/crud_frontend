import axios from "axios";

const API_URL = "https://crud-backend-cyan.vercel.app/nurses";

// Get all nurses
export const getAllNurses = async (page = 1, limit = 5) => {
    try {
        const response = await axios.get(`${API_URL}/getData`, {
            params: { page, limit },
        });
        return response.data; // contains { page, limit, total, totalPages, data }
    } catch (error) {
        console.error("Error fetching paginated nurses:", error);
        return { page, limit, total: 0, totalPages: 0, data: [] };
    }
};

// Delete a nurse
export const deleteNurse = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting nurse:", error);
        return [];
    }
};

// Update a nurse
export const updateNurse = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${id}`, formData);
        return response.data; // usually returns updated nurse
    } catch (error) {
        console.error("Error updating nurse:", error);
        return null;
    }
};

// Add a new nurse
export const addNurse = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, formData);
        return response.data; // usually returns created nurse
    } catch (error) {
        console.error("Error adding nurse:", error);
        throw error;
        return null;
    }
};
