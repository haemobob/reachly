import {
  formatBrief,
  interestFromSearch,
  validateBrief,
} from "../lib/brief.ts";
import type { Brief, BriefErrors } from "../lib/brief.ts";

export function initializeContact(doc: Document = document): void {
  const form = doc.querySelector<HTMLFormElement>("#brief-form");
  const win = doc.defaultView;
  if (!form || !win || form.dataset.initialized) return;
  const fields = Object.fromEntries(
    ["name", "business", "reply", "message", "interest"].map((key) => [
      key,
      doc.getElementById(`brief-${key}`),
    ]),
  ) as Record<
    keyof Brief,
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  const prepare = doc.getElementById("brief-prepare") as HTMLButtonElement;
  const clear = doc.getElementById("brief-clear") as HTMLButtonElement;
  const review = doc.getElementById("brief-review")!;
  const preview = doc.getElementById("brief-preview") as HTMLTextAreaElement;
  const summary = doc.getElementById("brief-errors")!;
  const status = doc.getElementById("brief-status")!;
  form.dataset.initialized = "true";
  form.noValidate = true;
  fields.interest.value = interestFromSearch(win.location.search);

  const read = (): Brief =>
    Object.fromEntries(
      Object.entries(fields).map(([key, field]) => [key, field.value]),
    ) as Brief;
  const showErrors = (errors: BriefErrors): void => {
    summary.replaceChildren();
    summary.hidden = Object.keys(errors).length === 0;
    for (const key of ["name", "business", "reply", "message"] as const) {
      const message = errors[key] ?? "";
      doc.getElementById(`brief-${key}-error`)!.textContent = message;
      fields[key].setCustomValidity(message);
      if (message) fields[key].setAttribute("aria-invalid", "true");
      else fields[key].removeAttribute("aria-invalid");
    }
    if (summary.hidden) return;
    const heading = doc.createElement("p");
    heading.textContent =
      "Please check these details. Your entries have been kept.";
    summary.append(heading);
    const list = doc.createElement("ul");
    for (const [key, message] of Object.entries(errors)) {
      const item = doc.createElement("li");
      const link = doc.createElement("a");
      link.href = `#brief-${key}`;
      link.textContent = message!;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        fields[key as keyof Brief].focus();
      });
      item.append(link);
      list.append(item);
    }
    summary.append(list);
  };
  const prepareReview = (): void => {
    const result = validateBrief(read());
    showErrors(result.errors);
    if (!result.valid) {
      review.hidden = true;
      preview.value = "";
      status.textContent =
        "Please correct the highlighted fields. Nothing has been sent.";
      summary.focus();
      return;
    }
    preview.value = formatBrief(result.values);
    review.hidden = false;
    status.textContent =
      "Brief prepared locally. Nothing has been sent to Reachly.";
    doc.getElementById("review-title")!.focus();
  };
  prepare.addEventListener("click", prepareReview);
  // Always intercept submit—even Enter cannot send or put form fields in a URL.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    prepareReview();
  });
  const changed = (): void => {
    if (!summary.hidden) showErrors(validateBrief(read()).errors);
    if (!review.hidden) {
      review.hidden = true;
      preview.value = "";
      status.textContent =
        "Details changed. Review again before keeping an updated copy.";
    }
  };
  form.addEventListener("input", changed);
  form.addEventListener("change", changed);
  doc.getElementById("brief-edit")!.addEventListener("click", () => {
    fields.name.focus();
  });
  clear.addEventListener("click", () => {
    form.reset();
    Object.values(fields).forEach((field) => {
      field.value = "";
    });
    review.hidden = true;
    preview.value = "";
    showErrors({});
    status.textContent =
      "Brief cleared from this page. Downloaded files and clipboard copies are not removed.";
    fields.name.focus();
  });
  const manualCopy = (message: string): void => {
    preview.focus();
    preview.select();
    status.textContent = `${message} The review text is selected. Copy manually with Ctrl+C, Cmd+C, or your device’s text menu. Nothing has been sent.`;
  };
  doc.getElementById("brief-copy")!.addEventListener("click", async () => {
    if (review.hidden || !preview.value) return;
    const text = preview.value;
    try {
      if (!win.navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await win.navigator.clipboard.writeText(text);
      status.textContent =
        "Brief copied to your clipboard. Not sent to Reachly.";
    } catch {
      if (!review.hidden && preview.value === text)
        manualCopy("Clipboard access is unavailable.");
    }
  });
  doc.getElementById("brief-download")!.addEventListener("click", () => {
    if (review.hidden || !preview.value) return;
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      const blob = new win.Blob([preview.value], {
        type: "text/plain;charset=utf-8",
      });
      url = win.URL.createObjectURL(blob);
      link = doc.createElement("a");
      link.href = url;
      link.download = "reachly-project-brief.txt";
      doc.body.append(link);
      link.click();
      status.textContent =
        "TXT download requested. Check your downloads; the brief is not sent to Reachly.";
    } catch {
      manualCopy("Download is unavailable.");
    } finally {
      link?.remove();
      if (url) {
        const objectURL = url;
        win.setTimeout(() => win.URL.revokeObjectURL(objectURL), 1000);
      }
    }
  });
  prepare.disabled = false;
  clear.disabled = false;
}

if (typeof document !== "undefined") initializeContact();
