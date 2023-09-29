import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Wrapper from "@/components/Wrapper";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <Wrapper className="mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-gray-700">
          EasePDF is now live!
        </p>
      </div>
      <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        Chat with your <span className="text-blue-600">Documents</span> in
        Seconds
      </h1>
      <p className="mt-5 max-w-prose text-zinc-700 sm:text-xl text-base">
        EasePDF allows you to have conversations with any PDF Document. Simply
        upload your file and start asking questions right away!
      </p>
      <Link href="/dashboard" target="_blank" className={buttonVariants()}>
        Get Started <ArrowRight className="h-5 w-5 ml-2" />
      </Link>
    </Wrapper>
  );
}
