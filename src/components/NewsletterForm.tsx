/** Footer newsletter (Ft7). Renders the seeded `Newsletter` form.
 *
 *  Deliberately NOT <BcmsForm>: this is a one-field inline row (label · input · button) for the
 *  footer, not that component's stacked field list, and it owns its own aria-live status copy. */
import { useState, type FormEvent } from "react";
import type { DeliveryForm } from "@bettercms-ai/sdk";
import { API_URL } from "../lib/config";

type Status = { text: string; ok: boolean } | null;

export function NewsletterForm({ form }: { form: DeliveryForm }) {
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const action = `${API_URL}/api/v1/forms/public/${encodeURIComponent(form.id)}/submissions`;
  const email = form.fields?.find((f) => f.type === "email");
  const emailKey = email?.key ?? "email";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    if (!el.reportValidity()) return;
    const data: Record<string, string> = {};
    new FormData(el).forEach((v, k) => {
      data[k] = String(v);
    });
    setBusy(true);
    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      el.reset();
      setStatus({ text: form.successMessage ?? "Thanks — you're subscribed.", ok: true });
    } catch {
      setStatus({ text: "Something went wrong. Please try again.", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter" method="post" action={action} onSubmit={onSubmit}>
      <label className="newsletter-label" htmlFor="newsletter-email">
        {email?.label ?? "Subscribe"}
      </label>
      <div className="newsletter-row">
        <input
          id="newsletter-email"
          type="email"
          name={emailKey}
          required
          placeholder={email?.placeholder ?? "you@company.com"}
          autoComplete="email"
        />
        <button type="submit" disabled={busy}>
          {form.submitLabel || "Subscribe"}
        </button>
      </div>
      {form.honeypotField && (
        <input
          type="text"
          name={form.honeypotField}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: "absolute", left: "-9999px" }}
          aria-hidden="true"
        />
      )}
      {/* aria-live so the outcome reaches a screen reader — it's the only feedback there is. */}
      <p
        className={`newsletter-msg ${status ? (status.ok ? "newsletter-msg--ok" : "newsletter-msg--err") : ""}`}
        role="status"
        aria-live="polite"
        hidden={!status}
      >
        {status?.text}
      </p>
    </form>
  );
}
