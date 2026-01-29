'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    rememberMe: false
  })

  // Zaten giriş yapmış mı kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          // Zaten giriş yapmış, ana sayfaya yönlendir
          router.push('/')
        }
      } catch (err) {
        // Giriş yapmamış, devam et
      } finally {
        setChecking(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Bir hata oluştu')
        return
      }

      // Başarılı, ana sayfaya yönlendir
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  // Kontrol ederken loading göster
  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Learn Game
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="kullaniciadi"
                required
                minLength={3}
              />
            </div>

            {/* Display Name (sadece kayıt için) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  İsim (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Adın Soyadın"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Remember Me (sadece login için) */}
            {isLogin && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 bg-muted border-border rounded text-primary focus:ring-primary focus:ring-2"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground">
                  Beni hatırla (30 gün)
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {isLogin ? (
                <>
                  Hesabın yok mu? <span className="text-primary font-medium">Kayıt ol</span>
                </>
              ) : (
                <>
                  Zaten hesabın var mı? <span className="text-primary font-medium">Giriş yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 bg-muted/50 border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">
            {isLogin ? 'Test hesapları (veritabanı kuruluysa):' : 'İlk kullanıcıyı oluştur:'}
          </p>
          {isLogin ? (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• ahmet / test123</p>
              <p>• ayse / test123</p>
              <p>• mehmet / test123</p>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              <p>Veritabanı henüz kurulmadıysa, ilk kullanıcıyı sen oluştur!</p>
              <p className="mt-2 text-neutral-500">
                Veya <code className="bg-neutral-800 px-1 py-0.5 rounded">supabase-schema.sql</code> dosyasını Supabase'de çalıştır.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
