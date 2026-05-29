import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ListChecks } from "lucide-react";

type Task = { id: string; text: string; done: boolean; date: string };

const STORAGE_KEY = "today-tasks";
const todayKey = () => new Date().toISOString().slice(0, 10);

export function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        setTasks(parsed.filter((t) => t.date === todayKey()));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore */
    }
  }, [tasks]);

  const addTask = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed.slice(0, 200), done: false, date: todayKey() },
    ]);
    setText("");
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ListChecks className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Today's Tasks</h2>
            <p className="text-xs text-muted-foreground">
              {tasks.length === 0
                ? "Nothing planned yet."
                : `${remaining} of ${tasks.length} remaining`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Add a task for today…"
          value={text}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} size="icon" aria-label="Add task">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tasks.length > 0 && (
        <ul className="space-y-1">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/50 group"
            >
              <Checkbox
                checked={t.done}
                onCheckedChange={() => toggle(t.id)}
                aria-label={`Mark "${t.text}" as ${t.done ? "incomplete" : "complete"}`}
              />
              <span
                className={
                  "flex-1 text-sm " +
                  (t.done ? "line-through text-muted-foreground" : "text-foreground")
                }
              >
                {t.text}
              </span>
              <button
                onClick={() => remove(t.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Remove task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
