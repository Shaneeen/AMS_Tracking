"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Applicant } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const applicantColumns: ColumnDef<Applicant>[] = [
  { accessorKey: "full_name", header: "Applicant", cell: ({ row }) => <Link className="font-medium text-primary" href={`/applicants/${row.original.id}`}>{row.original.full_name}</Link> },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone ?? "-" },
  { accessorKey: "current_role", header: "Current role", cell: ({ row }) => row.original.current_role ?? "-" },
  { accessorKey: "expected_salary", header: "Expected salary", cell: ({ row }) => formatCurrency(row.original.expected_salary) },
  { accessorKey: "notice_period", header: "Notice", cell: ({ row }) => row.original.notice_period ?? "-" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link href={`/applicants/${row.original.id}`}>View</Link>
      </Button>
    )
  }
];
