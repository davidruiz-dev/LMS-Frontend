import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import EnrollmentsTable from '@/features/courses/components/enrollments/EnrollmentsTable'
import { useCourse } from '@/features/courses/hooks/use-courses'
import { ROUTES } from '@/shared/constants/routes'
import { Book } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function CourseEnrollmentsPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course } = useCourse(id);
  if(!id) return null;

  return (
    <div className='space-y-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.COURSES)}>
              <div className="flex items-center gap-2">
                <Book size={15} /> Cursos
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.COURSE_DETAIL(id))}>{course?.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Alumnos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className='text-lg'>Alumnos</h1>
        <p className='text-gray-400'>Lista de todos los alumnos inscritos a este curso.</p>
      </div>
      <EnrollmentsTable />
    </div>
  )
}