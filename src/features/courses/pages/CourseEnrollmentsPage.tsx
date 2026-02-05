import EnrollmentsTable from '@/features/courses/components/enrollments/EnrollmentsTable'
import React from 'react'

const CourseEnrollmentsPage: React.FC = () => {
  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-lg'>Alumnos</h1>
        <p className='text-gray-400'>Lista de todos los alumnos inscritos a este curso.</p>
      </div>
      <EnrollmentsTable/>
    </div>
  )
}

export default CourseEnrollmentsPage