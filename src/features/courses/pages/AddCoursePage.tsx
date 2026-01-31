import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import FormCourse from '@/features/courses/components/CourseForm'
import { ROUTES } from '@/shared/constants/routes';
import { HomeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function AddCoursePage() {
  const navigate = useNavigate();
  return (
    <div className='p-6 space-y-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.DASHBOARD)}>
              <div className="flex items-center gap-2">
                <HomeIcon size={15} /> Dashboard
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(ROUTES.COURSES)}>Cursos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Agregar curso</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <FormCourse />
    </div>
  )
}
