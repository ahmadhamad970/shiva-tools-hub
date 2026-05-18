import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bug,
  Camera,
  Code2,
  Cpu,
  Download,
  Edit3,
  Eye,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Mail,
  UserCircle2,
  Layers,
  Lock,
  LogOut,
  Network,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Star,
  Terminal,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const API_BASE = "https://shiva-tools-backend.onrender.com";

const STORAGE_KEYS = {
  session: "shiva_session",
  token: "shiva_token",
  tools: "shiva_tools",
  language: "shiva_language",
};

const OWNER = {
  name: "Ahmad Hamad",
  brand: "Sh!Va",
  email: "s12325995@stu.najah.edu",
  handle: "@s12325995",
  copyright: "© 2026 Ahmad Hamad / Sh!Va. All Rights Reserved.",
  socials: {
    github: "https://github.com/YOUR_USERNAME",
    instagram: "https://instagram.com/YOUR_USERNAME",
    linkedin: "https://linkedin.com/in/YOUR_USERNAME",
    facebook: "https://facebook.com/YOUR_USERNAME",
    youtube: "https://youtube.com/@YOUR_USERNAME",
    twitter: "https://x.com/YOUR_USERNAME",
    website: "https://yourwebsite.com",
  },
};

const translations = {
  en: {
    aboutAhmad: "About Ahmad",
    aboutText:
      "Ahmad Hamad is the founder and developer behind Sh!Va Security Systems. Specialized in cybersecurity, automation systems, modern dashboards, and futuristic software experiences. Passionate about building secure digital tools and advanced cyber platforms with high-end UI/UX engineering.",
    community: "Community",
    usersJoined: "Users Joined",
    socialMedia: "Social Media",
    connectNow: "Connect with Ahmad",
    loginTitle: "Access Portal",
    loginSub: "Create an account or sign in to browse Sh!Va tools.",
    userLogin: "User Login",
    adminLogin: "Admin Login",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    createAccount: "Create Account",
    adminCode: "Admin code",
    adminHint: "Default demo admin code: SHIVA-ADMIN",
    browse: "Browse Arsenal",
    addTool: "Add New Tool",
    dashboardLine: "./launch-dashboard",
    ownerVerified: "Owner verified",
    brandLoaded: "Brand loaded",
    toolsIndexed: "Tools indexed",
    rights: "Owner Rights",
    status: "Portal Status",
    live: "LIVE",
    toolsArsenal: "Tools Arsenal",
    toolsDesc: "Browse and manage your cybersecurity utilities.",
    search: "Search tools...",
    filter: "Filter category",
    download: "Download",
    details: "Details",
    adminPanel: "Admin Control Center",
    adminDesc: "Create, edit, upload, and remove tools from the real backend database.",
    adminNote:
      "Files are uploaded to the backend uploads folder and saved in SQLite.",
    toolName: "Tool name",
    category: "Category",
    version: "Version",
    statusLabel: "Status",
    icon: "Icon",
    fileName: "File name",
    downloadUrl: "Download URL",
    description: "Description",
    features: "Features, comma separated",
    saveTool: "Save Tool",
    clear: "Clear",
    edit: "Edit",
    delete: "Delete",
    logout: "Logout",
    loggedAs: "Logged in as",
    userMode: "User Mode",
    adminMode: "Admin Mode",
    heroTitleA: "The official command center for",
    heroTitleB: "Sh!Va security tools",
    heroText:
      "Publish your tools, manage versions, show downloads, and build your cyber portfolio with a futuristic dashboard.",
    publishedTools: "Published Tools",
    categories: "Categories",
    downloads: "Downloads",
    secureDeploys: "Live releases",
    activeNow: "Active now",
    lastUpdated: "Last updated",
    quickActions: "Quick actions",
    recentChanges: "Recent changes",
    inventory: "Inventory",
    console: "Console",
    adminReady: "Admin ready",
    editMode: "Edit mode",
    createMode: "Create mode",
    emptyState: "No tools match your filter.",
    modalClose: "Close",
    modalDownload: "Open release",
    releaseBoard: "Release board",
    releaseBoardDesc: "Operational view for publishing, review, and maintenance.",
    auditLog: "Audit log",
    publishChecklist: "Publish checklist",
    support: "Support",
    supportDesc: "Prepare downloads, release notes, and owner contacts before publishing.",
    lastActivity: "Latest activity",
    featured: "Featured",
  },
  ar: {
    aboutAhmad: "عن أحمد",
    aboutText:
      "أحمد حماد هو المطور والمؤسس وراء أنظمة Sh!Va الأمنية. متخصص بالأمن السيبراني، أنظمة الأتمتة، الداشبوردات الحديثة، وتجارب البرمجيات المستقبلية. شغوف ببناء أدوات رقمية آمنة ومنصات سيبرانية متقدمة بواجهات احترافية عالية المستوى.",
    community: "المجتمع",
    usersJoined: "عدد المستخدمين",
    socialMedia: "السوشال ميديا",
    connectNow: "تواصل مع أحمد",
    loginTitle: "بوابة الدخول",
    loginSub: "اعمل حساب أو سجل دخول عشان تتصفح أدوات Sh!Va.",
    userLogin: "دخول المستخدم",
    adminLogin: "دخول الأدمن",
    fullName: "الاسم الكامل",
    email: "الإيميل",
    password: "كلمة المرور",
    signIn: "تسجيل دخول",
    createAccount: "إنشاء حساب",
    adminCode: "كود الأدمن",
    adminHint: "كود الأدمن التجريبي: SHIVA-ADMIN",
    browse: "تصفح الأدوات",
    addTool: "إضافة أداة",
    dashboardLine: "./تشغيل-الداشبورد",
    ownerVerified: "تم توثيق المالك",
    brandLoaded: "تم تحميل البراند",
    toolsIndexed: "الأدوات المفهرسة",
    rights: "حقوق الملكية",
    status: "حالة البوابة",
    live: "شغّالة",
    toolsArsenal: "ترسانة الأدوات",
    toolsDesc: "تصفح وادِر أدواتك السيبرانية من مكان واحد.",
    search: "ابحث عن أداة...",
    filter: "فلتر التصنيف",
    download: "تحميل",
    details: "تفاصيل",
    adminPanel: "مركز التحكم للأدمن",
    adminDesc: "أنشئ وعدّل وارفع واحذف الأدوات من قاعدة بيانات حقيقية.",
    adminNote:
      "الملفات تنرفع على فولدر uploads في الباكند وتنحفظ في SQLite.",
    toolName: "اسم الأداة",
    category: "التصنيف",
    version: "الإصدار",
    statusLabel: "الحالة",
    icon: "الأيقونة",
    fileName: "اسم الملف",
    downloadUrl: "رابط التحميل",
    description: "الوصف",
    features: "الميزات مفصولة بفواصل",
    saveTool: "حفظ الأداة",
    clear: "تنظيف",
    edit: "تعديل",
    delete: "حذف",
    logout: "تسجيل خروج",
    loggedAs: "مسجل باسم",
    userMode: "وضع المستخدم",
    adminMode: "وضع الأدمن",
    heroTitleA: "مركز التحكم الرسمي لـ",
    heroTitleB: "أدوات Sh!Va الأمنية",
    heroText:
      "انشر أدواتك، نظم الإصدارات، اعرض روابط التحميل، وابنِ بورتفوليو سيبراني بواجهة مستقبلية.",
    publishedTools: "الأدوات المنشورة",
    categories: "التصنيفات",
    downloads: "التحميلات",
    secureDeploys: "إصدارات حية",
    activeNow: "نشط الآن",
    lastUpdated: "آخر تحديث",
    quickActions: "إجراءات سريعة",
    recentChanges: "آخر التغييرات",
    inventory: "المحتوى",
    console: "الكونسول",
    adminReady: "الأدمن جاهز",
    editMode: "وضع التعديل",
    createMode: "وضع الإنشاء",
    emptyState: "ما في أدوات مطابقة للفلتر.",
    modalClose: "إغلاق",
    modalDownload: "فتح الإصدار",
    releaseBoard: "لوحة الإصدارات",
    releaseBoardDesc: "عرض تشغيلي للنشر والمراجعة والصيانة.",
    auditLog: "سجل التدقيق",
    publishChecklist: "قائمة النشر",
    support: "الدعم",
    supportDesc: "جهز الملفات وملاحظات الإصدار وبيانات المالك قبل النشر.",
    lastActivity: "آخر نشاط",
    featured: "مميز",
  },
  ru: {
    aboutAhmad: "Об Ахмаде",
    aboutText:
      "Ахмад Хамад — основатель и разработчик систем безопасности Sh!Va. Специализируется на кибербезопасности, автоматизации, современных дашбордах и футуристических программных интерфейсах.",
    community: "Сообщество",
    usersJoined: "Пользователей",
    socialMedia: "Соцсети",
    connectNow: "Связаться с Ахмадом",
    loginTitle: "Портал доступа",
    loginSub: "Создайте аккаунт или войдите, чтобы просматривать инструменты Sh!Va.",
    userLogin: "Вход пользователя",
    adminLogin: "Вход администратора",
    fullName: "Полное имя",
    email: "Email",
    password: "Пароль",
    signIn: "Войти",
    createAccount: "Создать аккаунт",
    adminCode: "Код администратора",
    adminHint: "Демо-код администратора: SHIVA-ADMIN",
    browse: "Открыть арсенал",
    addTool: "Добавить инструмент",
    dashboardLine: "./launch-dashboard",
    ownerVerified: "Владелец подтвержден",
    brandLoaded: "Бренд загружен",
    toolsIndexed: "Инструментов найдено",
    rights: "Права владельца",
    status: "Статус портала",
    live: "LIVE",
    toolsArsenal: "Арсенал инструментов",
    toolsDesc: "Просматривайте и управляйте киберинструментами из одного места.",
    search: "Поиск инструментов...",
    filter: "Фильтр категории",
    download: "Скачать",
    details: "Детали",
    adminPanel: "Центр управления",
    adminDesc: "Создавайте, редактируйте, загружайте и удаляйте инструменты в реальной базе данных.",
    adminNote:
      "Файлы загружаются в uploads backend и сохраняются в SQLite.",
    toolName: "Название инструмента",
    category: "Категория",
    version: "Версия",
    statusLabel: "Статус",
    icon: "Иконка",
    fileName: "Имя файла",
    downloadUrl: "Ссылка загрузки",
    description: "Описание",
    features: "Функции через запятую",
    saveTool: "Сохранить инструмент",
    clear: "Очистить",
    edit: "Редактировать",
    delete: "Удалить",
    logout: "Выйти",
    loggedAs: "Вошел как",
    userMode: "Режим пользователя",
    adminMode: "Режим администратора",
    heroTitleA: "Официальный командный центр для",
    heroTitleB: "инструментов Sh!Va",
    heroText:
      "Публикуйте инструменты, управляйте версиями, добавляйте загрузки и создавайте кибер-портфолио с футуристическим интерфейсом.",
    publishedTools: "Опубликованные инструменты",
    categories: "Категории",
    downloads: "Загрузки",
    secureDeploys: "Живые релизы",
    activeNow: "Активно сейчас",
    lastUpdated: "Последнее обновление",
    quickActions: "Быстрые действия",
    recentChanges: "Последние изменения",
    inventory: "Инвентарь",
    console: "Консоль",
    adminReady: "Админ готов",
    editMode: "Режим редактирования",
    createMode: "Режим создания",
    emptyState: "Нет инструментов, подходящих под фильтр.",
    modalClose: "Закрыть",
    modalDownload: "Открыть релиз",
    releaseBoard: "Доска релизов",
    releaseBoardDesc: "Операционный обзор публикации, проверки и поддержки.",
    auditLog: "Журнал аудита",
    publishChecklist: "Чеклист публикации",
    support: "Поддержка",
    supportDesc: "Подготовьте загрузки, заметки релиза и контакты владельца перед публикацией.",
    lastActivity: "Последняя активность",
    featured: "Избранное",
  },
};

const defaultTools = [
  {
    id: 1,
    name: "SH!VA Network Scanner",
    category: "Network Security",
    version: "v1.0 MAX",
    status: "Stable",
    iconType: "network",
    risk: "Authorized LAN Auditing",
    description:
      "Professional cyber dashboard for discovering devices on authorized networks.",
    features: ["Fast Scan", "Device Names", "Port Overview", "Reports"],
    fileName: "shiva-network-scanner.zip",
    downloadUrl: "#",
    updated: "2026-05-13",
  },
  {
    id: 2,
    name: "SH!VA Web Recon",
    category: "Web Security",
    version: "v2.0 Ultimate",
    status: "Beta",
    iconType: "bug",
    risk: "Authorized Web Recon",
    description:
      "Advanced web auditing dashboard with endpoint mapping and security checks.",
    features: ["Headers", "Endpoints", "Risk Score", "Fingerprinting"],
    fileName: "shiva-web-recon.zip",
    downloadUrl: "#",
    updated: "2026-05-10",
  },
  {
    id: 3,
    name: "SH!VA AI System",
    category: "Automation",
    version: "v1.0 GOD MODE",
    status: "Preview",
    iconType: "cpu",
    risk: "Workflow Automation",
    description:
      "Futuristic assistant-style dashboard for managing cybersecurity workflows.",
    features: ["Cyber Dashboard", "Notes", "Reports", "Launcher"],
    fileName: "shiva-ai-system.zip",
    downloadUrl: "#",
    updated: "2026-05-01",
  },
];

const categories = [
  "All",
  "Network Security",
  "Web Security",
  "Automation",
  "Reporting",
  "OSINT",
];

const iconMap = {
  network: Network,
  bug: Bug,
  cpu: Cpu,
  report: FileText,
  code: Code2,
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function toClientTool(tool) {
  return {
    id: tool.id,
    name: tool.name || "Untitled Tool",
    category: tool.category || "Automation",
    version: tool.version || "v1.0",
    status: tool.status || "Preview",
    iconType: tool.iconType || "code",
    risk: tool.risk || "Custom Release",
    description: tool.description || "No description provided.",
    features: Array.isArray(tool.features) ? tool.features : [],
    fileName: tool.fileName || "",
    downloadUrl: tool.downloadUrl?.startsWith("/uploads/") ? `${API_BASE}${tool.downloadUrl}` : tool.downloadUrl || "#",
    updated: tool.updated_at ? String(tool.updated_at).slice(0, 10) : tool.updated || new Date().toISOString().slice(0, 10),
  };
}

function createDraft(tool = null) {
  if (tool) {
    return {
      id: tool.id,
      name: tool.name ?? "",
      category: tool.category ?? "Network Security",
      version: tool.version ?? "v1.0",
      status: tool.status ?? "Preview",
      iconType: tool.iconType ?? "code",
      risk: tool.risk ?? "Custom Release",
      description: tool.description ?? "",
      featuresText: Array.isArray(tool.features) ? tool.features.join(", ") : "",
      fileName: tool.fileName ?? "",
      downloadUrl: tool.downloadUrl?.startsWith(API_BASE) ? tool.downloadUrl.replace(API_BASE, "") : tool.downloadUrl ?? "#",
      file: null,
    };
  }

  return {
    id: null,
    name: "",
    category: "Network Security",
    version: "v1.0",
    status: "Preview",
    iconType: "code",
    risk: "Custom Release",
    description: "",
    featuresText: "",
    fileName: "",
    downloadUrl: "#",
    file: null,
  };
}

// normalizeTool removed — backend-to-client conversion is handled by toClientTool
function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {Object.keys(translations).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={cn(
            "rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide transition",
            lang === code
              ? "bg-cyan-300 text-slate-950"
              : "text-slate-300 hover:bg-white/10"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === "Stable"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : status === "Beta"
        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
        : "border-amber-400/30 bg-amber-400/10 text-amber-200";

  return <span className={cn("rounded-full border px-3 py-1 text-xs font-black", tone)}>{status}</span>;
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-cyan-300/15 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
        <Icon size={24} />
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm font-bold text-slate-300">{label}</div>
    </motion.div>
  );
}

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-cyan-300/15 bg-slate-950/60 p-5 backdrop-blur-xl">
      <Icon className="mb-3 text-cyan-200" size={23} />
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function ActivityPill({ label, value, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    emerald: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    slate: "border-white/10 bg-white/5 text-slate-100",
  };

  return (
    <div className={cn("rounded-2xl border px-4 py-3", tones[tone] || tones.cyan)}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-current/70">{label}</div>
      <div className="mt-1 text-lg font-black text-current">{value}</div>
    </div>
  );
}

function ToolCard({ tool, t, isAdmin, onEdit, onDelete, onPreview }) {
  const Icon = iconMap[tool.iconType] || Code2;

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <Icon size={20} />
          </div>
          <div>
            <div className="font-black text-white">{tool.name}</div>
            <div className="text-xs text-slate-400">{tool.category} • {tool.updated}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview?.(tool)}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <Eye size={14} className="mr-1 inline-block" />
            Preview
          </button>
          {isAdmin && (
            <>
              <button onClick={() => onEdit?.(tool)} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <Edit3 size={14} className="mr-1 inline-block" />
                {t.edit}
              </button>
              <button onClick={() => onDelete?.(tool.id)} className="rounded-2xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                <Trash2 size={14} className="mr-1 inline-block" />
                {t.delete}
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">{tool.description}</p>
    </article>
  );
}

function ToolModal({ tool, t, onClose }) {
  const Icon = iconMap[tool.iconType] || Code2;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-xl">
      <button
        type="button"
        aria-label={t.modalClose}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950 shadow-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_.8fr] md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              {t.featured}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Icon size={30} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{tool.name}</h3>
                <p className="text-slate-400">{tool.category} • {tool.version}</p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              {tool.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {tool.features.map((feature) => (
                <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {feature}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ActivityPill label={t.statusLabel} value={tool.status} />
              <ActivityPill label={t.lastUpdated} value={tool.updated} tone="emerald" />
              <ActivityPill label={t.downloads} value={tool.fileName || "—"} tone="amber" />
            </div>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-slate-300">
              <div className="text-cyan-200">shiva@release:~$ cat release.json</div>
              <div className="mt-3 space-y-2 leading-6 text-slate-400">
                <div>name: {tool.name}</div>
                <div>file: {tool.fileName}</div>
                <div>risk: {tool.risk}</div>
                <div>updated: {tool.updated}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={tool.downloadUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
              >
                <Download size={17} />
                {t.modalDownload}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <X size={17} />
                {t.modalClose}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AuthScreen({ lang, setLang, setSession, setToken }) {
  const t = translations[lang];
  const [mode, setMode] = useState("user");
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", adminCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.email.trim() || !form.password.trim()) {
        throw new Error("Please enter email and password.");
      }

      let path = "/api/auth/login";
      let body = {
        email: form.email.trim(),
        password: form.password,
      };

      if (mode === "admin") {
        path = "/api/auth/admin-login";
        body = {
          ...body,
          name: form.name.trim() || "Sh!Va Admin",
          adminCode: form.adminCode.trim(),
        };
      } else if (isRegister) {
        path = "/api/auth/register";
        body = {
          ...body,
          name: form.name.trim() || "Sh!Va User",
        };
      }

      const data = await apiRequest(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.localStorage.setItem(STORAGE_KEYS.token, data.token);
      window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(data.user));
      setToken(data.token);
      setSession(data.user);
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.25),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.20),transparent_28%)]" />
      <div className="fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100">
            <Shield size={16} /> {OWNER.brand} SECURE ACCESS
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {t.loginTitle} <span className="bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-transparent">{OWNER.brand}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{t.loginSub}</p>
          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
            <MiniMetric icon={Lock} label={t.rights} value="100%" />
            <MiniMetric icon={Layers} label={t.downloads} value="Ready" />
            <MiniMetric icon={Terminal} label={t.status} value={t.live} />
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("user")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-black transition",
                  mode === "user" ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:bg-white/10"
                )}
              >
                {t.userLogin}
              </button>
              <button
                type="button"
                onClick={() => setMode("admin")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-black transition",
                  mode === "admin" ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:bg-white/10"
                )}
              >
                {t.adminLogin}
              </button>
            </div>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>

          <div className="mb-6 text-2xl font-black text-white">
            {mode === "admin" ? t.adminLogin : t.userLogin}
          </div>

          {isRegister && mode === "user" && (
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder={t.fullName}
              className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
            />
          )}

          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder={t.email}
            className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
          />

          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder={t.password}
            className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
          />

          {mode === "admin" && (
            <>
              <input
                value={form.adminCode}
                onChange={(event) => setForm({ ...form, adminCode: event.target.value })}
                placeholder={t.adminCode}
                className="mb-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              />
              <p className="mb-4 text-xs text-amber-200">{t.adminHint}</p>
            </>
          )}

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white disabled:opacity-60"
          >
            <Shield size={18} />
            {loading ? "Loading..." : isRegister && mode === "user" ? t.createAccount : t.signIn}
          </button>

          {mode === "user" && (
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="mt-4 w-full text-sm font-bold text-cyan-200 transition hover:text-white"
            >
              {isRegister ? t.signIn : t.createAccount}
            </button>
          )}
        </form>
      </section>

      
    </main>
  );
}

function AdminPanel({ t, tools, editingTool, onSave, onCancelEdit, token }) {
  const [draft, setDraft] = useState(() => createDraft(editingTool));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // AdminPanel is remounted with a unique `key` when `editingTool` changes,
    // so the initial draft is derived from `editingTool` and we don't need
    // to synchronously call setState inside an effect here.
  }, []);

  const recentTools = useMemo(
    () => [...tools].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3),
    [tools]
  );

  const releaseStatus = useMemo(
    () => ({
      stable: tools.filter((tool) => tool.status === "Stable").length,
      beta: tools.filter((tool) => tool.status === "Beta").length,
      preview: tools.filter((tool) => tool.status === "Preview").length,
    }),
    [tools]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!draft.name.trim() || !draft.description.trim()) {
        throw new Error("Tool name and description are required.");
      }

      const formData = new FormData();
      formData.append("name", draft.name);
      formData.append("category", draft.category);
      formData.append("version", draft.version);
      formData.append("status", draft.status);
      formData.append("iconType", draft.iconType);
      formData.append("risk", draft.risk);
      formData.append("description", draft.description);
      formData.append("features", draft.featuresText);
      formData.append("fileName", draft.fileName);
      formData.append("downloadUrl", draft.downloadUrl);

      if (draft.file) {
        formData.append("file", draft.file);
      }

      const path = draft.id ? `/api/tools/${draft.id}` : "/api/tools";
      const method = draft.id ? "PUT" : "POST";

      const savedTool = await apiRequest(path, {
        method,
        headers: authHeaders(token),
        body: formData,
      });

      onSave(toClientTool(savedTool));
      setDraft(createDraft());
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDraft(createDraft());
    setError("");
    onCancelEdit();
  };

  return (
    <section id="admin" className="relative z-10 mx-auto max-w-7xl px-6 py-12">
      <div className="overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-slate-950/78 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-8 border-b border-white/10 p-7 xl:grid-cols-[1.3fr_.7fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
              <Settings size={14} /> {t.adminReady}
            </div>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              {t.adminPanel}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">{t.adminDesc}</p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-100">
            <div className="mb-3 flex items-center gap-2 font-black text-emerald-100">
              <Activity size={16} /> {t.quickActions}
            </div>
            <div className="space-y-2 text-emerald-50/90">
              <div className="flex items-start gap-2">
                <Upload size={14} className="mt-0.5 shrink-0" />
                <span>{t.adminNote}</span>
              </div>
              <div>• {t.console}: {OWNER.handle}</div>
              <div>• {t.inventory}: {tools.length} tools</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-7 xl:grid-cols-[1.1fr_.9fr]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingTool ? t.editMode : t.createMode}
                </h3>
                <p className="text-sm text-slate-400">
                  {editingTool ? t.editMode : t.createMode}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
                {t.loggedAs}: {OWNER.name}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder={t.toolName}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              />
              <select
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              >
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category}>{category}</option>
                  ))}
              </select>
              <input
                value={draft.version}
                onChange={(event) => setDraft({ ...draft, version: event.target.value })}
                placeholder={t.version}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              />
              <select
                value={draft.status}
                onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              >
                <option>Stable</option>
                <option>Beta</option>
                <option>Preview</option>
              </select>
              <select
                value={draft.iconType}
                onChange={(event) => setDraft({ ...draft, iconType: event.target.value })}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              >
                <option value="code">Code</option>
                <option value="network">Network</option>
                <option value="bug">Bug</option>
                <option value="cpu">CPU</option>
                <option value="report">Report</option>
              </select>
              <input
                value={draft.fileName}
                onChange={(event) => setDraft({ ...draft, fileName: event.target.value })}
                placeholder={t.fileName}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50"
              />
              <input
                value={draft.downloadUrl}
                onChange={(event) => setDraft({ ...draft, downloadUrl: event.target.value })}
                placeholder={t.downloadUrl}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50 md:col-span-2"
              />
              <input
                type="file"
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    file: event.target.files?.[0] || null,
                    fileName: event.target.files?.[0]?.name || draft.fileName,
                  })
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-black file:text-slate-950 md:col-span-2"
              />
              <input
                value={draft.risk}
                onChange={(event) => setDraft({ ...draft, risk: event.target.value })}
                placeholder="Risk label"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50 md:col-span-2"
              />
              <input
                value={draft.featuresText}
                onChange={(event) => setDraft({ ...draft, featuresText: event.target.value })}
                placeholder={t.features}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50 md:col-span-2"
              />
              <textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                placeholder={t.description}
                className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition focus:border-cyan-300/50 md:col-span-2"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? "Saving..." : t.saveTool}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white transition hover:bg-white/10"
              >
                <X size={18} />
                {t.clear}
              </button>
            </div>
          </form>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniMetric icon={Layers} label={t.categories} value={categories.length - 1} />
              <MiniMetric icon={Lock} label={t.activeNow} value={tools.length} />
              <MiniMetric icon={Download} label={t.secureDeploys} value={tools.filter((tool) => tool.downloadUrl && tool.downloadUrl !== "#").length} />
              <MiniMetric icon={Terminal} label={t.lastUpdated} value={tools[0]?.updated ?? "—"} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                <Activity size={14} /> {t.releaseBoard}
              </div>
              <p className="text-sm text-slate-400">{t.releaseBoardDesc}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ActivityPill label="Stable" value={releaseStatus.stable} tone="emerald" />
                <ActivityPill label="Beta" value={releaseStatus.beta} tone="amber" />
                <ActivityPill label="Preview" value={releaseStatus.preview} tone="slate" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                <Shield size={14} /> {t.publishChecklist}
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <span>Release notes ready</span>
                  <span className="text-emerald-200">Done</span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <span>Download path verified</span>
                  <span className="text-emerald-200">Done</span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <span>Owner contact included</span>
                  <span className="text-amber-200">Review</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                <FileText size={14} /> {t.auditLog}
              </div>
              <div className="space-y-4">
                {recentTools.map((tool) => {
                  const Icon = iconMap[tool.iconType] || Code2;

                  return (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{tool.name}</div>
                          <div className="text-xs text-slate-400">{tool.category} • {tool.updated}</div>
                        </div>
                      </div>
                      <StatusBadge status={tool.status} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ShivaToolsHub() {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    return loadJSON(STORAGE_KEYS.language, "en");
  });

  const [session, setSession] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return loadJSON(STORAGE_KEYS.session, null);
  });

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(STORAGE_KEYS.token) || "";
  });

  const [visitorCount] = useState(() => {
    if (typeof window === "undefined") return 1;
 
    const current = Number(localStorage.getItem("shiva_visitors") || "0");
    const updated = current + 1;

    localStorage.setItem("shiva_visitors", updated);

    return updated;
  });

  const [tools, setTools] = useState(defaultTools);
  const [pageError, setPageError] = useState("");
  const [loadingTools, setLoadingTools] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editingTool, setEditingTool] = useState(null);
  const [previewTool, setPreviewTool] = useState(null);

  const t = translations[lang];
  const isAdmin = session?.role === "admin";

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.language, JSON.stringify(lang));
    }
  }, [lang]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (session) {
        window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.session);
      }
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    (async () => {
      if (mounted) {
        setLoadingTools(true);
        setPageError("");
      }

      try {
        const data = await apiRequest("/api/tools", {
          headers: authHeaders(token),
        });

        if (mounted) {
          setTools(Array.isArray(data) && data.length > 0 ? data.map(toClientTool) : defaultTools);
        }
      } catch (err) {
        if (mounted) {
          setPageError(err.message || "Backend connection failed.");
          setTools(defaultTools);
        }
      } finally {
        if (mounted) setLoadingTools(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const stats = useMemo(() => {
    const categoriesCount = new Set(tools.map((tool) => tool.category)).size;
    const downloadsCount = tools.filter((tool) => tool.downloadUrl && tool.downloadUrl !== "#").length;

    return {
      toolsCount: tools.length,
      categoriesCount,
      downloadsCount,
      latestUpdate: tools[0]?.updated ?? "—",
    };
  }, [tools]);

  const filteredTools = useMemo(() => {
    const loweredQuery = query.toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const searchText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();

      return matchesCategory && searchText.includes(loweredQuery);
    });
  }, [tools, query, category]);

  const setToolForEdit = (tool) => {
    setEditingTool(tool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveTool = (tool) => {
    setTools((currentTools) => {
      const existingIndex = currentTools.findIndex((item) => item.id === tool.id);

      if (existingIndex >= 0) {
        const nextTools = [...currentTools];
        nextTools[existingIndex] = tool;
        return nextTools;
      }

      return [tool, ...currentTools];
    });

    setEditingTool(null);
  };

  const deleteTool = async (toolId) => {
    const confirmed = window.confirm("Delete this tool from the arsenal?");

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/api/tools/${toolId}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      setTools((currentTools) => currentTools.filter((tool) => tool.id !== toolId));

      if (editingTool?.id === toolId) {
        setEditingTool(null);
      }
    } catch (err) {
      alert(err.message || "Delete failed.");
    }
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.session);
    setToken("");
    setSession(null);
    setEditingTool(null);
    setPreviewTool(null);
  };

  if (!session) {
    return <AuthScreen lang={lang} setLang={setLang} setSession={setSession} setToken={setToken} />;
  }

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_28%)]" />
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-cyan-300 via-blue-500 to-emerald-300" />
      <div className="fixed inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:52px_52px]" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <Shield className="text-cyan-200" size={28} />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight">{OWNER.brand} Tools Hub</div>
              <div className="text-xs text-slate-400">
                {t.loggedAs}: {session.name} • {isAdmin ? t.adminMode : t.userMode}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher lang={lang} setLang={setLang} />
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              <LogOut size={16} />
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100">
            <Star size={16} /> LEVEL MAX CYBER PORTAL
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {t.heroTitleA} <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-emerald-200 bg-clip-text text-transparent">{t.heroTitleB}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t.heroText}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white"
            >
              {t.browse}
              <ExternalLink size={18} />
            </a>

            {isAdmin && (
              <a
                href="#admin"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10"
              >
                {t.addTool}
                <Plus size={18} />
              </a>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="font-mono text-sm text-cyan-200">shiva@root:~$ {t.dashboardLine}</div>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-sm leading-7 text-slate-300">
            <div className="text-emerald-300">[OK] {t.ownerVerified}: {OWNER.name}</div>
            <div className="text-cyan-300">[OK] {t.brandLoaded}: {OWNER.brand}</div>
            <div className="text-blue-300">[OK] {t.toolsIndexed}: {stats.toolsCount}</div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard icon={Terminal} label={t.publishedTools} value={stats.toolsCount} />
            <MetricCard icon={Layers} label={t.categories} value={stats.categoriesCount} />
            <MetricCard icon={Lock} label={t.secureDeploys} value={stats.downloadsCount} />
            <MetricCard icon={Activity} label={t.status} value={t.live} />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100">
              <UserCircle2 size={16} />
              {t.aboutAhmad}
            </div>
            <h2 className="text-4xl font-black text-white">Ahmad Hamad</h2>
            <div className="mt-3 font-bold text-cyan-200">Founder of Sh!Va Security Systems</div>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-slate-300">{t.aboutText}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <ActivityPill label={t.community} value="Sh!Va" tone="cyan" />
              <ActivityPill label={t.usersJoined} value={`${visitorCount}+`} tone="emerald" />
              <ActivityPill label="Status" value="ONLINE" tone="amber" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100">
              <Globe size={16} />
              {t.socialMedia}
            </div>
            <h2 className="text-3xl font-black text-white">{t.connectNow}</h2>
            <div className="mt-8 grid gap-4">
              <a href={OWNER.socials.github} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Link2 className="text-cyan-200" /><span className="font-bold text-white">GitHub</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
              <a href={OWNER.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Globe className="text-cyan-200" /><span className="font-bold text-white">LinkedIn</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
              <a href={OWNER.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Camera className="text-cyan-200" /><span className="font-bold text-white">Instagram</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
              <a href={OWNER.socials.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Link2 className="text-cyan-200" /><span className="font-bold text-white">Facebook</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
              <a href={OWNER.socials.youtube} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Mail className="text-cyan-200" /><span className="font-bold text-white">YouTube</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
              <a href={OWNER.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <div className="flex items-center gap-3"><Link2 className="text-cyan-200" /><span className="font-bold text-white">X / Twitter</span></div>
                <ExternalLink className="text-slate-400" size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {pageError && (
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {pageError}
          </div>
        </div>
      )}

      {isAdmin && (
        <AdminPanel
          t={t}
          tools={tools}
          editingTool={editingTool}
          onSave={saveTool}
          onCancelEdit={() => setEditingTool(null)}
          token={token}
          key={editingTool?.id ?? "new"}
        />
      )}

      {previewTool && (
        <ToolModal
          tool={previewTool}
          t={t}
          onClose={() => setPreviewTool(null)}
        />
      )}

      {isAdmin && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-2 pb-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                <Activity size={14} /> {t.support}
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-300">{t.supportDesc}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ActivityPill label="Email" value={OWNER.email} />
                <ActivityPill label="Brand" value={OWNER.brand} tone="emerald" />
                <ActivityPill label="Handle" value={OWNER.handle} tone="amber" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                <Terminal size={14} /> {t.lastActivity}
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">• {tools[0]?.name} marked as {tools[0]?.status ?? "Stable"}</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">• {stats.latestUpdate} release file synced from backend</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">• {isAdmin ? "Admin session active and ready for publishing" : "User session active"}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="tools" className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-black text-white">{t.toolsArsenal}</h2>
            <p className="mt-2 max-w-2xl text-slate-400">{loadingTools ? "Loading tools from backend..." : t.toolsDesc}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-300/50 sm:w-72"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm outline-none transition focus:border-cyan-300/50"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16 text-center text-slate-300">
            {loadingTools ? "Loading..." : t.emptyState}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                t={t}
                isAdmin={isAdmin}
                onEdit={setToolForEdit}
                onDelete={deleteTool}
                onPreview={setPreviewTool}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="relative z-10 mt-10 border-t border-white/10 bg-slate-950/80 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row">

          <div>
            <div className="text-lg font-black text-white">
              Ahmad Hamad • Sh!Va Security Systems
            </div>

            <div className="mt-1 text-sm text-slate-400">
              © 2026 Ahmad Hamad / Sh!Va. All Rights Reserved.
            </div>
          </div>

          <div className="flex items-center gap-3">

            <a
              href={OWNER.socials.github}
              target="_blank"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Link2 size={18} />
            </a>

            <a
              href={OWNER.socials.linkedin}
              target="_blank"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Globe size={18} />
            </a>

            <a
              href={OWNER.socials.instagram}
              target="_blank"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Camera size={18} />
            </a>

          </div>
        </div>
      </footer>
    </main>
  );
}
