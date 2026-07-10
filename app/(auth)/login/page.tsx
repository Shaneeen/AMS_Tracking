"use client";

import { useFormState } from "react-dom";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [state, action] = useFormState(signIn, { error: null as string | null });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-medium text-secondary">Antares Management Services</p>
          <CardTitle>Sign in to AMS Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <Field label="Email">
              <Input name="email" type="email" autoComplete="email" required />
            </Field>
            <Field label="Password">
              <Input name="password" type="password" autoComplete="current-password" required />
            </Field>
            {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
