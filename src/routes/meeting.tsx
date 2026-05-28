import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader, Disclaimer } from "@/components/AppLayout";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/api/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/meeting")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer" }] }),
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (notes.trim().length < 10) {
      toast.error("Please paste meeting notes (at least 10 characters)");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await summarizeMeeting({ data: { notes } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Extract key points, action items, decisions, and deadlines."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes or transcript</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder="Paste your meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={onRun} disabled={loading} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Summarizing…" : "Summarize Meeting"}
          </Button>
          <Disclaimer />
        </div>
        <div>
          <AIOutput
            content={output}
            loading={loading}
            placeholder="Structured summary with key points and action items will appear here."
          />
        </div>
      </div>
    </AppLayout>
  );
}
