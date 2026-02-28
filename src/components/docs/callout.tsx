import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  info: {
    icon: Info,
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    iconColor: "text-blue-400",
    title: "Info",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    iconColor: "text-amber-400",
    title: "Warning",
  },
  tip: {
    icon: Lightbulb,
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    iconColor: "text-violet-400",
    title: "Tip",
  },
} as const;

interface CalloutProps {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div className={cn("rounded-xl border p-4", v.border, v.bg, className)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", v.iconColor)} />
        <div className="min-w-0">
          <p className={cn("font-medium text-foreground", !title && "sr-only")}>
            {title || v.title}
          </p>
          <div className="mt-1 text-sm text-muted-foreground [&_a]:text-violet-400 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-violet-300 [&_code]:rounded [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
