import { supabase } from './supabase'

export interface User {
  id: string
  username: string
  role: 'admin' | 'teacher'
  created_at: string
}

export interface Update {
  id: string
  title: string
  content: string
  author_id: string | null
  created_at: string
  updated_at: string
  published: boolean
}

export interface Image {
  id: string
  update_id: string
  image_url?: string
  file_path?: string
  alt_text: string | null
  display_order: number
  is_main?: boolean
  position?: 'top' | 'left' | 'right' | 'none'
  created_at: string
}

export interface Suggestion {
  id: string
  teacher_id: string
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'implemented'
  admin_feedback: string | null
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  name: string
  school: string | null
  team_name: string | null
  created_at: string
}

export interface ProgrammingLanguage {
  id: string
  name: string
  icon_url: string | null
  description: string | null
  display_order: number
  created_at: string
}

// Users
export async function getUserByUsername(username: string): Promise<(User & { password_hash: string }) | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Supabase error fetching user:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      // If table doesn't exist, return null gracefully
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('Users table does not exist. Please run SQL schema first.')
        return null
      }
      // If connection error
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.error('Network error connecting to Supabase. Check your connection.')
        return null
      }
      return null
    }
    
    if (!data) {
      console.log('No user found with username:', username)
      return null
    }
    
    console.log('User found in database:', username)
    return data as User & { password_hash: string }
  } catch (error) {
    console.error('Exception fetching user by username:', error)
    return null
  }
}

export async function createUser(username: string, passwordHash: string, role: 'admin' | 'teacher'): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash, role })
    .select()
    .single()

  if (error || !data) return null
  return data as User
}

// Updates
export async function getUpdates(limit: number = 10): Promise<Update[]> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching updates:', error)
      return []
    }
    if (!data) return []
    return data as Update[]
  } catch (error) {
    console.error('Exception fetching updates:', error)
    return []
  }
}

export async function getAllUpdates(): Promise<Update[]> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all updates:', error)
      return []
    }
    if (!data) return []
    return data as Update[]
  } catch (error) {
    console.error('Exception fetching all updates:', error)
    return []
  }
}

export async function getUpdateById(id: string): Promise<Update | null> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as Update
  } catch (error) {
    console.error('Exception fetching update by id:', error)
    return null
  }
}

export async function createUpdate(update: Omit<Update, 'id' | 'created_at' | 'updated_at'>): Promise<Update | null> {
  const { data, error } = await supabase
    .from('updates')
    .insert(update)
    .select()
    .single()

  if (error || !data) return null
  return data as Update
}

export async function updateUpdate(id: string, update: Partial<Update>): Promise<Update | null> {
  const { data, error } = await supabase
    .from('updates')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return null
  return data as Update
}

export async function deleteUpdate(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('updates')
    .delete()
    .eq('id', id)

  return !error
}

// Images
export async function getImagesByUpdateId(updateId: string): Promise<Image[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('id, update_id, image_url, file_path, alt_text, display_order, is_main, position, created_at')
      .eq('update_id', updateId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching images:', error)
      console.error('Error details:', error.message, error.code)
      return []
    }
    if (!data) return []
    
    // Ensure image_url is set (use file_path as fallback)
    const images = data.map((img: any) => ({
      ...img,
      image_url: img.image_url || img.file_path || '',
    })) as Image[]
    
    console.log(`Fetched ${images.length} images for update ${updateId}`)
    return images
  } catch (error) {
    console.error('Exception fetching images:', error)
    return []
  }
}

export async function createImage(image: Omit<Image, 'id' | 'created_at'>): Promise<Image | null> {
  const { data, error } = await supabase
    .from('images')
    .insert(image)
    .select()
    .single()

  if (error || !data) return null
  return data as Image
}

export async function deleteImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id)

  return !error
}

// Suggestions
export async function getSuggestionsByTeacher(teacherId: string): Promise<Suggestion[]> {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as Suggestion[]
}

export async function getAllSuggestions(): Promise<Suggestion[]> {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all suggestions:', error)
      return []
    }
    if (!data) return []
    return data as Suggestion[]
  } catch (error) {
    console.error('Exception fetching all suggestions:', error)
    return []
  }
}

export async function createSuggestion(suggestion: Omit<Suggestion, 'id' | 'created_at' | 'updated_at' | 'status' | 'admin_feedback'>): Promise<Suggestion | null> {
  const { data, error } = await supabase
    .from('suggestions')
    .insert({ ...suggestion, status: 'pending' })
    .select()
    .single()

  if (error || !data) return null
  return data as Suggestion
}

export async function updateSuggestion(id: string, suggestion: Partial<Suggestion>): Promise<Suggestion | null> {
  const { data, error } = await supabase
    .from('suggestions')
    .update(suggestion)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return null
  return data as Suggestion
}

// Participants
export async function getParticipants(): Promise<Participant[]> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching participants:', error)
      return []
    }
    if (!data) return []
    return data as Participant[]
  } catch (error) {
    console.error('Exception fetching participants:', error)
    return []
  }
}

export async function createParticipant(participant: Omit<Participant, 'id' | 'created_at'>): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participants')
    .insert(participant)
    .select()
    .single()

  if (error || !data) return null
  return data as Participant
}

// Programming Languages
export async function getProgrammingLanguages(): Promise<ProgrammingLanguage[]> {
  try {
    const { data, error } = await supabase
      .from('programming_languages')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching programming languages:', error)
      return []
    }
    if (!data) return []
    return data as ProgrammingLanguage[]
  } catch (error) {
    console.error('Exception fetching programming languages:', error)
    return []
  }
}

