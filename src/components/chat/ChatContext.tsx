import { trpc } from "@/app/_trpc/client";
import { useToast } from "../ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useRef, useState } from "react";

type StreamResponse = {
  message: string;
  isLoading: boolean;
  addMessage: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const ChatContext = createContext<StreamResponse>({
  message: "",
  isLoading: false,
  addMessage: () => {},
  handleInputChange: () => {},
});

export const ChatContextProvider = ({
  fileId,
  children,
}: {
  fileId: string;
  children: ReactNode;
}) => {
  const { toast } = useToast();
  const backupMessage = useRef("");
  const utils = trpc.useContext();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // No TRPC, Since Streaming doesn't Work with TRPC
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to Send Message!");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.getFileMessages.cancel();
      const previousMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...oldData.pages];
          let latestPage = newPages[0]!;
          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem sending this message.",
          description: "Please refresh this page and try again.",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let isDone = false;

      let accumulatedResponse = "";
      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        const chunkValue = decoder.decode(value);

        accumulatedResponse += chunkValue;
        utils.getFileMessages.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (oldData) => {
            if (!oldData) {
              return {
                pages: [],
                pageParams: [],
              };
            }

            let isAiResponseCreated = oldData.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            let updatedPages = oldData.pages.map((page) => {
              if (page === oldData.pages[0]) {
                let updatedMessages = null;
                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accumulatedResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accumulatedResponse,
                      };
                    }

                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        {
          messages: context?.previousMessages ?? [],
        }
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => sendMessage({ message });
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        isLoading,
        addMessage,
        handleInputChange,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
