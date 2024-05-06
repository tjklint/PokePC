import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	outputDir: "./tests/results",
	testMatch: "**/*.spec.ts",
	timeout: 10000,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [["html", { outputFolder: "tests/report", open: "never" }]],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: `http://${hostname}:${port}`,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "retain-on-failure",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: "npm run server",
		url: `http://${hostname}:${port}`,
		reuseExistingServer: true,
	},
});
