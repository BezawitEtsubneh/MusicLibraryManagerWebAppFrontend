import axios from "axios";

const BASE_URL = "/api/albums"; // Proxied through Next route handler to https://back-3-yciv.onrender.com

export const albumAPI = {
  // Fetch all albums
  getAll: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
      if (res.status === 200 && Array.isArray(res.data)) return res.data;
      console.error("Unexpected API response:", res.data);
      return [];
    } catch (error) {
      console.error("Error fetching albums:", error);
      return [];
    }
  },

  // Create new album
  create: async (album: { Album_title: string; Total_tracks: number; audioFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("Album_title", album.Album_title);
      formData.append("Total_tracks", album.Total_tracks.toString());

      if (album.audioFile) formData.append("audio", album.audioFile);

      const res = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error creating album:", error);
      throw error;
    }
  },

  // Update album
  update: async (
    Album_id: number,
    album: { Album_title: string; Total_tracks: number; audioFile?: File }
  ) => {
    try {
      const formData = new FormData();
      formData.append("Album_title", album.Album_title);
      formData.append("Total_tracks", album.Total_tracks.toString());

      if (album.audioFile) formData.append("audio", album.audioFile);

      const res = await axios.put(`${BASE_URL}/${Album_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error updating album:", error);
      throw error;
    }
  },

  // Delete album
  delete: async (Album_id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${Album_id}`, { withCredentials: true });
      return res.data;
    } catch (error) {
      console.error("Error deleting album:", error);
      throw error;
    }
  },

  // Search albums by title
  search: async (query: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/search`, {
        params: { query },
        withCredentials: true,
      });
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (error) {
      console.error("Error searching albums:", error);
      return [];
    }
  },
};
