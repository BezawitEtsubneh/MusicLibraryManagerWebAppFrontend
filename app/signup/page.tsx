'use client'
import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface SignupProps {
  onSuccess?: () => Promise<void>; // Add this
}
export default function Signup({ onSuccess }: SignupProps) {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" })
  const [message, setMessage] = useState("")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await axios.post("/auth/signup", new URLSearchParams(form), {
  withCredentials: true,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
})

      setMessage("User registered successfully! Redirecting to login...")
      setTimeout(() => router.push("/login"), 1500)
    } catch (err: any) {
      setMessage(err.response?.data?.detail || err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F0] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border-t-8 border-[#6F4E37]">
        <h2 className="text-2xl font-bold text-[#6F4E37] mb-6 text-center">Sign Up</h2>
        {message && <p className="text-center mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" required />
          <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]" required />
          <button type="submit" className="bg-[#6F4E37] text-white py-2 rounded-md hover:bg-[#563A2E] transition font-semibold">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-[#6F4E37] font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}
