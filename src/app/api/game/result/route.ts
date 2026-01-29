import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { topicId, mode, isCorrect, mistakes, timeSpent, score, xpEarned } = await request.json()

    if (!topicId || !mode) {
      return NextResponse.json(
        { error: 'Eksik parametreler' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Oyun sonucunu kaydet (trigger otomatik olarak istatistikleri günceller)
    const { data, error } = await supabase
      .from('game_results')
      .insert({
        user_id: user.id,
        topic_id: topicId,
        mode,
        is_correct: isCorrect,
        mistakes: mistakes || 0,
        time_spent: timeSpent,
        score,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (error) {
      console.error('Save game result error:', error)
      return NextResponse.json(
        { error: 'Sonuç kaydedilirken bir hata oluştu' },
        { status: 500 }
      )
    }

    // Güncellenmiş kullanıcı bilgilerini al
    const { data: updatedUser } = await supabase
      .from('users')
      .select('total_xp, level, streak_days')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      result: data,
      user: updatedUser
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }
    
    console.error('Save game result error:', error)
    return NextResponse.json(
      { error: 'Sonuç kaydedilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
