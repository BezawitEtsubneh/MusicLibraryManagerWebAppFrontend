'use client';
import { useEffect, useState } from 'react';

interface Song {
  Songs_id: number;
  Songs_name: string;
  Gener?: string;
}

interface Album {
  Album_id: number;
  Album_title: string;
  Total_tracks: number;
}

interface Artist {
  Artist_id: number;
  Artist_name: string;
  Country?: string;
}

interface DashboardData {
  totals: { songs: number; albums: number; artists: number };
  latest: { songs: Song[]; albums: Album[]; artists: Artist[] };
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("https://musiclibrarymanagerwebappbackend-2.onrender.com/dashboard/", { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setDashboard({
          totals: { songs: 0, albums: 0, artists: 0 },
          latest: { songs: [], albums: [], artists: [] },
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
          <p className="text-2xl font-bold mt-2">{dashboard.totals.songs}</p>
        </div>
        {/* <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Albums</h2>
          <p className="text-2xl font-bold mt-2">{dashboard.totals.albums}</p>
        </div> */}
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold">Total Artists</h2>
          <p className="text-2xl font-bold mt-2">{dashboard.totals.artists}</p>
        </div>
      </section>

      {/* Latest */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Latest</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Songs */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Songs</h3>
            <ul className="space-y-1">
              {dashboard.latest.songs.length ? (
                dashboard.latest.songs.map(song => (
                  <li key={song.Songs_id} className="border-b pb-1">
                    {song.Songs_name} {song.Gener && `(${song.Gener})`}
                  </li>
                ))
              ) : <li className="text-gray-500">No songs yet</li>}
            </ul>
          </div>

          {/* Albums */}
{/*           
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Albums</h3>
            <ul className="space-y-1">
              {dashboard.latest.albums.length ? (
                dashboard.latest.albums.map(album => (
                  <li key={album.Album_id} className="border-b pb-1">
                    {album.Album_title} ({album.Total_tracks} tracks)
                  </li>
                ))
              ) : <li className="text-gray-500">No albums yet</li>}
            </ul>
          </div> */}

          {/* Artists */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Artists</h3>
            <ul className="space-y-1">
              {dashboard.latest.artists.length ? (
                dashboard.latest.artists.map(artist => (
                  <li key={artist.Artist_id} className="border-b pb-1">
                    {artist.Artist_name} {artist.Country && `(${artist.Country})`}
                  </li>
                ))
              ) : <li className="text-gray-500">No artists yet</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
