'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { GameEngine, GameState, GameMode } from '../../../../../packages/game-engine/src'
import { getQuestionSetsByTopicAndMode, getTopicById } from '@/lib/supabase'

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const mode = params.mode as GameMode

  const [topic, setTopic] = useState<any>(null)
  const [state, setState] = useState<GameState | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [loading, setLoading] = useState(true)
  const [questionSetData, setQuestionSetData] = useState<any>(null)

  useEffect(() => {
    loadGame()
  }, [topicId, mode])

  const loadGame = async () => {
    try {
      const [topicData, questionSets] = await Promise.all([
        getTopicById(topicId),
        getQuestionSetsByTopicAndMode(topicId, mode)
      ])
      
      if (!topicData || !questionSets || questionSets.length === 0) {
        setLoading(false)
        return
      }

      // Rastgele bir soru seti seç
      const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)]
      
      setTopic(topicData)
      setQuestionSetData(randomSet)
      
      // Create game object from database data
      const game = {
        id: `${topicId}-${mode}`,
        title: topicData.name,
        mode: mode,
        data: randomSet.data
      }
      
      setState(GameEngine.initializeGame(game as any, randomSet.is_random))
    } catch (error) {
      console.error('Error loading game:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Yükleniyor...</div>
      </div>
    )
  }

  if (!topic || !state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Oyun bulunamadı</h1>
          <p className="text-muted-foreground mb-4">
            Bu konu için {mode} modu henüz eklenmemiş.
          </p>
          <button
            onClick={() => router.push(`/topic/${topicId}`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Konuya Dön
          </button>
        </div>
      </div>
    )
  }

  const progress = GameEngine.getProgress(state)
  const isComplete = GameEngine.isGameComplete(state)

  const handleSubmit = () => {
    const result = GameEngine.getResult(`${topicId}-${mode}`, state)
    console.log('Game Result:', result)
    setShowResult(true)
  }

  const handleReset = () => {
    const game = {
      id: `${topicId}-${mode}`,
      title: topic.title,
      mode: mode,
      data: topic.data[mode]
    }
    setState(GameEngine.initializeGame(game as any, true))
    setShowResult(false)
  }

  const getModeInfo = () => {
    switch (mode) {
      case 'matching':
        return { icon: '🔗', label: 'Eşleştirme', color: 'purple' }
      case 'sequence':
        return { icon: '📊', label: 'Sıralama', color: 'blue' }
      case 'grouping':
        return { icon: '📦', label: 'Gruplama', color: 'green' }
      default:
        return { icon: '🎮', label: mode, color: 'gray' }
    }
  }

  const modeInfo = getModeInfo()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Geri</span>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              {topic.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium border whitespace-nowrap ${
                modeInfo.color === 'purple' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' :
                modeInfo.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
              }`}>
                {modeInfo.icon} {modeInfo.label}
              </span>
              <div className="flex items-center gap-2 md:gap-3 flex-1 w-full sm:w-auto">
                <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Game Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border border-border p-4 md:p-6 shadow-sm"
        >
          {state.mode === 'matching' && (
            <MatchingGameView 
              state={state} 
              setState={setState} 
              showResult={showResult}
              showCorrectAnswers={showCorrectAnswers}
            />
          )}
          {state.mode === 'sequence' && (
            <SequenceGameView 
              state={state} 
              setState={setState} 
              showResult={showResult}
              showCorrectAnswers={showCorrectAnswers}
            />
          )}
          {state.mode === 'grouping' && (
            <GroupingGameView 
              state={state} 
              setState={setState} 
              showResult={showResult}
              showCorrectAnswers={showCorrectAnswers}
            />
          )}

          {/* Submit Button */}
          <div className="mt-4 md:mt-6 flex gap-2 md:gap-4">
            <button
              onClick={handleSubmit}
              disabled={!isComplete || showResult}
              className="flex-1 bg-primary text-primary-foreground py-2 md:py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
            >
              {showResult ? '✓ Cevap Gönderildi' : 'Cevabı Gönder'}
            </button>
          </div>
        </motion.div>

        {/* Result Modal */}
        {showResult && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg p-4 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 text-center">
                {GameEngine.checkAnswer(state) ? '🎉 Tebrikler!' : '😔 Tekrar Dene'}
              </h2>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-muted rounded-lg p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-foreground">{state.mistakes}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Hata Sayısı</div>
                </div>
                <div className="bg-muted rounded-lg p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-foreground">
                    {Math.round(((state.endTime || Date.now()) - state.startTime) / 1000)}s
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Süre</div>
                </div>
              </div>

              {/* Answers Review */}
              <div className="mb-4 md:mb-6">
                <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-base md:text-lg">Cevaplarınız:</h3>
                <div className="space-y-2 md:space-y-3">
                  {state.mode === 'matching' && (
                    <>
                      {state.pairs.map((pair: any) => {
                        const userAnswerId = state.userMatches[pair.id]
                        const isCorrect = userAnswerId === pair.id
                        const userAnswerPair = state.pairs.find((p: any) => p.id === userAnswerId)
                        
                        return (
                          <div 
                            key={pair.id}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect 
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-500' 
                                : 'bg-red-50 dark:bg-red-500/10 border-red-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {isCorrect ? '✅' : '❌'}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-foreground mb-2">{pair.key}</div>
                                <div className="text-sm space-y-1">
                                  <div className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                    <span className="font-medium">Cevabınız:</span> {userAnswerPair?.value || 'Boş'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-green-700 dark:text-green-400">
                                      <span className="font-medium">Doğru cevap:</span> {pair.value}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {state.mode === 'sequence' && (
                    <>
                      {state.userOrder.map((itemId: string, index: number) => {
                        const item = state.items.find((i: any) => i.id === itemId)
                        const isCorrect = item?.correctOrder === index
                        
                        return (
                          <div 
                            key={itemId}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect 
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-500' 
                                : 'bg-red-50 dark:bg-red-500/10 border-red-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {isCorrect ? '✅' : '❌'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground mb-1">{item?.text}</div>
                                <div className="text-sm space-y-1">
                                  <div className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                    Sıranız: {index + 1}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-green-700 dark:text-green-400">
                                      Doğru sıra: {(item?.correctOrder || 0) + 1}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {state.mode === 'grouping' && (
                    <>
                      {state.items.map((item: any) => {
                        const userCategory = state.userAssignments[item.id]
                        const isCorrect = userCategory === item.correctCategory
                        
                        return (
                          <div 
                            key={item.id}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect 
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-500' 
                                : 'bg-red-50 dark:bg-red-500/10 border-red-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {isCorrect ? '✅' : '❌'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground mb-1">{item.text}</div>
                                <div className="text-sm space-y-1">
                                  <div className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                    Cevabınız: {userCategory || 'Boş'}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-green-700 dark:text-green-400">
                                      Doğru kategori: {item.correctCategory}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {!GameEngine.checkAnswer(state) && (
                  <button
                    onClick={() => {
                      setShowResult(false)
                      setShowCorrectAnswers(true)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    👁️ Doğru Cevapları Göster
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      // Sadece yanlış cevapları kaldır, doğruları koru
                      if (state.mode === 'matching') {
                        const correctMatches: {[key: string]: string} = {}
                        Object.keys(state.userMatches).forEach(keyId => {
                          const valueId = state.userMatches[keyId]
                          if (keyId === valueId) {
                            correctMatches[keyId] = valueId
                          }
                        })
                        setState({
                          ...state,
                          userMatches: correctMatches
                        })
                      } else if (state.mode === 'sequence') {
                        // Sıralama oyununda tüm sıralamayı sıfırla
                        setState({
                          ...state,
                          userOrder: []
                        })
                      } else if (state.mode === 'grouping') {
                        // Doğru kategorideki öğeleri koru, yanlışları kaldır
                        const correctAssignments: {[key: string]: string} = {}
                        Object.keys(state.userAssignments).forEach(itemId => {
                          const category = state.userAssignments[itemId]
                          const item = state.items.find((i: any) => i.id === itemId)
                          if (item?.correctCategory === category) {
                            correctAssignments[itemId] = category
                          }
                        })
                        setState({
                          ...state,
                          userAssignments: correctAssignments
                        })
                      }
                      setShowResult(false)
                      setShowCorrectAnswers(false)
                    }}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
                  >
                    🔄 Hatalarımı Düzelt
                  </button>
                  <button
                    onClick={() => {
                      if (questionSetData) {
                        const game = {
                          id: `${topicId}-${mode}`,
                          title: topic.name,
                          mode: mode,
                          data: questionSetData.data
                        }
                        setState(GameEngine.initializeGame(game as any, questionSetData.is_random))
                        setShowResult(false)
                        setShowCorrectAnswers(false)
                      }
                    }}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    ↻ Baştan Başla
                  </button>
                </div>
                <button
                  onClick={() => router.back()}
                  className="w-full bg-neutral-700 text-white py-3 rounded-lg font-semibold hover:bg-neutral-600 transition-all shadow-lg"
                >
                  ← Geri Dön
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

// Matching Game Component
function MatchingGameView({ state, setState, showResult, showCorrectAnswers }: any) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [connections, setConnections] = useState<{[key: string]: string}>({})

  // State'ten connections'ı yükle
  useEffect(() => {
    if (state.userMatches) {
      setConnections(state.userMatches)
    }
  }, [state.userMatches])

  // Renk paleti - her eşleştirme için farklı renk
  const colors = [
    { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50 dark:bg-blue-500/10' },
    { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50 dark:bg-purple-500/10' },
    { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50 dark:bg-pink-500/10' },
    { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50 dark:bg-orange-500/10' },
    { border: 'border-teal-500', bg: 'bg-teal-500', text: 'text-teal-500', light: 'bg-teal-50 dark:bg-teal-500/10' },
    { border: 'border-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-500', light: 'bg-cyan-50 dark:bg-cyan-500/10' },
  ]

  const handleKeyClick = (keyId: string) => {
    if (showCorrectAnswers) return
    
    if (selectedKey === keyId) {
      setSelectedKey(null)
    } else if (connections[keyId]) {
      // Eşleştirmeyi kaldır
      const newConnections = { ...connections }
      delete newConnections[keyId]
      setConnections(newConnections)
      setState({
        ...state,
        userMatches: newConnections
      })
    } else {
      setSelectedKey(keyId)
    }
  }

  const handleValueClick = (valueId: string) => {
    if (showCorrectAnswers || !selectedKey) return
    
    // Eşleştirme yap
    const newConnections = { ...connections, [selectedKey]: valueId }
    setConnections(newConnections)
    setState({
      ...state,
      userMatches: newConnections
    })
    setSelectedKey(null)
  }

  const getColorForConnection = (keyId: string) => {
    const index = Object.keys(connections).indexOf(keyId)
    return colors[index % colors.length]
  }

  const isValueConnected = (valueId: string) => {
    return Object.values(connections).includes(valueId)
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {showCorrectAnswers ? 'Doğru eşleştirmeler gösteriliyor:' : 'Sol taraftan bir terim seçin, sonra sağ taraftan açıklamasını seçin:'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Keys (Sol taraf) */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Terimler</h3>
          {state.pairs.map((pair: any) => {
            const isConnected = !!connections[pair.id]
            const isSelected = selectedKey === pair.id
            const color = isConnected ? getColorForConnection(pair.id) : null
            const isCorrect = showCorrectAnswers ? connections[pair.id] === pair.id : null
            
            return (
              <button
                key={pair.id}
                onClick={() => handleKeyClick(pair.id)}
                disabled={showCorrectAnswers}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showCorrectAnswers
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                      : 'border-red-500 bg-red-50 dark:bg-red-500/10'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg scale-105'
                    : isConnected
                    ? `${color?.border} ${color?.light} shadow-md`
                    : 'border-border bg-card hover:border-blue-300 hover:shadow-md'
                } ${showCorrectAnswers ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{pair.key}</span>
                  {showCorrectAnswers && (
                    <span className="text-2xl">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                  {!showCorrectAnswers && isConnected && (
                    <div className={`w-3 h-3 rounded-full ${color?.bg}`} />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Values (Sağ taraf) */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Açıklamalar</h3>
          {state.pairs.map((pair: any) => {
            const connectedKeyId = Object.keys(connections).find(k => connections[k] === pair.id)
            const isConnected = !!connectedKeyId
            const color = isConnected ? getColorForConnection(connectedKeyId!) : null
            const isCorrect = showCorrectAnswers ? connectedKeyId === pair.id : null
            
            return (
              <button
                key={pair.id}
                onClick={() => handleValueClick(pair.id)}
                disabled={showCorrectAnswers || isConnected}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showCorrectAnswers
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                      : 'border-red-500 bg-red-50 dark:bg-red-500/10'
                    : isConnected
                    ? `${color?.border} ${color?.light} shadow-md cursor-not-allowed opacity-70`
                    : selectedKey
                    ? 'border-border bg-card hover:border-purple-300 hover:shadow-md cursor-pointer'
                    : 'border-border bg-card cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${isConnected && !showCorrectAnswers ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {pair.value}
                  </span>
                  {showCorrectAnswers && (
                    <span className="text-2xl">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                  {!showCorrectAnswers && isConnected && (
                    <div className={`w-3 h-3 rounded-full ${color?.bg}`} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Yanlış eşleştirmeleri göster */}
      {showCorrectAnswers && (
        <div className="mt-8 p-6 bg-muted rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Doğru Eşleştirmeler:</h3>
          <div className="space-y-3">
            {state.pairs.map((pair: any) => (
              <div key={pair.id} className="flex items-center gap-4 p-3 bg-card rounded-lg border border-green-500/30">
                <div className="flex-1">
                  <span className="font-medium text-foreground">{pair.key}</span>
                </div>
                <div className="text-green-600 dark:text-green-400">→</div>
                <div className="flex-1">
                  <span className="text-foreground">{pair.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Sequence Game Component
function SequenceGameView({ state, setState, showResult, showCorrectAnswers }: any) {
  const addToSequence = (itemId: string) => {
    if (!state.userOrder.includes(itemId) && !showCorrectAnswers) {
      setState({
        ...state,
        userOrder: [...state.userOrder, itemId]
      })
    }
  }

  const removeFromSequence = (itemId: string) => {
    if (!showCorrectAnswers) {
      setState({
        ...state,
        userOrder: state.userOrder.filter((id: string) => id !== itemId)
      })
    }
  }

  const availableItems = state.items.filter(
    (item: any) => !state.userOrder.includes(item.id)
  )

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {showCorrectAnswers ? 'Doğru sıralama gösteriliyor:' : 'Öğeleri doğru sıraya dizin:'}
      </p>

      {/* User's Order */}
      <div className="bg-muted border border-border rounded-lg p-4 min-h-[200px]">
        <h3 className="font-semibold text-foreground mb-3">Sıralama</h3>
        <div className="space-y-2">
          {state.userOrder.map((itemId: string, index: number) => {
            const item = state.items.find((i: any) => i.id === itemId)
            const isCorrect = showCorrectAnswers ? item?.correctOrder === index : null
            
            return (
              <div
                key={itemId}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 shadow-sm transition-all ${
                  showCorrectAnswers
                    ? isCorrect
                      ? 'bg-green-50 dark:bg-green-500/10 border-green-500'
                      : 'bg-red-50 dark:bg-red-500/10 border-red-500'
                    : 'bg-card border-border'
                }`}
              >
                <span className={`font-bold ${showCorrectAnswers ? (isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-blue-600 dark:text-blue-400'}`}>
                  {index + 1}.
                </span>
                <span className="flex-1 text-foreground">{item.text}</span>
                {showCorrectAnswers && (
                  <span className="text-2xl">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                )}
                {!showCorrectAnswers && (
                  <button
                    onClick={() => removeFromSequence(itemId)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            )
          })}
          {state.userOrder.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Aşağıdan öğeleri seçerek sıralayın
            </p>
          )}
        </div>
      </div>

      {/* Doğru sıralamayı göster */}
      {showCorrectAnswers && (
        <div className="bg-muted border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 text-lg">Doğru Sıralama:</h3>
          <div className="space-y-2">
            {state.items
              .sort((a: any, b: any) => a.correctOrder - b.correctOrder)
              .map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border-2 border-green-500 p-3 rounded-lg"
                >
                  <span className="font-bold text-green-600 dark:text-green-400">{index + 1}.</span>
                  <span className="flex-1 text-foreground">{item.text}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Available Items */}
      {!showCorrectAnswers && availableItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground mb-3">Öğeler</h3>
          <div className="grid grid-cols-1 gap-2">
            {availableItems.map((item: any) => (
              <button
                key={item.id}
                onClick={() => addToSequence(item.id)}
                className="p-4 rounded-lg border-2 border-border bg-card text-foreground hover:border-primary hover:bg-accent hover:shadow-md text-left transition-all"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Grouping Game Component
function GroupingGameView({ state, setState, showResult, showCorrectAnswers }: any) {
  const assignToGroup = (itemId: string, category: string) => {
    if (!showCorrectAnswers) {
      setState({
        ...state,
        userAssignments: {
          ...state.userAssignments,
          [itemId]: category
        }
      })
    }
  }

  const removeFromGroup = (itemId: string) => {
    if (!showCorrectAnswers) {
      const newAssignments = { ...state.userAssignments }
      delete newAssignments[itemId]
      setState({
        ...state,
        userAssignments: newAssignments
      })
    }
  }

  const unassignedItems = state.items.filter(
    (item: any) => !state.userAssignments[item.id]
  )

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {showCorrectAnswers ? 'Doğru gruplandırma gösteriliyor:' : 'Öğeleri doğru kategorilere yerleştirin:'}
      </p>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.categories.map((category: string) => {
          const categoryItems = state.items.filter(
            (item: any) => state.userAssignments[item.id] === category
          )
          
          return (
            <div 
              key={category} 
              className={`border-2 rounded-lg p-4 ${
                showCorrectAnswers 
                  ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                  : 'border-purple-300 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5'
              }`}
            >
              <h3 className={`font-semibold mb-3 ${
                showCorrectAnswers 
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-purple-700 dark:text-purple-400'
              }`}>
                {category}
              </h3>
              <div className="space-y-2 min-h-[100px]">
                {categoryItems.map((item: any) => {
                  const isCorrect = showCorrectAnswers ? item.correctCategory === category : null
                  
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg flex items-center justify-between shadow-sm transition-all ${
                        showCorrectAnswers
                          ? isCorrect
                            ? 'bg-green-100 dark:bg-green-500/20 border-2 border-green-500'
                            : 'bg-red-100 dark:bg-red-500/20 border-2 border-red-500'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <span className="text-foreground">{item.text}</span>
                      <div className="flex items-center gap-2">
                        {showCorrectAnswers && (
                          <span className="text-xl">
                            {isCorrect ? '✅' : '❌'}
                          </span>
                        )}
                        {!showCorrectAnswers && (
                          <button
                            onClick={() => removeFromGroup(item.id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {categoryItems.length === 0 && !showCorrectAnswers && (
                  <p className="text-gray-400 dark:text-neutral-500 text-center py-4 text-sm">
                    Buraya yerleştir
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Doğru gruplandırmayı göster */}
      {showCorrectAnswers && (
        <div className="bg-muted border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Doğru Gruplandırma:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.categories.map((category: string) => {
              const correctItems = state.items.filter(
                (item: any) => item.correctCategory === category
              )
              
              return (
                <div key={category} className="border-2 border-green-500 bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {correctItems.map((item: any) => (
                      <div key={item.id} className="p-2 bg-card rounded border border-green-500/30">
                        <span className="text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Unassigned Items */}
      {!showCorrectAnswers && unassignedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground mb-3">Yerleştirilecek Öğeler</h3>
          <div className="space-y-2">
            {unassignedItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="flex-1 p-3 bg-muted border border-border rounded-lg text-foreground shadow-sm">{item.text}</span>
                {state.categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => assignToGroup(item.id, category)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm transition-all shadow-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
