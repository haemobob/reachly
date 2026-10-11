import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function page(path) {
  const url = new URL(`../../src/pages/${path}`, import.meta.url);
  assert.ok(existsSync(url), `${path} must exist`);
  const source = readFileSync(url, "utf8");
  assert.match(source, /import Base from/);
  assert.match(source, /styles\/pages\.css/);
  assert.match(source, /<Base/);
  return source;
}

async function content() {
  try {
    return await import("../../src/data/content.ts");
  } catch (error) {
    assert.fail(
      `Shared content must exist and import cleanly: ${error.message}`,
    );
  }
}

test("portfolio exposes exactly the four confirmed projects with canonical imagery and URLs", async () => {
  const { projects } = await content();
  assert.deepEqual(
    projects.map((p) => p.slug),
    ["sellaku", "mac-one-indonesia", "crypto-radius", "crypto-galaxy"],
  );
  const urls = [
    "https://sellaku.vercel.app/toko",
    "https://www.mac1ndonesia.com/",
    "https://www.cryptoradius.id/",
    "https://www.cgcryptogalaxy.id/",
  ];
  projects.forEach((p, index) => {
    assert.equal(p.url, urls[index]);
    assert.equal(p.image, `/images/${p.slug}.webp`);
    for (const key of ["name", "category", "summary", "accent"])
      assert.ok(p[key]?.trim(), `${p.slug}: ${key}`);
    assert.match(p.accent, /^#[0-9a-f]{6}$/i);
  });
});

test("services retain the five approved names and unique planned routes with substantive scope", async () => {
  const { services } = await content();
  assert.ok(Array.isArray(services), "services export must exist");
  assert.deepEqual(
    services.map((s) => [s.slug, s.name]),
    [
      ["website-design-development", "Website Design & Development"],
      ["digital-presence", "Digital Presence"],
      ["digital-strategy", "Digital Strategy"],
      ["business-automation", "Business Automation"],
      ["seo", "SEO"],
    ],
  );
  services.forEach((s, index) => {
    assert.equal(s.number, String(index + 1).padStart(2, "0"));
    assert.ok(s.intro.length > 30);
    assert.ok(s.description.length > 100);
    assert.ok(s.outputs.length >= 3);
    assert.ok(s.questions.length >= 3);
    assert.equal(new Set(s.outputs).size, s.outputs.length);
    assert.equal(new Set(s.questions).size, s.questions.length);
  });
});

test("process describes the intended five-stage journey without invented commitments", async () => {
  const { process } = await content();
  assert.ok(Array.isArray(process), "process export must exist");
  assert.deepEqual(
    process.map((p) => p.name),
    ["Discover", "Plan", "Create", "Launch", "Improve"],
  );
  process.forEach((p) => assert.ok(p.text.length > 50));
  assert.match(process[4].text, /agreed|contracted/i);
});

test("work routes expose canonical project notes and honest attribution boundaries", () => {
  assert.match(page("work/index.astro"), /projects\.map/);
  const note = page("work/[slug].astro");
  assert.match(note, /getStaticPaths/);
  assert.match(note, /projects\.map/);
  assert.match(note, /project\.url/);
  assert.match(note, /project\.image/);
  assert.match(note, /not a performance case study/i);
});

test("service routes generate each agreed scope with boundaries and a contextual brief link", () => {
  assert.match(page("services/index.astro"), /services\.map/);
  const detail = page("services/[slug].astro");
  for (const pattern of [
    /getStaticPaths/,
    /services\.map/,
    /service\.outputs/,
    /service\.questions/,
    /interest=/,
    /not guaranteed/,
    /hosting/i,
  ])
    assert.match(detail, pattern);
});

test("About explains the Indonesian business focus and intended process without fictitious biographies", () => {
  const about = page("about.astro");
  assert.match(about, /Indonesian/);
  assert.match(about, /process\.map/);
  assert.match(about, /planned direction/i);
  assert.doesNotMatch(
    about,
    /award-winning|founded in|our founder|guaranteed growth/i,
  );
});

test("privacy describes actual local processing rather than inventing a receiver or legal entity", () => {
  const privacy = page("privacy.astro");
  for (const pattern of [
    /not sent/i,
    /no analytics/i,
    /localStorage/,
    /clipboard/i,
    /hosting/i,
    /verified contact/i,
  ])
    assert.match(privacy, pattern);
  assert.doesNotMatch(privacy, /mailto:|PT Reachly|registered office/i);
});

test("404 offers normal navigation back to useful destinations", () => {
  const missing = page("404.astro");
  for (const path of ["/", "/work", "/services", "/contact"])
    assert.ok(missing.includes(`href="${path}"`));
  assert.match(missing, /404/);
});

test("contact renders a non-delivering local tool with explicit labels, limits and recovery", () => {
  const contact = page("contact.astro");
  for (const pattern of [
    /not sent/i,
    /no verified/i,
    /id="brief-form"/,
    /id="brief-review"/,
    /id="brief-preview"/,
    /id="brief-status"/,
    /type="button"/,
    /disabled/,
    /contact\.ts/,
    /aria-describedby/,
    /maxlength="4000"/,
  ])
    assert.match(contact, pattern);
  assert.doesNotMatch(
    contact,
    /action=|method=|name="(?:name|business|reply|message)"|mailto:|wa\.me/,
  );
});

test("supporting page styles provide mobile recomposition and visible accessible states", () => {
  const url = new URL("../../src/styles/pages.css", import.meta.url);
  assert.ok(existsSync(url), "supporting page stylesheet must exist");
  const css = readFileSync(url, "utf8");
  for (const pattern of [
    /@media/,
    /focus-visible/,
    /aria-invalid/,
    /\[hidden\]/,
    /\.brief-layout/,
    /\.work-collection/,
    /\.service-row/,
  ])
    assert.match(css, pattern);
});

test("project notes retain actual capture proportions and clarify Sellaku’s visible source branding", () => {
  for (const path of ["work/index.astro", "work/[slug].astro"])
    assert.match(
      page(path),
      /height=\{project\.slug === 'sellaku' \? 845 : 960\}/,
    );
  assert.match(page("work/[slug].astro"), /Tekad Jaya/);
});

test("brief action colors change atomically so hover never passes through unreadable contrast", () => {
  const css = readFileSync(
    new URL("../../src/styles/pages.css", import.meta.url),
    "utf8",
  );
  assert.ok(
    /\.form-actions \.button\s*\{[^}]*transition:\s*none/.test(css),
    "brief button color transitions must be atomic",
  );
});

test("supporting page titles leave the shared layout to append the brand once", () => {
  for (const path of [
    "work/index.astro",
    "work/[slug].astro",
    "services/index.astro",
    "services/[slug].astro",
    "about.astro",
    "contact.astro",
    "privacy.astro",
    "404.astro",
  ]) {
    const source = page(path);
    assert.ok(
      !/<Base title=[^\n]*? — Reachly/.test(source),
      `${path}: Base already appends Reachly`,
    );
  }
});

test("muted portfolio explanation retains a readable ink color without compounding opacity", () => {
  const css = readFileSync(
    new URL("../../src/styles/pages.css", import.meta.url),
    "utf8",
  );
  const rule = css.match(/\.muted\s*\{([^}]+)\}/)?.[1];
  assert.ok(
    rule && !rule.includes("opacity"),
    "muted text must not lower the shared accessible color opacity",
  );
});
