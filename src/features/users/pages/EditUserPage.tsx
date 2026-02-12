import { useParams } from "react-router-dom";
import UserForm from "@/features/users/components/UserForm";

export default function EditUserPage() {
      const { id } = useParams<{id: string}>();
    
    return (
        <div className="p-6 space-y-4">
            <UserForm userId={id} />
        </div>
    )
}
