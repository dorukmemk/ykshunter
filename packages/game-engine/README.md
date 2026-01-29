# Game Engine Package

Tüm oyun modlarını (matching, sequence, grouping) destekleyen birleşik oyun motoru.

## Özellikler

- ✅ **Tek JSON Yapısı**: Tüm oyun modları aynı veri formatını kullanır
- ✅ **Type-Safe**: TypeScript ile tam tip güvenliği
- ✅ **Mode Switcher**: Otomatik mod algılama ve yönlendirme
- ✅ **Skor Sistemi**: Hata, süre ve streak bazlı puanlama
- ✅ **NotebookLM Uyumlu**: AI ile otomatik içerik üretimi

## Kurulum

```bash
npm install
```

## Kullanım

### 1. Oyun Verisi Hazırlama

```typescript
import { GameCollection } from '@repo/game-engine'

const myGames: GameCollection = {
  subject: "AYT Biyoloji",
  topic: "Sinir Sistemi",
  games: [
    {
      id: "game_001",
      title: "Nöron Yapısı",
      mode: "matching",
      data: [
        { key: "Dendrit", value: "Uyarıyı alan kısa uzantılar" },
        { key: "Akson", value: "Uyarıyı ileten uzun uzantı" }
      ]
    },
    {
      id: "game_002",
      title: "Refleks Yayı",
      mode: "sequence",
      data: ["Reseptör", "Duyu Nöronu", "Ara Nöron", "Motor Nöron", "Efektör"]
    },
    {
      id: "game_003",
      title: "Beyin Bölümleri",
      mode: "grouping",
      data: [
        { item: "Serebrum", category: "Ön Beyin" },
        { item: "Beyincik", category: "Arka Beyin" }
      ]
    }
  ]
}
```

### 2. Oyun Motoru Kullanımı

```typescript
import { GameEngine, AnyGame } from '@repo/game-engine'

// Oyunu başlat
const game: AnyGame = myGames.games[0]
const initialState = GameEngine.initializeGame(game, true) // randomize=true

// İlerlemeyi kontrol et
const progress = GameEngine.getProgress(initialState)
console.log(`Progress: ${progress}%`)

// Tamamlanma durumu
const isComplete = GameEngine.isGameComplete(initialState)

// Cevabı kontrol et
const isCorrect = GameEngine.checkAnswer(initialState)

// Sonucu al
const result = GameEngine.getResult(game.id, initialState, streak)
console.log(`Score: ${result.score}, XP: ${result.xp}`)
```

### 3. React Component Örneği

```typescript
'use client'

import { useState } from 'react'
import { GameEngine, AnyGame, GameState } from '@repo/game-engine'
import { MatchingGameComponent } from './MatchingGame'
import { SequenceGameComponent } from './SequenceGame'
import { GroupingGameComponent } from './GroupingGame'

export function GamePlayer({ game }: { game: AnyGame }) {
  const [state, setState] = useState<GameState>(() => 
    GameEngine.initializeGame(game, true)
  )

  const handleSubmit = () => {
    const result = GameEngine.getResult(game.id, state)
    console.log('Game Result:', result)
    // Save to database, show results, etc.
  }

  // Mode'a göre doğru component'i render et
  switch (game.mode) {
    case 'matching':
      return <MatchingGameComponent state={state} setState={setState} onSubmit={handleSubmit} />
    
    case 'sequence':
      return <SequenceGameComponent state={state} setState={setState} onSubmit={handleSubmit} />
    
    case 'grouping':
      return <GroupingGameComponent state={state} setState={setState} onSubmit={handleSubmit} />
    
    default:
      return <div>Unknown game mode</div>
  }
}
```

### 4. Matching Game Component

```typescript
import { makeMatch, removeMatch } from '@repo/game-engine'

export function MatchingGameComponent({ state, setState, onSubmit }) {
  const handleMatch = (keyId: string, valueId: string) => {
    setState(makeMatch(state, keyId, valueId))
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {state.pairs.map(pair => (
          <button key={pair.id} onClick={() => handleMatch(pair.id, selectedValue)}>
            {pair.key}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {state.pairs.map(pair => (
          <button key={pair.id} onClick={() => setSelectedValue(pair.id)}>
            {pair.value}
          </button>
        ))}
      </div>
      <button onClick={onSubmit}>Cevabı Gönder</button>
    </div>
  )
}
```

### 5. Sequence Game Component

```typescript
import { addToSequence, reorderSequence } from '@repo/game-engine'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export function SequenceGameComponent({ state, setState, onSubmit }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = state.userOrder.indexOf(active.id)
      const newIndex = state.userOrder.indexOf(over.id)
      setState(reorderSequence(state, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={state.userOrder} strategy={verticalListSortingStrategy}>
        {state.userOrder.map(itemId => {
          const item = state.items.find(i => i.id === itemId)
          return <SortableItem key={itemId} id={itemId} text={item.text} />
        })}
      </SortableContext>
      <button onClick={onSubmit}>Cevabı Gönder</button>
    </DndContext>
  )
}
```

### 6. Grouping Game Component

```typescript
import { assignToGroup } from '@repo/game-engine'

export function GroupingGameComponent({ state, setState, onSubmit }) {
  const handleAssign = (itemId: string, category: string) => {
    setState(assignToGroup(state, itemId, category))
  }

  return (
    <div>
      <div className="flex gap-4">
        {state.categories.map(category => (
          <div key={category} className="flex-1 border p-4">
            <h3>{category}</h3>
            {state.items
              .filter(item => state.userAssignments[item.id] === category)
              .map(item => (
                <div key={item.id}>{item.text}</div>
              ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 space-y-2">
        {state.items
          .filter(item => !state.userAssignments[item.id])
          .map(item => (
            <div key={item.id} className="flex gap-2">
              <span>{item.text}</span>
              {state.categories.map(cat => (
                <button key={cat} onClick={() => handleAssign(item.id, cat)}>
                  {cat}
                </button>
              ))}
            </div>
          ))}
      </div>
      
      <button onClick={onSubmit}>Cevabı Gönder</button>
    </div>
  )
}
```

## NotebookLM ile İçerik Üretimi

1. NotebookLM'e kaynaklarını yükle (PDF, MEB kitabı, notlar)
2. Şu prompt'u kullan:

```
Yüklediğim dokümanları analiz et. [Sinir Sistemi] konusuyla ilgili; 
en az 2 'matching', 2 'sequence' ve 2 'grouping' oyunu oluştur. 

Çıktıyı tam olarak şu JSON yapısında ver:
{
  "subject": "AYT Biyoloji",
  "topic": "Sinir Sistemi",
  "games": [...]
}

Hiçbir açıklama metni ekleme, sadece JSON kodunu ver.
```

3. Çıkan JSON'u direkt olarak uygulamana import et

## API Referansı

### GameEngine

- `initializeGame(game, randomize)` - Oyunu başlatır
- `checkAnswer(state)` - Cevabı kontrol eder
- `getResult(gameId, state, streak)` - Sonucu hesaplar
- `isGameComplete(state)` - Tamamlanma durumunu kontrol eder
- `getProgress(state)` - İlerleme yüzdesini döner

### Matching Functions

- `makeMatch(state, keyId, valueId)` - Eşleştirme yapar
- `removeMatch(state, keyId)` - Eşleştirmeyi kaldırır
- `submitMatchingAnswer(state)` - Cevabı gönderir

### Sequence Functions

- `addToSequence(state, itemId)` - Sıraya ekler
- `removeFromSequence(state, itemId)` - Sıradan çıkarır
- `reorderSequence(state, fromIndex, toIndex)` - Sırayı değiştirir
- `submitSequenceAnswer(state)` - Cevabı gönderir

### Grouping Functions

- `assignToGroup(state, itemId, category)` - Gruba atar
- `removeFromGroup(state, itemId)` - Gruptan çıkarır
- `submitGroupingAnswer(state)` - Cevabı gönderir

## Lisans

MIT
