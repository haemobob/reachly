import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { services } from "../../src/data/content.ts";

function contactDOM(query = "") {
  const source = readFileSync(
    new URL("../../src/pages/contact.astro", import.meta.url),
    "utf8",
  );
  const form = source
    .match(/<form id="brief-form"[\s\S]*?<\/form>/)[0]
    .replace(
      /<select([^>]*)>[\s\S]*?<\/select>/,
      `<select$1><option value="">Not sure</option>${services.map((s) => `<option value="${s.slug}">${s.name}</option>`).join("")}</select>`,
    );
  const review = source.match(
    /<section class="brief-review"[\s\S]*?<\/section>/,
  )[0];
  return new JSDOM(`${form}${review}<p id="brief-status" role="status"></p>`, {
    url: `https://reachly.test/contact${query}`,
  });
}

async function contact() {
  try {
    return await import("../../src/scripts/contact.ts");
  } catch (error) {
    assert.fail(`Contact controller must import cleanly: ${error.message}`);
  }
}

function fillBrief(dom, input = valid) {
  for (const [field, value] of Object.entries(input))
    dom.window.document.getElementById(`brief-${field}`).value = value;
}

async function brief() {
  try {
    return await import("../../src/lib/brief.ts");
  } catch (error) {
    assert.fail(
      `Local brief module must exist and import cleanly: ${error.message}`,
    );
  }
}

const valid = {
  name: "Dewi",
  business: "Ruang Studio",
  reply: "dewi@example.com",
  message: "We need a clearer website for our furniture business.",
  interest: "website-design-development",
};

test("URL context accepts only an exact service slug and never personal fields", async () => {
  const { interestFromSearch } = await brief();
  assert.equal(typeof interestFromSearch, "function");
  assert.equal(
    interestFromSearch(
      "?interest=business-automation&name=Someone&reply=private",
    ),
    "business-automation",
  );
  for (const query of [
    "",
    "?interest=unknown",
    "?interest=SEO",
    "?interest=seo%20",
    "?interest=__proto__",
    "?source=seo",
  ])
    assert.equal(interestFromSearch(query), "");
  assert.equal(
    interestFromSearch("?interest=seo&interest=digital-strategy"),
    "",
    "ambiguous context is ignored",
  );
});

test("brief validation normalizes valid fields and gives field-specific recoverable errors", async () => {
  const { validateBrief } = await brief();
  assert.equal(typeof validateBrief, "function");
  const result = validateBrief({
    ...valid,
    name: "  Dewi  ",
    business: " Ruang Studio ",
    ignored: "private",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, valid);
  const invalid = validateBrief({
    name: " ",
    business: " ",
    reply: "not a reply address",
    message: "short",
    interest: "bad",
  });
  assert.equal(invalid.valid, false);
  assert.deepEqual(Object.keys(invalid.errors), [
    "name",
    "business",
    "reply",
    "message",
  ]);
  assert.equal(invalid.values.interest, "");
  assert.equal(
    validateBrief({ ...valid, reply: "+62 812-3456-7890" }).valid,
    true,
  );
  for (const reply of [
    "a@b",
    "name @example.com",
    "+12",
    "12345678901234567890",
    "https://example.com",
    "email@example.com\nBcc:other@example.com",
  ]) {
    assert.ok(validateBrief({ ...valid, reply }).errors.reply, reply);
  }
});

test("brief rejects oversized and control-character input while preserving ordinary multiline context", async () => {
  const { validateBrief } = await brief();
  for (const [field, limit] of [
    ["name", 100],
    ["business", 160],
    ["reply", 160],
    ["message", 4000],
  ]) {
    const value =
      field === "reply"
        ? `${"a".repeat(limit)}@example.com`
        : "x".repeat(limit + 1);
    assert.ok(validateBrief({ ...valid, [field]: value }).errors[field], field);
  }
  for (const field of ["name", "business", "reply", "message"])
    assert.ok(
      validateBrief({ ...valid, [field]: `${valid[field]}\u0000` }).errors[
        field
      ],
      field,
    );
  assert.ok(
    validateBrief({ ...valid, name: "Dewi\nInjected label" }).errors.name,
  );
  assert.equal(
    validateBrief({
      ...valid,
      message: "A useful first line.\r\nAnd a second line with context.",
    }).values.message,
    "A useful first line.\nAnd a second line with context.",
  );
  assert.equal(
    validateBrief({
      ...valid,
      message: "A useful first line.\nAnd a second line with context.",
    }).valid,
    true,
  );
  assert.equal(validateBrief({}).valid, false);
});

test("TXT export is deterministic plain text and never claims delivery", async () => {
  const { formatBrief } = await brief();
  assert.equal(typeof formatBrief, "function");
  assert.equal(
    formatBrief(valid),
    [
      "REACHLY — PROJECT BRIEF",
      "Prepared locally. Not sent to Reachly.",
      "",
      "Name: Dewi",
      "Business / project: Ruang Studio",
      "Reply via: dewi@example.com",
      "Interest: Website Design & Development",
      "",
      "What needs to change:",
      valid.message,
      "",
      "Share only through a contact channel you have independently verified.",
      "",
    ].join("\n"),
  );
  assert.match(
    formatBrief({ ...valid, interest: "" }),
    /Interest: Not sure yet/,
  );
  assert.match(
    formatBrief({
      ...valid,
      message: "<script>alert(1)</script> is literal brief context.",
    }),
    /<script>/,
  );
  assert.throws(() => formatBrief({ ...valid, reply: "bad" }), /valid brief/i);
});

test("contact review validates accessibly, preserves edits and never submits personal fields", async () => {
  const { initializeContact } = await contact();
  assert.equal(typeof initializeContact, "function");
  const dom = contactDOM("?interest=seo&name=Should-not-fill");
  const doc = dom.window.document;
  initializeContact(doc);
  assert.equal(doc.getElementById("brief-interest").value, "seo");
  assert.equal(doc.getElementById("brief-name").value, "");
  assert.equal(doc.getElementById("brief-prepare").disabled, false);
  doc.getElementById("brief-prepare").click();
  assert.equal(doc.getElementById("brief-review").hidden, true);
  assert.equal(
    doc.getElementById("brief-name").getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(doc.activeElement.id, "brief-errors");
  assert.ok(doc.querySelector('#brief-errors a[href="#brief-name"]'));
  fillBrief(dom, {
    ...valid,
    message: "<script>alert(1)</script> is literal brief context.",
  });
  doc.getElementById("brief-prepare").click();
  assert.equal(doc.getElementById("brief-review").hidden, false);
  assert.equal(
    doc.getElementById("brief-name").getAttribute("aria-invalid"),
    null,
  );
  assert.equal(doc.activeElement.id, "review-title");
  assert.match(doc.getElementById("brief-preview").value, /<script>/);
  assert.equal(doc.querySelectorAll("script").length, 0);
  assert.equal(
    doc
      .getElementById("brief-form")
      .dispatchEvent(new dom.window.Event("submit", { cancelable: true })),
    false,
  );
  doc.getElementById("brief-message").value =
    "This is updated context after review.";
  doc
    .getElementById("brief-message")
    .dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(doc.getElementById("brief-review").hidden, true);
  assert.equal(doc.getElementById("brief-preview").value, "");
  assert.match(doc.getElementById("brief-status").textContent, /review again/i);
  doc.getElementById("brief-prepare").click();
  doc.getElementById("brief-edit").click();
  assert.equal(doc.activeElement.id, "brief-name");
  assert.equal(
    doc.getElementById("brief-message").value,
    "This is updated context after review.",
  );
  doc.getElementById("brief-clear").click();
  assert.equal(doc.getElementById("brief-name").value, "");
  assert.equal(doc.getElementById("brief-interest").value, "");
  assert.equal(doc.getElementById("brief-review").hidden, true);
  assert.equal(
    dom.window.location.search,
    "?interest=seo&name=Should-not-fill",
  );
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);
  dom.window.close();
});

test("copy uses the clipboard only on request and offers manual selection when denied", async () => {
  const { initializeContact } = await contact();
  const dom = contactDOM();
  const doc = dom.window.document;
  let copied = "";
  let calls = 0;
  Object.defineProperty(dom.window.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (text) => {
        copied = text;
        calls++;
      },
    },
  });
  initializeContact(doc);
  fillBrief(dom);
  doc.getElementById("brief-prepare").click();
  assert.equal(calls, 0);
  doc.getElementById("brief-copy").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(copied, doc.getElementById("brief-preview").value);
  assert.match(
    doc.getElementById("brief-status").textContent,
    /copied.*not sent/i,
  );
  Object.defineProperty(dom.window.navigator, "clipboard", {
    value: {
      writeText: async () => {
        throw new Error("Denied");
      },
    },
  });
  doc.getElementById("brief-copy").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const preview = doc.getElementById("brief-preview");
  assert.equal(doc.activeElement, preview);
  assert.equal(preview.selectionEnd, preview.value.length);
  assert.match(doc.getElementById("brief-status").textContent, /manually/i);
  dom.window.close();
});

test("reply validation rejects malformed email delimiters and empty domain labels", async () => {
  const { validateBrief } = await brief();
  for (const reply of [
    "a<@example.com",
    "a@example..com",
    "a@.com",
    "a@example.com.",
    ".a@example.com",
    "a..b@example.com",
  ])
    assert.ok(validateBrief({ ...valid, reply }).errors.reply, reply);
  for (const reply of ["dewi+studio@example.co.id", "dewi.s@example.com"])
    assert.equal(validateBrief({ ...valid, reply }).valid, true, reply);
});

test("download requests a plain TXT file with no personal filename and recovers if unavailable", async () => {
  const { initializeContact } = await contact();
  const dom = contactDOM();
  const doc = dom.window.document;
  let blob;
  let clicked;
  let revoked;
  let release;
  dom.window.URL.createObjectURL = (value) => {
    blob = value;
    return "blob:local-test";
  };
  dom.window.URL.revokeObjectURL = (value) => {
    revoked = value;
  };
  dom.window.setTimeout = (fn) => {
    release = fn;
    return 1;
  };
  dom.window.HTMLAnchorElement.prototype.click = function () {
    clicked = { download: this.download, href: this.href };
  };
  initializeContact(doc);
  doc.getElementById("brief-download").click();
  assert.equal(clicked, undefined);
  fillBrief(dom);
  doc.getElementById("brief-prepare").click();
  doc.getElementById("brief-download").click();
  assert.ok(blob, "download must create a local text blob");
  assert.equal(blob.type, "text/plain;charset=utf-8");
  assert.deepEqual(clicked, {
    download: "reachly-project-brief.txt",
    href: "blob:local-test",
  });
  release();
  assert.equal(revoked, "blob:local-test");
  assert.match(
    doc.getElementById("brief-status").textContent,
    /download.*not sent/i,
  );
  dom.window.URL.createObjectURL = () => {
    throw new Error("Unavailable");
  };
  doc.getElementById("brief-download").click();
  assert.equal(doc.activeElement.id, "brief-preview");
  assert.match(
    doc.getElementById("brief-status").textContent,
    /unavailable.*manually/i,
  );
  dom.window.close();
});
