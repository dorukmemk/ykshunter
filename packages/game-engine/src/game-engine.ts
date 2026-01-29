import {
  AnyGame,
  GameState,
  GameResult,
  MatchingGame,
  SequenceGame,
  GroupingGame
} from './types'
import { initializeMatchingGame, checkMatchingAnswer } from './matching'
import { initializeSequenceGame, checkSequenceAnswer } from './sorting'
import { initializeGroupingGame, checkGroupingAnswer } from './grouping'
import { getGameResult } from './utils'

/**
 * Master Game Engine - Tüm oyun modlarını yöneten ana sınıf
 * Mode'a göre doğru oyun motorunu seçer ve çalıştırır
 */
export class GameEngine {
  /**
   * Oyunu başlatır ve ilk state'i döner
   */
  static initializeGame(game: AnyGame, randomize: boolean = true): GameState {
    switch (game.mode) {
      case 'matching':
        return initializeMatchingGame((game as MatchingGame).data, randomize)
      
      case 'sequence':
        return initializeSequenceGame((game as SequenceGame).data, randomize)
      
      case 'grouping':
        return initializeGroupingGame((game as GroupingGame).data, randomize)
      
      default:
        throw new Error(`Unknown game mode: ${(game as any).mode}`)
    }
  }

  /**
   * Oyunun cevabını kontrol eder
   */
  static checkAnswer(state: GameState): boolean {
    switch (state.mode) {
      case 'matching':
        return checkMatchingAnswer(state)
      
      case 'sequence':
        return checkSequenceAnswer(state)
      
      case 'grouping':
        return checkGroupingAnswer(state)
      
      default:
        return false
    }
  }

  /**
   * Oyun sonucunu hesaplar ve döner
   */
  static getResult(
    gameId: string,
    state: GameState,
    streak: number = 0
  ): GameResult {
    const isCorrect = this.checkAnswer(state)
    return getGameResult(gameId, state, isCorrect, streak)
  }

  /**
   * Oyunun tamamlanma durumunu kontrol eder
   */
  static isGameComplete(state: GameState): boolean {
    switch (state.mode) {
      case 'matching':
        return Object.keys(state.userMatches).length === state.pairs.length
      
      case 'sequence':
        return state.userOrder.length === state.items.length
      
      case 'grouping':
        return Object.keys(state.userAssignments).length === state.items.length
      
      default:
        return false
    }
  }

  /**
   * Oyunun ilerleme yüzdesini hesaplar
   */
  static getProgress(state: GameState): number {
    switch (state.mode) {
      case 'matching':
        if (state.pairs.length === 0) return 0
        return (Object.keys(state.userMatches).length / state.pairs.length) * 100
      
      case 'sequence':
        if (state.items.length === 0) return 0
        return (state.userOrder.length / state.items.length) * 100
      
      case 'grouping':
        if (state.items.length === 0) return 0
        return (Object.keys(state.userAssignments).length / state.items.length) * 100
      
      default:
        return 0
    }
  }
}

// Helper function to validate game data
export function validateGameData(game: AnyGame): boolean {
  if (!game.id || !game.title || !game.mode || !game.data) {
    return false
  }

  switch (game.mode) {
    case 'matching': {
      const matchingGame = game as MatchingGame
      return Array.isArray(matchingGame.data) && 
             matchingGame.data.every(item => 'key' in item && 'value' in item)
    }
    
    case 'sequence': {
      const sequenceGame = game as SequenceGame
      return Array.isArray(sequenceGame.data) && 
             sequenceGame.data.every(item => typeof item === 'string')
    }
    
    case 'grouping': {
      const groupingGame = game as GroupingGame
      return Array.isArray(groupingGame.data) && 
             groupingGame.data.every(item => 'item' in item && 'category' in item)
    }
    
    default:
      return false
  }
}
