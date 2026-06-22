import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
      >
        Abmelden
      </button>
    </form>
  );
}
