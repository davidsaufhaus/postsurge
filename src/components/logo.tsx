export function PostSurgeLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { container: "h-8 px-3", text: "text-sm" },
    md: { container: "h-10 px-4", text: "text-base" },
    lg: { container: "h-14 px-6", text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-[#0d1f3c] font-bold tracking-tight shadow-lg ${s.container} ${s.text}`}
    >
      <span className="text-white">Post</span>
      <span className="text-[#60bffa]">Surge</span>
    </span>
  );
}
