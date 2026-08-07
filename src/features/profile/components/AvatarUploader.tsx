import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useUploadAvatar } from '../hooks/useProfile';

export function AvatarUploader({ avatarUrl, initials }: { avatarUrl: string | null; initials: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadAvatar();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    upload(file, { onSettled: () => setPreview(null) });
  }

  return (
    <div className="relative w-24 h-24">
      <Avatar className="w-24 h-24">
        <AvatarImage src={preview ?? avatarUrl ?? undefined} />
        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
      </Avatar>
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
      </Button>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
    </div>
  );
}