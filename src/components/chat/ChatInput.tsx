import { Send } from "lucide-react";
import { useContext, useRef } from "react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatContext } from "./ChatContext";

export default function ChatInput({ isDisabled }: { isDisabled?: boolean }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                autoFocus
                maxRows={4}
                ref={textRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textRef.current?.focus();
                  }
                }}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  addMessage();
                  textRef.current?.focus();
                }}
                disabled={isLoading || isDisabled}
                className="absolute bottom-1 right-[8px]"
                aria-label="send message">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
