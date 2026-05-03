import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  name: string;
  role?: string;
  hideText?: boolean;
  className?: string;
};

export function Avatar({ src, name, role, hideText, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  const avatarCircle = (
    <div className={cn(
      "relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-slate-200/40 bg-white shadow-sm ring-1 ring-slate-200/20 group",
      hideText && className
    )}>
      {src || name ? (
        <Image
          src={src || "/avatar.png"}
          alt={name}
          fill
          sizes="100px"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 bg-slate-100"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
          {initials}
        </div>
      )}
    </div>
  );

  if (hideText) return avatarCircle;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {avatarCircle}
      <div className="hidden text-left sm:block">
        <p className="text-[13px] font-bold tracking-tight text-slate-800 leading-none mb-0.5">{name}</p>
        {role ? <p className="text-[10px] font-medium text-slate-400/80 uppercase tracking-[0.2em]">{role}</p> : null}
      </div>
    </div>
  );
}
