import { useCourseGuard } from '@/features/courses/hooks/use-course-guard'
import EditCoursePage from '@/features/courses/pages/EditCoursePage'
import { GuardBoundary } from '@/router/GuardBoundary'
import { useParams } from 'react-router-dom'


export default function EditCourseRoute() {
  const { id } = useParams()
  const state = useCourseGuard(id!, a => a.canEdit)

  return (
    <GuardBoundary state={state}>
      <EditCoursePage />
    </GuardBoundary>
  )
}
