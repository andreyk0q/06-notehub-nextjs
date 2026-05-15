import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

interface NotesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

const allowedTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tagFromUrl = slug?.[0];

  const tag =
    tagFromUrl && allowedTags.includes(tagFromUrl as NoteTag)
      ? (tagFromUrl as NoteTag)
      : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}