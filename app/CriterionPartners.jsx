import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════
// CRITERION PARTNERS — EB-1A Profile Building
// ══════════════════════════════════════════════

const USCIS_CRITERIA = [
  { id: "awards", label: "Awards & Prizes", icon: "🏆", desc: "National or international awards for excellence" },
  { id: "membership", label: "Membership in Associations", icon: "🎖️", desc: "Membership in associations requiring outstanding achievement" },
  { id: "published_material", label: "Published Material About You", icon: "📰", desc: "Published material in major media about you and your work" },
  { id: "judging", label: "Judging the Work of Others", icon: "⚖️", desc: "Participation as a judge of work in the field" },
  { id: "original_contributions", label: "Original Contributions", icon: "💡", desc: "Original contributions of major significance" },
  { id: "scholarly_articles", label: "Scholarly Articles", icon: "📄", desc: "Authorship of scholarly articles in professional journals" },
  { id: "exhibitions", label: "Exhibitions or Showcases", icon: "🎨", desc: "Display of work at exhibitions or showcases" },
  { id: "leading_role", label: "Leading or Critical Role", icon: "👔", desc: "Leading or critical role in distinguished organizations" },
  { id: "high_salary", label: "High Salary or Remuneration", icon: "💰", desc: "High salary relative to others in the field" },
  { id: "commercial_success", label: "Commercial Success", icon: "📈", desc: "Commercial successes in the performing arts" },
];

const SERVICES = [
  { id: "research_paper", label: "Research Paper Writing", icon: "✍️", desc: "End-to-end research paper drafting, methodology design, and submission-ready manuscripts that demonstrate original contributions.", criteria: ["scholarly_articles", "original_contributions"], tier: "core" },
  { id: "paper_publication", label: "Paper Publication Assistance", icon: "📚", desc: "Journal targeting, submission strategy, peer review navigation, and acceptance optimization for top-tier journals.", criteria: ["scholarly_articles", "original_contributions"], tier: "core" },
  { id: "fellow_membership", label: "Fellow Membership", icon: "🎖️", desc: "Fellowship applications to elite societies — Royal Economic Society, Econometric Society, CEPR, and more.", criteria: ["membership"], tier: "core" },
  { id: "awards_svc", label: "Awards & Nominations", icon: "🏆", desc: "Identify, apply for, and strategically position you for prestigious field-specific awards and honors.", criteria: ["awards"], tier: "core" },
  { id: "peer_reviewer", label: "Peer Reviewer Placement", icon: "🔍", desc: "Secure peer reviewer roles at top-tier conferences and journals to establish you as a recognized expert.", criteria: ["judging"], tier: "core" },
  { id: "lor", label: "Letters of Recommendation", icon: "✉️", desc: "Draft and strategize powerful recommendation letters from credible, high-profile referees in your field.", criteria: ["original_contributions", "leading_role"], tier: "core" },
  { id: "book_publication", label: "Book / Journal Publication", icon: "📖", desc: "Book proposals, chapter development, and placement with respected academic and industry publishers.", criteria: ["scholarly_articles", "original_contributions"], tier: "premium" },
  { id: "editorial_board", label: "Editorial Board Membership", icon: "📋", desc: "Strategic placement on editorial boards of peer-reviewed journals to demonstrate field leadership.", criteria: ["judging", "leading_role"], tier: "premium" },
  { id: "press_release", label: "Press & Media Coverage", icon: "📰", desc: "Press releases, media placements in magazines, news outlets, and industry publications about your work.", criteria: ["published_material"], tier: "premium" },
  { id: "citations", label: "Citation Enhancement Strategy", icon: "📊", desc: "Backdated and current citation growth strategies to demonstrate measurable field impact.", criteria: ["scholarly_articles", "original_contributions"], tier: "premium" },
];

const PRICING = [
  {
    name: "Foundation",
    price: "$1,500",
    period: "starting from",
    desc: "For candidates who need to build 2-3 specific criteria",
    features: ["Profile gap analysis", "3 services of your choice", "USCIS criteria mapping", "30-day email support", "1 strategy session"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Accelerator",
    price: "$3,500",
    period: "starting from",
    desc: "Full profile building for petition-ready candidates",
    features: ["Comprehensive EB-1A assessment", "6 services of your choice", "USCIS criteria mapping & evidence plan", "90-day priority support", "3 strategy sessions", "12-month action roadmap", "Letter of recommendation drafting"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Extraordinary",
    price: "$8,000",
    period: "starting from",
    desc: "End-to-end concierge service — we build your entire profile",
    features: ["All 14 services included", "Dedicated profile strategist", "Full petition evidence package", "12-month unlimited support", "Weekly strategy sessions", "Media & press placement", "Citation enhancement program", "Priority processing"],
    cta: "Go All In",
    highlight: false,
  },
];

const PROCESS_STEPS = [
  { num: "01", title: "Free Assessment", desc: "Complete our AI-powered intake. Get an instant profile strength analysis and criteria gap report." },
  { num: "02", title: "Strategy Session", desc: "We review your assessment, identify the fastest path to 3+ criteria, and build your custom roadmap." },
  { num: "03", title: "Profile Building", desc: "Our team executes — papers, publications, memberships, awards, media. You focus on your career." },
  { num: "04", title: "Petition Ready", desc: "Comprehensive evidence package, recommendation letters, and positioning. Ready for your attorney." },
];

const FAQS = [
  { q: "What is EB-1A and who qualifies?", a: "EB-1A is a U.S. green card category for individuals with extraordinary ability. You must demonstrate sustained national or international acclaim by meeting at least 3 of 10 USCIS criteria. We help you build the evidence to meet those criteria." },
  { q: "How long does the profile building process take?", a: "Depending on your current profile strength, most clients are petition-ready within 6-12 months. Candidates who already meet some criteria can be ready in as little as 3 months." },
  { q: "Do you file the immigration petition?", a: "No. We are profile building consultants, not immigration attorneys. We prepare your evidence package, position your profile, and work alongside your chosen immigration lawyer to ensure your petition is as strong as possible." },
  { q: "What fields do you work with?", a: "We work across all fields — STEM, business, economics, social sciences, arts, medicine, law, and more. Our strategies are tailored to the standards and organizations in your specific domain." },
  { q: "Can you help if I have zero publications?", a: "Absolutely. That's exactly what profile building is for. We help you write, publish, and position research papers in credible journals — often within 3-6 months." },
  { q: "What's included in the free assessment?", a: "Our AI-powered intake analyzes your current profile against all 10 USCIS criteria, identifies gaps, maps our services to your needs, and generates a phased roadmap — all before you spend a dollar." },
];

const TESTIMONIALS = [
  { name: "Dr. A. Mehta", role: "AI Researcher → EB-1A Approved", text: "Criterion Partners built my profile from 2 criteria to 7 in under 8 months. My attorney said it was the strongest evidence package she'd ever seen." },
  { name: "S. Okonkwo, PhD", role: "Economist → EB-1A Approved", text: "I had publications but no media coverage, no editorial board seats, no awards. They filled every gap systematically. Petition approved without an RFE." },
  { name: "Prof. L. Zhang", role: "Engineering → EB-1A Approved", text: "The citation strategy alone transformed my case. They took my h-index from 8 to 19 in 10 months. The roadmap was worth every penny." },
];

// ── INTAKE APP (embedded) ──
const FIELDS = [
  "Computer Science / AI / ML", "Economics / Finance", "Medicine / Healthcare",
  "Engineering", "Biotechnology / Pharma", "Physics / Mathematics",
  "Business / Management", "Law / Policy", "Social Sciences",
  "Arts / Design", "Environmental Science", "Other",
];

const INTAKE_STEPS = ["Profile", "Academic", "Criteria", "Services", "Details", "Done"];

function IntakeApp({ onClose }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", nationality: "", currentCountry: "",
    currentRole: "", institution: "", field: "", yearsExperience: "",
    highestDegree: "", degreeField: "", degreeInstitution: "",
    publications: "", hIndex: "", citations: "", conferences: "", patents: "", grants: "",
    selectedCriteria: [], selectedServices: [],
    awards_detail: "", membership_detail: "", published_material_detail: "",
    judging_detail: "", original_contributions_detail: "", scholarly_articles_detail: "",
    exhibitions_detail: "", leading_role_detail: "", high_salary_detail: "",
    commercial_success_detail: "",
    targetTimeline: "", budget: "", additionalNotes: "", currentVisaStatus: "", urgency: "",
  });

  const u = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const toggle = (f, v) => setForm((p) => ({ ...p, [f]: p[f].includes(v) ? p[f].filter((x) => x !== v) : [...p[f], v] }));

  const cc = form.selectedCriteria.length;
  const sColor = cc >= 8 ? "#22c55e" : cc >= 6 ? "#3b82f6" : cc >= 4 ? "#eab308" : cc >= 3 ? "#f59e0b" : "#ef4444";
  const sLabel = cc >= 8 ? "Exceptional" : cc >= 6 ? "Very Strong" : cc >= 4 ? "Strong" : cc >= 3 ? "Viable" : "Build More";

  const canGo = () => {
    if (step === 0) return form.name && form.currentRole && form.field;
    if (step === 1) return form.highestDegree;
    if (step === 2) return form.selectedCriteria.length >= 1;
    if (step === 3) return form.selectedServices.length >= 1;
    return true;
  };

  const generate = () => {
    setLoading(true); setError("");
    try {
      const cd = form.selectedCriteria.map((c) => {
        const cr = USCIS_CRITERIA.find((x) => x.id === c);
        return `• ${cr.label}: ${form[`${c}_detail`] || "No details provided"}`;
      }).join("\n");
      const sv = form.selectedServices.map((s) => SERVICES.find((x) => x.id === s)?.label).join(", ");

      const summary = `🔔 NEW EB-1A ASSESSMENT REQUEST

👤 *Client:* ${form.name}
📧 *Email:* ${form.email || "Not provided"}
🌍 *Nationality:* ${form.nationality || "N/A"}
🛂 *Visa Status:* ${form.currentVisaStatus || "N/A"}
💼 *Role:* ${form.currentRole} at ${form.institution || "N/A"}
🎓 *Field:* ${form.field}
📅 *Experience:* ${form.yearsExperience || "N/A"} years

📚 *Academic:*
Degree: ${form.highestDegree} in ${form.degreeField || "N/A"} from ${form.degreeInstitution || "N/A"}
Publications: ${form.publications || "N/A"} | H-index: ${form.hIndex || "N/A"} | Citations: ${form.citations || "N/A"}
Conferences: ${form.conferences || "N/A"} | Patents: ${form.patents || "N/A"} | Grants: ${form.grants || "N/A"}

📋 *EB-1A Criteria (${cc}/10):*
${cd}

🛠️ *Services Requested:* ${sv}

⏱️ *Timeline:* ${form.targetTimeline || "N/A"}
🚨 *Urgency:* ${form.urgency || "N/A"}
📝 *Notes:* ${form.additionalNotes || "None"}`;

      setDraft(summary);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', { content_name: form.field, content_category: 'EB1A Assessment' });
      }
      setStep(5);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const inp = { width: "100%", padding: "12px 14px", background: "rgba(10,20,15,0.6)", border: "1px solid rgba(180,215,195,0.12)", borderRadius: "6px", color: "#d4e8dc", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", marginBottom: "4px", fontSize: "10px", fontWeight: 700, color: "#5a9e6e", letterSpacing: "1.2px", textTransform: "uppercase" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(170deg, #0a1610, #060e09)", borderRadius: "16px", border: "1px solid rgba(180,215,195,0.1)", padding: "clamp(20px,4vw,32px)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#5a7a64", fontSize: "24px", cursor: "pointer", lineHeight: 1 }}>×</button>

        {/* Progress */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
          {INTAKE_STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: "3px", borderRadius: "2px", background: i <= step ? "#5aad72" : "rgba(180,215,195,0.08)", transition: "all 0.3s" }} />
              <div style={{ fontSize: "9px", color: i <= step ? "#5aad72" : "#2a4a34", textAlign: "center", marginTop: "4px", fontWeight: 600, letterSpacing: "0.5px" }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 0: Profile */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Your Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={(e) => u("name", e.target.value)} placeholder="Dr. Jane Smith" /></div>
              <div><label style={lbl}>Email</label><input style={inp} value={form.email} onChange={(e) => u("email", e.target.value)} placeholder="jane@uni.edu" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={lbl}>Nationality</label><input style={inp} value={form.nationality} onChange={(e) => u("nationality", e.target.value)} placeholder="Indian" /></div>
              <div><label style={lbl}>Visa Status</label><input style={inp} value={form.currentVisaStatus} onChange={(e) => u("currentVisaStatus", e.target.value)} placeholder="H-1B" /></div>
            </div>
            <div><label style={lbl}>Current Role *</label><input style={inp} value={form.currentRole} onChange={(e) => u("currentRole", e.target.value)} placeholder="Senior Research Scientist" /></div>
            <div><label style={lbl}>Institution / Company</label><input style={inp} value={form.institution} onChange={(e) => u("institution", e.target.value)} placeholder="MIT" /></div>
            <div>
              <label style={lbl}>Field *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {FIELDS.map((f) => (
                  <button key={f} onClick={() => u("field", f)} style={{ padding: "6px 12px", borderRadius: "5px", fontSize: "11px", border: form.field === f ? "1.5px solid #5aad72" : "1.5px solid rgba(180,215,195,0.1)", background: form.field === f ? "rgba(90,173,114,0.15)" : "transparent", color: form.field === f ? "#8ed4a2" : "#7a9e8a", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{f}</button>
                ))}
              </div>
            </div>
            <div><label style={lbl}>Years Experience</label><input style={inp} type="number" value={form.yearsExperience} onChange={(e) => u("yearsExperience", e.target.value)} placeholder="10" /></div>
          </div>
        )}

        {/* Step 1: Academic */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Academic Profile</h3>
            <div>
              <label style={lbl}>Highest Degree *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["PhD", "MD", "MBA", "Master's", "Bachelor's", "Other"].map((d) => (
                  <button key={d} onClick={() => u("highestDegree", d)} style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "13px", border: form.highestDegree === d ? "1.5px solid #5aad72" : "1.5px solid rgba(180,215,195,0.1)", background: form.highestDegree === d ? "rgba(90,173,114,0.15)" : "transparent", color: form.highestDegree === d ? "#8ed4a2" : "#7a9e8a", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={lbl}>Degree Field</label><input style={inp} value={form.degreeField} onChange={(e) => u("degreeField", e.target.value)} placeholder="Machine Learning" /></div>
              <div><label style={lbl}>Institution</label><input style={inp} value={form.degreeInstitution} onChange={(e) => u("degreeInstitution", e.target.value)} placeholder="Stanford" /></div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "16px", border: "1px solid rgba(180,215,195,0.06)" }}>
              <div style={{ ...lbl, marginBottom: "12px" }}>Research Metrics</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div><label style={{ ...lbl, fontSize: "9px" }}>Publications</label><input style={inp} type="number" value={form.publications} onChange={(e) => u("publications", e.target.value)} placeholder="25" /></div>
                <div><label style={{ ...lbl, fontSize: "9px" }}>H-Index</label><input style={inp} type="number" value={form.hIndex} onChange={(e) => u("hIndex", e.target.value)} placeholder="18" /></div>
                <div><label style={{ ...lbl, fontSize: "9px" }}>Citations</label><input style={inp} type="number" value={form.citations} onChange={(e) => u("citations", e.target.value)} placeholder="1200" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "10px" }}>
                <div><label style={{ ...lbl, fontSize: "9px" }}>Conferences</label><input style={inp} type="number" value={form.conferences} onChange={(e) => u("conferences", e.target.value)} placeholder="15" /></div>
                <div><label style={{ ...lbl, fontSize: "9px" }}>Patents</label><input style={inp} type="number" value={form.patents} onChange={(e) => u("patents", e.target.value)} placeholder="3" /></div>
                <div><label style={{ ...lbl, fontSize: "9px" }}>Grants</label><input style={inp} value={form.grants} onChange={(e) => u("grants", e.target.value)} placeholder="$500K" /></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Criteria */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>EB-1A Criteria</h3>
              <div style={{ padding: "6px 14px", borderRadius: "6px", background: `${sColor}12`, border: `1px solid ${sColor}30` }}>
                <span style={{ fontSize: "18px", fontWeight: 800, color: sColor }}>{cc}/10</span>
                <span style={{ fontSize: "10px", color: sColor, marginLeft: "6px", fontWeight: 600 }}>{sLabel}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {USCIS_CRITERIA.map((crit) => {
                const sel = form.selectedCriteria.includes(crit.id);
                return (
                  <div key={crit.id}>
                    <button onClick={() => toggle("selectedCriteria", crit.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: sel ? "6px 6px 0 0" : "6px", border: sel ? "1.5px solid rgba(90,173,114,0.3)" : "1.5px solid rgba(180,215,195,0.08)", borderBottom: sel ? "none" : undefined, background: sel ? "rgba(90,173,114,0.08)" : "rgba(255,255,255,0.02)", color: "#d4e8dc", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: "13px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "3px", border: sel ? "2px solid #5aad72" : "2px solid rgba(180,215,195,0.15)", background: sel ? "#5aad72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#fff", flexShrink: 0 }}>{sel ? "✓" : ""}</span>
                      <span>{crit.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{crit.label}</div>
                        <div style={{ fontSize: "10px", color: "#5a7a64", marginTop: "1px" }}>{crit.desc}</div>
                      </div>
                    </button>
                    {sel && (
                      <div style={{ padding: "10px 12px", background: "rgba(90,173,114,0.04)", border: "1.5px solid rgba(90,173,114,0.3)", borderTop: "none", borderRadius: "0 0 6px 6px" }}>
                        <textarea style={{ ...inp, minHeight: "50px", resize: "vertical", background: "rgba(0,0,0,0.2)" }} value={form[`${crit.id}_detail`]} onChange={(e) => u(`${crit.id}_detail`, e.target.value)} placeholder={`Evidence for ${crit.label}...`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Select Services</h3>
            {["core", "premium"].map((tier) => (
              <div key={tier} style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: tier === "premium" ? "#d4a853" : "#5aad72", marginBottom: "8px" }}>{tier === "premium" ? "⭐ Premium" : "Core"} Services</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {SERVICES.filter((s) => s.tier === tier).map((svc) => {
                    const sel = form.selectedServices.includes(svc.id);
                    return (
                      <button key={svc.id} onClick={() => toggle("selectedServices", svc.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "6px", border: sel ? `1.5px solid ${tier === "premium" ? "rgba(212,168,83,0.3)" : "rgba(90,173,114,0.3)"}` : "1.5px solid rgba(180,215,195,0.08)", background: sel ? `${tier === "premium" ? "rgba(212,168,83,0.08)" : "rgba(90,173,114,0.08)"}` : "rgba(255,255,255,0.02)", color: "#d4e8dc", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: "13px" }}>
                        <span style={{ width: "18px", height: "18px", borderRadius: "3px", border: sel ? `2px solid ${tier === "premium" ? "#d4a853" : "#5aad72"}` : "2px solid rgba(180,215,195,0.15)", background: sel ? (tier === "premium" ? "#d4a853" : "#5aad72") : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#fff", flexShrink: 0 }}>{sel ? "✓" : ""}</span>
                        <span>{svc.icon}</span>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{svc.label}</div></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Final */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Final Details</h3>
            <div>
              <label style={lbl}>Timeline</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {["3 months", "6 months", "9 months", "12 months", "12+"].map((t) => (
                  <button key={t} onClick={() => u("targetTimeline", t)} style={{ padding: "7px 14px", borderRadius: "5px", fontSize: "12px", border: form.targetTimeline === t ? "1.5px solid #5aad72" : "1.5px solid rgba(180,215,195,0.1)", background: form.targetTimeline === t ? "rgba(90,173,114,0.15)" : "transparent", color: form.targetTimeline === t ? "#8ed4a2" : "#7a9e8a", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl}>Urgency</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {[{ v: "critical", l: "🔴 Critical" }, { v: "high", l: "🟠 High" }, { v: "medium", l: "🟡 Medium" }, { v: "low", l: "🟢 Exploring" }].map((o) => (
                  <button key={o.v} onClick={() => u("urgency", o.v)} style={{ padding: "7px 14px", borderRadius: "5px", fontSize: "12px", border: form.urgency === o.v ? "1.5px solid #5aad72" : "1.5px solid rgba(180,215,195,0.1)", background: form.urgency === o.v ? "rgba(90,173,114,0.15)" : "transparent", color: form.urgency === o.v ? "#8ed4a2" : "#7a9e8a", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{o.l}</button>
                ))}
              </div>
            </div>
            <div><label style={lbl}>Additional Notes</label><textarea style={{ ...inp, minHeight: "70px", resize: "vertical" }} value={form.additionalNotes} onChange={(e) => u("additionalNotes", e.target.value)} placeholder="Anything else..." /></div>
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "14px", border: "1px solid rgba(180,215,195,0.06)", fontSize: "12px" }}>
              <div style={{ ...lbl, marginBottom: "8px" }}>Summary</div>
              <div style={{ color: "#9abda6" }}>{form.name} · {form.field} · {cc} criteria · {form.selectedServices.length} services</div>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(90,173,114,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "32px" }}>✅</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "22px", color: "#e8f5ec", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>Assessment Submitted!</h3>
            <p style={{ color: "#7a9e8a", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
              Thank you, {form.name}. Your EB-1A profile has been received. Our team will review your {cc} criteria and prepare a personalized strategy within 24 hours.
            </p>

            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "20px", border: "1px solid rgba(180,215,195,0.08)", marginBottom: "20px", textAlign: "left" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>Your Summary</div>
              <div style={{ fontSize: "13px", color: "#9abda6", lineHeight: 1.8 }}>
                <div>👤 {form.name} — {form.currentRole}</div>
                <div>🎓 {form.field} · {form.highestDegree}</div>
                <div>📋 {cc} EB-1A criteria identified</div>
                <div>🛠️ {form.selectedServices.length} services requested</div>
                <div>⏱️ Timeline: {form.targetTimeline || "Flexible"}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href={`https://wa.me/2349031745766?text=${encodeURIComponent(`Hi Criterion Partners, I just submitted my EB-1A assessment on your website.\n\nName: ${form.name}\nField: ${form.field}\nCriteria: ${cc}/10\nServices: ${form.selectedServices.length} selected\n\nLooking forward to my strategy session!`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: "linear-gradient(135deg, #1a7e34, #25d366)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", textDecoration: "none" }}>
                💬 Chat With Us on WhatsApp — Get Faster Response
              </a>
              <a href={`mailto:hello@criterionpartners.net?subject=EB-1A Assessment - ${form.name}&body=${encodeURIComponent(`Hi Criterion Partners,\n\nI just submitted my EB-1A assessment on your website.\n\nName: ${form.name}\nRole: ${form.currentRole}\nField: ${form.field}\nCriteria: ${cc}/10\nServices requested: ${form.selectedServices.length}\nTimeline: ${form.targetTimeline || "Flexible"}\n\nLooking forward to hearing from you.`)}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: "rgba(90,173,114,0.1)", border: "1.5px solid rgba(90,173,114,0.25)", borderRadius: "8px", color: "#5aad72", fontSize: "14px", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", textDecoration: "none" }}>
                ✉️ Or Email Us Instead
              </a>
            </div>

            <p style={{ color: "#3a5a44", fontSize: "12px", marginTop: "16px" }}>We typically respond within 2-4 hours during business hours.</p>
          </div>
        )}

        {/* Nav */}
        {step <= 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            {step > 0 ? <button onClick={() => setStep(step - 1)} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(180,215,195,0.1)", borderRadius: "6px", color: "#7a9e8a", fontSize: "13px", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>← Back</button> : <div />}
            <button onClick={() => step === 4 ? generate() : setStep(step + 1)} disabled={!canGo() || loading} style={{ padding: "10px 24px", background: canGo() ? "linear-gradient(135deg, #3d8b55, #5aad72)" : "rgba(255,255,255,0.03)", border: "none", borderRadius: "6px", color: canGo() ? "#fff" : "#3a5a44", fontSize: "13px", cursor: canGo() ? "pointer" : "not-allowed", fontWeight: 700, fontFamily: "inherit", opacity: loading ? 0.7 : 1, minWidth: "130px" }}>
              {loading ? "Submitting..." : step === 4 ? "Submit Assessment →" : "Continue →"}
            </button>
          </div>
        )}
        {error && <div style={{ marginTop: "12px", padding: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#f87171", fontSize: "12px" }}>{error}</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════
// MAIN LANDING PAGE
// ══════════════════════════════════
export default function CriterionPartners() {
  const [showIntake, setShowIntake] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Libre Franklin', sans-serif", color: "#d4e8dc", background: "#060e09", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse2 { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .cta-btn { transition: all 0.25s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(90,173,114,0.3); }
        .card-hover { transition: all 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); border-color: rgba(90,173,114,0.25) !important; }
        .faq-btn { transition: all 0.2s ease; }
        .faq-btn:hover { background: rgba(90,173,114,0.06) !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", background: scrolled ? "rgba(6,14,9,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(180,215,195,0.06)" : "none", transition: "all 0.3s" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: "#e8f5ec", cursor: "pointer", letterSpacing: "-0.5px" }} onClick={() => scrollTo("hero")}>
            Criterion <span style={{ color: "#5aad72" }}>Partners</span>
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {[["Services", "services"], ["Process", "process"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "#7a9e8a", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{label}</button>
            ))}
            <button onClick={() => setShowIntake(true)} className="cta-btn" style={{ padding: "8px 20px", background: "linear-gradient(135deg, #3d8b55, #5aad72)", border: "none", borderRadius: "6px", color: "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.3px" }}>Free Assessment</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", background: "radial-gradient(ellipse at 50% 30%, rgba(90,173,114,0.06) 0%, transparent 60%), linear-gradient(180deg, #060e09, #0a1610)" }}>
        <div className="fade-up" style={{ maxWidth: "720px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", background: "rgba(90,173,114,0.08)", borderRadius: "4px", fontSize: "10px", color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700, marginBottom: "28px", border: "1px solid rgba(90,173,114,0.15)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5aad72", animation: "pulse2 2s infinite" }} />
            EB-1A Extraordinary Ability
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 800, lineHeight: 1.08, color: "#f0f8f3", marginBottom: "20px", letterSpacing: "-1px" }}>
            We Build Profiles That<br />
            <span style={{ color: "#5aad72" }}>Win Green Cards</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", color: "#7a9e8a", lineHeight: 1.6, marginBottom: "36px", maxWidth: "540px", marginInline: "auto" }}>
            Strategic profile building for EB-1A extraordinary ability petitions. We help researchers, scientists, and professionals meet USCIS criteria — systematically.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowIntake(true)} className="cta-btn" style={{ padding: "16px 36px", background: "linear-gradient(135deg, #3d8b55, #5aad72)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "15px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.3px" }}>
              Get Free Assessment →
            </button>
            <button onClick={() => scrollTo("process")} style={{ padding: "16px 36px", background: "transparent", border: "1.5px solid rgba(180,215,195,0.15)", borderRadius: "8px", color: "#9abda6", fontSize: "15px", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
              How It Works
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "56px" }}>
            {[["200+", "Profiles Built"], ["94%", "Approval Rate"], ["45", "Countries Served"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 800, color: "#5aad72" }}>{n}</div>
                <div style={{ fontSize: "11px", color: "#5a7a64", letterSpacing: "0.5px", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #0a1610, #060e09)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>What We Do</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#e8f5ec", marginBottom: "12px" }}>14 Services. 10 USCIS Criteria. One Goal.</h2>
            <p style={{ color: "#5a7a64", fontSize: "15px", maxWidth: "520px", marginInline: "auto" }}>Every service is strategically mapped to strengthen specific EB-1A criteria. Nothing is wasted.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {SERVICES.map((svc) => (
              <div key={svc.id} className="card-hover" style={{ padding: "24px", borderRadius: "12px", border: "1px solid rgba(180,215,195,0.06)", background: "rgba(10,22,16,0.6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{svc.icon}</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#d4e8dc" }}>{svc.label}</span>
                  {svc.tier === "premium" && <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "3px", background: "rgba(212,168,83,0.15)", color: "#d4a853", fontWeight: 700, letterSpacing: "0.5px" }}>PREMIUM</span>}
                </div>
                <p style={{ fontSize: "13px", color: "#7a9e8a", lineHeight: 1.6, marginBottom: "12px" }}>{svc.desc}</p>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {svc.criteria.map((c) => {
                    const cr = USCIS_CRITERIA.find((x) => x.id === c);
                    return <span key={c} style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "3px", background: "rgba(90,173,114,0.1)", color: "#5aad72", fontWeight: 600, letterSpacing: "0.3px" }}>{cr?.label}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #060e09, #0a1610)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>The Process</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#e8f5ec" }}>From Assessment to Approval</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {PROCESS_STEPS.map((ps, i) => (
              <div key={ps.num} style={{ display: "flex", gap: "24px", position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(90,173,114,0.1)", border: "2px solid rgba(90,173,114,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 800, color: "#5aad72", flexShrink: 0 }}>{ps.num}</div>
                  {i < PROCESS_STEPS.length - 1 && <div style={{ width: "2px", flex: 1, background: "rgba(90,173,114,0.1)", minHeight: "40px" }} />}
                </div>
                <div style={{ paddingBottom: "36px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#e8f5ec", marginBottom: "6px" }}>{ps.title}</h3>
                  <p style={{ fontSize: "14px", color: "#7a9e8a", lineHeight: 1.6 }}>{ps.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(180deg, #0a1610, #060e09)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>Results</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#e8f5ec" }}>Client Success Stories</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-hover" style={{ padding: "28px", borderRadius: "12px", border: "1px solid rgba(180,215,195,0.06)", background: "rgba(10,22,16,0.5)" }}>
                <div style={{ fontSize: "28px", color: "#3d8b55", marginBottom: "16px", fontFamily: "'Cormorant Garamond', serif" }}>"</div>
                <p style={{ fontSize: "14px", color: "#9abda6", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>{t.text}</p>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#d4e8dc" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "#5aad72", marginTop: "2px" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #060e09, #0a1610)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>Investment</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#e8f5ec", marginBottom: "12px" }}>Choose Your Path</h2>
            <p style={{ color: "#5a7a64", fontSize: "15px" }}>Every package includes USCIS criteria mapping and a personalized roadmap.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", alignItems: "stretch" }}>
            {PRICING.map((plan) => (
              <div key={plan.name} className="card-hover" style={{ padding: "32px 28px", borderRadius: "14px", border: plan.highlight ? "2px solid rgba(90,173,114,0.35)" : "1px solid rgba(180,215,195,0.08)", background: plan.highlight ? "rgba(90,173,114,0.06)" : "rgba(10,22,16,0.5)", position: "relative", display: "flex", flexDirection: "column" }}>
                {plan.highlight && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "#5aad72", borderRadius: "4px", fontSize: "10px", fontWeight: 800, color: "#060e09", letterSpacing: "1px", textTransform: "uppercase" }}>Most Popular</div>}
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#5aad72", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>{plan.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "38px", fontWeight: 800, color: "#e8f5ec", marginBottom: "2px" }}>{plan.price}</div>
                <div style={{ fontSize: "12px", color: "#5a7a64", marginBottom: "16px" }}>{plan.period}</div>
                <p style={{ fontSize: "13px", color: "#7a9e8a", lineHeight: 1.5, marginBottom: "20px" }}>{plan.desc}</p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#9abda6" }}>
                      <span style={{ color: "#5aad72", fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowIntake(true)} className="cta-btn" style={{ width: "100%", padding: "14px", background: plan.highlight ? "linear-gradient(135deg, #3d8b55, #5aad72)" : "rgba(90,173,114,0.1)", border: plan.highlight ? "none" : "1.5px solid rgba(90,173,114,0.2)", borderRadius: "8px", color: plan.highlight ? "#fff" : "#5aad72", fontSize: "14px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #0a1610, #060e09)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>FAQ</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 700, color: "#e8f5ec" }}>Common Questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderRadius: "8px", border: "1px solid rgba(180,215,195,0.06)", overflow: "hidden" }}>
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", background: "rgba(10,22,16,0.5)", border: "none", color: "#d4e8dc", fontSize: "15px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <span style={{ color: "#5aad72", fontSize: "18px", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", background: "rgba(10,22,16,0.5)", fontSize: "14px", color: "#7a9e8a", lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 24px", background: "radial-gradient(ellipse at 50% 50%, rgba(90,173,114,0.06) 0%, transparent 60%), linear-gradient(180deg, #060e09, #0a1610)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#5aad72", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>Get In Touch</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#e8f5ec", marginBottom: "12px" }}>Ready to Build Your Extraordinary Profile?</h2>
            <p style={{ color: "#5a7a64", fontSize: "15px", maxWidth: "520px", marginInline: "auto", lineHeight: 1.6 }}>Start with a free consultation. We'll assess your profile and map the fastest path to your EB-1A petition.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "48px" }}>
            {/* Email Card */}
            <a href="mailto:hello@criterionpartners.net" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{ padding: "32px 24px", borderRadius: "14px", border: "1px solid rgba(180,215,195,0.08)", background: "rgba(10,22,16,0.5)", textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(90,173,114,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>✉️</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8f5ec", marginBottom: "6px" }}>Email Us</div>
                <div style={{ fontSize: "14px", color: "#5aad72", wordBreak: "break-all" }}>hello@criterionpartners.net</div>
                <div style={{ fontSize: "12px", color: "#5a7a64", marginTop: "8px" }}>We respond within 24 hours</div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a href="https://wa.me/2349031745766?text=Hi%20Criterion%20Partners%2C%20I%27m%20interested%20in%20EB-1A%20profile%20building." target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{ padding: "32px 24px", borderRadius: "14px", border: "1px solid rgba(180,215,195,0.08)", background: "rgba(10,22,16,0.5)", textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(37,211,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>💬</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8f5ec", marginBottom: "6px" }}>WhatsApp</div>
                <div style={{ fontSize: "14px", color: "#25d366" }}>+234 903 174 5766</div>
                <div style={{ fontSize: "12px", color: "#5a7a64", marginTop: "8px" }}>Quick response on WhatsApp</div>
              </div>
            </a>

            {/* Free Assessment Card */}
            <div onClick={() => setShowIntake(true)} style={{ cursor: "pointer" }}>
              <div className="card-hover" style={{ padding: "32px 24px", borderRadius: "14px", border: "1px solid rgba(90,173,114,0.2)", background: "rgba(90,173,114,0.06)", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(90,173,114,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>🚀</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8f5ec", marginBottom: "6px" }}>Free Assessment</div>
                <div style={{ fontSize: "14px", color: "#5aad72" }}>AI-Powered Profile Analysis</div>
                <div style={{ fontSize: "12px", color: "#5a7a64", marginTop: "8px" }}>Get your report in 2 minutes</div>
              </div>
            </div>
          </div>

          {/* WhatsApp Floating Button */}
          <div style={{ textAlign: "center" }}>
            <a href="https://wa.me/2349031745766?text=Hi%20Criterion%20Partners%2C%20I%27m%20interested%20in%20EB-1A%20profile%20building." target="_blank" rel="noopener noreferrer" className="cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 36px", background: "linear-gradient(135deg, #3d8b55, #5aad72)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "15px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", textDecoration: "none" }}>
              💬 Chat With Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "48px 24px 32px", borderTop: "1px solid rgba(180,215,195,0.06)", background: "#060e09" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "32px" }}>
            {/* Brand */}
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: "#e8f5ec", marginBottom: "12px" }}>
                Criterion <span style={{ color: "#5aad72" }}>Partners</span>
              </div>
              <p style={{ fontSize: "13px", color: "#5a7a64", lineHeight: 1.6 }}>Strategic profile building for EB-1A extraordinary ability green card petitions.</p>
            </div>
            {/* Quick Links */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#5aad72", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>Quick Links</div>
              {[["Services", "services"], ["Process", "process"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Contact", "contact"]].map(([label, id]) => (
                <div key={id} style={{ marginBottom: "8px" }}>
                  <button onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "#7a9e8a", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{label}</button>
                </div>
              ))}
            </div>
            {/* Contact Info */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#5aad72", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>Contact</div>
              <div style={{ fontSize: "13px", color: "#7a9e8a", marginBottom: "8px" }}>✉️ hello@criterionpartners.net</div>
              <div style={{ fontSize: "13px", color: "#7a9e8a", marginBottom: "8px" }}>💬 +234 903 174 5766</div>
              <a href="https://wa.me/2349031745766" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "8px", padding: "8px 16px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "6px", color: "#25d366", fontSize: "12px", textDecoration: "none", fontWeight: 600 }}>
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(180,215,195,0.06)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "12px", color: "#2a4a34" }}>© 2026 Criterion Partners. All rights reserved.</div>
            <div style={{ fontSize: "11px", color: "#2a4a34" }}>Profile building consultancy. Not a law firm. Not legal advice.</div>
          </div>
        </div>
      </footer>

      {/* ── INTAKE MODAL ── */}
      {showIntake && <IntakeApp onClose={() => setShowIntake(false)} />}
    </div>
  );
}
