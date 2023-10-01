import { Loader2 } from "lucide-react";

export default function Loading({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex-1 flex justify-center items-center flex-col mb-28">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-sm text-zinc-500">{text}</p>
      </div>
    </div>
  );
}
