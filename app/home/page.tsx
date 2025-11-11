'use client'
import { useAuth } from "../context/authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Album from '../album/page';
import Artist from "../artist/page";
import Song from '../songs/page';
import Dashboard from '../dashboard/page';
import ChatBox from "../ChatBox/page";

export const buttons = {
  artist: '/images/artist.png',
  album: '/images/album.png',
  song: '/images/song.png',
  chat: '/images/chat.jpg' // new chat icon (you can add this image)
};

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<'dashboard' | 'artist' | 'album' | 'songs' | 'chat'>('dashboard');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  const renderComponent = () => {
    switch (activeView) {
      case 'artist': return <Artist />;
      case 'album': return <Album />;
      case 'songs': return <Song />;
      case 'chat': return <ChatBox />;
      default: return <Dashboard />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF7F0] relative">

      {/* Header and Logout */}
      <div className="relative py-4">
        <div className="text-center">
          <Header />
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Buttons Section */}
      {activeView === 'dashboard' && (
        <div className='flex mt-10 justify-center gap-6 flex-wrap'>
          {Object.entries(buttons).map(([key, src]) => (
            <button
              key={key}
              className='w-32 h-32 bg-amber-200 rounded-lg shadow-md flex flex-col items-center justify-center text-lg font-medium cursor-pointer hover:bg-amber-300 transition'
              onClick={() => setActiveView(key as any)}
            >
              <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              <Image src={src} width={40} height={40} alt={key} />
            </button>
          ))}
        </div>
      )}

      {/* Back to Dashboard Button */}
      {activeView !== 'dashboard' && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Active Component */}
      <div className="mt-10 px-4">{renderComponent()}</div>
    </div>
  );
}
