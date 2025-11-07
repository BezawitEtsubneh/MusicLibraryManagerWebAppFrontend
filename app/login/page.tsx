'use client'
import { useState, ChangeEvent, FormEvent } from "react"
import { useAuth } from "../context/authcontext"
import { useRouter } from "next/navigation"

interface LoginProps {
  onLogin: (token: string) => Promise<void>;
}
export default function Login({ onLogin }: LoginProps) {
  const { loginUser } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await loginUser(username, password)
      router.push("/home")
    } catch {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F0] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border-t-8 border-[#6F4E37]">
        <h2 className="text-2xl font-bold text-[#6F4E37] mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" required />
          <input type="password" placeholder="Password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" required />
          <button type="submit" className="bg-[#6F4E37] text-white py-2 rounded-md hover:bg-[#563A2E] transition font-semibold">Login</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <a href="/signup" className="text-[#6F4E37] font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}
