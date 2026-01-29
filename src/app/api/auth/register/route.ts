import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { setUserSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password, displayName } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Kullanıcı adı en az 3 karakter olmalı' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Kullanıcı adı kontrolü
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
      )
    }

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, 10)

    // Kullanıcıyı oluştur
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: passwordHash,
        display_name: displayName || username
      })
      .select()
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
        { status: 500 }
      )
    }

    // Session oluştur
    await setUserSession({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      totalXp: user.total_xp || 0,
      level: user.level || 1,
      streakDays: user.streak_days || 0
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        totalXp: user.total_xp || 0,
        level: user.level || 1,
        streakDays: user.streak_days || 0
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
