import { cn } from "@/lib/utils";

export default function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-2xl items-center justify-center gap-1 inline-flex border transition-colors select-none",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        { "cursor-pointer": !!onClick }
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
