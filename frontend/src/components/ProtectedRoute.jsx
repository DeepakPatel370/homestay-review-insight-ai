import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from './ui'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#070a13]">
        <div className="text-center">
          <Loader className="w-10 h-10 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-gray-400 text-sm">Verifying session credentials...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
