"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Job } from "@/lib/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type JobRow = Job & { clients: { name: string } | null };

export const jobColumns: ColumnDef<JobRow>[] = [
  { accessorKey: "title", header: "Job", cell: ({ row }) => <Link className="font-medium text-primary" href={`/jobs/${row.original.id}`}>{row.original.title}</Link> },
  { header: "Client", cell: ({ row }) => row.original.clients?.name ?? "-" },
  { accessorKey: "location", header: "Location", cell: ({ row }) => row.original.location ?? "-" },
  { header: "Salary", cell: ({ row }) => `${formatCurrency(row.original.salary_min)} - ${formatCurrency(row.original.salary_max)}` },
  { accessorKey: "priority", header: "Priority", cell: ({ row }) => <Badge>{row.original.priority}</Badge> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm"><Link href={`/jobs/${row.original.id}`}>View</Link></Button>
        <Button asChild variant="secondary" size="sm"><Link href={`/jobs/${row.original.id}/tracker`}>Tracker</Link></Button>
      </div>
    )
  }
];
