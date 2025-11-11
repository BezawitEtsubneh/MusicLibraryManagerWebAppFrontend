import axios from "axios";

const BASE_URL = "/api/albums"; // proxied via Next.js route handler

export const albumAPI = {
  // Fetch all albums
  getAll: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
      if (Array.isArray(res.data)) return res.data;
      console.error("Unexpected response:", res.data);
      return [];
    } catch (err) {
      console.error("Error fetching albums:", err);
      return [];
    }
  },

  // Create new album
  create: async (album: {
    Album_title: string;
    Total_tracks: number;
    youtube_url?: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("Album_title", album.Album_title);
      formData.append("Total_tracks", album.Total_tracks.toString());
      if (album.youtube_url) formData.append("youtube_url", album.youtube_url);

      const res = await axios.post(`${BASE_URL}/create`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Error creating album:", err);
      throw err;
    }
  },

  // Update album
  update: async (
    Album_id: number,
    album: {
      Album_title: string;
      Total_tracks: number;
      youtube_url?: string;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("Album_title", album.Album_title);
      formData.append("Total_tracks", album.Total_tracks.toString());
      if (album.youtube_url) formData.append("youtube_url", album.youtube_url);

      const res = await axios.put(`${BASE_URL}/${Album_id}`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Error updating album:", err);
      throw err;
    }
  },

  // Delete album
  delete: async (Album_id: number) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${Album_id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Error deleting album:", err);
      throw err;
    }
  },
};
