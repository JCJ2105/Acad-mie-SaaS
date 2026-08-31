import { createClient } from '@/lib/supabase/server'
import type { Course } from '@/components/dashboard'

const fallbackCourses: Course[] = [
  { tag: 'Fondamentaux', title: 'Concevoir son premier agent IA', meta: '8 leçons · 1h 45', progress: 82 },
  { tag: 'Construire avec l’IA', title: 'Architectures de données pour SaaS', meta: '11 leçons · 2h 20', progress: 46 },
  { tag: 'Publier son app', title: 'Déployer et itérer avec confiance', meta: '6 leçons · 1h 05', progress: 12 },
]

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('modules')
    .select('titre, description, tag, progres')
    .order('created_at', { ascending: true })

  if (error) {
    console.log('[v0] Erreur de récupération des modules Supabase:', error.message)
  }

  return data && data.length > 0
    ? data.map((module) => ({
        tag: module.tag ?? 'Module',
        title: module.titre,
        meta: module.description ?? '',
        progress: module.progres ?? 0,
      }))
    : fallbackCourses
}
