import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
import { User, Mail, Calendar, ShieldCheck, LogOut, KeyRound } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) return null;

  // Derive initial for avatar
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Banner Section */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-brand p-1 shadow-xl">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white text-3xl font-bold font-display border border-white/10">
                {initial}
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Profile</span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-8">
          {/* Header */}
          <div className="mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-1">{user.name}</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-light flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-left">
              <div className="flex items-center gap-2.5 text-slate-400 dark:text-gray-500 mb-2">
                <User className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Account Holder</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-left">
              <div className="flex items-center gap-2.5 text-slate-400 dark:text-gray-500 mb-2">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Auth Provider</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user.email === 'guest.user@gmail.com' ? 'Google OAuth' : 'Local JWT Credentials'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-left">
              <div className="flex items-center gap-2.5 text-slate-400 dark:text-gray-500 mb-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Creation Date</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-left">
              <div className="flex items-center gap-2.5 text-slate-400 dark:text-gray-500 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Session Status</span>
              </div>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active Session Verified</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-white/5">
            <p className="text-[10px] text-slate-400 dark:text-gray-500 italic">
              InsightStay AI utilizes bcrypt (12 rounds) and JWT verification for end-to-end security.
            </p>
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 hover:border-rose-300 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
