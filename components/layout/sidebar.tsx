import Link from "next/link";
import { BriefcaseBusiness, Building2, Gauge, Users } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/applicants", label: "Applicants", icon: Users },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness }
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-primary text-white lg:block">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div>
          <p className="text-sm text-white/70">Antares</p>
          <h1 className="font-semibold">AMS Tracking</h1>
        </div>
      </div>
      <nav className="space-y-1 p-4">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
