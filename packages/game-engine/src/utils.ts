import { GameState, GameResult, GameMode } from './types'

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function calculateScore(
  isCorrect: boolean,
  mistakes: number,
  timeSpent: number
): number {
  if (!isCorrect) return 0
  
  const baseScore = 100
  const mistakePenalty = mistakes * 10
  const timePenalty = Math.min(timeSpent / 1000, 30) // Max 30 second penalty
  
  return Math.max(0, Math.round(baseScore - mistakePenalty - timePenalty))
}

export function calculateXP(
  score: number,
  mode: GameMode,
  streak: number = 0
): number {
  const modeMultiplier = {
    matching: 1.0,
    sequence: 1.2,
    grouping: 1.5
  }
  
  const baseXP = score * (modeMultiplier[mode] || 1.0)
  const streakBonus = streak * 5
  
  return Math.round(baseXP + streakBonus)
}

export function getGameResult(
  gameId: string,
  state: GameState,
  isCorrect: boolean,
  streak: number = 0
): GameResult {
  const timeSpent = (state.endTime || Date.now()) - state.startTime
  const score = calculateScore(isCorrect, state.mistakes, timeSpent)
  const xp = calculateXP(score, state.mode, streak)

  return {
    gameId,
    mode: state.mode,
    isCorrect,
    mistakes: state.mistakes,
    timeSpent,
    score,
    xp
  }
}
