'use client';
import React, { useState, useEffect, useCallback } from "react";
import { songAPI } from "@/lib/songapi";
import SongCard from "@/components/forms/SongsFormCard";
import Searchbar from "@/components/ui/Searchbar";

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
      console.log("Fetched songs:", data);
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
    <div className="p-4">
      {showCard ? (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-amber-500 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {editingSong ? "Edit Song" : "New Song"}
            </h2>
            <button onClick={handleCloseCard} className="ml-auto text-white text-2xl hover:text-amber-200">
              ×
            </button>
          </div>

          <SongCard
            onClose={handleCloseCard}
            editingSong={editingSong}
            onSuccess={handleSongSuccess}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mt-4 mb-4">
            <Searchbar />
            <button
              onClick={handleAddClick}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Song
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading songs...</p>
          ) : songs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No songs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {songs.map((song) => (
                <div key={song.Songs_id} className="border p-4 rounded shadow bg-white">
                  <h3 className="text-lg font-semibold">{song.Songs_name}</h3>
                  <p className="text-gray-600">Genre: {song.Gener}</p>

                  {song.youtube_url && (
                    <p className="mt-2 text-blue-600 underline">
                      <a
                        href={song.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch on YouTube
                      </a>
                    </p>
                  )}

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditSong(song)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSong(song.Songs_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
