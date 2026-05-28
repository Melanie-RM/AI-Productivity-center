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
import { planTasks } from "@/lib/api/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("Today");
  const [customTimeframe, setCustomTimeframe] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (!tasks.trim()) {
      toast.error("Please list at least one task");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await planTasks({ data: { tasks, timeframe } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Task Planner"
        description="Prioritize and schedule your tasks using the Eisenhower Matrix."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={"Prepare Q3 board deck\nReply to investor email\nReview PR #482\nGym\n…"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe" className="w-full">
                <SelectValue placeholder="Select a timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                <SelectItem value="This week">This week</SelectItem>
                <SelectItem value="This month">This month</SelectItem>
                <SelectItem value="6 months">6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onRun} disabled={loading} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Planning…" : "Plan My Day"}
          </Button>
          <Disclaimer />
        </div>
        <div>
          <AIOutput
            content={output}
            loading={loading}
            placeholder="Prioritized plan with time blocks will appear here."
          />
        </div>
      </div>
    </AppLayout>
  );
}
