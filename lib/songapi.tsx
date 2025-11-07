import axios from "axios";

const BASE_URL = "/api/songs"; // Proxied through Next route handler

export const songAPI = {
  // Fetch all songs
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
      if (response.status === 200 && Array.isArray(response.data)) return response.data;
      console.error("Unexpected API response:", response.data);
      return []; // fallback to empty array
    } catch (error) {
      console.error("Error fetching songs:", error);
      return []; // safe fallback
    }
  },

  // Create new song
  create: async (song: { Songs_name: string; Gener: string; audioFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("Songs_name", song.Songs_name);
      formData.append("Gener", song.Gener);
      if (song.audioFile) formData.append("audio", song.audioFile);

      const response = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200) return response.data;
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  },

  // Update song
  update: async (
    Songs_id: number,
    song: { Songs_name: string; Gener: string; audioFile?: File }
  ) => {
    try {
      const formData = new FormData();
      formData.append("Songs_name", song.Songs_name);
      formData.append("Gener", song.Gener);
      if (song.audioFile) formData.append("audio", song.audioFile);

      const response = await axios.put(`${BASE_URL}/${Songs_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200) return response.data;
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  },

  // Delete song
  delete: async (Songs_id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${Songs_id}`, { withCredentials: true });
      if (response.status === 200) return response.data;
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  },

  // Search songs
  search: async (query: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { query },
        withCredentials: true,
      });
      if (response.status === 200 && Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.error("Error searching songs:", error);
      return [];
    }
  },
};
