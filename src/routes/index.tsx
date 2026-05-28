import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate emails, meeting notes, task planning, research, and chat with AI built for professionals.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    title: "Smart Email Generator",
    desc: "Draft polished emails tuned to your tone and audience.",
    icon: Mail,
  },
  {
    to: "/meeting",
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into key points, actions, and deadlines.",
    icon: FileText,
  },
  {
    to: "/tasks",
    title: "AI Task Planner",
    desc: "Prioritize and schedule your day with the Eisenhower Matrix.",
    icon: ListChecks,
  },
  {
    to: "/research",
    title: "AI Research Assistant",
    desc: "Get structured insights and summaries on any topic.",
    icon: Search,
  },
  {
    to: "/chat",
    title: "AI Chat",
    desc: "A conversational assistant for anything else you need.",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  return (
    <AppLayout>
      <PageHeader
        title="Welcome back"
        description="Your AI productivity suite — pick a tool to get started."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold mb-1">About this assistant</h2>
        <p className="text-sm text-muted-foreground">
          Built on Lovable AI with structured prompt engineering for each workflow.
          AI-generated content may require human review.
        </p>
      </div>
    </AppLayout>
  );
}
