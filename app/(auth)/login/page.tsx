"use client";

import { useFormState } from "react-dom";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [state, action] = useFormState(signIn, { error: null as string | null });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Soft brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-semibold text-lg text-white shadow-sm">
            A
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-wide text-muted">Antares Management Services</p>
            <p className="text-lg font-semibold text-text">AMS Tracking</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-heading">Sign in</CardTitle>
            <CardDescription>Access the internal applicant tracking workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <Field label="Email">
                <Input name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Password">
                <Input name="password" type="password" autoComplete="current-password" required />
              </Field>
              {state.error ? (
                <p className="rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
                  {state.error}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
