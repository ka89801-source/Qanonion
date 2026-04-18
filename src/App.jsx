import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

const STORAGE_KEY = "qanuniyoun-theme";
const ROLE_OPTIONS = ["محامٍ", "مستشار قانوني", "طالب قانون", "باحث قانوني", "مهتم بالقانون"];
const CATEGORIES = ["الكل", "نظام العمل", "قانون تجاري", "قانون دولي", "نصائح مهنية", "أنظمة جديدة", "أحكام قضائية"];

const SAMPLE_POSTS = [
  {
    id: "p1",
    author_name: "د. سارة الحربي",
    author_role: "محامية",
    author_bio: "محامية متخصصة في قانون العمل السعودي | ١٢ سنة خبرة",
    content: `تعديل جوهري في نظام العمل السعودي:\n\nصدر المرسوم الملكي رقم (م/14) بتعديل المادة (٧٥) من نظام العمل، حيث أصبحت فترة الإشعار للعقود غير محددة المدة (٦٠) يومًا بدلاً من (٣٠) يومًا.\n\nهذا التعديل يمنح كلا الطرفين وقتًا كافيًا للترتيب، ويُعد خطوة مهمة نحو تحقيق التوازن في العلاقة التعاقدية.`,
    likes: 89,
    comments: [
      { id: "c1", author_name: "أ. فهد القحطاني", text: "إضافة ممتازة، شكرًا على التوضيح. هل ينطبق هذا بأثر رجعي على العقود القائمة؟", timestamp: Date.now() - 3600000 },
      { id: "c2", author_name: "نورة العتيبي", text: "معلومة قيّمة جدًا، سأضيفها لبحثي الجامعي.", timestamp: Date.now() - 1800000 },
    ],
    timestamp: Date.now() - 7200000,
    category: "نظام العمل",
    verified: true,
  },
  {
    id: "p2",
    author_name: "أ. عبدالرحمن الشمري",
    author_role: "محامي",
    author_bio: "محامي ومحكّم تجاري معتمد | عضو الهيئة السعودية للمحامين",
    content: `نصيحة مهنية للمحامين الجدد:\n\nلا تقبل أي قضية دون قراءة كاملة للملف. كثير من المحامين يتسرعون في قبول القضايا ثم يكتشفون لاحقًا أن موقف موكلهم ضعيف.\n\nخذ وقتك في:\n• دراسة المستندات\n• تقييم الأدلة\n• فهم موقف الطرف الآخر\n\nهذا يحفظ سمعتك المهنية ويحمي حقوق موكلك.`,
    likes: 156,
    comments: [
      { id: "c3", author_name: "د. سارة الحربي", text: "كلام ذهبي. أضيف أيضًا: لا تخجل من رفض القضية إذا شعرت أنها خارج تخصصك.", timestamp: Date.now() - 5400000 },
    ],
    timestamp: Date.now() - 14400000,
    category: "نصائح مهنية",
    verified: true,
  },
  {
    id: "p3",
    author_name: "أ. فهد القحطاني",
    author_role: "مستشار قانوني",
    author_bio: "متخصص في الأنظمة التجارية والشركات",
    content: `هل تعلم؟\n\nالمادة (٧٧) من نظام العمل السعودي تنص على أنه إذا أُنهي العقد لسبب غير مشروع، يحق للطرف المتضرر تعويض لا يقل عن أجر شهرين.\n\nلكن المحكمة العمالية قد تحكم بتعويض أعلى بكثير إذا ثبت أن الفصل كان تعسفيًا وأن العامل لحقه ضرر معنوي أو مادي كبير.\n\nالمفتاح: توثيق كل شيء من بداية العلاقة التعاقدية.`,
    likes: 203,
    comments: [],
    timestamp: Date.now() - 28800000,
    category: "نظام العمل",
    verified: true,
  },
];

function Logo({ size = 32, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 8L16 28V56C16 82 34 106 60 114C86 106 104 82 104 56V28L60 8Z" fill={color} opacity="0.12" stroke={color} strokeWidth="3.5" strokeLinejoin="round"/>
      <line x1="60" y1="32" x2="60" y2="88" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="38" y1="42" x2="82" y2="42" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M38 42L30 62C30 62 30 68 38 68C46 68 46 62 46 62L38 42Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} opacity="0.2"/>
      <path d="M82 42L74 62C74 62 74 68 82 68C90 68 90 62 90 62L82 42Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} opacity="0.2"/>
      <path d="M48 88H72" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <rect x="50" y="80" width="20" height="8" rx="1.5" fill={color} opacity="0.25" stroke={color} strokeWidth="1.5"/>
      <line x1="60" y1="80" x2="60" y2="88" stroke={color} strokeWidth="1"/>
    </svg>
  );
}

const Icons = {
  Home: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Search: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Plus: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  User: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Heart: ({ size = 18, filled }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  Comment: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  Verified: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 2px rgba(29,155,240,0.35))" }}><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.89-.81-3.9s-2.52-1.26-3.91-.81C14.67 2.88 13.43 2 12 2s-2.67.88-3.34 2.19c-1.39-.46-2.89-.2-3.9.81s-1.26 2.52-.81 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.89.81 3.9s2.52 1.26 3.91.81C9.33 21.12 10.57 22 12 22s2.67-.88 3.34-2.19c1.39.46 2.89.2 3.9-.81s1.26-2.52.81-3.91C21.12 14.67 22 13.43 22.25 12z" fill="#1D9BF0"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Moon: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
  Sun: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
  Send: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Close: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Bell: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Share: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  Bookmark: ({ size = 18, filled }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  Back: ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
  Logout: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Shield: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Sparkles: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z" /><path d="M5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" /></svg>,
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} س`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `منذ ${days} ي`;
  return `منذ ${Math.floor(days / 7)} أسبوع`;
}

function Avatar({ name, size = 42, verified = false, showBadge = true }) {
  const safeName = name || "مستخدم قانونيون";
  const colors = ["linear-gradient(135deg, #1a365d, #2d5a87)", "linear-gradient(135deg, #2d3748, #4a5568)", "linear-gradient(135deg, #1a4731, #2d6a4f)", "linear-gradient(135deg, #553c2e, #8b6f4e)", "linear-gradient(135deg, #3c1a5e, #6b3fa0)"];
  const idx = safeName.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const initials = safeName.split(" ").filter((w) => !["د.", "أ.", "م."].includes(w)).map((w) => w[0]).slice(0, 2).join("") || "ق";
  return <div style={{ position: "relative", flexShrink: 0 }}><div style={{ width: size, height: size, borderRadius: "50%", background: colors[idx], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: size * 0.35, fontWeight: 600, fontFamily: "Tajawal, sans-serif" }}>{initials}</div>{verified && showBadge ? <div style={{ position: "absolute", bottom: -2, left: -2, background: "var(--bg)", borderRadius: "50%", width: size * 0.42, height: size * 0.42, display: "flex", alignItems: "center", justifyContent: "center", padding: 1 }}><Icons.Verified size={size * 0.4} /></div> : null}</div>;
}

function mapProfileToUser(profile) {
  return { id: profile.id, name: profile.full_name || "مستخدم قانونيون", role: profile.role || "مهتم بالقانون", bio: profile.bio || "مرحبًا بك في مجتمع قانونيون.", verified: false, postsCount: SAMPLE_POSTS.filter((post) => post.author_name === profile.full_name).length, followersCount: 0 };
}

function FeatureChip({ icon, title, darkMode }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 999, background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)", color: darkMode ? "#d5d5d8" : "#324055", border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(26,54,93,0.08)", backdropFilter: "blur(10px)" }}><span style={{ display: "flex", alignItems: "center" }}>{icon}</span><span style={{ fontSize: 12, fontWeight: 700 }}>{title}</span></div>;
}

function AuthScreen({ darkMode, authMode, setAuthMode, authForm, setAuthForm, onAuthSubmit, authLoading, authError }) {
  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "radial-gradient(circle at top, #1b1629 0%, #0a0a0b 48%, #09090b 100%)" : "linear-gradient(180deg, #eef4ff 0%, #fafcff 35%, #ffffff 100%)", color: darkMode ? "#f0f0f2" : "#162033", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Tajawal', 'Cairo', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: darkMode ? "rgba(201,168,76,0.12)" : "rgba(26,54,93,0.08)", top: -140, right: -120, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: darkMode ? "rgba(46,134,171,0.12)" : "rgba(108,99,255,0.08)", bottom: -120, left: -100, filter: "blur(30px)" }} />
      <div style={{ width: "100%", maxWidth: 1100, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, position: "relative", zIndex: 1 }}>
        <div style={{ padding: "22px 8px 22px 0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 58, height: 58, borderRadius: 18, display: "grid", placeItems: "center", background: darkMode ? "rgba(201,168,76,0.12)" : "rgba(26,54,93,0.08)", border: darkMode ? "1px solid rgba(201,168,76,0.18)" : "1px solid rgba(26,54,93,0.12)" }}><Logo size={32} color={darkMode ? "#d3b567" : "#1a365d"} /></div><div><div style={{ fontSize: 14, fontWeight: 700, color: darkMode ? "#c9a84c" : "#1a365d" }}>مجتمع قانوني عربي حديث</div><div style={{ fontSize: 13, color: darkMode ? "#9fa0a8" : "#617086" }}>تجربة أبسط للدخول والمشاركة القانونية</div></div></div>
          <div>
            <h1 style={{ fontSize: 42, lineHeight: 1.25, fontWeight: 800, marginBottom: 12 }}>سجّل دخولك إلى <span style={{ color: darkMode ? "#d3b567" : "#1a365d" }}>قانونيون</span> بسهولة وأناقة</h1>
            <p style={{ fontSize: 17, lineHeight: 1.95, color: darkMode ? "#b6b7bd" : "#58677c", maxWidth: 560 }}>أنشئ حسابك بخطوات سريعة، أكمل ملفك الشخصي، ثم ابدأ التفاعل داخل مجتمع قانوني منظم وواضح ومصمم باللغة العربية من البداية للنهاية.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <FeatureChip darkMode={darkMode} icon={<Icons.Shield size={15} />} title="حساب شخصي منظم" />
            <FeatureChip darkMode={darkMode} icon={<Icons.Sparkles size={15} />} title="واجهة عربية سلسة" />
            <FeatureChip darkMode={darkMode} icon={<Icons.User size={15} />} title="بدء سريع وبسيط" />
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {["أدخل بياناتك مرة واحدة فقط", "أكمل الصفة المهنية والنبذة خلال لحظات", "ابدأ التصفح والنشر مباشرة بعد الدخول"].map((item) => <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: darkMode ? "#d4d5db" : "#415066" }}><div style={{ width: 8, height: 8, borderRadius: 999, background: darkMode ? "#c9a84c" : "#1a365d" }} /> <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span></div>)}
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 470, justifySelf: "end" }}>
          <div style={{ background: darkMode ? "rgba(20,20,22,0.82)" : "rgba(255,255,255,0.88)", border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(26,54,93,0.08)", borderRadius: 30, boxShadow: darkMode ? "0 18px 60px rgba(0,0,0,0.35)" : "0 18px 60px rgba(26,54,93,0.12)", padding: 28, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: darkMode ? "#c9a84c" : "#1a365d", marginBottom: 6 }}>{authMode === "login" ? "مرحبًا بعودتك" : "أنشئ حسابًا جديدًا"}</div>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>{authMode === "login" ? "تسجيل الدخول" : "بدء الاستخدام"}</h2>
              </div>
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{ padding: "10px 14px", borderRadius: 14, background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(26,54,93,0.06)", color: darkMode ? "#f0f0f2" : "#1a365d", fontWeight: 700, fontSize: 13 }}>{authMode === "login" ? "حساب جديد" : "لديك حساب؟"}</button>
            </div>

            <div style={{ display: "flex", background: darkMode ? "#1b1b1f" : "#f5f7fb", borderRadius: 18, padding: 5, marginBottom: 18, border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(26,54,93,0.06)" }}>
              <button type="button" onClick={() => setAuthMode("login")} style={{ flex: 1, padding: "12px 14px", borderRadius: 14, background: authMode === "login" ? (darkMode ? "linear-gradient(135deg,#2a2a32,#1e1e24)" : "#ffffff") : "transparent", color: authMode === "login" ? (darkMode ? "#ffffff" : "#1a365d") : (darkMode ? "#8e8e93" : "#6e6e73"), fontWeight: 800, boxShadow: authMode === "login" && !darkMode ? "0 8px 20px rgba(26,54,93,0.08)" : "none" }}>دخول</button>
              <button type="button" onClick={() => setAuthMode("signup")} style={{ flex: 1, padding: "12px 14px", borderRadius: 14, background: authMode === "signup" ? (darkMode ? "linear-gradient(135deg,#2a2a32,#1e1e24)" : "#ffffff") : "transparent", color: authMode === "signup" ? (darkMode ? "#ffffff" : "#1a365d") : (darkMode ? "#8e8e93" : "#6e6e73"), fontWeight: 800, boxShadow: authMode === "signup" && !darkMode ? "0 8px 20px rgba(26,54,93,0.08)" : "none" }}>إنشاء حساب</button>
            </div>

            <form onSubmit={onAuthSubmit} style={{ display: "grid", gap: 14 }}>
              {authMode === "signup" ? <Field label="الاسم الكامل"><input value={authForm.fullName} onChange={(e) => setAuthForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="مثل: خالد الفيفي" style={inputStyle(darkMode)} /></Field> : null}
              <Field label="البريد الإلكتروني"><input type="email" value={authForm.email} onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="name@example.com" style={inputStyle(darkMode)} /></Field>
              <Field label="كلمة المرور"><input type="password" value={authForm.password} onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={authMode === "login" ? "أدخل كلمة المرور" : "أنشئ كلمة مرور قوية"} style={inputStyle(darkMode)} /></Field>

              {authMode === "signup" ? <div style={{ display: "grid", gap: 8, padding: "14px 16px", borderRadius: 18, background: darkMode ? "rgba(201,168,76,0.09)" : "rgba(26,54,93,0.05)", color: darkMode ? "#e3d6af" : "#415066", lineHeight: 1.8, fontSize: 13 }}><div style={{ fontWeight: 800 }}>بعد إنشاء الحساب ستكمل فقط:</div><div>• الصفة المهنية</div><div>• نبذة مختصرة</div></div> : null}

              {authError ? <div style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", borderRadius: 16, padding: "13px 14px", fontSize: 14, lineHeight: 1.7 }}>{authError}</div> : null}

              <button type="submit" disabled={authLoading} style={{ background: darkMode ? "linear-gradient(135deg,#d2b261,#b89644)" : "linear-gradient(135deg,#1a365d,#274a7d)", color: "white", borderRadius: 18, padding: "15px 16px", fontWeight: 800, fontSize: 15, boxShadow: darkMode ? "0 14px 30px rgba(201,168,76,0.16)" : "0 14px 30px rgba(26,54,93,0.18)", opacity: authLoading ? 0.72 : 1 }}>{authLoading ? "جاري التنفيذ..." : authMode === "login" ? "دخول إلى الحساب" : "إنشاء الحساب والمتابعة"}</button>
            </form>

            <div style={{ marginTop: 18, paddingTop: 16, borderTop: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(26,54,93,0.08)", color: darkMode ? "#8e8e93" : "#6e6e73", fontSize: 12.5, lineHeight: 1.9 }}>
              {authMode === "login" ? "أدخل بياناتك الحالية للعودة إلى حسابك ومتابعة نشاطك داخل التطبيق." : "ستتمكن بعد إنشاء الحساب من إكمال ملفك الشخصي والدخول مباشرة إلى مجتمع قانونيون."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({ darkMode, profileForm, setProfileForm, onSubmit, loading, error, email }) {
  return <div style={{ minHeight: "100vh", background: darkMode ? "#0a0a0b" : "#fafafa", color: darkMode ? "#f0f0f2" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Tajawal', 'Cairo', sans-serif" }}><div style={{ width: "100%", maxWidth: 520, background: darkMode ? "#141416" : "#ffffff", border: darkMode ? "1px solid #2c2c2e" : "1px solid #e5e5ea", borderRadius: 24, boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.35)" : "0 8px 32px rgba(0,0,0,0.08)", padding: 24 }}><h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>أكمل ملفك الشخصي</h2><p style={{ color: darkMode ? "#8e8e93" : "#6e6e73", lineHeight: 1.8, marginBottom: 18 }}>بقيت خطوة واحدة فقط حتى تبدأ استخدام قانونيون. البريد الحالي: <strong>{email}</strong></p><form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}><Field label="الصفة المهنية"><select value={profileForm.role} onChange={(e) => setProfileForm((prev) => ({ ...prev, role: e.target.value }))} style={inputStyle(darkMode)}><option value="">اختر الصفة المهنية</option>{ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}</select></Field><Field label="نبذة مختصرة"><textarea value={profileForm.bio} onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="عرّف بنفسك بشكل مختصر" style={{ ...inputStyle(darkMode), minHeight: 120, resize: "vertical" }} /></Field>{error ? <div style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", borderRadius: 14, padding: "12px 14px", fontSize: 14, lineHeight: 1.7 }}>{error}</div> : null}<button type="submit" disabled={loading} style={{ background: darkMode ? "#c9a84c" : "#1a365d", color: "white", borderRadius: 16, padding: "13px 16px", fontWeight: 800, fontSize: 15, opacity: loading ? 0.7 : 1 }}>{loading ? "جاري الحفظ..." : "حفظ والبدء"}</button></form></div></div>;
}

function Field({ label, children }) {
  return <label style={{ display: "grid", gap: 8 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>{children}</label>;
}

function inputStyle(darkMode) {
  return { width: "100%", borderRadius: 16, border: darkMode ? "1px solid #2c2c2e" : "1px solid #e5e5ea", background: darkMode ? "#1c1c1f" : "#ffffff", color: darkMode ? "#f0f0f2" : "#1a1a1a", padding: "13px 14px", outline: "none", fontSize: 15, fontFamily: "Tajawal, sans-serif" };
}

export default function Qanuniyoun() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(STORAGE_KEY) === "dark");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "" });
  const [profileForm, setProfileForm] = useState({ role: "", bio: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [currentPage, setCurrentPage] = useState("feed");
  const [pageHistory, setPageHistory] = useState(["feed"]);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, darkMode ? "dark" : "light"); }, [darkMode]);

  const fetchProfile = useCallback(async (userId) => { const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle(); if (error) throw error; return data; }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const currentSession = data.session;
        setSession(currentSession);
        if (currentSession?.user) {
          const existingProfile = await fetchProfile(currentSession.user.id);
          if (!mounted) return;
          setProfile(existingProfile);
          if (existingProfile) {
            setProfileForm({ role: existingProfile.role || "", bio: existingProfile.bio || "" });
            setAuthForm((prev) => ({ ...prev, fullName: existingProfile.full_name || prev.fullName, email: currentSession.user.email || prev.email }));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoadingApp(false);
      }
    }
    init();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        try {
          const existingProfile = await fetchProfile(newSession.user.id);
          setProfile(existingProfile);
        } catch (error) {
          console.error(error);
        }
      } else {
        setProfile(null);
      }
      setLoadingApp(false);
    });
    return () => { mounted = false; authListener.subscription.unsubscribe(); };
  }, [fetchProfile]);

  const currentUser = useMemo(() => {
    if (profile) return mapProfileToUser(profile);
    if (session?.user) return { id: session.user.id, name: authForm.fullName || session.user.email?.split("@")[0] || "مستخدم قانونيون", role: profileForm.role || "مهتم بالقانون", bio: profileForm.bio || "مرحبًا بك في مجتمع قانونيون.", verified: false, postsCount: 0, followersCount: 0 };
    return null;
  }, [profile, session, authForm.fullName, profileForm.role, profileForm.bio]);

  const visibleUsers = useMemo(() => {
    const feedUsers = SAMPLE_POSTS.map((post) => ({ id: `${post.id}-author`, name: post.author_name, role: post.author_role, bio: post.author_bio, verified: post.verified, postsCount: SAMPLE_POSTS.filter((item) => item.author_name === post.author_name).length, followersCount: post.verified ? 1200 : 180 }));
    const merged = currentUser ? [currentUser, ...feedUsers] : feedUsers;
    return merged.filter((user, index, self) => self.findIndex((entry) => entry.name === user.name) === index);
  }, [currentUser]);

  const getUserByName = useCallback((name) => visibleUsers.find((user) => user.name === name), [visibleUsers]);
  const navigateTo = useCallback((page, pUser) => { setPageHistory((prev) => [...prev, page]); setCurrentPage(page); if (pUser) setProfileUser(pUser); }, []);
  const goBack = useCallback(() => { setPageHistory((prev) => { if (prev.length <= 1) return prev; const newHistory = prev.slice(0, -1); setCurrentPage(newHistory[newHistory.length - 1]); return newHistory; }); }, []);
  const canGoBack = pageHistory.length > 1;

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password.trim();
    const fullName = authForm.fullName.trim();
    if (!email || !password) { setAuthError("يرجى تعبئة البريد الإلكتروني وكلمة المرور."); return; }
    if (authMode === "signup" && !fullName) { setAuthError("يرجى إدخال الاسم الكامل."); return; }
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          setSession(data.session ?? null);
          setAuthForm((prev) => ({ ...prev, email, fullName }));
          if (!data.session) {
            setAuthError("تم إنشاء الحساب بنجاح. جرّب الآن تسجيل الدخول بنفس البريد وكلمة المرور.");
            setAuthMode("login");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        if (data.user) { const existingProfile = await fetchProfile(data.user.id); setProfile(existingProfile); }
      }
    } catch (error) {
      setAuthError(error.message || "تعذر تنفيذ العملية حاليًا.");
    } finally { setAuthLoading(false); }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!session?.user) return;
    if (!profileForm.role.trim() || !profileForm.bio.trim()) { setProfileError("يرجى تعبئة الصفة المهنية والنبذة المختصرة."); return; }
    setProfileError("");
    setProfileLoading(true);
    try {
      const payload = { id: session.user.id, email: session.user.email, full_name: authForm.fullName.trim() || session.user.email?.split("@")[0] || "مستخدم قانونيون", role: profileForm.role.trim(), bio: profileForm.bio.trim() };
      const { data, error } = await supabase.from("profiles").upsert(payload).select().single();
      if (error) throw error;
      setProfile(data);
      setProfileUser(mapProfileToUser(data));
    } catch (error) {
      setProfileError(error.message || "تعذر حفظ الملف الشخصي الآن.");
    } finally { setProfileLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); setProfile(null); setAuthForm({ fullName: "", email: "", password: "" }); setProfileForm({ role: "", bio: "" }); setCurrentPage("feed"); setPageHistory(["feed"]); };
  const handleLike = (postId) => { if (!currentUser) return; setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, likes: post.likes + 1 } : post)); };
  const handleComment = (postId, text) => { if (!text.trim() || !currentUser) return; setPosts((prev) => prev.map((post) => post.id !== postId ? post : { ...post, comments: [...post.comments, { id: `c${Date.now()}`, author_name: currentUser.name, text: text.trim(), timestamp: Date.now() }] })); };
  const handleNewPost = (content, category) => { if (!content.trim() || !currentUser) return; setPosts((prev) => [{ id: `p${Date.now()}`, author_name: currentUser.name, author_role: currentUser.role, author_bio: currentUser.bio, content: content.trim(), likes: 0, comments: [], timestamp: Date.now(), category: category || "نصائح مهنية", verified: currentUser.verified }, ...prev]); setShowCompose(false); };
  const filteredPosts = posts.filter((post) => { if (selectedCategory !== "الكل" && post.category !== selectedCategory) return false; if (searchQuery && !post.content.includes(searchQuery) && !post.author_name.includes(searchQuery)) return false; return true; });

  const theme = darkMode ? { "--bg": "#0a0a0b", "--bg-secondary": "#141416", "--bg-tertiary": "#1c1c1f", "--bg-hover": "#222225", "--text": "#f0f0f2", "--text-secondary": "#8e8e93", "--text-tertiary": "#636366", "--border": "#2c2c2e", "--border-light": "#1c1c1e", "--accent": "#c9a84c", "--accent-bg": "rgba(201,168,76,0.1)", "--card-bg": "#141416", "--overlay": "rgba(0,0,0,0.7)", "--like-color": "#ff4757" } : { "--bg": "#fafafa", "--bg-secondary": "#ffffff", "--bg-tertiary": "#f5f5f7", "--bg-hover": "#f0f0f2", "--text": "#1a1a1a", "--text-secondary": "#6e6e73", "--text-tertiary": "#aeaeb2", "--border": "#e5e5ea", "--border-light": "#f2f2f7", "--accent": "#1a365d", "--accent-bg": "rgba(26,54,93,0.06)", "--card-bg": "#ffffff", "--overlay": "rgba(0,0,0,0.4)", "--like-color": "#ff3b30" };

  if (loadingApp) return <FullScreenMessage darkMode={darkMode} title="جاري تجهيز التطبيق..." subtitle="نقوم بتحميل بيانات المستخدم والتحقق من الجلسة الحالية." />;
  if (!session) return <AuthScreen darkMode={darkMode} authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} onAuthSubmit={handleAuthSubmit} authLoading={authLoading} authError={authError} />;
  if (!profile) return <OnboardingScreen darkMode={darkMode} profileForm={profileForm} setProfileForm={setProfileForm} onSubmit={handleProfileSubmit} loading={profileLoading} error={profileError} email={session.user.email} />;

  const pageTitle = { feed: null, explore: "استكشف", notifications: "الإشعارات", profile: profileUser?.name || "الملف الشخصي" };

  return (
    <div dir="rtl" style={{ ...theme, fontFamily: "'Tajawal', 'Cairo', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh", maxWidth: 680, margin: "0 auto", position: "relative", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${darkMode ? "#0a0a0b" : "#fafafa"}; overflow-x: hidden; }
        ::selection { background: var(--accent); color: white; }
        input, textarea, button, select { font-family: 'Tajawal', sans-serif; }
        button { cursor: pointer; border: none; background: none; color: inherit; }
        textarea { resize: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease-out both; }
      `}</style>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: darkMode ? "rgba(10,10,11,0.88)" : "rgba(250,250,250,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-light)", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{canGoBack && currentPage !== "feed" ? <button onClick={goBack} style={{ padding: 6, borderRadius: 10, color: "var(--accent)", display: "flex", alignItems: "center" }}><Icons.Back size={22} /></button> : null}{currentPage === "feed" ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Logo size={30} color={darkMode ? "#c9a84c" : "#1a365d"} /><span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em", color: "var(--accent)" }}>قانونيون</span></div> : <span style={{ fontWeight: 700, fontSize: 17 }}>{pageTitle[currentPage]}</span>}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><button onClick={() => setShowSearch(!showSearch)} style={{ padding: 8, borderRadius: 10, color: "var(--text-secondary)" }}><Icons.Search size={20} /></button><button onClick={() => setDarkMode((prev) => !prev)} style={{ padding: 8, borderRadius: 10, color: "var(--text-secondary)" }}>{darkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}</button><button onClick={handleLogout} style={{ padding: 8, borderRadius: 10, color: "var(--text-secondary)" }} title="تسجيل الخروج"><Icons.Logout size={18} /></button><button onClick={() => { setProfileUser(currentUser); navigateTo("profile", currentUser); }} style={{ padding: 4, marginRight: 2 }}><Avatar name={currentUser.name} size={30} verified={false} /></button></div>
      </header>
      {showSearch ? <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)", animation: "fadeUp 0.25s ease-out" }}><div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-tertiary)", borderRadius: 12, padding: "10px 14px" }}><Icons.Search size={18} /><input type="text" placeholder="ابحث في المنشورات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus style={{ border: "none", background: "none", outline: "none", color: "var(--text)", fontSize: 15, width: "100%", direction: "rtl" }} />{searchQuery ? <button onClick={() => setSearchQuery("")} style={{ color: "var(--text-tertiary)" }}><Icons.Close size={16} /></button> : null}</div></div> : null}
      <main style={{ paddingBottom: 80 }}>{currentPage === "feed" ? <FeedPage posts={filteredPosts} currentUser={currentUser} onLike={handleLike} onComment={handleComment} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setSelectedPost={setSelectedPost} setProfileUser={(user) => navigateTo("profile", user)} getUserByName={getUserByName} /> : null}{currentPage === "explore" ? <ExplorePage posts={posts} users={visibleUsers} setProfileUser={(user) => navigateTo("profile", user)} /> : null}{currentPage === "notifications" ? <NotificationsPage /> : null}{currentPage === "profile" && profileUser ? <ProfilePage user={profileUser} posts={posts.filter((post) => post.author_name === profileUser.name)} currentUser={currentUser} onLike={handleLike} onComment={handleComment} setSelectedPost={setSelectedPost} /> : null}</main>
      <button onClick={() => setShowCompose(true)} style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", width: 54, height: 54, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(26,54,93,0.3)", zIndex: 90 }}><Icons.Plus size={24} /></button>
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 680, background: darkMode ? "rgba(10,10,11,0.92)" : "rgba(250,250,250,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-around", alignItems: "center", height: 58, zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>{[{ id: "feed", icon: Icons.Home, label: "الرئيسية" }, { id: "explore", icon: Icons.Search, label: "استكشف" }, { id: "notifications", icon: Icons.Bell, label: "الإشعارات" }, { id: "profile", icon: Icons.User, label: "حسابي" }].map((tab) => <button key={tab.id} onClick={() => { if (tab.id === "profile") setProfileUser(currentUser); setPageHistory([tab.id]); setCurrentPage(tab.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 16px", color: currentPage === tab.id ? "var(--accent)" : "var(--text-tertiary)", fontSize: 10, fontWeight: currentPage === tab.id ? 700 : 400 }}><tab.icon size={22} /><span>{tab.label}</span></button>)}</nav>
      {showCompose ? <ComposeModal currentUser={currentUser} onPost={handleNewPost} onClose={() => setShowCompose(false)} /> : null}
      {selectedPost ? <PostDetailModal post={selectedPost} currentUser={currentUser} onLike={handleLike} onComment={handleComment} onClose={() => setSelectedPost(null)} /> : null}
    </div>
  );
}

function FullScreenMessage({ darkMode, title, subtitle }) {
  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: darkMode ? "#0a0a0b" : "#fafafa", color: darkMode ? "#f0f0f2" : "#1a1a1a", fontFamily: "'Tajawal', 'Cairo', sans-serif", padding: 20, textAlign: "center" }}><Logo size={42} color={darkMode ? "#c9a84c" : "#1a365d"} /><h2 style={{ fontSize: 26, fontWeight: 800 }}>{title}</h2><p style={{ maxWidth: 420, color: darkMode ? "#8e8e93" : "#6e6e73", lineHeight: 1.8 }}>{subtitle}</p></div>;
}

function FeedPage({ posts, currentUser, onLike, onComment, selectedCategory, setSelectedCategory, setSelectedPost, setProfileUser, getUserByName }) {
  return <div><div style={{ display: "flex", gap: 8, padding: "14px 16px", overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none", borderBottom: "1px solid var(--border-light)", WebkitOverflowScrolling: "touch" }}>{CATEGORIES.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: selectedCategory === cat ? "var(--accent)" : "var(--bg-tertiary)", color: selectedCategory === cat ? "white" : "var(--text-secondary)", flexShrink: 0 }}>{cat}</button>)}</div>{posts.length === 0 ? <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-tertiary)" }}><p style={{ fontSize: 16 }}>لا توجد منشورات في هذا التصنيف</p></div> : posts.map((post, i) => <PostCard key={post.id} post={post} user={getUserByName(post.author_name)} currentUser={currentUser} onLike={onLike} onComment={onComment} onExpand={() => setSelectedPost(post)} onUserClick={() => setProfileUser(getUserByName(post.author_name))} delay={i * 0.05} />)}</div>;
}

function PostCard({ post, user, currentUser, onLike, onComment, onExpand, onUserClick, delay = 0 }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const displayUser = user || { name: post.author_name, role: post.author_role, bio: post.author_bio, verified: post.verified };
  const submitComment = () => { if (!commentText.trim()) return; onComment(post.id, commentText); setCommentText(""); setShowCommentInput(false); };
  return <article className="fade-up" style={{ padding: "16px", borderBottom: "1px solid var(--border-light)", animationDelay: `${delay}s` }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div onClick={onUserClick} style={{ cursor: "pointer" }}><Avatar name={displayUser.name} size={42} verified={displayUser.verified} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}><span onClick={onUserClick} style={{ fontWeight: 700, fontSize: 15, cursor: "pointer", lineHeight: 1.3 }}>{displayUser.name}</span>{displayUser.verified ? <Icons.Verified size={16} /> : null}</div><div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 6 }}><span>{displayUser.role}</span><span>·</span><span>{timeAgo(post.timestamp)}</span></div></div>{post.category ? <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: "var(--accent-bg)", color: "var(--accent)" }}>{post.category}</span> : null}</div><div onClick={onExpand} style={{ fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-wrap", cursor: "pointer", marginBottom: 14, letterSpacing: "0.01em" }}>{post.content}</div><div style={{ display: "flex", alignItems: "center", gap: 2, marginRight: -6 }}><button onClick={() => { setLiked((prev) => !prev); setLikeCount((count) => liked ? count - 1 : count + 1); onLike(post.id); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, color: liked ? "var(--like-color)" : "var(--text-tertiary)", fontSize: 13, fontWeight: 500 }}><Icons.Heart size={18} filled={liked} /><span>{likeCount}</span></button><button onClick={() => setShowCommentInput(!showCommentInput)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, color: "var(--text-tertiary)", fontSize: 13, fontWeight: 500 }}><Icons.Comment size={18} /><span>{post.comments.length}</span></button><button style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 8, color: "var(--text-tertiary)" }}><Icons.Share size={16} /></button><div style={{ flex: 1 }} /><button onClick={() => setSaved((prev) => !prev)} style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 8, color: saved ? "var(--accent)" : "var(--text-tertiary)" }}><Icons.Bookmark size={17} filled={saved} /></button></div>{post.comments.length > 0 && !showCommentInput ? <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>{post.comments.slice(-2).map((comment) => <div key={comment.id} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, lineHeight: 1.7 }}><Avatar name={comment.author_name} size={26} verified={false} showBadge={false} /><div style={{ flex: 1 }}><span style={{ fontWeight: 700, marginLeft: 6 }}>{comment.author_name}</span><span style={{ color: "var(--text-secondary)" }}>{comment.text}</span></div></div>)}{post.comments.length > 2 ? <button onClick={onExpand} style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, padding: "4px 0" }}>عرض جميع التعليقات ({post.comments.length})</button> : null}</div> : null}{showCommentInput ? <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-light)", display: "flex", gap: 8, alignItems: "center" }}><Avatar name={currentUser.name} size={28} verified={false} showBadge={false} /><input autoFocus value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitComment()} placeholder="اكتب تعليقك..." style={{ flex: 1, border: "none", outline: "none", background: "var(--bg-tertiary)", borderRadius: 20, padding: "8px 14px", fontSize: 14, color: "var(--text)", direction: "rtl" }} /><button onClick={submitComment} disabled={!commentText.trim()} style={{ color: commentText.trim() ? "var(--accent)" : "var(--text-tertiary)", padding: 6 }}><Icons.Send size={18} /></button></div> : null}</article>;
}

function ComposeModal({ currentUser, onPost, onClose }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("نصائح مهنية");
  const textareaRef = useRef(null);
  const modalRef = useRef(null);
  useEffect(() => { document.body.style.overflow = "hidden"; const timer = setTimeout(() => textareaRef.current?.focus(), 150); return () => { document.body.style.overflow = ""; clearTimeout(timer); }; }, []);
  useEffect(() => { const handleResize = () => { if (modalRef.current && window.visualViewport) { modalRef.current.style.height = `${window.visualViewport.height}px`; modalRef.current.style.top = `${window.visualViewport.offsetTop}px`; } }; window.visualViewport?.addEventListener("resize", handleResize); window.visualViewport?.addEventListener("scroll", handleResize); handleResize(); return () => { window.visualViewport?.removeEventListener("resize", handleResize); window.visualViewport?.removeEventListener("scroll", handleResize); }; }, []);
  return <div ref={modalRef} style={{ position: "fixed", left: 0, right: 0, top: 0, bottom: 0, zIndex: 300, background: "var(--overlay)", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", animation: "fadeIn 0.2s ease-out" }} onClick={onClose}><div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 680, background: "var(--bg-secondary)", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", maxHeight: "100%", animation: "slideUp 0.3s ease-out" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border-light)" }}><button onClick={onClose} style={{ color: "var(--text-secondary)", padding: 4, fontSize: 15, fontWeight: 600 }}>إلغاء</button><span style={{ fontWeight: 700, fontSize: 16 }}>منشور جديد</span><button onClick={() => onPost(content, category)} disabled={!content.trim()} style={{ padding: "7px 20px", borderRadius: 20, background: content.trim() ? "var(--accent)" : "var(--bg-tertiary)", color: content.trim() ? "white" : "var(--text-tertiary)", fontWeight: 700, fontSize: 14 }}>نشر</button></div><div style={{ flex: 1, overflowY: "auto", padding: 16 }}><div style={{ display: "flex", gap: 10, marginBottom: 14 }}><Avatar name={currentUser.name} size={40} verified={false} /><div><div style={{ fontWeight: 700, fontSize: 15 }}>{currentUser.name}</div><div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{currentUser.role}</div></div></div><textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="شارك رأيك القانوني..." style={{ width: "100%", minHeight: 120, border: "none", outline: "none", background: "none", color: "var(--text)", fontSize: 16, lineHeight: 1.8, direction: "rtl" }} /><div style={{ marginTop: 12 }}><div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 8 }}>التصنيف:</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{CATEGORIES.filter((item) => item !== "الكل").map((cat) => <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 12, fontWeight: 600, background: category === cat ? "var(--accent)" : "var(--bg-tertiary)", color: category === cat ? "white" : "var(--text-secondary)" }}>{cat}</button>)}</div></div></div></div></div>;
}

function PostDetailModal({ post, currentUser, onLike, onComment, onClose }) {
  const [commentText, setCommentText] = useState("");
  const submitComment = () => { if (!commentText.trim()) return; onComment(post.id, commentText); setCommentText(""); };
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--overlay)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease-out" }} onClick={onClose}><div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 680, background: "var(--bg-secondary)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "slideUp 0.3s ease-out" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border-light)" }}><button onClick={onClose} style={{ color: "var(--text-secondary)", padding: 4 }}><Icons.Close size={22} /></button><span style={{ fontWeight: 700, fontSize: 16 }}>المنشور</span><div style={{ width: 30 }} /></div><div style={{ flex: 1, overflowY: "auto" }}><div style={{ padding: "18px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><Avatar name={post.author_name} size={46} verified={post.verified} /><div><div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontWeight: 700, fontSize: 16 }}>{post.author_name}</span>{post.verified ? <Icons.Verified size={16} /> : null}</div><div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{post.author_role} · {timeAgo(post.timestamp)}</div></div></div><div style={{ fontSize: 16, lineHeight: 1.9, whiteSpace: "pre-wrap", marginBottom: 16 }}>{post.content}</div><div style={{ display: "flex", gap: 20, padding: "12px 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", fontSize: 14, color: "var(--text-secondary)" }}><span><strong style={{ color: "var(--text)" }}>{post.likes}</strong> إعجاب</span><span><strong style={{ color: "var(--text)" }}>{post.comments.length}</strong> تعليق</span></div><div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}><button onClick={() => onLike(post.id)} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px" }}><Icons.Heart size={20} filled={false} /> إعجاب</button><button style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px" }}><Icons.Comment size={20} /> تعليق</button><button style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px" }}><Icons.Share size={20} /> مشاركة</button></div></div><div style={{ padding: "0 16px 20px" }}>{post.comments.map((comment) => <div key={comment.id} style={{ display: "flex", gap: 10, padding: "14px 0", borderBottom: "1px solid var(--border-light)" }}><Avatar name={comment.author_name} size={34} verified={false} /><div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}><span style={{ fontWeight: 700, fontSize: 14 }}>{comment.author_name}</span><span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{timeAgo(comment.timestamp)}</span></div><p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)" }}>{comment.text}</p></div></div>)}</div></div><div style={{ borderTop: "1px solid var(--border-light)", padding: "12px 16px", display: "flex", gap: 8, alignItems: "center", background: "var(--bg-secondary)" }}><Avatar name={currentUser.name} size={30} verified={false} showBadge={false} /><input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitComment()} placeholder="اكتب تعليقك..." style={{ flex: 1, border: "none", outline: "none", background: "var(--bg-tertiary)", borderRadius: 20, padding: "9px 14px", fontSize: 14, color: "var(--text)", direction: "rtl" }} /><button onClick={submitComment} disabled={!commentText.trim()} style={{ color: commentText.trim() ? "var(--accent)" : "var(--text-tertiary)", padding: 6 }}><Icons.Send size={18} /></button></div></div></div>;
}

function ExplorePage({ posts, users, setProfileUser }) {
  const trendingTopics = [{ tag: "#نظام_العمل_الجديد", count: "٤٢٠ منشور" }, { tag: "#المحاكم_العمالية", count: "٢١٨ منشور" }, { tag: "#الأنظمة_التجارية", count: "١٧٥ منشور" }, { tag: "#حقوق_المرأة_العاملة", count: "١٥٣ منشور" }, { tag: "#التحكيم_التجاري", count: "١٢٩ منشور" }];
  const topUsers = users.slice(0, 4);
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  return <div className="fade-up"><div style={{ padding: "20px 16px 8px" }}><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>المواضيع الرائجة</h2>{trendingTopics.map((topic, index) => <div key={topic.tag} style={{ padding: "14px 0", borderBottom: index < trendingTopics.length - 1 ? "1px solid var(--border-light)" : "none" }}><div style={{ fontWeight: 700, fontSize: 15, color: "var(--accent)", marginBottom: 2 }}>{topic.tag}</div><div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{topic.count}</div></div>)}</div><div style={{ height: 8, background: "var(--bg-tertiary)" }} /><div style={{ padding: "20px 16px" }}><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>حسابات مقترحة</h2>{topUsers.map((user) => <div key={user.id} onClick={() => setProfileUser(user)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", cursor: "pointer", borderBottom: "1px solid var(--border-light)" }}><Avatar name={user.name} size={48} verified={user.verified} /><div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</span>{user.verified ? <Icons.Verified size={15} /> : null}</div><p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 2 }}>{user.bio}</p></div><button style={{ padding: "6px 18px", borderRadius: 20, border: "1.5px solid var(--accent)", color: "var(--accent)", fontWeight: 700, fontSize: 13 }}>متابعة</button></div>)}</div><div style={{ height: 8, background: "var(--bg-tertiary)" }} /><div style={{ padding: "20px 16px" }}><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>الأكثر تفاعلاً</h2>{sortedPosts.map((post) => <div key={post.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border-light)" }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Avatar name={post.author_name} size={28} verified={post.verified} /><span style={{ fontWeight: 600, fontSize: 13 }}>{post.author_name}</span>{post.verified ? <Icons.Verified size={13} /> : null}</div><p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{post.content}</p><div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--text-tertiary)" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.Heart size={13} filled={false} /> {post.likes}</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.Comment size={13} /> {post.comments.length}</span></div></div>)}</div></div>;
}

function NotificationsPage() {
  const notifications = [{ text: "مرحبًا بك في قانونيون. اكتمل إنشاء حسابك بنجاح.", time: "الآن" }, { text: "ابدأ بنشر أول مشاركة لك ومتابعة المجتمع القانوني.", time: "منذ ١ د" }];
  return <div className="fade-up">{notifications.map((notif, index) => <div key={index} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border-light)", background: index === 0 ? "var(--accent-bg)" : "transparent" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} /><div style={{ flex: 1 }}><p style={{ fontSize: 14, lineHeight: 1.7 }}>{notif.text}</p><span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{notif.time}</span></div></div>)}</div>;
}

function ProfilePage({ user, posts, currentUser, onLike, onComment, setSelectedPost }) {
  const isOwnProfile = user.id === currentUser.id;
  return <div className="fade-up"><div style={{ padding: "24px 16px 20px", textAlign: "center", borderBottom: "1px solid var(--border-light)" }}><div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Avatar name={user.name} size={80} verified={user.verified} /></div><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}><h1 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h1>{user.verified ? <Icons.Verified size={19} /> : null}</div><div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>{user.role}</div><p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 340, margin: "0 auto 16px" }}>{user.bio}</p><div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 18 }}>{[{ val: posts.length, label: "منشور" }, { val: user.followersCount?.toLocaleString?.("ar-SA") || "٠", label: "متابع" }, { val: "٠", label: "متابَع" }].map((stat, index) => <div key={index} style={{ textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 18 }}>{stat.val}</div><div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{stat.label}</div></div>)}</div><button style={{ padding: "9px 28px", borderRadius: 20, border: isOwnProfile ? "1.5px solid var(--border)" : "none", background: isOwnProfile ? "transparent" : "var(--accent)", color: isOwnProfile ? "var(--text)" : "white", fontWeight: 700, fontSize: 14 }}>{isOwnProfile ? "ملفك الحالي" : "متابعة"}</button></div><div style={{ padding: "14px 16px 6px" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)" }}>المنشورات</h3></div>{posts.length === 0 ? <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-tertiary)" }}>لا توجد منشورات بعد</div> : posts.map((post, index) => <PostCard key={post.id} post={post} user={user} currentUser={currentUser} onLike={onLike} onComment={onComment} onExpand={() => setSelectedPost(post)} onUserClick={() => {}} delay={index * 0.05} />)}</div>;
}

