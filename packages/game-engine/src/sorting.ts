import { SequenceData, SequenceGameState } from './types'
import { shuffle } from './utils'

export function initializeSequenceGame(
  data: SequenceData,
  randomize: boolean = true
): SequenceGameState {
  const items = data.map((text, index) => ({
    id: `item-${index}`,
    text,
    correctOrder: index
  }))

  const shuffledItems = randomize ? shuffle(items) : items

  return {
    mode: 'sequence',
    items: shuffledItems,
    userOrder: [],
    isComplete: false,
    mistakes: 0,
    startTime: Date.now()
  }
}

export function addToSequence(
  state: SequenceGameState,
  itemId: string
): SequenceGameState {
  if (state.userOrder.includes(itemId)) {
    return state
  }

  return {
    ...state,
    userOrder: [...state.userOrder, itemId]
  }
}

export function removeFromSequence(
  state: SequenceGameState,
  itemId: string
): SequenceGameState {
  return {
    ...state,
    userOrder: state.userOrder.filter(id => id !== itemId)
  }
}

export function reorderSequence(
  state: SequenceGameState,
  fromIndex: number,
  toIndex: number
): SequenceGameState {
  const newOrder = [...state.userOrder]
  const [removed] = newOrder.splice(fromIndex, 1)
  newOrder.splice(toIndex, 0, removed)

  return {
    ...state,
    userOrder: newOrder
  }
}

export function checkSequenceAnswer(state: SequenceGameState): boolean {
  if (state.userOrder.length !== state.items.length) {
    return false
  }

  return state.userOrder.every((itemId, index) => {
    const item = state.items.find(i => i.id === itemId)
    return item?.correctOrder === index
  })
}

export function submitSequenceAnswer(
  state: SequenceGameState
): SequenceGameState {
  const isCorrect = checkSequenceAnswer(state)
  
  return {
    ...state,
    isComplete: true,
    mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
    endTime: Date.now()
  }
}
