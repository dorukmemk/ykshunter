// Shuffle utility
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// XP calculation with speed bonus
export function calculateXP(
  correctCount: number,
  totalCount: number,
  timeSpent: number,
  streak: number
): number {
  const baseXP = correctCount * 10
  const accuracyBonus = (correctCount / totalCount) * 50
  const speedBonus = Math.max(0, 100 - timeSpent / 1000) // Faster = more XP
  const streakBonus = streak * 5
  
  return Math.round(baseXP + accuracyBonus + speedBonus + streakBonus)
}

// Level calculation from XP
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

// Sequence Game (Sıralama)
export interface SequenceItem {
  text: string
  order: number
}

export function initializeSequenceGame(items: string[], randomize: boolean) {
  const sequenceItems: SequenceItem[] = items.map((text, index) => ({
    text,
    order: index
  }))
  
  return {
    items: randomize ? shuffle(sequenceItems) : sequenceItems,
    userOrder: [] as number[],
    mistakes: [] as string[]
  }
}

export function checkSequenceAnswer(
  correctOrder: SequenceItem[],
  userOrder: number[]
): boolean {
  return correctOrder.every((item, index) => item.order === userOrder[index])
}

// Grouping Game (Gruplandırma)
export interface GroupingItem {
  item: string
  category: string
}

export function initializeGroupingGame(items: GroupingItem[], randomize: boolean) {
  const categories = [...new Set(items.map(i => i.category))]
  
  return {
    items: randomize ? shuffle(items) : items,
    categories,
    currentIndex: 0,
    userAnswers: [] as { item: string; userCategory: string; correct: boolean }[],
    mistakes: [] as string[]
  }
}

// Matching Game (Eşleştirme)
export interface MatchingPair {
  key: string
  value: string
}

export function initializeMatchingGame(pairs: MatchingPair[], randomize: boolean) {
  const leftItems = pairs.map(p => p.key)
  const rightItems = randomize ? shuffle(pairs.map(p => p.value)) : pairs.map(p => p.value)
  
  return {
    pairs,
    leftItems,
    rightItems,
    userMatches: {} as Record<string, string>,
    mistakes: [] as string[]
  }
}

export function checkMatchingAnswer(
  pairs: MatchingPair[],
  userMatches: Record<string, string>
): boolean {
  return pairs.every(pair => userMatches[pair.key] === pair.value)
}
