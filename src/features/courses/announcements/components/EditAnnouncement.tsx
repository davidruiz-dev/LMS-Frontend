import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { useEditAnnouncement } from "@/features/courses/hooks/use-announcements";
import { EditAnnouncementSchema, type EditAnnouncement } from "@/features/courses/announcements/schemas/announcements.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { Unlock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { Announcement } from "@/features/courses/announcements/types/announcement.types";

interface EditAnnouncementProps {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    announcement: Announcement;
}

export default function EditAnnouncement({ courseId, open, onOpenChange, announcement }: EditAnnouncementProps) {
    const form = useForm<EditAnnouncement>({
        resolver: zodResolver(EditAnnouncementSchema),
        defaultValues: {
            title: announcement.title,
            content: announcement.content,
            isPublished: announcement.isPublished
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: announcement.title,
                content: announcement.content,
                isPublished: announcement.isPublished
            });
        }
    }, [open, announcement, form]);

    const editAnnouncement = useEditAnnouncement();

    const onSubmit = async (data: EditAnnouncement) => {
        await editAnnouncement.mutateAsync({ courseId, announcementId: announcement.id, data })
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-3xl"
            >
                <DialogHeader>
                    <DialogTitle>Editar anuncio</DialogTitle>
                    <DialogDescription>Completa todos los campos requeridos.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenido</FormLabel>
                                    <FormControl>
                                        <Editor
                                            apiKey='irfl7e6itq24e0fw7uevozwv6xgg8awfczpd11lto0vc22o3'
                                            init={{
                                                height: 300,
                                                plugins:
                                                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                                                toolbar:
                                                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                                fixed_toolbar_container: false,
                                                toolbar_mode: "sliding",
                                                ui_mode: "split",
                                            }}
                                            value={field.value}
                                            onEditorChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Item variant={'outline'}>
                            <ItemMedia>
                                <Unlock className="size-5" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>Publicar</ItemTitle>
                                <ItemDescription>Todos los alumnos podrán visualizar este anuncio.</ItemDescription>
                            </ItemContent>
                            <ItemContent>
                                <FormField
                                    control={form.control}
                                    name='isPublished'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Publicar</FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value}
                                                    onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </ItemContent>
                        </Item>

                        <DialogFooter>
                            <Button variant={"outline"} type="reset" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={editAnnouncement.isPending || !form.formState.isValid}>{editAnnouncement.isPending ? (
                                <><Spinner /> <span>guardando</span></>
                            ) : 'Editar anuncio'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
