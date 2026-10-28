interface AnnouncementBarProps {
  text: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  if (!text.trim()) return null;

  return (
    <div className="bg-mang-brown text-mang-cream text-center py-2.5 px-4 text-[11px] sm:text-xs font-semibold tracking-[0.5px] uppercase line-clamp-2">
      {text}
    </div>
  );
}
