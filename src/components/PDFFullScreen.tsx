import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Expand, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFFullScreen({ url }: { url: string }) {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
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
              {new Array(pages).fill(0).map((_, idx) => (
                <Page
                  key={idx}
                  width={width ? width : 1}
                  pageNumber={idx + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
