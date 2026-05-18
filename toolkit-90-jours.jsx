import { useState } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────────

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatDateFull(date) {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" });
}

function daysBetween(a, b) {
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 1, label: "Phase 1", name: "Découvrir", days: "J1 – J30",
    startDay: 0, endDay: 29,
    color: "#2D6A4F", light: "#D8F3DC", icon: "🧭",
    description: "Poser ses valises, observer sans juger, construire sa crédibilité par l'écoute.",
    milestones: [
      { day: "J1–3",  offset: 0,  title: "Clarifier le mandat",          desc: "Rencontrer son N+1 : quelles attentes, quels critères de succès à 90 jours ?" },
      { day: "J5–10", offset: 4,  title: "Tour d'équipe individuel",      desc: "Un 1:1 de 45 min avec chaque collaborateur. Écouter, ne pas promettre." },
      { day: "J15",   offset: 14, title: "Cartographie politique",        desc: "Identifier les alliés, les influenceurs, les sceptiques. À qui dois-je parler ?" },
      { day: "J30",   offset: 29, title: "Restitution de découverte",     desc: "Partager avec son N+1 : ce que j'ai appris, ce que je vois, mes premières questions." },
    ],
    resources: [
      { emoji: "🎤", title: "Guide d'entretien 1:1",       desc: "10 questions pour découvrir l'équipe sans paraître naïf ni arrogant." },
      { emoji: "🗺️", title: "Carte des parties prenantes", desc: "Classer chaque acteur clé : influence, posture, relation à construire." },
      { emoji: "🪞", title: "Journal de posture",          desc: "Chaque soir : qu'ai-je observé ? Qu'ai-je ressenti ? Qu'est-ce que je ne sais pas encore ?" },
      { emoji: "⚠️", title: "Les pièges du promu interne", desc: "Comment sortir du rôle de collègue sans trahir les relations existantes." },
    ],
  },
  {
    id: 2, label: "Phase 2", name: "Aligner", days: "J31 – J60",
    startDay: 30, endDay: 59,
    color: "#7C3AED", light: "#EDE9FE", icon: "🎯",
    description: "Passer du faire au faire-faire. Fixer le cap, clarifier les règles du jeu, s'affirmer.",
    milestones: [
      { day: "J35", offset: 34, title: "Diagnostic équipe partagé",      desc: "Présenter ses observations à l'équipe : forces, tensions, opportunités. Valider ensemble." },
      { day: "J45", offset: 44, title: "Définir 3 priorités collectives", desc: "Pas 10. Trois. Co-construites avec l'équipe, validées par le N+1." },
      { day: "J50", offset: 49, title: "Clarifier sa posture de manager", desc: "Ce que je délègue, ce que je garde, comment je prends les décisions." },
      { day: "J60", offset: 59, title: "Check intermédiaire N+1",         desc: "Feedback direct : est-ce que j'incarne ce qu'on attendait de moi ?" },
    ],
    resources: [
      { emoji: "🔄", title: "Du faire au faire-faire",           desc: "Exercice pratique : lister ce que tu fais encore toi-même — et décider ce que tu lâches." },
      { emoji: "📌", title: "Charte de fonctionnement",          desc: "Co-construire avec l'équipe les règles du jeu : réunions, décisions, feedback." },
      { emoji: "🧠", title: "Gérer la pression du N+1",          desc: "Comment cadrer les attentes, dire non avec élégance, et rendre compte efficacement." },
      { emoji: "⏱️", title: "Matrice de priorités managériales", desc: "Distinguer urgence opérationnelle et impératifs de leadership." },
    ],
  },
  {
    id: 3, label: "Phase 3", name: "Déployer", days: "J61 – J90",
    startDay: 60, endDay: 89,
    color: "#B5451B", light: "#FFE8D6", icon: "🚀",
    description: "Livrer, incarner, inspirer. Ancrer sa légitimité par les résultats et la relation.",
    milestones: [
      { day: "J65", offset: 64, title: "Première victoire visible",    desc: "Un résultat concret, porté par l'équipe, célébré ensemble. Petit mais réel." },
      { day: "J72", offset: 71, title: "Entretiens de développement",  desc: "Un échange individuel sur les ambitions et besoins de chaque collaborateur." },
      { day: "J80", offset: 79, title: "Revue Stop / Keep / Start",    desc: "Ce qu'on arrête, ce qu'on garde, ce qu'on lance. Décider ensemble." },
      { day: "J90", offset: 89, title: "Bilan 90 jours structuré",     desc: "Auto-évaluation + restitution N+1 : qu'est-ce que j'ai appris sur moi en tant que manager ?" },
    ],
    resources: [
      { emoji: "🏆", title: "Construire une victoire rapide", desc: "Comment choisir, préparer et célébrer un quick win qui renforce la crédibilité." },
      { emoji: "💬", title: "Feedback et légitimité",         desc: "Donner et recevoir du feedback dès J60 — sans attendre l'évaluation annuelle." },
      { emoji: "🌱", title: "Entretien de développement",     desc: "Trame d'un entretien 1:1 centré sur les aspirations et la montée en compétences." },
      { emoji: "📋", title: "Trame de bilan 90 jours",        desc: "Structure pour le bilan final : faits, apprentissages, engagements pour la suite." },
    ],
  },
];

const CHECKLIST = [
  { id: "c1",  phase: 1, label: "J'ai clarifié le mandat et les critères de succès avec mon N+1" },
  { id: "c2",  phase: 1, label: "J'ai mené un 1:1 de découverte avec chaque membre de mon équipe" },
  { id: "c3",  phase: 1, label: "J'ai cartographié mes parties prenantes (alliés, influenceurs, sceptiques)" },
  { id: "c4",  phase: 1, label: "J'ai identifié 2-3 tensions ou non-dits dans l'équipe" },
  { id: "c5",  phase: 1, label: "J'ai partagé ma restitution de découverte avec mon N+1" },
  { id: "c6",  phase: 2, label: "J'ai présenté mon diagnostic à l'équipe et recueilli les réactions" },
  { id: "c7",  phase: 2, label: "J'ai défini et communiqué mes 3 priorités collectives" },
  { id: "c8",  phase: 2, label: "J'ai listé ce que je délègue et ce que je garde (passer du faire au faire-faire)" },
  { id: "c9",  phase: 2, label: "J'ai co-construit une charte de fonctionnement avec mon équipe" },
  { id: "c10", phase: 2, label: "J'ai demandé un feedback intermédiaire à mon N+1" },
  { id: "c11", phase: 3, label: "J'ai célébré une première victoire concrète avec mon équipe" },
  { id: "c12", phase: 3, label: "J'ai mené un entretien de développement avec chaque collaborateur" },
  { id: "c13", phase: 3, label: "J'ai animé une revue Stop / Keep / Start avec l'équipe" },
  { id: "c14", phase: 3, label: "J'ai réalisé mon bilan 90 jours (auto-évaluation + restitution N+1)" },
];

// ── ONBOARDING ────────────────────────────────────────────────────────────────

function OnboardingScreen({ onStart }) {
  const [prenom, setPrenom] = useState("");
  const [date, setDate]     = useState("");
  const [error, setError]   = useState("");

  const handleSubmit = () => {
    if (!prenom.trim()) { setError("Merci d'indiquer votre prénom."); return; }
    if (!date)          { setError("Merci de choisir votre date de prise de poste."); return; }
    onStart({ prenom: prenom.trim(), startDate: new Date(date + "T12:00:00") });
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "2px solid #E5E7EB", fontSize: 15,
    fontFamily: "'DM Sans', sans-serif", color: "#111",
    background: "#fff", outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#111", letterSpacing: -0.5, lineHeight: 1.2 }}>
            Boîte à outils<br />Manager
          </div>
          <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8 }}>Découvrir · Aligner · Déployer · 90 jours</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 6 }}>
            Bienvenue dans votre parcours
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>
            Renseignez votre prénom et votre date de prise de poste.
            Vos jalons seront automatiquement convertis en vraies dates.
          </p>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Votre prénom
            </label>
            <input type="text" placeholder="ex : Sophie" value={prenom}
              onChange={e => { setPrenom(e.target.value); setError(""); }}
              onFocus={e => e.target.style.borderColor = "#111"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Date de prise de poste
            </label>
            <input type="date" value={date}
              onChange={e => { setDate(e.target.value); setError(""); }}
              onFocus={e => e.target.style.borderColor = "#111"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              style={inputStyle} />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#B5451B", marginBottom: 16, padding: "10px 14px", background: "#FFE8D6", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            onMouseOver={e => e.currentTarget.style.background = "#333"}
            onMouseOut={e => e.currentTarget.style.background = "#111"}
            style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: "#111", color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "'Playfair Display', serif", cursor: "pointer",
              transition: "background 0.2s", letterSpacing: 0.3,
            }}>
            Démarrer mon parcours →
          </button>
        </div>

        {/* Phase preview */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {PHASES.map(ph => (
            <div key={ph.id} style={{ flex: 1, background: ph.light, borderRadius: 10, padding: "10px 12px", textAlign: "center", border: `1px solid ${ph.color}22` }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ph.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ph.color }}>{ph.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{ph.days}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function ProgressRing({ pct, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: "10px 22px", borderRadius: 999,
          border: active === t.id ? "2px solid #111" : "2px solid #E5E7EB",
          background: active === t.id ? "#111" : "#fff",
          color: active === t.id ? "#fff" : "#555",
          fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s",
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────

function TimelineView({ startDate }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysSinceStart = daysBetween(startDate, today);
  const currentPhase = PHASES.find(ph => daysSinceStart >= ph.startDay && daysSinceStart <= ph.endDay);

  return (
    <div>
      {/* Status banner */}
      {daysSinceStart >= 0 && daysSinceStart <= 89 ? (
        <div style={{
          background: currentPhase?.light, border: `1px solid ${currentPhase?.color}33`,
          borderRadius: 12, padding: "12px 18px", marginBottom: 28,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>{currentPhase?.icon}</span>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
            Vous êtes au <strong>Jour {daysSinceStart + 1}</strong> — Phase <strong>{currentPhase?.name}</strong>.
            Il vous reste <strong>{89 - daysSinceStart} jours</strong> dans votre parcours.
          </span>
        </div>
      ) : daysSinceStart > 89 ? (
        <div style={{ background: "#D8F3DC", borderRadius: 12, padding: "12px 18px", marginBottom: 28, fontSize: 13, color: "#2D6A4F", fontWeight: 500 }}>
          🎉 Vos 90 premiers jours sont terminés. Félicitations !
        </div>
      ) : (
        <div style={{ background: "#FFF3CD", borderRadius: 12, padding: "12px 18px", marginBottom: 28, fontSize: 13, color: "#92400E", fontWeight: 500 }}>
          📅 Votre prise de poste commence le {formatDateFull(startDate)}.
        </div>
      )}

      <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 15, maxWidth: 560 }}>
        Les jalons sont calculés automatiquement à partir de votre date de prise de poste.
      </p>

      {PHASES.map((ph, pi) => {
        const phStart  = addDays(startDate, ph.startDay);
        const phEnd    = addDays(startDate, ph.endDay);
        const isActive = currentPhase?.id === ph.id;

        return (
          <div key={ph.id} style={{ display: "flex", gap: 0, marginBottom: 8 }}>
            {/* Left label */}
            <div style={{ width: 96, flexShrink: 0, paddingTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ph.color, letterSpacing: 1, textTransform: "uppercase" }}>{ph.label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{formatDate(phStart)} –</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDate(phEnd)}</div>
            </div>

            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
              <div style={{
                width: isActive ? 18 : 14, height: isActive ? 18 : 14,
                borderRadius: "50%", background: ph.color,
                marginTop: isActive ? 20 : 22, flexShrink: 0,
                boxShadow: isActive ? `0 0 0 5px ${ph.light}, 0 0 0 8px ${ph.color}44` : `0 0 0 4px ${ph.light}`,
                transition: "all 0.3s",
              }} />
              {pi < 2 && <div style={{ width: 2, flexGrow: 1, background: "#E5E7EB", marginTop: 8 }} />}
            </div>

            {/* Card */}
            <div style={{
              flex: 1, background: "#fff", borderRadius: 16,
              border: isActive ? `2px solid ${ph.color}` : "1px solid #F3F4F6",
              padding: "20px 24px", marginLeft: 16, marginBottom: pi < 2 ? 24 : 0,
              boxShadow: isActive ? `0 4px 20px ${ph.color}22` : "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{ph.icon}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#111" }}>{ph.name}</span>
                {isActive && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: ph.color, background: ph.light, padding: "3px 10px", borderRadius: 99, letterSpacing: 0.5 }}>
                    EN COURS
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>{ph.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {ph.milestones.map(m => {
                  const mDate  = addDays(startDate, m.offset);
                  const isPast = today > mDate;
                  const isNow  = daysBetween(mDate, today) === 0;
                  return (
                    <div key={m.day} style={{
                      background: isNow ? ph.color : isPast ? "#F9FAFB" : ph.light,
                      borderRadius: 10, padding: "12px 14px",
                      borderLeft: `3px solid ${isPast && !isNow ? "#D1D5DB" : ph.color}`,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 2, letterSpacing: 0.5, color: isNow ? "#fff" : isPast ? "#9CA3AF" : ph.color }}>
                        {m.day} · {formatDate(mDate)}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: isNow ? "#fff" : isPast ? "#9CA3AF" : "#111" }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: isNow ? "rgba(255,255,255,0.85)" : isPast ? "#9CA3AF" : "#555" }}>{m.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResourcesView() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 15, maxWidth: 560 }}>
        Des outils concrets pour chaque phase. Cliquez sur une phase pour explorer les ressources.
      </p>
      {PHASES.map(ph => (
        <div key={ph.id} style={{ marginBottom: 12 }}>
          <button onClick={() => setOpen(open === ph.id ? null : ph.id)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", borderRadius: open === ph.id ? "14px 14px 0 0" : 14,
            border: "none", background: open === ph.id ? ph.color : "#fff",
            color: open === ph.id ? "#fff" : "#111",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer",
            transition: "all 0.2s", textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{ph.icon}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>{ph.name}</span>
              <span style={{ fontSize: 12, background: open === ph.id ? "rgba(255,255,255,0.2)" : ph.light, padding: "2px 8px", borderRadius: 20, color: open === ph.id ? "#fff" : ph.color, fontWeight: 600 }}>{ph.days}</span>
            </div>
            <span style={{ fontSize: 18, transform: open === ph.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {open === ph.id && (
            <div style={{
              background: "#FAFAFA", borderRadius: "0 0 14px 14px",
              border: "1px solid #F3F4F6", borderTop: "none",
              padding: 20, display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14,
            }}>
              {ph.resources.map((r, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${ph.light}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{r.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{r.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardView({ checked, setChecked, prenom, startDate }) {
  const total  = CHECKLIST.length;
  const done   = CHECKLIST.filter(c => checked[c.id]).length;
  const pct    = Math.round((done / total) * 100);
  const endDate = addDays(startDate, 89);

  return (
    <div>
      {/* Global */}
      <div style={{ background: "#111", borderRadius: 20, padding: "28px 32px", marginBottom: 32, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <ProgressRing pct={pct} color="#4ADE80" size={80} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{pct}%</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            {prenom}, {done} / {total} actions complétées
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
            {pct < 33 ? "Vous débutez votre parcours — continuez !" : pct < 66 ? "Belle progression, vous avancez bien." : pct < 100 ? "La ligne d'arrivée est proche !" : "🎉 Félicitations, 90 jours accomplis !"}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>
            Fin de parcours : <strong style={{ color: "#9CA3AF" }}>{formatDateFull(endDate)}</strong>
          </div>
        </div>
      </div>

      {/* Per-phase */}
      {PHASES.map(ph => {
        const items  = CHECKLIST.filter(c => c.phase === ph.id);
        const phDone = items.filter(c => checked[c.id]).length;
        const phPct  = Math.round((phDone / items.length) * 100);
        const phEnd  = addDays(startDate, ph.endDay);
        return (
          <div key={ph.id} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>{ph.icon}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#111" }}>{ph.name}</span>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>jusqu'au {formatDate(phEnd)}</span>
              <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${phPct}%`, height: "100%", background: ph.color, borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: ph.color, minWidth: 36, textAlign: "right" }}>{phPct}%</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 28 }}>
              {items.map(item => (
                <label key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  padding: "10px 14px", borderRadius: 10,
                  background: checked[item.id] ? ph.light : "#FAFAFA",
                  border: `1px solid ${checked[item.id] ? ph.color + "44" : "#F3F4F6"}`,
                  transition: "all 0.15s",
                }}>
                  <div onClick={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))} style={{
                    width: 20, height: 20, borderRadius: 6,
                    border: checked[item.id] ? "none" : "2px solid #D1D5DB",
                    background: checked[item.id] ? ph.color : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s",
                  }}>
                    {checked[item.id] && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 14, color: checked[item.id] ? "#374151" : "#6B7280", textDecoration: checked[item.id] ? "line-through" : "none", transition: "all 0.15s" }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [profile, setProfile] = useState(null);
  const [view, setView]       = useState("timeline");
  const [checked, setChecked] = useState({});

  if (!profile) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F2; font-family: 'DM Sans', sans-serif; }
      `}</style>
      <OnboardingScreen onStart={setProfile} />
    </>
  );

  const tabs = [
    { id: "timeline",  label: "📅 Timeline 90j" },
    { id: "resources", label: "📚 Ressources" },
    { id: "dashboard", label: "✅ Ma progression" },
  ];

  const donePct = Math.round((Object.values(checked).filter(Boolean).length / CHECKLIST.length) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F2; font-family: 'DM Sans', sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>

        {/* Header */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #F3F4F6",
          padding: "16px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#111", letterSpacing: -0.5 }}>
              Boîte à outils · {profile.prenom}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Prise de poste : {formatDateFull(profile.startDate)} · Fin : {formatDateFull(addDays(profile.startDate, 89))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Progression</div>
            <div style={{ background: "#111", color: "#fff", fontWeight: 800, fontSize: 14, padding: "6px 14px", borderRadius: 999 }}>
              {donePct}%
            </div>
            <button onClick={() => { setProfile(null); setChecked({}); }}
              style={{ fontSize: 12, color: "#9CA3AF", background: "none", border: "1px solid #E5E7EB", borderRadius: 99, padding: "5px 12px", cursor: "pointer" }}>
              ↩ Recommencer
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px" }}>
          <TabBar tabs={tabs} active={view} onChange={setView} />
          {view === "timeline"  && <TimelineView  startDate={profile.startDate} />}
          {view === "resources" && <ResourcesView />}
          {view === "dashboard" && <DashboardView checked={checked} setChecked={setChecked} prenom={profile.prenom} startDate={profile.startDate} />}
        </div>

      </div>
    </>
  );
}
