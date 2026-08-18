import { useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
}

type InputFieldProps = BaseProps & { as?: "input" } & InputHTMLAttributes<HTMLInputElement>;
type TextareaFieldProps = BaseProps & { as: "textarea" } & TextareaHTMLAttributes<HTMLTextAreaElement>;

type FormFieldProps = InputFieldProps | TextareaFieldProps;

const fieldClasses =
  "w-full border-0 border-b-2 border-structure/50 bg-transparent py-2.5 font-sans text-base text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-signal dark:border-structure-dark/50 dark:text-ink-dark dark:placeholder:text-ink-dark/40 dark:focus:border-signal-dark";

/**
 * Shared accessible pattern for every input on the site: visible label,
 * bottom-border-only field (the "orange focus underline = live" rule),
 * and an inline error tied via aria-describedby instead of a toast.
 */
export function FormField(props: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const { label, error, as = "input", className = "", ...rest } = props as FormFieldProps & {
    className?: string;
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-mono text-xs tracking-wide text-ink/60 dark:text-ink-dark/60">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${fieldClasses} resize-none ${className}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${fieldClasses} ${className}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 font-mono text-xs text-signal dark:text-signal-dark">
          {error}
        </p>
      )}
    </div>
  );
}