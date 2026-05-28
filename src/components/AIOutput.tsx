import { useState } from "react";
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
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed pr-20">
            {content}
          </pre>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
}
