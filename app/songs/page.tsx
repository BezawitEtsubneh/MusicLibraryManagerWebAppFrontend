'use client';
import React, { useState, useEffect, useCallback } from "react";
import { songAPI } from "@/lib/songapi";
import SongCard from "@/components/forms/SongsFormCard";

interface Song {
  Songs_id: number;
  Songs_name: string;
  Gener: string;
  youtube_url?: string;
}

export default function Song() {
  const [showCard, setShowCard] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await songAPI.getAll();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      alert("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleAddClick = () => {
    setEditingSong(null);
    setShowCard(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowCard(true);
  };

  const handleDeleteSong = async (Songs_id: number) => {
    if (!confirm("Are you sure you want to delete this song?")) return;
    try {
      await songAPI.delete(Songs_id);
      alert("Song deleted successfully");
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
    }
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setEditingSong(null);
  };

  const handleSongSuccess = () => {
    fetchSongs();
    handleCloseCard();
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* ---------------------- FORM MODAL ---------------------- */}
      {showCard && (
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#6F4E37] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {editingSong ? "Edit Song" : "New Song"}
            </h2>
            <button
              onClick={handleCloseCard}
              className="ml-auto text-white text-2xl hover:text-amber-200 transition"
            >
              ×
            </button>
          </div>

          <SongCard
            onClose={handleCloseCard}
            editingSong={editingSong}
            onSuccess={handleSongSuccess}
          />
        </div>
      )}

      {!showCard && (
        <>
          {/* ---------------------- ADD BUTTON ---------------------- */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddClick}
              className="w-12 h-12 bg-[#6F4E37] hover:bg-[#5a3f2d] text-white rounded-full flex items-center justify-center text-2xl shadow-md transition-transform hover:scale-110"
            >
              +
            </button>
          </div>

          {/* ---------------------- SONG CARDS ---------------------- */}
          <div className="mt-10">
            {loading ? (
              <p className="text-center text-gray-600">Loading songs...</p>
            ) : songs.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-lg">
                No songs found. Click <span className="font-semibold">+</span> to add one.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                  <div
                    key={song.Songs_id}
                    className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border border-gray-200"
                  >
                    {/* Song Name */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {song.Songs_name}
                    </h3>

                    {/* Genre */}
                    <p className="text-gray-600 mb-3">Genre: {song.Gener}</p>

                    {/* YouTube URL */}
                    {song.youtube_url && (
                      <a
                        href={song.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm mb-4 inline-block hover:text-blue-600"
                      >
                        Watch on YouTube
                      </a>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleEditSong(song)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.Songs_id)}
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

          {/* ---------------------- FOOTER ---------------------- */}
          <div className="flex justify-end mt-6">
            <button
              onClick={fetchSongs}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Refresh List
            </button>
          </div>
        </>
      )}
    </div>
  );
}
