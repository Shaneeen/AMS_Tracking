"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Client } from "@/lib/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => <Link className="font-medium text-primary" href={`/clients/${row.original.id}`}>{row.original.name}</Link>
  },
  { accessorKey: "industry", header: "Industry", cell: ({ row }) => row.original.industry ?? "-" },
  { accessorKey: "contact_name", header: "Contact" },
  { accessorKey: "account_manager", header: "Account manager", cell: ({ row }) => row.original.account_manager ?? "-" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link href={`/clients/${row.original.id}`}>View</Link>
      </Button>
    )
  }
];
