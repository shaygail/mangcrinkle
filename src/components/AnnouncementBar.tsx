interface AnnouncementBarProps {
  text: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-mang-brown text-mang-cream text-center py-2 text-sm font-semibold tracking-wide">
      {text}
    </div>
  );
}
