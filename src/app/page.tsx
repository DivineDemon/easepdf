import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Steps from "@/components/Steps";
import Wrapper from "@/components/Wrapper";
import Decorator from "@/components/Decorator";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  const listItems = [
    {
      step: 1,
      title: "Sign up for an Account",
      text: "Either starting out with a free plan or choose our",
      linkText: "pro plan.",
    },
    {
      step: 2,
      title: "Upload your PDF File",
      text: "We'll process your file and make it ready for you to chat with.",
    },
    {
      step: 3,
      title: "Start asking questions",
      text: "It's that simple. Try out EasePDF today - it really takes less than a minute.",
    },
  ];

  return (
    <>
      <Wrapper className="mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-background px-7 py-2 shadow-md backdrop-blur transition-all">
          <p className="text-sm font-semibold text-foreground cursor-default">
            EasePDF is now live!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-primary">Documents</span> in
          Seconds
        </h1>
        <p className="mt-5 max-w-prose text-foreground sm:text-xl text-base">
          EasePDF allows you to have conversations with any PDF Document. Simply
          upload your file and start asking questions right away!
        </p>
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
          href="/dashboard"
          target="_blank">
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Wrapper>

      <div className="relative isolate">
        <Decorator left="11rem" smLeft="30rem" />

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/dashboard-preview.jpg"
                alt="product preview"
                width={1364}
                height={866}
                quality={100}
                priority
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>

        <Decorator left="13rem" smLeft="36rem" />
      </div>

      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
              Start Chatting in Minutes!
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting with your PDF Files has never been easier than with
              EasePDF.
            </p>
          </div>
        </div>

        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          {listItems.map((item) => (
            <Steps
              key={item.step}
              step={item.step}
              text={item.text}
              title={item.title}
              linkText={item.linkText}
            />
          ))}
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                priority
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
