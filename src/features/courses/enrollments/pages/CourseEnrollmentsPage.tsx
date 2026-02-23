import EnrollmentsTable from '@/features/courses/enrollments/components/EnrollmentsTable';
import { useParams } from 'react-router-dom'

export default function CourseEnrollmentsPage () {
  const { id } = useParams();
  if(!id) return null;

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-3xl font-bold'>Alumnos</h1>
        <p className='text-muted-foreground'>Lista de todos los alumnos inscritos a este curso.</p>
      </div>
      <EnrollmentsTable />
    </div>
  )
}