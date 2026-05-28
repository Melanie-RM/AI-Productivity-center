import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader, Disclaimer } from "@/components/AppLayout";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { researchTopic } from "@/lib/api/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (topic.trim().length < 2) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await researchTopic({ data: { topic } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Research Assistant"
        description="Get structured briefings with insights, trends, and next steps."
      />
      <div className="rounded-lg border bg-card p-5 space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Research topic</Label>
          <Input
            id="topic"
            placeholder="e.g. AI adoption in mid-market B2B SaaS"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRun()}
          />
        </div>
        <Button onClick={onRun} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Researching…" : "Generate Briefing"}
        </Button>
        <Disclaimer />
      </div>
      <AIOutput
        content={output}
        loading={loading}
        placeholder="Your structured research briefing will appear here."
      />
    </AppLayout>
  );
}
