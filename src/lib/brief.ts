import { services } from "../data/content.ts";

export function interestFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  const values = params.getAll("interest");
  return values.length === 1 &&
    services.some((service) => service.slug === values[0])
    ? values[0]
    : "";
}

export type Brief = {
  name: string;
  business: string;
  reply: string;
  message: string;
  interest: string;
};
export type BriefErrors = Partial<Record<keyof Brief, string>>;

export function validateBrief(input: Partial<Brief>): {
  valid: boolean;
  values: Brief;
  errors: BriefErrors;
} {
  const values: Brief = {
    name: typeof input.name === "string" ? input.name.trim() : "",
    business: typeof input.business === "string" ? input.business.trim() : "",
    reply: typeof input.reply === "string" ? input.reply.trim() : "",
    message: typeof input.message === "string" ? input.message.trim() : "",
    interest: services.some((service) => service.slug === input.interest)
      ? input.interest!
      : "",
  };
  const errors: BriefErrors = {};
  if (values.name.length < 2)
    errors.name = "Enter your name (at least 2 characters).";
  if (values.business.length < 2)
    errors.business =
      "Enter your business or project name (at least 2 characters).";
  const email =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/u.test(
      values.reply,
    ) && !/(^\.|\.\.|\.@)/u.test(values.reply);
  const phone =
    /^\+?[\d ().-]+$/u.test(values.reply) &&
    /^\d{7,15}$/u.test(values.reply.replace(/\D/g, ""));
  if (!email && !phone)
    errors.reply =
      "Enter a valid email address or phone number with 7–15 digits.";
  if (values.message.length < 20)
    errors.message = "Describe the change you need in at least 20 characters.";
  const limits: Record<keyof Brief, number> = {
    name: 100,
    business: 160,
    reply: 160,
    message: 4000,
    interest: 64,
  };
  for (const field of ["name", "business", "reply", "message"] as const) {
    if (values[field].length > limits[field])
      errors[field] = `Use no more than ${limits[field]} characters.`;
    const forbidden =
      field === "message"
        ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u
        : /[\u0000-\u001f\u007f]/u;
    if (forbidden.test(values[field]))
      errors[field] =
        "Remove control characters or line breaks from this field.";
  }
  values.message = values.message.replace(/\r\n?/g, "\n");
  return { valid: Object.keys(errors).length === 0, values, errors };
}

export function formatBrief(input: Brief): string {
  const { valid, values } = validateBrief(input);
  if (!valid) throw new Error("A valid brief is required before export.");
  const service = services.find((service) => service.slug === values.interest);
  return [
    "REACHLY — PROJECT BRIEF",
    "Prepared locally. Not sent to Reachly.",
    "",
    `Name: ${values.name}`,
    `Business / project: ${values.business}`,
    `Reply via: ${values.reply}`,
    `Interest: ${service?.name ?? "Not sure yet"}`,
    "",
    "What needs to change:",
    values.message,
    "",
    "Share only through a contact channel you have independently verified.",
    "",
  ].join("\n");
}
