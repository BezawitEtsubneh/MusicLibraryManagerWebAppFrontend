'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authcontext" // your auth context

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { loginUser } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await loginUser(username, password)
      if (onSuccess) await onSuccess()
      else router.push("/home")
    } catch (err: any) {
      setError(err?.message || "Invalid username or password. Please try again.")
    }
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border-t-8 border-[#6F4E37]">
      <h2 className="text-2xl font-bold text-[#6F4E37] mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          required
        />
        <button
          type="submit"
          className="bg-[#6F4E37] text-white py-2 rounded-md hover:bg-[#563A2E] transition font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  )
}
