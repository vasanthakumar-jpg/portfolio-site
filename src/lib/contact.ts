// This is the public contact address already displayed in the portfolio.
export const CONTACT_EMAIL = "vasanthakumar141099@gmail.com";
export const COMPOSE_COOLDOWN_MS = 1500;

export interface ContactDraft {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5000,
} as const;

export function normalizeContactDraft(draft: ContactDraft): ContactDraft {
  return {
    name: draft.name.trim(),
    email: draft.email.trim(),
    subject: draft.subject.trim(),
    message: draft.message.trim(),
  };
}

function isValidEmail(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2 || email.length > CONTACT_LIMITS.email) return false;
  const [local, domain] = parts;
  const labels = domain.split(".");
  return local.length > 0 && local.length <= 64
    && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
    && !local.startsWith(".") && !local.endsWith(".") && !local.includes("..")
    && labels.length >= 2
    && labels.every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label));
}

export function validateContactDraft(input: ContactDraft): ContactErrors {
  const draft = normalizeContactDraft(input);
  const errors: ContactErrors = {};

  if (!draft.name) errors.name = "Name is required";
  else if (draft.name.length < 2) errors.name = "Name must be at least 2 characters";
  else if (draft.name.length > CONTACT_LIMITS.name) errors.name = "Name must be 120 characters or fewer";

  if (!draft.email) errors.email = "Email is required";
  else if (!isValidEmail(draft.email))
    errors.email = "Please enter a valid email address";

  if (!draft.subject) errors.subject = "Subject is required";
  else if (/[\r\n]/.test(draft.subject)) errors.subject = "Subject must be a single line";
  else if (draft.subject.length > CONTACT_LIMITS.subject) errors.subject = "Subject must be 200 characters or fewer";

  if (!draft.message) errors.message = "Message is required";
  else if (draft.message.length < 10) errors.message = "Message must be at least 10 characters";
  else if (draft.message.length > CONTACT_LIMITS.message) errors.message = "Message must be 5000 characters or fewer";

  return errors;
}

export function createComposeLinks(input: ContactDraft) {
  const draft = normalizeContactDraft(input);
  const body = `Name: ${draft.name}\r\nEmail: ${draft.email}\r\n\r\nMessage:\r\n${draft.message}`;
  const recipient = encodeURIComponent(CONTACT_EMAIL);
  const subject = encodeURIComponent(draft.subject);
  const encodedBody = encodeURIComponent(body);

  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${encodedBody}`,
    mailto: `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodedBody}`,
  };
}
