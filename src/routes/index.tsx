import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { TodayTasks } from "@/components/TodayTasks";

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

const quotes = [
  "Your focus determines your reality.",
  "Small steps every day lead to big results.",
  "Progress, not perfection.",
  "You are capable of amazing things.",
  "Clarity comes from action, not thought.",
  "Stay patient and trust your journey.",
  "What you do today can improve all your tomorrows.",
  "Effort is the path to mastery.",
  "Your only limit is you.",
  "Believe you can and you're halfway there.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Act as if what you do makes a difference. It does.",
  "Start where you are. Use what you have. Do what you can.",
  "Everything you've ever wanted is on the other side of fear.",
  "Dream big and dare to fail.",
  "It always seems impossible until it's done.",
  "The best way to predict the future is to create it.",
  "Your time is limited, so don't waste it living someone else's life.",
  "Do something today that your future self will thank you for.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Don't be pushed around by the fears in your mind.",
  "We generate fears while we sit. We overcome them by action.",
  "Light tomorrow with today.",
  "You don't have to be great to start, but you have to start to be great.",
  "A goal without a plan is just a wish.",
  "Focus on being productive instead of busy.",
  "The only way to do great work is to love what you do.",
  "Discipline is the bridge between goals and accomplishment.",
  "Opportunities don't happen. You create them.",
  "Quality means doing it right when no one is looking.",
  "Don't count the days, make the days count.",
  "If you want to achieve greatness stop asking for permission.",
  "Work hard in silence, let success be your noise.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Don't be afraid to give up the good to go for the great.",
  "I find that the harder I work, the more luck I seem to have.",
  "There are no shortcuts to any place worth going.",
  "Try not to become a person of success, but rather a person of value.",
  "Either you run the day, or the day runs you.",
  "The future depends on what you do today.",
  "Nothing will work unless you do.",
  "The best preparation for tomorrow is doing your best today.",
  "You are never too old to set another goal or to dream a new dream.",
  "Change your thoughts and you change your world.",
  "Happiness depends upon ourselves.",
  "Turn your wounds into wisdom.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything has beauty, but not everyone sees it.",
  "With the new day comes new strength and new thoughts.",
  "The only journey is the one within.",
  "What we think, we become.",
  "Strive not to be a success, but rather to be of value.",
  "Be the change that you wish to see in the world.",
  "In the middle of difficulty lies opportunity.",
  "Well done is better than well said.",
  "He who has a why to live can bear almost any how.",
  "Make each day your masterpiece.",
  "Life is 10% what happens to us and 90% how we react to it.",
  "The mind is everything. What you think you become.",
  "An unexamined life is not worth living.",
  "Knowing yourself is the beginning of all wisdom.",
];

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function DailyQuote() {
  const quote = quotes[getDayOfYear(new Date()) % quotes.length];
  return (
    <div className="rounded-lg border bg-card p-5 mb-6">
      <p className="text-sm text-muted-foreground italic">"{quote}"</p>
    </div>
  );
}

function Dashboard() {
  return (
    <AppLayout>
      <PageHeader
        title="Welcome back"
        description="Start your day with focus and intention."
      />
      <DailyQuote />
      <div className="mb-8">
        <TodayTasks />
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
