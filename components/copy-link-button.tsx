"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ value }: { value: string }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(value)}>
      <Copy className="h-4 w-4" />
      Copy link
    </Button>
  );
}
