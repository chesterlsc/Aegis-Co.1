import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const htmlFiles = ["index.html", "assessment/index.html", "flowcharts.html"];
const productionCode = [...htmlFiles, "scripts.js", "assessment/assessment.js", "flowcharts.js"];
const allowedExternalHosts = new Set([
  "aegisco.co",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "formspree.io",
  "schema.org",
  "www.linkedin.com",
]);
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const read = (file) => readFileSync(resolve(root, file), "utf8");
const trackedFiles = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

for (const file of trackedFiles) {
  check(!/(^|\/)(\.env(?:\.|$)|\.vscode|\.idea|\.playwright-cli|output)(\/|$)/i.test(file), `Local-only file is tracked: ${file}`);
  check(!/\.(?:bak|backup|log|map|old|orig|pem|p12|pfx|key|swp|tmp)$/i.test(file), `Sensitive or debug artifact is tracked: ${file}`);
}

const externalHosts = new Set();
for (const file of htmlFiles) {
  const source = read(file);
  check(/<meta\s+name="referrer"\s+content="strict-origin-when-cross-origin">/i.test(source), `${file} is missing the approved referrer policy.`);
  const csp = source.match(/<meta[\s\S]*?http-equiv="Content-Security-Policy"[\s\S]*?content="([^"]+)"/i)?.[1] || "";
  check(csp.includes("object-src 'none'") && csp.includes("base-uri 'none'"), `${file} is missing the required CSP baseline.`);
  check(!/<[^>]+\son[a-z]+\s*=/i.test(source), `${file} contains an inline event handler.`);
  check(!/<[^>]+\sstyle\s*=/i.test(source), `${file} contains an inline style attribute.`);

  for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    const tag = match[0];
    check(/rel="[^"]*noopener[^"]*"/i.test(tag) && /rel="[^"]*noreferrer[^"]*"/i.test(tag), `${file} has an unsafe target=_blank link.`);
  }

  for (const match of source.matchAll(/(?:href|src|action|content)="(https?:\/\/[^"\s]+)"/gi)) {
    const url = new URL(match[1]);
    check(url.protocol === "https:", `${file} loads or links to an HTTP resource: ${url.href}`);
    externalHosts.add(url.hostname);
    check(allowedExternalHosts.has(url.hostname), `${file} introduces an unexpected external host: ${url.hostname}`);
  }

  for (const script of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = script[1];
    const body = script[2].trim();
    const isJsonLd = /type="application\/ld\+json"/i.test(attributes);
    check(Boolean(attributes.match(/\bsrc=/i)) || isJsonLd || !body, `${file} contains executable inline JavaScript.`);
  }
}

const dangerousSinkPattern = /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval|Function)\b|javascript:/;
const storagePattern = /\b(?:localStorage|sessionStorage|indexedDB|document\.cookie|caches\.|serviceWorker)\b/;
const secretPattern = /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----)/;

for (const file of productionCode) {
  const source = read(file);
  check(!dangerousSinkPattern.test(source), `${file} contains a prohibited dynamic-code or HTML sink.`);
  check(!storagePattern.test(source), `${file} writes to browser persistence.`);
  check(!/console\.(?:log|debug|info|warn|error)\s*\(/.test(source), `${file} contains console logging.`);
  check(!secretPattern.test(source), `${file} contains a credential-like value.`);
}

const assessment = read("assessment/index.html");
const assessmentForm = assessment.match(/<form\b[\s\S]*?<\/form>/i)?.[0] || "";
const approvedFields = new Set([
  "brand",
  "form_type",
  "source_page",
  "subject",
  "_gotcha",
  "name",
  "email",
  "business_name",
  "business_description",
  "business_stage",
  "friction_area",
  "current_truth",
  "next_6_12_months",
  "operating_correctly",
  "why_now",
  "investment_level",
  "readiness",
]);
const actualFields = new Set([...assessmentForm.matchAll(/\bname="([^"]+)"/g)].map((match) => match[1]));
assert.deepEqual([...actualFields].sort(), [...approvedFields].sort(), "Assessment field allowlist changed.");
check(/action="https:\/\/formspree\.io\/f\/xrewvzgb"/.test(assessment), "Assessment Formspree action changed.");

const expectedLengths = {
  name: "100",
  email: "254",
  business_name: "160",
  business_description: "1500",
  friction_area: "1500",
  next_6_12_months: "1500",
  operating_correctly: "1500",
  why_now: "1500",
};
for (const [name, length] of Object.entries(expectedLengths)) {
  const tag = assessment.match(new RegExp(`<(?:input|textarea)\\b[^>]*name="${name}"[^>]*>`, "i"))?.[0] || "";
  check(new RegExp(`maxlength="${length}"`, "i").test(tag), `Assessment field ${name} is missing maxlength=${length}.`);
}

const unexpectedHosts = [...externalHosts].filter((host) => !allowedExternalHosts.has(host));
check(unexpectedHosts.length === 0, `Unexpected external hosts: ${unexpectedHosts.join(", ")}`);

if (failures.length) {
  console.error(`Security static checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Security static checks passed. Tracked files: ${trackedFiles.length}. External hosts: ${[...externalHosts].sort().join(", ")}.`);
