// Master JSON Types - Tüm oyun modları için birleşik yapı

export type GameMode = 'matching' | 'sequence' | 'grouping'

// Matching Mode Data
export interface MatchingData {
  key: string
  value: string
}

// Sequence Mode Data
export type SequenceData = string[]

// Grouping Mode Data
export interface GroupingData {
  item: string
  category: string
}

// Generic Game Structure
export interface Game<T = any> {
  id: string
  title: string
  mode: GameMode
  data: T
}

// Specific Game Types
export type MatchingGame = Game<MatchingData[]>
export type SequenceGame = Game<SequenceData>
export type GroupingGame = Game<GroupingData[]>

// Union type for all games
export type AnyGame = MatchingGame | SequenceGame | GroupingGame

// Master JSON Structure
export interface GameCollection {
  subject: string
  unit?: string
  topic: string
  games: AnyGame[]
}

// Game State Types
export interface BaseGameState {
  isComplete: boolean
  mistakes: number
  startTime: number
  endTime?: number
  score?: number
}

export interface MatchingGameState extends BaseGameState {
  mode: 'matching'
  pairs: Array<{ id: string; key: string; value: string }>
  userMatches: Record<string, string> // keyId -> valueId
}

export interface SequenceGameState extends BaseGameState {
  mode: 'sequence'
  items: Array<{ id: string; text: string; correctOrder: number }>
  userOrder: string[]
}

export interface GroupingGameState extends BaseGameState {
  mode: 'grouping'
  items: Array<{ id: string; text: string; correctCategory: string }>
  categories: string[]
  userAssignments: Record<string, string> // itemId -> category
}

export type GameState = MatchingGameState | SequenceGameState | GroupingGameState

// Result Types
export interface GameResult {
  gameId: string
  mode: GameMode
  isCorrect: boolean
  mistakes: number
  timeSpent: number // milliseconds
  score: number
  xp: number
}
