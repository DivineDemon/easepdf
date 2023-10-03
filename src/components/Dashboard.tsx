"use client";

import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import { getUserSubscriptionPlan } from "@/lib/stripe";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";

const MessageCount = ({ fileId }: { fileId: string }) => {
  const { data } = trpc.getFileMessagesCount.useQuery({
    fileId: fileId,
  });

  return (
    <div className="flex items-center gap-2">
      <MessageSquare className="w-4 h-4" />
      {data?.count}
    </div>
  );
};

export default function Dashboard({
  subscriptionPlan,
}: {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}) {
  const utils = trpc.useContext();
  const [deletedFile, setDeletedFile] = useState<string | null>(null);

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setDeletedFile(id);
    },
    onSettled: () => {
      setDeletedFile(null);
    },
  });
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>
                  <MessageCount fileId={file.id} />
                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteFile({ id: file.id })}>
                    {deletedFile === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="w-8 h-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here!</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
}
