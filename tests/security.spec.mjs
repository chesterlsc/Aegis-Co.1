import { expect, test } from "@playwright/test";

const pages = ["/", "/assessment/", "/flowcharts.html"];
const approvedPayloadFields = [
  "_gotcha",
  "brand",
  "business_description",
  "business_name",
  "business_stage",
  "current_truth",
  "email",
  "form_type",
  "friction_area",
  "investment_level",
  "name",
  "next_6_12_months",
  "operating_correctly",
  "readiness",
  "source_page",
  "subject",
  "why_now",
].sort();

const fillAssessment = async (page, name = "Security Test") => {
  await page.locator('[name="name"]').fill(name);
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="email"]').fill("security-test@example.com");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="business_name"]').fill("Aegis Test Business");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="business_description"]').fill("A local intercepted browser test.");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="business_stage"][value="Growing"]').check();
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="friction_area"]').fill("Manual handoffs.");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="current_truth"]').first().check();
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="next_6_12_months"]').fill("The bottleneck becomes more expensive.");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="operating_correctly"]').fill("Clear routing and visibility.");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="why_now"]').fill("Demand is increasing.");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="investment_level"]').first().check();
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="readiness"]').first().check();
};

for (const path of pages) {
  test(`${path} is clean at desktop and mobile`, async ({ page }) => {
    const consoleErrors = [];
    const insecureExternalRequests = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (!["127.0.0.1", "localhost"].includes(url.hostname) && url.protocol !== "https:") {
        insecureExternalRequests.push(request.url());
      }
    });

    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(consoleErrors).toEqual([]);
    expect(insecureExternalRequests).toEqual([]);
    expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').count()).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    expect(consoleErrors).toEqual([]);
  });
}

test("external new-tab links are protected", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const links = await page.locator('a[target="_blank"]').evaluateAll((elements) =>
      elements.map((element) => ({ href: element.href, rel: element.rel }))
    );
    for (const link of links) {
      expect(link.href.startsWith("https://")).toBeTruthy();
      expect(link.rel.split(/\s+/)).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
    }
  }
});

test("flowchart hash input is allowlisted and cannot become markup", async ({ page }) => {
  await page.goto("/flowcharts.html#%3Cimg%20src=x%20onerror=window.__xss=1%3E");
  await expect(page.locator("#flow-title")).toHaveText("Lead Qualification Workflow");
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  expect(await page.locator("img[src='x']").count()).toBe(0);
});

test("assessment validates required fields and preserves back navigation", async ({ page }) => {
  await page.goto("/assessment/");
  await page.locator("[data-wizard-next]").click();
  await expect(page.locator("#assessment-error-1")).toContainText("Please answer");
  await expect(page.locator("#assessment-form")).toHaveAttribute("data-current-step", "1");

  await page.locator('[name="name"]').fill("Persistent Answer");
  await page.locator("[data-wizard-next]").click();
  await page.locator('[name="email"]').fill("not-an-email");
  await page.locator("[data-wizard-next]").click();
  await expect(page.locator("#assessment-error-2")).toContainText("valid email");
  await page.locator("[data-wizard-back]").click();
  await expect(page.locator('[name="name"]')).toHaveValue("Persistent Answer");
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("assessment success uses an allowlisted payload, blocks duplicates, and clears answers", async ({ page }) => {
  let requestCount = 0;
  let requestBody = "";
  await page.route("https://formspree.io/**", async (route) => {
    requestCount += 1;
    requestBody = route.request().postData() || "";
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });

  await page.goto("/assessment/");
  const xssPayload = '<img src=x onerror="window.__xss=1">';
  await fillAssessment(page, xssPayload);
  await page.evaluate(() => {
    document.querySelector('[name="subject"]').value = "Injected\r\nBcc: attacker@example.com";
    const unexpected = document.createElement("input");
    unexpected.name = "unexpected_field";
    unexpected.value = "must-not-submit";
    document.querySelector("#assessment-form").append(unexpected);
  });

  const startingUrl = page.url();
  await page.locator(".assessment-submit").click();
  await page.evaluate(() => document.querySelector("#assessment-form").requestSubmit());
  await expect(page.locator("#assessment-form-message")).toContainText("assessment received");

  const submittedNames = [...requestBody.matchAll(/name="([^"]+)"/g)].map((match) => match[1]).sort();
  expect(requestCount).toBe(1);
  expect([...new Set(submittedNames)]).toEqual(approvedPayloadFields);
  expect(requestBody).not.toContain("unexpected_field");
  expect(requestBody).not.toContain("Bcc: attacker@example.com");
  expect(requestBody).toContain("[ AEGIS ] System Assessment Submission");
  expect(page.url()).toBe(startingUrl);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  await expect(page.locator('[name="name"]')).toHaveValue("");
  await expect(page.locator("#assessment-form")).toHaveAttribute("data-current-step", "1");
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("assessment failure is generic, retains answers, and never falls back to native submission", async ({ page }) => {
  let requestCount = 0;
  await page.route("https://formspree.io/**", async (route) => {
    requestCount += 1;
    await route.fulfill({
      status: 422,
      contentType: "application/json",
      body: '{"errors":[{"message":"internal-route-id-123"}]}',
    });
  });

  await page.goto("/assessment/");
  await fillAssessment(page, "Retained Answer");
  const startingUrl = page.url();
  await page.locator(".assessment-submit").click();
  await expect(page.locator("#assessment-form-message")).toContainText("Your answers are still here");
  await expect(page.locator("#assessment-form-message")).not.toContainText("internal-route-id-123");
  await expect(page.locator("#assessment-form-message")).not.toContainText("Formspree");
  await expect(page.locator('[name="name"]')).toHaveValue("Retained Answer");
  await expect(page.locator("#assessment-form")).toHaveAttribute("data-current-step", "12");
  expect(page.url()).toBe(startingUrl);
  expect(requestCount).toBe(1);
});
