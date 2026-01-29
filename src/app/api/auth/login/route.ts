import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { setUserSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password, rememberMe } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Kullanıcıyı bul
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      )
    }

    // Şifreyi kontrol et
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      )
    }

    // Last login güncelle
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    // Session oluştur (beni hatırla seçeneği ile)
    await setUserSession({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      totalXp: user.total_xp,
      level: user.level,
      streakDays: user.streak_days
    }, rememberMe || false)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        totalXp: user.total_xp,
        level: user.level,
        streakDays: user.streak_days
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
