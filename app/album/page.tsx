'use client'

import React, { useState, useEffect, useCallback } from "react";
import { albumAPI } from "@/lib/albumapi";

interface Album {
  Album_id: number;
  Album_title: string;
  Total_tracks: number;
  youtube_url: string; // single URL now
}

interface AlbumProps {
  token?: string;
}

// Helper function to validate YouTube URL
const isValidUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return pattern.test(url);
};

export default function Album({ token }: AlbumProps) {
  const [showCard, setShowCard] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [title, setTitle] = useState("");
  const [tracks, setTracks] = useState(1);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const data = await albumAPI.getAll();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
      alert("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleDeleteAlbum = async (Album_id: number) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await albumAPI.delete(Album_id);
      alert("Album deleted successfully");
      fetchAlbums();
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album");
    }
  };

  const handleAddClick = () => {
    setEditingAlbum(null);
    setTitle("");
    setTracks(1);
    setYoutubeUrl("");
    setShowCard(true);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setTitle(album.Album_title);
    setTracks(album.Total_tracks);
    setYoutubeUrl(album.youtube_url || "");
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setEditingAlbum(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !tracks || !youtubeUrl.trim()) {
      alert("Please fill all fields and provide a YouTube URL.");
      return;
    }

    if (!isValidUrl(youtubeUrl)) {
      alert("Please provide a valid YouTube URL.");
      return;
    }

    const payload = {
      Album_title: title,
      Total_tracks: tracks,
      youtube_url: youtubeUrl,
    };

    try {
      setUploading(true);
      if (editingAlbum) {
        await albumAPI.update(editingAlbum.Album_id, payload);
        alert("Album updated successfully");
      } else {
        await albumAPI.create(payload);
        alert("Album created successfully");
      }

      fetchAlbums();
      handleCloseCard();
    } catch (err) {
      console.error("Error payload:", payload);
      console.error(err);
      alert("Failed to create or update album");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showCard ? (
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="bg-[#6F4E37] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {editingAlbum ? "Edit Album" : "New Album"}
            </h2>
            <button
              onClick={handleCloseCard}
              className="ml-auto text-white text-2xl hover:text-amber-200 transition-colors"
            >
              ×
            </button>
          </div>
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1">Album Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Total Tracks</label>
              <input
                type="number"
                value={tracks}
                onChange={(e) => setTracks(Number(e.target.value))}
                min={1}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">YouTube URL</label>
              <input
                type="url"
                value={youtubeUrl}
                placeholder="https://youtu.be/..."
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {uploading ? "Saving..." : editingAlbum ? "Update Album" : "Create Album"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Albums</h1>
            <button
              onClick={handleAddClick}
              className="bg-[#6F4E37] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5a3e2e] transition-colors"
            >
              + Add Album
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading albums...</p>
          ) : albums.length === 0 ? (
            <p className="text-center text-gray-400">No albums found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div
                  key={album.Album_id}
                  className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-shadow transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {album.Album_title}
                  </h3>
                  <p className="text-gray-600 mb-3">Tracks: {album.Total_tracks}</p>
                  {album.youtube_url && (
                    <a
                      href={album.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm hover:text-blue-600"
                    >
                      Watch
                    </a>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.Album_id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
