'use client'
import { useAuth } from "../context/authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
// import Album from '../album/page';
import Artist from "../artist/page";
import Song from '../songs/page';
import Dashboard from '../dashboard/page';
import ChatBox from "../ChatBox/page";

export const buttons = {
  artist: '/images/artist.png',
  // album: '/images/album.png',
  song: '/images/song.png',
  chat: '/images/chat.jpg'
};

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<'dashboard' | 'artist' | 'album' | 'song' | 'chat'>('dashboard');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  const renderComponent = () => {
    switch (activeView) {
      case 'artist': return <Artist />;
      // case 'album': return <Album />;
      case 'song': return <Song />;
      case 'chat': return <ChatBox />;
      default: return <Dashboard />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7F0] to-[#FFF0E5] relative">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto relative flex items-center py-4 px-6">
          {/* Logo on the left */}
          <div className="absolute left-6">
            <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          </div>

          {/* Title centered */}
          <div className="flex-1 text-center">
            <Header />
          </div>

          {/* Logout button on the right */}
          <div className="absolute right-6">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Buttons */}
      {activeView === 'dashboard' && (
        <div className="container mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {Object.entries(buttons).filter(([key]) => key !== 'chat').map(([key, src]) => (
            <div
              key={key}
              onClick={() => setActiveView(key as any)}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Image src={src} width={50} height={50} alt={key} />
              <p className="mt-4 text-lg font-semibold text-[#6F4E37]">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Back to Dashboard */}
      {activeView !== 'dashboard' && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setActiveView('dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Active Component */}
      <div className="mt-10 px-6 container mx-auto">{renderComponent()}</div>

      {/* Floating Chat Bot */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setActiveView('chat')}
          className="bg-[#6F4E37] hover:bg-[#563A2E] text-white p-4 rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-110"
        >
          <Image src={buttons.chat} width={30} height={30} alt="Chat" />
        </button>
      </div>
    </div>
  );
}
