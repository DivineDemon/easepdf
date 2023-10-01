"use client";

import Loading from "./Loading";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { buttonVariants } from "../ui/button";

import Link from "next/link";
import { ChevronLeft, XCircle } from "lucide-react";
import { ChatContextProvider } from "./ChatContext";

export default function ChatWrapper({ fileid }: { fileid: string }) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileid },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <Loading title="Loading..." text="We're preparing your PDF." />
        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <Loading title="Processing PDF..." text="This won't take long." />
        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <h3 className="font-semibold text-xl">
              Too many pages in the PDF.
            </h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports upto
              5 pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}>
              <ChevronLeft className="w-3 h-3 mr-1.5" /> Back
            </Link>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <ChatContextProvider fileid={fileid}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-500 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}
