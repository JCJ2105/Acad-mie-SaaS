import { Dashboard } from '@/components/dashboard'
import { getCourses } from '@/lib/get-courses'

export default async function DashboardPage() {
  const courses = await getCourses()
  return <Dashboard courses={courses} />
}
