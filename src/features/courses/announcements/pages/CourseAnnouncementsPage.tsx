import AnnouncementsList from "@/features/courses/announcements/components/AnnouncementsList";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { useParams } from "react-router-dom";

export default function CourseAnnouncementsPage() {
  const { id: courseId } = useParams();
  
  const access = useCourseAccess(courseId);
  
  return (
    <div className="space-y-6">
      <AnnouncementsList courseId={courseId!} access={access?.isOwner}/>
      
    </div>
  )
}
