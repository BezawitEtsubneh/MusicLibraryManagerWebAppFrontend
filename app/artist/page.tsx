'use client'
import React, { useState, useEffect } from "react";
import ArtistCard from "@/components/forms/ArtistFormCard";
import { artistAPI } from "@/lib/artistapi";

interface Artist {
  Artist_id: number;
  Artist_name: string;
  Country: string;
  audio_url?: string;
}

interface ArtistProps {
  token?: string;
}

export default function Artist({ token }: ArtistProps) {
  const [showCard, setShowCard] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await artistAPI.getAll();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      alert("Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDeleteArtist = async (Artist_id: number) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;
    try {
      await artistAPI.delete(Artist_id);
      fetchArtists();
      alert("Artist deleted successfully");
    } catch (error) {
      console.error("Error deleting artist:", error);
      alert("Failed to delete artist");
    }
  };

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setShowCard(true);
  };

  const handleAddClick = () => {
    setEditingArtist(null);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setEditingArtist(null);
  };

  const handleArtistSuccess = () => {
    fetchArtists();
    handleCloseCard();
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* ---------------------- FORM MODAL ---------------------- */}
      {showCard ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 animate-fade-in p-1">
          <div className="bg-[#6F4E37] px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-xl font-bold text-white tracking-wide">
              {editingArtist ? "Edit Artist" : "Add Artist"}
            </h2>
            <button 
              onClick={handleCloseCard} 
              className="text-white text-2xl hover:scale-110 transition"
            >
              ×
            </button>
          </div>

          <ArtistCard
            onClose={handleCloseCard}
            editingArtist={editingArtist}
            onSuccess={handleArtistSuccess}
          />
        </div>
      ) : (
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

          {/* ---------------------- ARTIST CARDS ---------------------- */}
          <div className="mt-10">
            {loading ? (
              <p className="text-center text-gray-600">Loading artists...</p>
            ) : artists.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-lg">
                No artists found. Click <span className="font-semibold">+</span> to add one.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <div
                    key={artist.Artist_id}
                    className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border border-gray-200"
                  >
                    {/* Artist Name */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {artist.Artist_name}
                    </h3>

                    {/* Audio */}
                    {artist.audio_url ? (
                      <audio controls className="w-full mt-4 rounded-lg">
                        <source src={`/api${artist.audio_url}`} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <p className="text-gray-500 text-sm mt-3">No song available</p>
                    )}

                    {/* Buttons */}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleEditArtist(artist)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteArtist(artist.Artist_id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
              onClick={fetchArtists}
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
