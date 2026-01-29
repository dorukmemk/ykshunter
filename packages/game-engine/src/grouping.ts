import { GroupingData, GroupingGameState } from './types'
import { shuffle } from './utils'

export function initializeGroupingGame(
  data: GroupingData[],
  randomize: boolean = true
): GroupingGameState {
  // Extract unique categories
  const categories = Array.from(new Set(data.map(d => d.category)))

  // Create items with IDs
  const items = data.map((item, index) => ({
    id: `item-${index}`,
    text: item.item,
    correctCategory: item.category
  }))

  const shuffledItems = randomize ? shuffle(items) : items

  return {
    mode: 'grouping',
    items: shuffledItems,
    categories,
    userAssignments: {},
    isComplete: false,
    mistakes: 0,
    startTime: Date.now()
  }
}

export function assignToGroup(
  state: GroupingGameState,
  itemId: string,
  category: string
): GroupingGameState {
  return {
    ...state,
    userAssignments: {
      ...state.userAssignments,
      [itemId]: category
    }
  }
}

export function removeFromGroup(
  state: GroupingGameState,
  itemId: string
): GroupingGameState {
  const newAssignments = { ...state.userAssignments }
  delete newAssignments[itemId]
  
  return {
    ...state,
    userAssignments: newAssignments
  }
}

export function checkGroupingAnswer(state: GroupingGameState): boolean {
  if (Object.keys(state.userAssignments).length !== state.items.length) {
    return false
  }

  return state.items.every(item => 
    state.userAssignments[item.id] === item.correctCategory
  )
}

export function submitGroupingAnswer(
  state: GroupingGameState
): GroupingGameState {
  const isCorrect = checkGroupingAnswer(state)
  
  return {
    ...state,
    isComplete: true,
    mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
    endTime: Date.now()
  }
}
