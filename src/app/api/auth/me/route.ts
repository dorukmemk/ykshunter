import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı bilgisi alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
