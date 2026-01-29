'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Trophy, 
  Target, 
  Flame,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react'

// Mock data - Supabase'den gelecek
const subjects = [
  { 
    id: 1, 
    name: 'AYT Biyoloji', 
    icon: '🧬', 
    topicCount: 12, 
    completedCount: 8,
    streak: 5,
    xp: 1250
  },
  { 
    id: 2, 
    name: 'AYT Kimya', 
    icon: '⚗️', 
    topicCount: 10, 
    completedCount: 3,
    streak: 2,
    xp: 450
  },
  { 
    id: 3, 
    name: 'Edebiyat', 
    icon: '📚', 
    topicCount: 15, 
    completedCount: 12,
    streak: 8,
    xp: 2100
  },
  { 
    id: 4, 
    name: 'Tarih', 
    icon: '🏛️', 
    topicCount: 8, 
    completedCount: 0,
    streak: 0,
    xp: 0
  },
]

const stats = {
  totalXP: 3800,
  level: 12,
  streak: 8,
  todayGoal: 3,
  todayCompleted: 1
}

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with Stats */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learn Game
                </h1>
                <p className="text-sm text-gray-600">Level {stats.level} • {stats.totalXP} XP</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Streak */}
              <motion.div 
                className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-700">{stats.streak} gün</span>
              </motion.div>

              {/* Daily Goal */}
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {stats.todayCompleted}/{stats.todayGoal} günlük hedef
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Toplam XP</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalXP}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Aktif Seri</p>
                <p className="text-3xl font-bold text-orange-600">{stats.streak} gün</p>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Seviye</p>
                <p className="text-3xl font-bold text-purple-600">{stats.level}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Derslerim</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer group"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{subject.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subject.topicCount} konu • {subject.completedCount} tamamlandı
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">İlerleme</span>
                    <span className="font-semibold text-gray-800">
                      {Math.round((subject.completedCount / subject.topicCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(subject.completedCount / subject.topicCount) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-700">{subject.xp} XP</span>
                  </div>
                  {subject.streak > 0 && (
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-700">{subject.streak} gün</span>
                    </div>
                  )}
                  {subject.completedCount === subject.topicCount && (
                    <div className="flex items-center gap-1 ml-auto">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-semibold">Tamamlandı!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Action Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-8 h-8" />
        </motion.button>
      </main>
    </div>
  )
}
