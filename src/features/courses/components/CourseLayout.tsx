import { ROUTES } from '@/shared/constants/routes'
import { HomeIcon, User2, BookIcon, Megaphone, type LucideProps, ClipboardList } from 'lucide-react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import ForbiddenPage from '@/components/ForbiddenPage';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NotFoundPage from '@/components/NotFoundPage';


interface Item {
  title: string;
  url: (url: string) => string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const items: Item[] = [
  {
    title: 'Inicio',
    url: ROUTES.COURSE_DETAIL,
    icon: HomeIcon
  },
  {
    title: 'Miembros',
    url: ROUTES.COURSE_MEMBERS,
    icon: User2
  },
  {
    title: 'Tareas',
    url: ROUTES.COURSE_ASSIGNMENTS,
    icon: ClipboardList
  },
  {
    title: 'Contenido',
    url: ROUTES.COURSE_MODULES,
    icon: BookIcon
  },
  {
    title: 'Anuncios',
    url: ROUTES.COURSE_ANNOUNCEMENTS,
    icon: Megaphone
  }
]

const CourseLayout = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  if (!id) return <NotFoundPage />

  const access = useCourseAccess(id)

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
    <div className="p-6 space-y-4 flex gap-6 min-h-full items-stretch">
      <div className="w-[250px]">
        {items.map((item, index) => {
          const url = item.url(id)
          const active = location.pathname === url

          return (
            <Link to={url} key={index}>
              <div
                className={`flex items-center gap-1 p-2 rounded-md
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                  ${active ? 'dark:bg-neutral-800 bg-neutral-100' : ''}`}
              >
                <item.icon size={17} />
                <span className="text-sm">{item.title}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default CourseLayout
