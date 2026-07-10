import { saveClient } from "@/lib/actions";
import { clientStatuses } from "@/lib/constants";
import type { Client } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ClientForm({ client }: { client?: Client }) {
  return (
    <form action={saveClient} className="grid gap-4 md:grid-cols-2">
      {client ? <input type="hidden" name="id" value={client.id} /> : null}
      <Field label="Client name">
        <Input name="name" defaultValue={client?.name ?? ""} required />
      </Field>
      <Field label="Industry">
        <Input name="industry" defaultValue={client?.industry ?? ""} />
      </Field>
      <Field label="Contact person">
        <Input name="contact_name" defaultValue={client?.contact_name ?? ""} />
      </Field>
      <Field label="Contact email">
        <Input name="contact_email" type="email" defaultValue={client?.contact_email ?? ""} />
      </Field>
      <Field label="Contact phone">
        <Input name="contact_phone" defaultValue={client?.contact_phone ?? ""} />
      </Field>
      <Field label="Account manager">
        <Input name="account_manager" defaultValue={client?.account_manager ?? ""} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={client?.status ?? "Active"} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm">
          {clientStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Notes">
          <Textarea name="notes" defaultValue={client?.notes ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{client ? "Save client" : "Add client"}</Button>
      </div>
    </form>
  );
}
