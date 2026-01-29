export type GameMode = 'sorting' | 'grouping' | 'matching'

export interface Subject {
  id: string
  name: string
  icon: string
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  subject_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface QuestionSet {
  id: string
  topic_id: string
  mode: GameMode
  is_random: boolean
  data: any // JSON data
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  topic_id: string
  completed_count: number
  total_xp: number
  streak: number
  last_played: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: Subject
        Insert: Omit<Subject, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>
      }
      topics: {
        Row: Topic
        Insert: Omit<Topic, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>
      }
      question_sets: {
        Row: QuestionSet
        Insert: Omit<QuestionSet, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuestionSet, 'id' | 'created_at' | 'updated_at'>>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
