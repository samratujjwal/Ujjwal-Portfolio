import { useState, type FormEvent } from "react";
import { Container } from "@/components/layout/Container";
import { FormField } from "@/components/ui/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Edit with real links.
const CONTACT_LINKS = [
  { label: "Email", href: "mailto:ujjawalmaurya45@gmail.com" },
  { label: "GitHub", href: "https://github.com/samratujjwal" },
  { label: "LeetCode", href: "https://leetcode.com/u/samratujjwal" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ujjwalmaurya45" },
  { label: "Resume", href: "/Ujjwal_Maurya_Resume.pdf", download: true },
];

type Status = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  email?: string;
  message?: string;
}

export function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!email.trim()) next.email = "Enter your email so I can reply.";
    else if (!EMAIL_PATTERN.test(email)) next.email = "That doesn't look like a valid email.";
    if (!message.trim()) next.message = "Add a short message.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="contact" aria-labelledby="contact-heading" className="pt-24 pb-24 md:pt-32 md:pb-40">
        <Container className="max-w-lg text-center">
          <h2 id="contact-heading" className="font-serif text-3xl md:text-4xl">
            Message sent.
          </h2>
          <p className="mt-4 font-sans text-ink/70 dark:text-ink-dark/70">
            I'll get back to you soon — thanks for reaching out.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="pt-24 pb-24 md:pt-32 md:pb-40">
      <Container className="max-w-lg">
        <p className="mb-10 font-mono text-xs tracking-wide text-structure dark:text-structure-dark">
          06 / Contact
        </p>

        <h2 id="contact-heading" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          Let's build something real-time.
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-6">
          <FormField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <FormField
            as="textarea"
            label="Message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.message}
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex w-fit items-center gap-2 font-sans text-[15px] font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal disabled:opacity-50 dark:text-ink-dark dark:hover:text-signal-dark"
          >
            {status === "submitting" ? "Sending…" : "Send →"}
          </button>

          {status === "error" && (
            <p role="alert" className="font-mono text-xs text-signal dark:text-signal-dark">
              Something went wrong — try again, or use the email link below.
            </p>
          )}
        </form>

        <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-structure/15 pt-6 dark:border-structure-dark/15">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                download={link.download}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="font-mono text-xs text-ink/60 underline decoration-structure/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-signal dark:text-ink-dark/60 dark:hover:text-ink-dark dark:hover:decoration-signal-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}