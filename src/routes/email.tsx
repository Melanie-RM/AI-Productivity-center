import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader, Disclaimer } from "@/components/AppLayout";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { generateEmail } from "@/lib/api/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!purpose || !audience) {
      toast.error("Purpose and audience are required");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await generateEmail({ data: { purpose, audience, tone, details } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        description="Draft emails tailored to your tone and audience."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Follow up after sales call"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Input
              id="audience"
              placeholder="e.g. Enterprise CTO"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Professional", "Friendly", "Formal", "Persuasive", "Concise", "Apologetic", "Enthusiastic"].map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              rows={5}
              placeholder="Context, key points to mention, etc."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
          <Disclaimer />
        </div>
        <div>
          <AIOutput content={output} loading={loading} placeholder="Your generated email will appear here." />
        </div>
      </div>
    </AppLayout>
  );
}
