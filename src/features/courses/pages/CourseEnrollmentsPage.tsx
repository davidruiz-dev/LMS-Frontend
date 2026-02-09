import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import EnrollmentsTable from '@/features/courses/components/enrollments/EnrollmentsTable'
import { ROUTES } from '@/shared/constants/routes'
import { HomeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CourseEnrollmentsPage () {
  const navigate = useNavigate();

  return (
    <div className='space-y-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.COURSES)}>
              <div className="flex items-center gap-2">
                <HomeIcon size={15} /> Cursos
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.COURSES)}>Cursos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Miembros</BreadcrumbLink>
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