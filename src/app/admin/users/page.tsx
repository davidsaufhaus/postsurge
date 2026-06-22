import { prisma } from "@/lib/prisma";
import { UserForm } from "./user-form";
import { UserRow } from "./user-row";

export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Nutzerverwaltung</h1>
      <UserForm />
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f5f5f7] text-xs uppercase tracking-wide text-[#86868b]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">E-Mail</th>
              <th className="px-4 py-3">Rolle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-6 text-center text-sm text-[#86868b]">Noch keine Nutzer angelegt.</p>
        )}
      </div>
    </div>
  );
}
