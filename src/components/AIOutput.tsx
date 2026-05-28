import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";

export function AIOutput({
  content,
  loading,
  placeholder = "Your AI-generated output will appear here.",
}: {
  content: string;
  loading: boolean;
  placeholder?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-lg border bg-card min-h-[300px] p-5">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating…
        </div>
      ) : content ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="absolute top-3 right-3"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <div className="text-sm leading-relaxed pr-20 space-y-2">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mt-4 mb-2">{children}</h2>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1">{children}</ul>
                ),
                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                p: ({ children }) => <p className="mb-2">{children}</p>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
}
