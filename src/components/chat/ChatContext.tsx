import { useToast } from "../ui/use-toast";

import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useState } from "react";

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
