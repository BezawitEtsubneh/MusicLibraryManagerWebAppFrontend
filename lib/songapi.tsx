import axios from "axios";

const BASE_URL = "/api/songs";

export const songAPI = {
  getAll: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  },

  create: async (song: { Songs_name: string; Gener: string; youtube_url?: string }) => {
    try {
      const formData = new FormData();
      formData.append("Songs_name", song.Songs_name);
      formData.append("Gener", song.Gener);
      if (song.youtube_url) formData.append("youtube_url", song.youtube_url);

      const res = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  },

  update: async (Songs_id: number, song: { Songs_name: string; Gener: string; youtube_url?: string }) => {
    try {
      const formData = new FormData();
      formData.append("Songs_name", song.Songs_name);
      formData.append("Gener", song.Gener);
      if (song.youtube_url) formData.append("youtube_url", song.youtube_url);

      const res = await axios.put(`${BASE_URL}/${Songs_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  },

  delete: async (Songs_id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${Songs_id}`, { withCredentials: true });
      return res.data;
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  },

  search: async (query: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/search`, { params: { query }, withCredentials: true });
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Error searching songs:", error);
      return [];
    }
  },
};
