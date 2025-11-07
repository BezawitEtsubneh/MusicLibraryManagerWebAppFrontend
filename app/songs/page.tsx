'use client'
import React, { useState, useEffect } from "react"
import SongCard from "@/components/forms/SongsFormCard"
import Searchbar from "@/components/ui/Searchbar"
import { songAPI } from '@/lib/songapi'
import { buttons } from "../home/page"

interface Song {
  Songs_id: number
  Songs_name: string
  Gener: string
  audio_url?: string
}

interface SongProps {
  token?: string
}

const image = '/images/plus.png'
const image2 = './images/update.png'
const image3 = './images/bin.png'

export default function Song({ token }: SongProps) {
  const [showCard, setShowCard] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)

  // Fetch songs from API
  const fetchSongs = async () => {
    try {
      setLoading(true)
      const data = await songAPI.getAll()

      // ✅ Validate data to prevent runtime errors
      if (!data || !Array.isArray(data)) {
        console.error("Invalid songs data:", data)
        throw new Error("Unexpected response format")
      }

      setSongs(data)
    } catch (error) {
      console.error("Error fetching songs:", error)
      alert("Failed to fetch songs. Please try again later.")
      setSongs([]) // fallback to prevent undefined reference
    } finally {
      setLoading(false)
    }
  }

  // Load songs on component mount
  useEffect(() => {
    fetchSongs()
  }, [])

  // Delete a song
  const handleDeleteSong = async (Songs_id: number) => {
    if (!confirm("Are you sure you want to delete this song?")) return

    try {
      await songAPI.delete(Songs_id)
      alert("Song deleted successfully")
      fetchSongs() // Refresh list
    } catch (error) {
      console.error("Error deleting song:", error)
      alert("Failed to delete song. Please try again.")
    }
  }

  // Edit song
  const handleEditSong = (song: Song) => {
    setEditingSong(song)
    setShowCard(true)
  }

  // Add new song
  const handleAddClick = () => {
    setEditingSong(null)
    setShowCard(true)
  }

  // Close modal
  const handleCloseCard = () => {
    setShowCard(false)
    setEditingSong(null)
  }

  // On successful create/update
  const handleSongSuccess = () => {
    fetchSongs()
    handleCloseCard()
  }

  return (
    <div>
      {showCard ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border">
          <div className="bg-amber-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingSong ? "Edit Song" : "Add Song"}
              </h2>
              <button
                onClick={handleCloseCard}
                className="text-white text-xl hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>

          <SongCard
            onClose={handleCloseCard}
            editingSong={editingSong}
            onSuccess={handleSongSuccess}
          />
        </div>
      ) : (
        <div>
          {/* Header: Search and Add Button */}
          <div className="flex justify-between items-center mt-10 ml-4">
            <Searchbar />
            <img
              onClick={handleAddClick}
              className="w-9 h-9 cursor-pointer hover:scale-110 transition-transform"
              src={image}
              alt="Add"
              title="Add Song"
            />
          </div>

          {/* Songs List */}
          <div className="mt-6 p-4">
            {loading ? (
              <p className="text-center text-gray-600">Loading songs...</p>
            ) : songs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No songs found. Click + to add a song.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {songs.map((song) => (
                  <div
                    key={song.Songs_id}
                    className="border p-4 rounded shadow bg-white hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {song.Songs_name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Genre: <span className="font-medium">{song.Gener}</span>
                    </p>

                    {song.audio_url && (
                      <div className="mb-3">
                        <audio controls className="w-full">
                          <source src={`/api${song.audio_url}`} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEditSong(song)}
                        className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.Songs_id)}
                        className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Icons */}
          <div className="flex justify-end gap-10 mt-4">
            <img
              className="w-9 h-9 cursor-pointer hover:rotate-90 transition-transform"
              src={image2}
              alt="Update"
              title="Refresh Songs"
              onClick={fetchSongs}
            />
            <img
              className="w-9 h-9 cursor-pointer opacity-70"
              src={image3}
              alt="Delete"
              title="Bulk Delete (not implemented)"
            />
          </div>
        </div>
      )}
    </div>
  )
}
