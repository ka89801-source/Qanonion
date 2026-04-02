import { useState, useEffect, useRef, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   قانونيون — منصة المجتمع القانوني العربي
   Qanuniyoun — Arabic Legal Community Platform
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// ─── Sample Data ───
const SAMPLE_USERS = [
  { id: "u1", name: "د. سارة الحربي", bio: "محامية متخصصة في قانون العمل السعودي | ١٢ سنة خبرة", verified: true, role: "محامية", postsCount: 47, followersCount: 1280 },
  { id: "u2", name: "أ. فهد القحطاني", bio: "مستشار قانوني | متخصص في الأنظمة التجارية والشركات", verified: true, role: "مستشار قانوني", postsCount: 35, followersCount: 890 },
  { id: "u3", name: "نورة العتيبي", bio: "طالبة قانون — جامعة الملك سعود | مهتمة بالقانون الجنائي", verified: false, role: "طالبة قانون", postsCount: 12, followersCount: 210 },
  { id: "u4", name: "أ. عبدالرحمن الشمري", bio: "محامي ومحكّم تجاري معتمد | عضو الهيئة السعودية للمحامين", verified: true, role: "محامي", postsCount: 63, followersCount: 2100 },
  { id: "u5", name: "ريم الدوسري", bio: "باحثة في القانون الدولي الإنساني | ماجستير من جامعة الأميرة نورة", verified: false, role: "باحثة قانونية", postsCount: 8, followersCount: 340 },
];

const SAMPLE_POSTS = [
  {
    id: "p1", userId: "u1",
    content: `تعديل جوهري في نظام العمل السعودي:\n\nصدر المرسوم الملكي رقم (م/14) بتعديل المادة (٧٥) من نظام العمل، حيث أصبحت فترة الإشعار للعقود غير محددة المدة (٦٠) يومًا بدلاً من (٣٠) يومًا.\n\nهذا التعديل يمنح كلا الطرفين وقتًا كافيًا للترتيب، ويُعد خطوة مهمة نحو تحقيق التوازن في العلاقة التعاقدية.`,
    likes: 89, likedBy: ["u2", "u3"],
    comments: [
      { id: "c1", userId: "u2", text: "إضافة ممتازة، شكرًا على التوضيح. هل ينطبق هذا بأثر رجعي على العقود القائمة؟", timestamp: Date.now() - 3600000 },
      { id: "c2", userId: "u3", text: "معلومة قيّمة جدًا، سأضيفها لبحثي الجامعي.", timestamp: Date.now() - 1800000 },
    ],
    timestamp: Date.now() - 7200000, category: "نظام العمل",
  },
  {
    id: "p2", userId: "u4",
    content: `نصيحة مهنية للمحامين الجدد:\n\nلا تقبل أي قضية دون قراءة كاملة للملف. كثير من المحامين يتسرعون في قبول القضايا ثم يكتشفون لاحقًا أن موقف موكلهم ضعيف.\n\nخذ وقتك في:\n• دراسة المستندات\n• تقييم الأدلة\n• فهم موقف الطرف الآخر\n\nهذا يحفظ سمعتك المهنية ويحمي حقوق موكلك.`,
    likes: 156, likedBy: ["u1", "u3", "u5"],
    comments: [
      { id: "c3", userId: "u1", text: "كلام ذهبي. أضيف أيضًا: لا تخجل من رفض القضية إذا شعرت أنها خارج تخصصك.", timestamp: Date.now() - 5400000 },
    ],
    timestamp: Date.now() - 14400000, category: "نصائح مهنية",
  },
  {
    id: "p3", userId: "u2",
    content: `هل تعلم؟\n\nالمادة (٧٧) من نظام العمل السعودي تنص على أنه إذا أُنهي العقد لسبب غير مشروع، يحق للطرف المتضرر تعويض لا يقل عن أجر شهرين.\n\nلكن المحكمة العمالية قد تحكم بتعويض أعلى بكثير إذا ثبت أن الفصل كان تعسفيًا وأن العامل لحقه ضرر معنوي أو مادي كبير.\n\nالمفتاح: توثيق كل شيء من بداية العلاقة التعاقدية.`,
    likes: 203, likedBy: ["u1", "u4", "u5"],
    comments: [],
    timestamp: Date.now() - 28800000, category: "نظام العمل",
  },
  {
    id: "p4", userId: "u5",
    content: `أنهيت للتو بحثي حول "مبدأ عدم الإعادة القسرية في القانون الدولي الإنساني وتطبيقاته في المنطقة العربية".\n\nمن أهم النتائج: هناك فجوة كبيرة بين النصوص القانونية الدولية والتطبيق الفعلي في بعض الدول العربية.\n\nسأشارك ملخصًا تفصيليًا قريبًا إن شاء الله.`,
    likes: 67, likedBy: ["u1", "u2"],
    comments: [
      { id: "c4", userId: "u4", text: "بحث مهم جدًا. ننتظر الملخص بشغف.", timestamp: Date.now() - 10000000 },
    ],
    timestamp: Date.now() - 43200000, category: "قانون دولي",
  },
  {
    id: "p5", userId: "u3",
    content: `سؤال لأهل الخبرة:\n\nفي حالة النزاع على بند الشرط الجزائي في العقود التجارية — هل المحكمة ملزمة بتطبيقه كما هو، أم لها سلطة تقديرية في تعديله؟\n\nدرسنا في الجامعة أن للقاضي سلطة تعديل الشرط الجزائي إذا كان مبالغًا فيه، لكن أريد أن أعرف الواقع العملي من تجاربكم.`,
    likes: 45, likedBy: ["u2"],
    comments: [
      { id: "c5", userId: "u2", text: "نعم، المحكمة لها سلطة تقديرية وفق المادة (١٨٠) من نظام المعاملات المدنية. الواقع العملي يؤكد ذلك.", timestamp: Date.now() - 20000000 },
      { id: "c6", userId: "u4", text: "صحيح ما ذكره الأستاذ فهد. وأضيف أن المحكمة تنظر في مدى التناسب بين الشرط والضرر الفعلي.", timestamp: Date.now() - 18000000 },
    ],
    timestamp: Date.now() - 50000000, category: "قانون تجاري",
  },
];

const CATEGORIES = ["الكل", "نظام العمل", "قانون تجاري", "قانون دولي", "نصائح مهنية", "أنظمة جديدة", "أحكام قضائية"];

// ─── Logo Component ───
function Logo({ size = 32, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path d="M60 8L16 28V56C16 82 34 106 60 114C86 106 104 82 104 56V28L60 8Z" fill={color} opacity="0.12" stroke={color} strokeWidth="3.5" strokeLinejoin="round"/>
      {/* Scale of justice */}
      <line x1="60" y1="32" x2="60" y2="88" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Top bar */}
      <line x1="38" y1="42" x2="82" y2="42" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Left pan */}
      <path d="M38 42L30 62C30 62 30 68 38 68C46 68 46 62 46 62L38 42Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} opacity="0.2"/>
      {/* Right pan */}
      <path d="M82 42L74 62C74 62 74 68 82 68C90 68 90 62 90 62L82 42Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} opacity="0.2"/>
      {/* Base */}
      <path d="M48 88H72" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Book at base */}
      <rect x="50" y="80" width="20" height="8" rx="1.5" fill={color} opacity="0.25" stroke={color} strokeWidth="1.5"/>
      <line x1="60" y1="80" x2="60" y2="88" stroke={color} strokeWidth="1"/>
    </svg>
  );
}

// ─── Icons ───
const Icons = {
  Home: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Search: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  User: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Heart: ({ size = 18, filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Comment: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // Twitter-style verified badge — blue circle with white checkmark + shadow
  Verified: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 2px rgba(29,155,240,0.35))" }}>
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.89-.81-3.9s-2.52-1.26-3.91-.81C14.67 2.88 13.43 2 12 2s-2.67.88-3.34 2.19c-1.39-.46-2.89-.2-3.9.81s-1.26 2.52-.81 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.89.81 3.9s2.52 1.26 3.91.81C9.33 21.12 10.57 22 12 22s2.67-.88 3.34-2.19c1.39.46 2.89.2 3.9-.81s1.26-2.52.81-3.91C21.12 14.67 22 13.43 22.25 12z" fill="#1D9BF0"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Moon: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Sun: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Send: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Close: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bell: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Share: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Bookmark: ({ size = 18, filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Back: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// ─── Avatar Component ───
function Avatar({ name, size = 42, verified = false, showBadge = true }) {
  const colors = [
    "linear-gradient(135deg, #1a365d, #2d5a87)",
    "linear-gradient(135deg, #2d3748, #4a5568)",
    "linear-gradient(135deg, #1a4731, #2d6a4f)",
    "linear-gradient(135deg, #553c2e, #8b6f4e)",
    "linear-gradient(135deg, #3c1a5e, #6b3fa0)",
  ];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const initials = name.split(" ").filter(w => !["د.", "أ.", "م."].includes(w)).map(w => w[0]).slice(0, 2).join("");

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: colors[idx],
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontSize: size * 0.35, fontWeight: 600,
        fontFamily: "Tajawal, sans-serif",
      }}>
        {initials}
      </div>
      {verified && showBadge && (
        <div style={{
          position: "absolute", bottom: -2, left: -2,
          background: "var(--bg)", borderRadius: "50%",
          width: size * 0.42, height: size * 0.42,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 1,
        }}>
          <Icons.Verified size={size * 0.4} />
        </div>
      )}
    </div>
  );
}

// ─── Time Formatting ───
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

// ═══════════════════════════════════════
//  Main App
// ═══════════════════════════════════════
export default function Qanuniyoun() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [pageHistory, setPageHistory] = useState(["feed"]);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [users] = useState(SAMPLE_USERS);
  const [currentUser] = useState(SAMPLE_USERS[0]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  const navigateTo = useCallback((page, pUser) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    if (pUser) setProfileUser(pUser);
  }, []);

  const goBack = useCallback(() => {
    setPageHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      setCurrentPage(previousPage);
      return newHistory;
    });
  }, []);

  const canGoBack = pageHistory.length > 1;

  const getUser = useCallback((userId) => users.find(u => u.id === userId), [users]);

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(currentUser.id);
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id],
      };
    }));
  };

  const handleComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, { id: `c${Date.now()}`, userId: currentUser.id, text: text.trim(), timestamp: Date.now() }] };
    }));
  };

  const handleNewPost = (content, category) => {
    if (!content.trim()) return;
    setPosts(prev => [{
      id: `p${Date.now()}`, userId: currentUser.id, content: content.trim(),
      likes: 0, likedBy: [], comments: [], timestamp: Date.now(),
      category: category || "نصائح مهنية",
    }, ...prev]);
    setShowCompose(false);
  };

  const filteredPosts = posts.filter(p => {
    if (selectedCategory !== "الكل" && p.category !== selectedCategory) return false;
    if (searchQuery && !p.content.includes(searchQuery)) return false;
    return true;
  });

  const theme = darkMode ? {
    "--bg": "#0a0a0b", "--bg-secondary": "#141416", "--bg-tertiary": "#1c1c1f",
    "--bg-hover": "#222225", "--text": "#f0f0f2", "--text-secondary": "#8e8e93",
    "--text-tertiary": "#636366", "--border": "#2c2c2e", "--border-light": "#1c1c1e",
    "--accent": "#c9a84c", "--accent-bg": "rgba(201,168,76,0.1)", "--accent-hover": "#d4b65e",
    "--shadow": "0 1px 3px rgba(0,0,0,0.4)", "--shadow-lg": "0 8px 32px rgba(0,0,0,0.5)",
    "--card-bg": "#141416", "--overlay": "rgba(0,0,0,0.7)", "--like-color": "#ff4757",
    "--verified-blue": "#1D9BF0",
  } : {
    "--bg": "#fafafa", "--bg-secondary": "#ffffff", "--bg-tertiary": "#f5f5f7",
    "--bg-hover": "#f0f0f2", "--text": "#1a1a1a", "--text-secondary": "#6e6e73",
    "--text-tertiary": "#aeaeb2", "--border": "#e5e5ea", "--border-light": "#f2f2f7",
    "--accent": "#1a365d", "--accent-bg": "rgba(26,54,93,0.06)", "--accent-hover": "#2d5a87",
    "--shadow": "0 1px 3px rgba(0,0,0,0.06)", "--shadow-lg": "0 8px 32px rgba(0,0,0,0.08)",
    "--card-bg": "#ffffff", "--overlay": "rgba(0,0,0,0.4)", "--like-color": "#ff3b30",
    "--verified-blue": "#1D9BF0",
  };

  const pageTitle = {
    feed: null,
    explore: "استكشف",
    notifications: "الإشعارات",
    profile: profileUser?.name || "الملف الشخصي",
  };

  return (
    <div dir="rtl" style={{
      ...theme,
      fontFamily: "'Tajawal', 'Cairo', sans-serif",
      background: "var(--bg)", color: "var(--text)",
      minHeight: "100vh", maxWidth: 680, margin: "0 auto",
      position: "relative", transition: "background 0.3s, color 0.3s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${darkMode ? "#0a0a0b" : "#fafafa"}; overflow-x: hidden; }
        ::selection { background: var(--accent); color: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        input, textarea, button { font-family: 'Tajawal', sans-serif; }
        textarea { resize: none; }
        button { cursor: pointer; border: none; background: none; color: inherit; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes heartPop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
        .post-card { transition: background 0.15s; }
        .post-card:hover { background: var(--bg-hover); }
        .btn-hover:hover { opacity: 0.8; }
        .like-pop { animation: heartPop 0.3s ease-out; }
      `}</style>

      {/* ─── Header ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: darkMode ? "rgba(10,10,11,0.88)" : "rgba(250,250,250,0.88)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-light)",
        padding: "0 16px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Right side: back button or logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {canGoBack && currentPage !== "feed" ? (
            <button onClick={goBack} style={{
              padding: 6, borderRadius: 10, color: "var(--accent)",
              display: "flex", alignItems: "center",
            }} className="btn-hover">
              <Icons.Back size={22} />
            </button>
          ) : null}

          {currentPage === "feed" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Logo size={30} color={darkMode ? "#c9a84c" : "#1a365d"} />
              <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em", color: "var(--accent)" }}>
                قانونيون
              </span>
            </div>
          ) : (
            <span style={{ fontWeight: 700, fontSize: 17 }}>
              {pageTitle[currentPage]}
            </span>
          )}
        </div>

        {/* Left side: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setShowSearch(!showSearch)}
            style={{ padding: 8, borderRadius: 10, color: "var(--text-secondary)" }} className="btn-hover">
            <Icons.Search size={20} />
          </button>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ padding: 8, borderRadius: 10, color: "var(--text-secondary)" }} className="btn-hover">
            {darkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
          </button>
          <button onClick={() => { setProfileUser(currentUser); navigateTo("profile", currentUser); }}
            style={{ padding: 4, marginRight: 2 }}>
            <Avatar name={currentUser.name} size={30} verified={currentUser.verified} />
          </button>
        </div>
      </header>

      {/* ─── Search Bar ─── */}
      {showSearch && (
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid var(--border-light)",
          animation: "fadeUp 0.25s ease-out",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg-tertiary)", borderRadius: 12, padding: "10px 14px",
          }}>
            <Icons.Search size={18} />
            <input type="text" placeholder="ابحث في المنشورات..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
              style={{ border: "none", background: "none", outline: "none", color: "var(--text)", fontSize: 15, width: "100%", direction: "rtl" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ color: "var(--text-tertiary)" }}>
                <Icons.Close size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <main style={{ paddingBottom: 80 }}>
        {currentPage === "feed" && (
          <FeedPage posts={filteredPosts} getUser={getUser} currentUser={currentUser}
            onLike={handleLike} onComment={handleComment}
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            setSelectedPost={setSelectedPost}
            setProfileUser={(u) => navigateTo("profile", u)} />
        )}
        {currentPage === "explore" && (
          <ExplorePage posts={posts} users={users} getUser={getUser}
            setProfileUser={(u) => navigateTo("profile", u)} />
        )}
        {currentPage === "notifications" && <NotificationsPage users={users} />}
        {currentPage === "profile" && profileUser && (
          <ProfilePage user={profileUser} posts={posts.filter(p => p.userId === profileUser.id)}
            currentUser={currentUser} getUser={getUser}
            onLike={handleLike} onComment={handleComment} setSelectedPost={setSelectedPost} />
        )}
      </main>

      {/* ─── Compose FAB ─── */}
      <button onClick={() => setShowCompose(true)} style={{
        position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
        width: 54, height: 54, borderRadius: "50%",
        background: "var(--accent)", color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(26,54,93,0.3)", zIndex: 90,
        transition: "transform 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}
      >
        <Icons.Plus size={24} />
      </button>

      {/* ─── Bottom Nav ─── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 680,
        background: darkMode ? "rgba(10,10,11,0.92)" : "rgba(250,250,250,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-light)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        height: 58, zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {[
          { id: "feed", icon: Icons.Home, label: "الرئيسية" },
          { id: "explore", icon: Icons.Search, label: "استكشف" },
          { id: "notifications", icon: Icons.Bell, label: "الإشعارات" },
          { id: "profile", icon: Icons.User, label: "حسابي" },
        ].map(tab => (
          <button key={tab.id} onClick={() => {
            if (tab.id === "profile") { setProfileUser(currentUser); }
            setPageHistory([tab.id]);
            setCurrentPage(tab.id);
          }} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "6px 16px",
            color: currentPage === tab.id ? "var(--accent)" : "var(--text-tertiary)",
            transition: "color 0.2s", fontSize: 10,
            fontWeight: currentPage === tab.id ? 700 : 400,
          }}>
            <tab.icon size={22} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ─── Modals ─── */}
      {showCompose && <ComposeModal currentUser={currentUser} onPost={handleNewPost} onClose={() => setShowCompose(false)} />}
      {selectedPost && (
        <PostDetailModal post={selectedPost} getUser={getUser} currentUser={currentUser}
          onLike={handleLike} onComment={handleComment} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  Feed Page
// ═══════════════════════════════════════
function FeedPage({ posts, getUser, currentUser, onLike, onComment, selectedCategory, setSelectedCategory, setSelectedPost, setProfileUser }) {
  return (
    <div>
      {/* Category Pills */}
      <div style={{
        display: "flex", gap: 8, padding: "14px 16px",
        overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none",
        borderBottom: "1px solid var(--border-light)",
        WebkitOverflowScrolling: "touch",
      }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: selectedCategory === cat ? "var(--accent)" : "var(--bg-tertiary)",
            color: selectedCategory === cat ? "white" : "var(--text-secondary)",
            flexShrink: 0, transition: "all 0.2s",
          }}>
            {cat}
          </button>
        ))}
      </div>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-tertiary)" }}>
          <p style={{ fontSize: 16 }}>لا توجد منشورات في هذا التصنيف</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <PostCard key={post.id} post={post} user={getUser(post.userId)} currentUser={currentUser}
            onLike={onLike} onComment={onComment}
            onExpand={() => setSelectedPost(post)}
            onUserClick={() => setProfileUser(getUser(post.userId))}
            delay={i * 0.05} />
        ))
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  Post Card
// ═══════════════════════════════════════
function PostCard({ post, user, currentUser, onLike, onComment, onExpand, onUserClick, delay = 0 }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(post.likedBy.includes(currentUser.id));
  const [likeCount, setLikeCount] = useState(post.likes);
  const [animLike, setAnimLike] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleLikeClick = () => {
    setAnimLike(true);
    setTimeout(() => setAnimLike(false), 300);
    setLiked(!liked);
    setLikeCount(c => liked ? c - 1 : c + 1);
    onLike(post.id);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
    setShowCommentInput(false);
  };

  return (
    <article className="post-card fade-up" style={{
      padding: "16px", borderBottom: "1px solid var(--border-light)",
      animationDelay: `${delay}s`,
    }}>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div onClick={onUserClick} style={{ cursor: "pointer" }}>
          <Avatar name={user.name} size={42} verified={user.verified} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <span onClick={onUserClick} style={{ fontWeight: 700, fontSize: 15, cursor: "pointer", lineHeight: 1.3 }}>
              {user.name}
            </span>
            {user.verified && <Icons.Verified size={16} />}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 6 }}>
            <span>{user.role}</span><span>·</span><span>{timeAgo(post.timestamp)}</span>
          </div>
        </div>
        {post.category && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
            background: "var(--accent-bg)", color: "var(--accent)",
          }}>
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div onClick={onExpand} style={{
        fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-wrap",
        cursor: "pointer", marginBottom: 14, letterSpacing: "0.01em",
      }}>
        {post.content}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, marginRight: -6 }}>
        <button onClick={handleLikeClick} className={animLike ? "like-pop" : ""} style={{
          display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8,
          color: liked ? "var(--like-color)" : "var(--text-tertiary)", fontSize: 13, fontWeight: 500, transition: "color 0.2s",
        }}>
          <Icons.Heart size={18} filled={liked} /><span>{likeCount}</span>
        </button>
        <button onClick={() => setShowCommentInput(!showCommentInput)} style={{
          display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8,
          color: "var(--text-tertiary)", fontSize: 13, fontWeight: 500,
        }}>
          <Icons.Comment size={18} /><span>{post.comments.length}</span>
        </button>
        <button style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 8, color: "var(--text-tertiary)" }}>
          <Icons.Share size={16} />
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setSaved(!saved)} style={{
          display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 8,
          color: saved ? "var(--accent)" : "var(--text-tertiary)", transition: "color 0.2s",
        }}>
          <Icons.Bookmark size={17} filled={saved} />
        </button>
      </div>

      {/* Comments Preview */}
      {post.comments.length > 0 && !showCommentInput && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
          {post.comments.slice(-2).map(c => {
            const commenter = SAMPLE_USERS.find(u => u.id === c.userId);
            if (!commenter) return null;
            return (
              <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, lineHeight: 1.7 }}>
                <Avatar name={commenter.name} size={26} verified={commenter.verified} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, marginLeft: 6 }}>{commenter.name}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{c.text}</span>
                </div>
              </div>
            );
          })}
          {post.comments.length > 2 && (
            <button onClick={onExpand} style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, padding: "4px 0" }}>
              عرض جميع التعليقات ({post.comments.length})
            </button>
          )}
        </div>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-light)",
          display: "flex", gap: 8, alignItems: "center", animation: "fadeUp 0.2s ease-out",
        }}>
          <Avatar name={currentUser.name} size={28} verified={currentUser.verified} showBadge={false} />
          <input autoFocus value={commentText} onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitComment()}
            placeholder="اكتب تعليقك..."
            style={{
              flex: 1, border: "none", outline: "none", background: "var(--bg-tertiary)", borderRadius: 20,
              padding: "8px 14px", fontSize: 14, color: "var(--text)", direction: "rtl",
            }}
          />
          <button onClick={submitComment} disabled={!commentText.trim()} style={{
            color: commentText.trim() ? "var(--accent)" : "var(--text-tertiary)", padding: 6, transition: "color 0.2s",
          }}>
            <Icons.Send size={18} />
          </button>
        </div>
      )}
    </article>
  );
}

// ═══════════════════════════════════════
//  Compose Modal — Fixed for keyboard
// ═══════════════════════════════════════
function ComposeModal({ currentUser, onPost, onClose }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("نصائح مهنية");
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    // Focus textarea with slight delay to let modal render
    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, []);

  // Handle visual viewport resize (keyboard open/close)
  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current) {
        const vv = window.visualViewport;
        if (vv) {
          modalRef.current.style.height = `${vv.height}px`;
          modalRef.current.style.top = `${vv.offsetTop}px`;
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
      handleResize();
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
    };
  }, []);

  return (
    <div ref={modalRef} style={{
      position: "fixed", left: 0, right: 0, top: 0, bottom: 0,
      zIndex: 300, background: "var(--overlay)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      alignItems: "center",
      animation: "fadeIn 0.2s ease-out",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 680,
        background: "var(--bg-secondary)",
        borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column",
        maxHeight: "100%",
        animation: "slideUp 0.3s ease-out",
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderBottom: "1px solid var(--border-light)",
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{ color: "var(--text-secondary)", padding: 4, fontSize: 15, fontWeight: 600 }}>
            إلغاء
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>منشور جديد</span>
          <button onClick={() => onPost(content, category)} disabled={!content.trim()} style={{
            padding: "7px 20px", borderRadius: 20,
            background: content.trim() ? "var(--accent)" : "var(--bg-tertiary)",
            color: content.trim() ? "white" : "var(--text-tertiary)",
            fontWeight: 700, fontSize: 14, transition: "all 0.2s",
          }}>
            نشر
          </button>
        </div>

        {/* Scrollable content area */}
        <div style={{
          flex: 1, overflowY: "auto", padding: 16,
          WebkitOverflowScrolling: "touch",
          minHeight: 0,
        }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <Avatar name={currentUser.name} size={40} verified={currentUser.verified} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 5 }}>
                {currentUser.name}
                {currentUser.verified && <Icons.Verified size={14} />}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{currentUser.role}</div>
            </div>
          </div>

          <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)}
            placeholder="شارك رأيك القانوني..."
            style={{
              width: "100%", minHeight: 120, border: "none", outline: "none",
              background: "none", color: "var(--text)", fontSize: 16, lineHeight: 1.8, direction: "rtl",
            }}
          />

          {/* Category Selector */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 8 }}>التصنيف:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.filter(c => c !== "الكل").map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "5px 14px", borderRadius: 16, fontSize: 12, fontWeight: 600,
                  background: category === cat ? "var(--accent)" : "var(--bg-tertiary)",
                  color: category === cat ? "white" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Post Detail Modal
// ═══════════════════════════════════════
function PostDetailModal({ post, getUser, currentUser, onLike, onComment, onClose }) {
  const [commentText, setCommentText] = useState("");
  const user = getUser(post.userId);
  const liked = post.likedBy.includes(currentUser.id);

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "var(--overlay)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease-out",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 680, background: "var(--bg-secondary)",
        borderRadius: "20px 20px 0 0", maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.3s ease-out",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderBottom: "1px solid var(--border-light)",
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{ color: "var(--text-secondary)", padding: 4 }}>
            <Icons.Close size={22} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>المنشور</span>
          <div style={{ width: 30 }} />
        </div>

        {/* Scrollable post + comments */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <div style={{ padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Avatar name={user.name} size={46} verified={user.verified} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</span>
                  {user.verified && <Icons.Verified size={16} />}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{user.role} · {timeAgo(post.timestamp)}</div>
              </div>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.9, whiteSpace: "pre-wrap", marginBottom: 16 }}>
              {post.content}
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: 20, padding: "12px 0",
              borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)",
              fontSize: 14, color: "var(--text-secondary)",
            }}>
              <span><strong style={{ color: "var(--text)" }}>{post.likes}</strong> إعجاب</span>
              <span><strong style={{ color: "var(--text)" }}>{post.comments.length}</strong> تعليق</span>
            </div>

            {/* Actions */}
            <div style={{
              display: "flex", justifyContent: "space-around", padding: "10px 0",
              borderBottom: "1px solid var(--border-light)",
            }}>
              <button onClick={() => onLike(post.id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                color: liked ? "var(--like-color)" : "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px",
              }}>
                <Icons.Heart size={20} filled={liked} /> إعجاب
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px",
              }}>
                <Icons.Comment size={20} /> تعليق
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "var(--text-secondary)", fontWeight: 600, fontSize: 14, padding: "6px 12px",
              }}>
                <Icons.Share size={20} /> مشاركة
              </button>
            </div>
          </div>

          {/* Comments */}
          <div style={{ padding: "0 16px 20px" }}>
            {post.comments.map(c => {
              const commenter = getUser(c.userId);
              if (!commenter) return null;
              return (
                <div key={c.id} style={{
                  display: "flex", gap: 10, padding: "14px 0",
                  borderBottom: "1px solid var(--border-light)",
                }}>
                  <Avatar name={commenter.name} size={34} verified={commenter.verified} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{commenter.name}</span>
                      {commenter.verified && <Icons.Verified size={13} />}
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)" }}>{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Input — sticky at bottom */}
        <div style={{
          flexShrink: 0, borderTop: "1px solid var(--border-light)",
          padding: "12px 16px", display: "flex", gap: 8, alignItems: "center",
          background: "var(--bg-secondary)",
        }}>
          <Avatar name={currentUser.name} size={30} verified={currentUser.verified} showBadge={false} />
          <input value={commentText} onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitComment()}
            placeholder="اكتب تعليقك..."
            style={{
              flex: 1, border: "none", outline: "none", background: "var(--bg-tertiary)", borderRadius: 20,
              padding: "9px 14px", fontSize: 14, color: "var(--text)", direction: "rtl",
            }}
          />
          <button onClick={submitComment} disabled={!commentText.trim()} style={{
            color: commentText.trim() ? "var(--accent)" : "var(--text-tertiary)", padding: 6,
          }}>
            <Icons.Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Explore Page
// ═══════════════════════════════════════
function ExplorePage({ posts, users, getUser, setProfileUser }) {
  const trendingTopics = [
    { tag: "#نظام_العمل_الجديد", count: "٤٢٠ منشور" },
    { tag: "#المحاكم_العمالية", count: "٢١٨ منشور" },
    { tag: "#الأنظمة_التجارية", count: "١٧٥ منشور" },
    { tag: "#حقوق_المرأة_العاملة", count: "١٥٣ منشور" },
    { tag: "#التحكيم_التجاري", count: "١٢٩ منشور" },
  ];

  const topUsers = users.filter(u => u.verified).slice(0, 4);
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="fade-up">
      <div style={{ padding: "20px 16px 8px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>المواضيع الرائجة</h2>
        {trendingTopics.map((topic, i) => (
          <div key={i} style={{
            padding: "14px 0",
            borderBottom: i < trendingTopics.length - 1 ? "1px solid var(--border-light)" : "none",
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--accent)", marginBottom: 2 }}>{topic.tag}</div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{topic.count}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 8, background: "var(--bg-tertiary)" }} />

      <div style={{ padding: "20px 16px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>حسابات مقترحة</h2>
        {topUsers.map(user => (
          <div key={user.id} onClick={() => setProfileUser(user)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0", cursor: "pointer",
            borderBottom: "1px solid var(--border-light)",
          }}>
            <Avatar name={user.name} size={48} verified={user.verified} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</span>
                <Icons.Verified size={15} />
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 2 }}>{user.bio}</p>
            </div>
            <button style={{
              padding: "6px 18px", borderRadius: 20, border: "1.5px solid var(--accent)",
              color: "var(--accent)", fontWeight: 700, fontSize: 13,
            }}>
              متابعة
            </button>
          </div>
        ))}
      </div>

      <div style={{ height: 8, background: "var(--bg-tertiary)" }} />

      <div style={{ padding: "20px 16px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>الأكثر تفاعلاً</h2>
        {sortedPosts.map(post => {
          const user = getUser(post.userId);
          return (
            <div key={post.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Avatar name={user.name} size={28} verified={user.verified} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</span>
                {user.verified && <Icons.Verified size={13} />}
              </div>
              <p style={{
                fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)",
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>{post.content}</p>
              <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--text-tertiary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icons.Heart size={13} filled={false} /> {post.likes}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icons.Comment size={13} /> {post.comments.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Notifications Page
// ═══════════════════════════════════════
function NotificationsPage({ users }) {
  const notifications = [
    { type: "like", user: users[1], text: "أعجب بمنشورك عن تعديل نظام العمل", time: "منذ ٣ س" },
    { type: "comment", user: users[2], text: "علّقت على منشورك: \"معلومة قيّمة جدًا\"", time: "منذ ٥ س" },
    { type: "follow", user: users[3], text: "بدأ بمتابعتك", time: "منذ ٨ س" },
    { type: "like", user: users[4], text: "أعجبت بتعليقك", time: "أمس" },
    { type: "comment", user: users[1], text: "ردّ على تعليقك في منشور الشرط الجزائي", time: "أمس" },
    { type: "follow", user: users[2], text: "بدأت بمتابعتك", time: "منذ يومين" },
  ];

  return (
    <div className="fade-up">
      {notifications.map((notif, i) => (
        <div key={i} className="fade-up" style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
          borderBottom: "1px solid var(--border-light)",
          background: i < 2 ? "var(--accent-bg)" : "transparent",
          animationDelay: `${i * 0.05}s`,
        }}>
          <Avatar name={notif.user.name} size={44} verified={notif.user.verified} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              <strong>{notif.user.name}</strong> {notif.text}
            </p>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{notif.time}</span>
          </div>
          {i < 2 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
//  Profile Page — Redesigned layout
// ═══════════════════════════════════════
function ProfilePage({ user, posts, currentUser, getUser, onLike, onComment, setSelectedPost }) {
  const isOwnProfile = user.id === currentUser.id;

  return (
    <div className="fade-up">
      {/* Profile Header */}
      <div style={{
        padding: "24px 16px 20px", textAlign: "center",
        borderBottom: "1px solid var(--border-light)",
      }}>
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Avatar name={user.name} size={80} verified={user.verified} />
        </div>

        {/* Name + Verified */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h1>
          {user.verified && <Icons.Verified size={19} />}
        </div>

        {/* Role */}
        <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
          {user.role}
        </div>

        {/* Bio */}
        <p style={{
          fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
          maxWidth: 340, margin: "0 auto 16px",
        }}>
          {user.bio}
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 18 }}>
          {[
            { val: user.postsCount, label: "منشور" },
            { val: user.followersCount.toLocaleString("ar-SA"), label: "متابع" },
            { val: "٢٤٣", label: "متابَع" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Verified Badge — above button */}
        {user.verified && (
          <div style={{
            marginBottom: 14, display: "flex", justifyContent: "center",
          }}>
            <div style={{
              padding: "8px 18px", borderRadius: 20,
              background: "rgba(29,155,240,0.08)",
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 13, fontWeight: 700, color: "#1D9BF0",
              border: "1px solid rgba(29,155,240,0.15)",
            }}>
              <Icons.Verified size={17} />
              حساب موثّق
            </div>
          </div>
        )}

        {/* Action Button */}
        {isOwnProfile ? (
          <button style={{
            padding: "9px 28px", borderRadius: 20,
            border: "1.5px solid var(--border)", fontWeight: 700, fontSize: 14,
            color: "var(--text)", transition: "all 0.2s",
          }}>
            تعديل الملف الشخصي
          </button>
        ) : (
          <button style={{
            padding: "9px 28px", borderRadius: 20,
            background: "var(--accent)", color: "white",
            fontWeight: 700, fontSize: 14,
          }}>
            متابعة
          </button>
        )}
      </div>

      {/* User's Posts */}
      <div style={{ padding: "14px 16px 6px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)" }}>المنشورات</h3>
      </div>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-tertiary)" }}>
          لا توجد منشورات بعد
        </div>
      ) : (
        posts.map((post, i) => (
          <PostCard key={post.id} post={post} user={user} currentUser={currentUser}
            onLike={onLike} onComment={onComment}
            onExpand={() => setSelectedPost(post)}
            onUserClick={() => {}} delay={i * 0.05} />
        ))
      )}
    </div>
  );
}
