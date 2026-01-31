import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUserProps {
    src?: string;
    firstName: string;
    lastName: string;
}

export const AvatarUser = ({ src, firstName, lastName }: AvatarUserProps) => {
    return (
        <Avatar>
            <AvatarImage src={src} />
            <AvatarFallback>
                {firstName && lastName ? `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}` : ''}
            </AvatarFallback>
        </Avatar>
    )

}

