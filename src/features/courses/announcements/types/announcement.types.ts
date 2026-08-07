import type { User } from "@/shared/types";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  authorId: string;
  author: User;
  isPinned: boolean;
  createdAt: Date;
  updateAt: Date;
}