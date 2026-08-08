import { ROUTES } from '@/shared/constants/routes'
import { HomeIcon, User2, BookIcon, Megaphone, ClipboardList, FileQuestion, type LucideIcon } from 'lucide-react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import ForbiddenPage from '@/components/ForbiddenPage';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NotFoundPage from '@/components/NotFoundPage';

interface Item {
  title: string;
  url: (url: string) => string;
  icon: LucideIcon
}

const items: Item[] = [
  {
    title: 'Inicio',
    url: ROUTES.COURSE_DETAIL,
    icon: HomeIcon
  },
  {
    title: 'Anuncios',
    url: ROUTES.COURSE_ANNOUNCEMENTS,
    icon: Megaphone
  },
  {
    title: 'Personas',
    url: ROUTES.COURSE_MEMBERS,
    icon: User2
  },
  {
    title: 'Tareas',
    url: ROUTES.COURSE_ASSIGNMENTS,
    icon: ClipboardList
  },
  {
    title: 'Módulos',
    url: ROUTES.COURSE_MODULES,
    icon: BookIcon
  },
  {
    title: 'Cuestionarios',
    url: ROUTES.COURSE_QUIZZES,
    icon: FileQuestion
  }
]

const CourseLayout = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const access = useCourseAccess(id)
  if (!id) return <NotFoundPage />

  if (!access) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <div className='space-y-3 flex flex-col items-center'>
          <LoadingSpinner size='md' />
          <h1 className='text-xl font-semibold'>Cargando curso...</h1>
        </div>
      </div>
    )
  }

  if (!access.canView) {
    return <ForbiddenPage />
  }

  return (
    <div className="flex md:flex-row flex-col min-h-full items-stretch">   
      <div className="md:w-62 w-full p-4 flex justify-center flex-wrap md:block gap-2">
        {items.map((item, index) => {
          const url = item.url(id)
          const active = location.pathname === url

          return (
            <Link to={url} key={index}>
              <div
                className={`flex items-center gap-1 p-2 rounded-md
                  hover:bg-sidebar-accent
                  ${active && 'bg-sidebar-accent' }`}
              >
                <item.icon size={17} />
                <span className="text-sm">{item.title}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="w-full p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default CourseLayout
