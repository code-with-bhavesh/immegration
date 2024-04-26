import { test, expect } from "@playwright/test";

test("Unauthenticated view loads successfully", async ({ page }) => {
	await page.goto("https://my-demo-website.com/?code=startforfree");
	await page.goto("https://my-demo-website.com/home");
	await expect(page.getByRole("img", { name: "Logo" })).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Navicons Home" })
	).toBeVisible();
	await page.waitForTimeout(3000);
	await expect(
		page.locator("div").filter({ hasText: /^Eligibility Quiz$/ })
	).toBeVisible();
	await expect(page.getByText("Eligibility Quiz")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Start", exact: true })
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Sign In / Sign Up" })
	).toBeVisible();
	await expect(page.getByLabel("Open Intercom Messenger")).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Marriage based AOS" })
	).toBeVisible();
	await expect(page.locator("#root")).toContainText(
		"Get started to explore our free features, we're delighted to have you onboard."
	);
	await expect(
		page.getByRole("button", { name: "Get started" })
	).toBeVisible();
});

test("Authenticated pay and now completion", async ({ page }) => {
	// Need to skip this test a lot of the reusable functions are not working
	// due to identifiers not being found or not being unique.
	// test.skip();
	await page.goto("https://my-demo-website.com?code=login");

	{
		/* --------- Open below lines if dev contains Login button in login screen --------- */
	}
	await page.getByPlaceholder("yours@example.com").click();
	await page
		.getByPlaceholder("yours@example.com")
		.fill("12345678@yopmail.com");
	await page.getByPlaceholder("your password").click();
	await page.getByPlaceholder("your password").fill("Admin@123");
	await page.getByLabel("Password").press("Enter");

	await page.waitForSelector('text="Marriage based AOS"', {
		state: "visible",
	});
	await expect(page.getByText("Marriage based AOS")).toBeVisible();
	await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Lock", exact: true })
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Pay Now" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
	await expect(page.getByLabel("Open Intercom Messenger")).toBeVisible();
});
