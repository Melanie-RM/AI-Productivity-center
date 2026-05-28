import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppLayout, PageHeader, Disclaimer } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { chatComplete } from "@/lib/api/ai.functions";
import { Send, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatComplete({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="AI Chat" description="Conversational assistant for anything else." />
      <div className="rounded-lg border bg-card flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm">Ask me anything to get started.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                {m.role === "user" ? (
                  <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>
        <div className="border-t p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message the assistant…"
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Disclaimer />
        </div>
      </div>
    </AppLayout>
  );
}
