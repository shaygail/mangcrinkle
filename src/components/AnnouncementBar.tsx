interface AnnouncementBarProps {
  text: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-mang-brown text-mang-cream text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wide line-clamp-2">
      {text}
    </div>
  );
}
