import { Button } from "@/components/ui/button";
import AnnouncementsList from "@/features/courses/announcements/components/AnnouncementsList";
import CreateAnnouncement from "@/features/courses/announcements/components/CreateAnnouncement";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseAnnouncementsPage() {
  const { id: courseId } = useParams();
  if (!courseId) return null;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const toggle = () => setOpenModal(prev => !prev)
  const access = useCourseAccess(courseId);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Anuncios</h1>
        {access?.isOwner && (
          <Button onClick={toggle}><Plus/> Nuevo anuncio</Button>
        )}
        
      </div>
      <AnnouncementsList courseId={courseId} access={access?.isOwner}/>

      <CreateAnnouncement
        courseId={courseId}
        open={openModal}
        onOpenChange={setOpenModal}
      />
    </div>
  )
}
