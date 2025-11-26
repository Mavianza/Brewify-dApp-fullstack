"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, ShoppingBag, Truck, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import UserProfile from "@/build/contracts/UserProfile.json"
import useWallet from "@/hooks/useWallet"

export default function RolesPage() {
  const router = useRouter()
  const { address, signer, connect, isConnecting } = useWallet()

  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const progress = step === 1 ? 50 : 100

  // AUTO CONNECT WALLET
  useEffect(() => {
    if (!address) connect()
  }, [address, connect])

  const handleSelectRole = (role: number) => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // connect dulu kalau signer belum ada
      if (!signer) await connect()

      if (!signer) return alert("Gagal connect wallet, coba lagi bro")

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERPROFILE_ADDRESS!,
        UserProfile.abi,
        signer
      )

      const tx = await contract.setUserProfile(selectedRole, username)
      await tx.wait()

      router.push("/") // balik ke Home
    } catch (err) {
      console.error(err)
      alert("Gagal simpan ke blockchain")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <motion.div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Pilih Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-semibold">Halo, selamat datang di Brewify!</h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectRole(1)}
                  className="border border-gray-300 bg-white rounded-xl p-5 text-left hover:border-gray-400 transition"
                >
                  <User className="w-6 h-6 mb-3" />
                  <h3 className="font-semibold">Buyer</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Beli bean berkualitas dari petani langsung.
                  </p>
                </button>

                <button
                  onClick={() => handleSelectRole(2)}
                  className="border border-gray-300 bg-white rounded-xl p-5 text-left hover:border-gray-400 transition"
                >
                  <ShoppingBag className="w-6 h-6 mb-3" />
                  <h3 className="font-semibold">Farmer</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload batch kopi & minting NFT.
                  </p>
                </button>

                <button
                  onClick={() => handleSelectRole(3)}
                  className="border border-gray-300 bg-white rounded-xl p-5 text-left hover:border-gray-400 transition"
                >
                  <Truck className="w-6 h-6 mb-3" />
                  <h3 className="font-semibold">Logistics</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Handle pengiriman & tracking.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Masukkan Username */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="border border-gray-300 rounded-full px-2 py-1 cursor-pointer flex items-center gap-2 text-gray-600 hover:text-black transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <h1 className="text-2xl font-semibold">Yuk kenalan dulu!</h1>

              <div className="space-y-4">
                <input
                  placeholder="Masukkan Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-full p-3 outline-none focus:border-blue-500 transition"
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-medium p-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Submit"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
