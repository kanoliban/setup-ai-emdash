import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [
				{
					id: "booking-test",
					version: "0.0.1",
					entrypoint: "./src/plugins/booking-test.ts",
					capabilities: ["network:fetch", "read:content"],
					allowedHosts: ["httpbin.org", "www.googleapis.com", "api.resend.com"],
				},
			],
		}),
	],
	devToolbar: { enabled: false },
});
