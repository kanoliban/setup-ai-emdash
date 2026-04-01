import { useState } from "react";

const DEVICES = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "macbook", label: "MacBook" },
  { id: "watch", label: "Apple Watch" },
  { id: "airpods", label: "AirPods" },
  { id: "other", label: "Other" },
];

const ISSUES = [
  { id: "screen", name: "Screen Repair", description: "Cracks, touch responsiveness, or display bleeding." },
  { id: "battery", name: "Battery Replacement", description: "Rapid drain, unexpected shutdowns, or swelling." },
  { id: "water", name: "Water Damage", description: "Liquid exposure or moisture detection errors." },
  { id: "port", name: "Port / Audio", description: "Charging issues, speaker crackle, or microphone failure." },
];

type Step = "device" | "issue" | "confirm";

export default function BookingWizard() {
  const [step, setStep] = useState<Step>("device");
  const [device, setDevice] = useState<string | null>(null);
  const [issue, setIssue] = useState<string | null>(null);

  const stepIndex = step === "device" ? 0 : step === "issue" ? 1 : 2;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 40px", width: "100%" }}>
      {/* Progress Header */}
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 64, position: "relative" }}>
        <div style={{ position: "absolute", top: 15, left: 0, right: 0, height: 1, background: "#333", zIndex: 1 }} />
        {["Device", "Issue Type", "Confirm"].map((label, i) => (
          <div key={label} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 80 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
              background: i === stepIndex ? "#fff" : i < stepIndex ? "#111" : "#000",
              color: i === stepIndex ? "#000" : i < stepIndex ? "#A1A1A6" : "#6E6E73",
              border: i === stepIndex ? "1px solid #fff" : i < stepIndex ? "1px solid #6E6E73" : "1px solid #333",
            }}>
              {i < stepIndex ? "✓" : String(i + 1).padStart(2, "0")}
            </div>
            <span style={{
              fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "1px", whiteSpace: "nowrap" as const,
              color: i === stepIndex ? "#fff" : "#6E6E73",
            }}>
              {label}
            </span>
          </div>
        ))}
      </header>

      {/* Step 1: Device */}
      {step === "device" && (
        <section>
          <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1, marginBottom: 40 }}>
            Select your<br />device
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {DEVICES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
                  padding: "32px 24px", borderRadius: 12, cursor: "pointer", textAlign: "center" as const,
                  background: device === d.id ? "#1a1a1a" : "#111",
                  border: device === d.id ? "1px solid #fff" : "1px solid #333",
                  color: device === d.id ? "#fff" : "#A1A1A6",
                  fontSize: 16, fontWeight: 500,
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #333", paddingTop: 32 }}>
            <button
              onClick={() => device && setStep("issue")}
              disabled={!device}
              style={{
                background: device ? "#fff" : "#333", color: device ? "#000" : "#666",
                padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: 600,
                border: "none", cursor: device ? "pointer" : "default",
              }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Issue */}
      {step === "issue" && (
        <section>
          <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1, marginBottom: 40 }}>
            What seems to be<br />the problem?
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
            {ISSUES.map((iss) => (
              <button
                key={iss.id}
                onClick={() => setIssue(iss.id)}
                style={{
                  display: "flex", flexDirection: "column", gap: 8, padding: 24, borderRadius: 12,
                  textAlign: "left" as const, cursor: "pointer",
                  background: issue === iss.id ? "#1a1a1a" : "#111",
                  border: issue === iss.id ? "1px solid #fff" : "1px solid #333",
                  color: "#fff",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 500 }}>{iss.name}</span>
                <span style={{ fontSize: 14, color: "#A1A1A6" }}>{iss.description}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #333", paddingTop: 32 }}>
            <button onClick={() => setStep("device")} style={{ background: "none", border: "none", color: "#A1A1A6", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
              Back to Device
            </button>
            <button
              onClick={() => issue && setStep("confirm")}
              disabled={!issue}
              style={{
                background: issue ? "#fff" : "#333", color: issue ? "#000" : "#666",
                padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: 600,
                border: "none", cursor: issue ? "pointer" : "default",
              }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirm" && (
        <section style={{ textAlign: "center" as const, paddingTop: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #333",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px",
          }}>
            <div style={{ width: 24, height: 12, borderLeft: "3px solid #30D158", borderBottom: "3px solid #30D158", transform: "rotate(-45deg) translateY(-2px)" }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1, marginBottom: 16 }}>
            Booking Confirmed
          </h1>
          <p style={{ fontSize: 17, color: "#A1A1A6", marginBottom: 48 }}>
            Device: {device} | Issue: {issue}
          </p>
          <div style={{
            background: "#111", border: "1px solid #333", borderRadius: 12, padding: 40,
            maxWidth: 560, margin: "0 auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #333", paddingBottom: 20, marginBottom: 20 }}>
              <span style={{ color: "#A1A1A6", fontSize: 13 }}>Confirmation Code</span>
              <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, letterSpacing: 2 }}>RVV-{Math.floor(1000 + Math.random() * 9000)}-X</span>
            </div>
            <button
              onClick={() => { setStep("device"); setDevice(null); setIssue(null); }}
              style={{
                background: "#fff", color: "#000", padding: "12px 32px", borderRadius: 8,
                fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", width: "100%",
              }}
            >
              Book Another Repair
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
