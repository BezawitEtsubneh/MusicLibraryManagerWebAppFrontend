'use client';
import { useEffect, useState } from 'react';

interface Song {
  id: number;
  name: string;
  genre?: string;
  audio_url?: string;
}

interface Album {
  id: number;
  title: string;
  total_tracks: number;
  audio_url?: string;
}

interface Artist {
  id: number;
  name: string;
  country?: string;
  audio_url?: string;
}

interface DashboardData {
  totals: { songs: number; albums: number; artists: number };
  recently_added: { songs: Song[]; albums: Album[]; artists: Artist[] };
  top_played: { songs: Song[]; albums: Album[]; artists: Artist[] };
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        // Set default empty dashboard
        setDashboard({
          totals: { songs: 0, albums: 0, artists: 0 },
          recently_added: { songs: [], albums: [], artists: [] },
          top_played: { songs: [], albums: [], artists: [] },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!dashboard || !dashboard.totals) return <div className="p-4 text-center">No data available</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Music Dashboard</h1>

      {/* Totals */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Songs</h2>
          <p className="text-2xl font-bold mt-2">{dashboard.totals?.songs || 0}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Albums</h2>
          <p className="text-2xl font-bold mt-2">{dashboard.totals?.albums || 0}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Artists</h2>
          <p className="text-2xl font-bold mt-2">{dashboard.totals?.artists || 0}</p>
        </div>
      </section>

      {/* Recently Added */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Songs */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Songs</h3>
            <ul className="space-y-1">
              {dashboard.recently_added?.songs?.length > 0 ? (
                dashboard.recently_added.songs.map((song) => (
                  <li key={song.id} className="border-b pb-1">
                    {song.name} {song.genre && `(${song.genre})`}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No songs yet</li>
              )}
            </ul>
          </div>

          {/* Albums */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Albums</h3>
            <ul className="space-y-1">
              {dashboard.recently_added?.albums?.length > 0 ? (
                dashboard.recently_added.albums.map((album) => (
                  <li key={album.id} className="border-b pb-1">
                    {album.title} ({album.total_tracks} tracks)
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No albums yet</li>
              )}
            </ul>
          </div>

          {/* Artists */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Artists</h3>
            <ul className="space-y-1">
              {dashboard.recently_added?.artists?.length > 0 ? (
                dashboard.recently_added.artists.map((artist) => (
                  <li key={artist.id} className="border-b pb-1">
                    {artist.name} {artist.country && `(${artist.country})`}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No artists yet</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Top Played */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Played</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Songs */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Songs</h3>
            <ul className="space-y-1">
              {dashboard.top_played?.songs?.length > 0 ? (
                dashboard.top_played.songs.map((song) => (
                  <li key={song.id} className="border-b pb-1">
                    {song.name} {song.genre && `(${song.genre})`}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No songs yet</li>
              )}
            </ul>
          </div>

          {/* Albums */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Albums</h3>
            <ul className="space-y-1">
              {dashboard.top_played?.albums?.length > 0 ? (
                dashboard.top_played.albums.map((album) => (
                  <li key={album.id} className="border-b pb-1">
                    {album.title} ({album.total_tracks} tracks)
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No albums yet</li>
              )}
            </ul>
          </div>

          {/* Artists */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Artists</h3>
            <ul className="space-y-1">
              {dashboard.top_played?.artists?.length > 0 ? (
                dashboard.top_played.artists.map((artist) => (
                  <li key={artist.id} className="border-b pb-1">
                    {artist.name} {artist.country && `(${artist.country})`}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No artists yet</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
