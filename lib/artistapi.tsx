import axios from "axios";

const BASE_URL = "/api/artists"; // Proxied through Next route handler to https://back-3-yciv.onrender.com

export const artistAPI = {
  // Get all artists
  getAll: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
      if (res.status === 200 && Array.isArray(res.data)) return res.data;
      console.error("Unexpected API response:", res.data);
      return [];
    } catch (error) {
      console.error("Error fetching artists:", error);
      return [];
    }
  },

  // Create artist (FormData)
  create: async (formData: FormData) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error creating artist:", error);
      throw error;
    }
  },

  // Update artist (FormData)
  update: async (Artist_id: number, formData: FormData) => {
    try {
      const res = await axios.put(`${BASE_URL}/${Artist_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error updating artist:", error);
      throw error;
    }
  },

  // Delete artist
  delete: async (Artist_id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${Artist_id}`, { withCredentials: true });
      return res.data;
    } catch (error) {
      console.error("Error deleting artist:", error);
      throw error;
    }
  },

  // Search artists
  search: async (query: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/search`, {
        params: { query },
        withCredentials: true,
      });
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (error) {
      console.error("Error searching artists:", error);
      return [];
    }
  },
};
