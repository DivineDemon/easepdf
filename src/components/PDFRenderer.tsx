"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import "react-pdf/dist/Page/TextLayer.css";
import PDFFullScreen from "./PDFFullScreen";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import z from "zod";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResizeDetector } from "react-resize-detector";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFRenderer({ url }: { url: string }) {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [pages, setPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => parseInt(num) > 0 && parseInt(num) <= pages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            variant="ghost"
            aria-label="previous page"
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage - 1));
            }}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{pages ?? "#"}</span>
            </p>
          </div>
          <Button
            disabled={pages === undefined || currentPage === pages}
            variant="ghost"
            aria-label="next page"
            onClick={() => {
              setCurrentPage((prev) => (prev + 1 > pages! ? pages! : prev + 1));
              setValue("page", String(currentPage + 1));
            }}>
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <Search className="w-4 h-4" />
                {scale * 100}%<ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label="rotate 90 degrees clockwise"
            variant="ghost">
            <RotateCw className="w-4 h-4" />
          </Button>
          <PDFFullScreen url={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
              file={url}
              className="max-h-full">
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                key={"@" + scale}
                className={cn(isLoading ? "hidden" : "")}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 2-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
