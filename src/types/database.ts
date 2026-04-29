/**
 * Tipos derivados del schema de Supabase.
 *
 * En el futuro, estos tipos se pueden auto-generar con:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Por ahora los mantenemos manualmente para no requerir CLI de Supabase.
 */

export type UserRole = 'student' | 'teacher' | 'parent';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type ContrastMode = 'soft' | 'medium' | 'high';
export type TaskType = 'vocab' | 'grammar' | 'listening' | 'reading';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  cefr_level: CefrLevel;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  font_size_scale: 1.0 | 1.15 | 1.3 | 1.5;
  contrast_mode: ContrastMode;
  audio_speed: 0.5 | 0.75 | 1.0 | 1.25;
  reduce_motion: boolean;
  updated_at: string;
}

export interface Lesson {
  id: string;
  cefr_level: CefrLevel;
  title: string;
  description: string | null;
  order_index: number;
  estimated_minutes: number;
  is_published: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  lesson_id: string;
  task_type: TaskType;
  content_json: Record<string, unknown>;
  correct_answer: string | null;
  order_index: number;
  max_duration_seconds: number;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  task_id: string;
  completed_at: string;
  time_spent_seconds: number;
  attempts: number;
  success: boolean;
  score: number | null;
}

export interface SessionLog {
  id: string;
  student_id: string;
  lesson_id: string | null;
  started_at: string;
  ended_at: string | null;
  shield_mode_active: boolean;
  focus_breaks: number;
}

export interface ClassroomMembership {
  id: string;
  classroom_name: string;
  teacher_id: string;
  student_id: string;
  created_at: string;
}

export interface ParentStudentLink {
  id: string;
  parent_id: string;
  student_id: string;
  created_at: string;
}

/**
 * Database type para tipar el cliente de Supabase.
 * Versión simplificada — solo describe lo que usamos.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'cefr_level'> & {
          cefr_level?: CefrLevel;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Partial<UserPreferences> & { user_id: string };
        Update: Partial<Omit<UserPreferences, 'user_id'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at'>;
        Update: Partial<Omit<Lesson, 'id' | 'created_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at'>>;
      };
      student_progress: {
        Row: StudentProgress;
        Insert: Omit<StudentProgress, 'id' | 'completed_at'>;
        Update: Partial<Omit<StudentProgress, 'id'>>;
      };
      session_logs: {
        Row: SessionLog;
        Insert: Omit<SessionLog, 'id' | 'started_at'>;
        Update: Partial<Omit<SessionLog, 'id'>>;
      };
      classroom_memberships: {
        Row: ClassroomMembership;
        Insert: Omit<ClassroomMembership, 'id' | 'created_at'>;
        Update: Partial<Omit<ClassroomMembership, 'id' | 'created_at'>>;
      };
      parent_student_links: {
        Row: ParentStudentLink;
        Insert: Omit<ParentStudentLink, 'id' | 'created_at'>;
        Update: Partial<Omit<ParentStudentLink, 'id' | 'created_at'>>;
      };
    };
  };
}
