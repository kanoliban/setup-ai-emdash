import { definePlugin } from "emdash";
import { createHmac, timingSafeEqual } from "node:crypto";

export function createPlugin() {
	return definePlugin({
	id: "booking-test",
	version: "0.0.1",
	capabilities: ["network:fetch", "read:content"],
	allowedHosts: ["httpbin.org", "www.googleapis.com", "api.resend.com"],

	routes: {
		"test/fetch": {
			public: true,
			handler: async (ctx) => {
				if (!ctx.http) return { error: "http not available" };
				const response = await ctx.http.fetch("https://httpbin.org/get");
				const data = await response.json();
				return { pass: true, status: response.status, origin: data.origin };
			},
		},

		"test/post": {
			public: true,
			handler: async (ctx) => {
				if (!ctx.http) return { error: "http not available" };
				const response = await ctx.http.fetch("https://httpbin.org/post", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ booking: "test", device: "iPhone", issue: "screen" }),
				});
				const data = await response.json();
				return { pass: true, status: response.status, echoed: data.json };
			},
		},

		"test/hmac": {
			public: true,
			handler: async (ctx) => {
				const secret = "test-cancel-secret";
				const eventId = "cal_abc123";

				const encodedId = Buffer.from(eventId).toString("base64url");
				const hmac = createHmac("sha256", secret).update(eventId).digest();
				const encodedHmac = hmac.toString("base64url");
				const token = `${encodedId}.${encodedHmac}`;

				const [idPart, hmacPart] = token.split(".");
				const decodedId = Buffer.from(idPart, "base64url").toString();
				const expectedHmac = createHmac("sha256", secret).update(decodedId).digest();
				const providedHmac = Buffer.from(hmacPart, "base64url");
				const valid = timingSafeEqual(expectedHmac, providedHmac);

				return {
					pass: valid && decodedId === eventId,
					token,
					decodedId,
					valid,
				};
			},
		},

		"test/all": {
			public: true,
			handler: async (ctx) => {
				const results: Record<string, unknown> = {};

				// Eval 4: External HTTP fetch
				if (ctx.http) {
					try {
						const res = await ctx.http.fetch("https://httpbin.org/get");
						results.externalFetch = { pass: res.ok, status: res.status };
					} catch (e) {
						results.externalFetch = { pass: false, error: String(e) };
					}

					// Eval 5: POST (simulates Resend email API shape)
					try {
						const res = await ctx.http.fetch("https://httpbin.org/post", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": "Bearer re_test_fake_key",
							},
							body: JSON.stringify({
								from: "bookings@revive.com",
								to: "customer@test.com",
								subject: "Your repair is confirmed",
							}),
						});
						results.resendShape = { pass: res.ok, status: res.status };
					} catch (e) {
						results.resendShape = { pass: false, error: String(e) };
					}
				} else {
					results.externalFetch = { pass: false, error: "ctx.http not available" };
					results.resendShape = { pass: false, error: "ctx.http not available" };
				}

				// Eval 6: HMAC cancel token
				try {
					const secret = "test-secret";
					const eventId = "cal_test_789";
					const hmac = createHmac("sha256", secret).update(eventId).digest();
					const token = `${Buffer.from(eventId).toString("base64url")}.${hmac.toString("base64url")}`;
					const [idPart, hmacPart] = token.split(".");
					const decoded = Buffer.from(idPart, "base64url").toString();
					const expected = createHmac("sha256", secret).update(decoded).digest();
					const valid = timingSafeEqual(expected, Buffer.from(hmacPart, "base64url"));
					results.hmacCancel = { pass: valid && decoded === eventId };
				} catch (e) {
					results.hmacCancel = { pass: false, error: String(e) };
				}

				// Content read (proves plugin can access CMS data)
				if (ctx.content) {
					const services = await ctx.content.list("services", { limit: 10 });
					results.contentRead = { pass: true, serviceCount: services.items.length };
				} else {
					results.contentRead = { pass: false, error: "ctx.content not available" };
				}

				const allPass = Object.values(results).every(
					(r) => typeof r === "object" && r !== null && "pass" in r && (r as { pass: boolean }).pass
				);

				return { allPass, results };
			},
		},
	},
});
}
