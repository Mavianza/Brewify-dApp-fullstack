'use client'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

export default function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasLoggedOut, setHasLoggedOut] = useState(false)

  // ----- CONNECT WALLET -----
  const connect = useCallback(async () => {
    if (!window.ethereum) return alert('Install MetaMask dulu bro!')

    try {
      setIsConnecting(true)
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length === 0) throw new Error('No accounts found')

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signerInstance = await provider.getSigner()

      setAddress(accounts[0])
      setSigner(signerInstance)
      setHasLoggedOut(false)
    } catch (err) {
      console.error('Gagal connect wallet:', err)
      alert('Gagal connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // ----- DISCONNECT WALLET -----
  const disconnect = () => {
    setAddress(null)
    setSigner(null)
    setIsConnecting(false)
  }


  // ----- HANDLE ACCOUNT / NETWORK SWITCH -----
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
        // optional: bisa reset signer biar fresh
        const provider = new ethers.BrowserProvider(window.ethereum)
        provider.getSigner().then(setSigner)
        setHasLoggedOut(false)
      }
    }

    const handleChainChanged = () => {
      disconnect()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnect])

  return {
    connect,
    disconnect,
    address,
    signer,
    isConnecting,
    hasLoggedOut,
  }
}
