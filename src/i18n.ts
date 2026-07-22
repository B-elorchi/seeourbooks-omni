import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "SeeOurBook",
      "login": "Log in",
      "signup": "Sign up",
      "dashboard": "Dashboard",
      "ai_process": "AI Process",
      "my_library": "My Library",
      "logout": "Logout",
      "free_trial": "Free Trial",
      "user": "User",
      "switch_lang": "عربي",

      "nav": {
        "server_catalog": "Server Catalog",
        "my_books": "My Books"
      },

      "common": {
        "email": "Email",
        "password": "Password",
        "start_processing": "Start Processing",
        "in_progress": "In Progress",
        "failed": "Failed",
        "summary": "Summary",
        "audio": "Audio",
        "audio_original": "Audio Original",
        "audio_translated": "Audio Translated",
        "mindmap": "Mindmap",
        "epub": "EPUB"
      },

      "landing": {
        "badge": "Omni Portal is now live",
        "title_line1": "Read Less.",
        "title_line2": "Learn More.",
        "subtitle": "Transform any book, PDF, or video into a comprehensive learning experience with bilingual summaries, full audio, and interactive mind maps in seconds.",
        "cta": "Start your free trial",
        "no_cc": "No credit card required",
        "mock_summary_title": "Atomic Habits — Summary",
        "mock_summary_line1": "Small, consistent changes compound into",
        "mock_summary_line2": "remarkable results over time...",
        "mock_audio_label": "Full audiobook",
        "mock_mindmap_label": "Mind map",
        "mock_status": "Ready",
        "feature1_title": "Smart Summaries",
        "feature1_desc": "Get to the core ideas of any book instantly. Available in both English and Arabic.",
        "feature2_title": "Immersive Audio",
        "feature2_desc": "Listen on the go with studio-quality AI voices generating full book audio.",
        "feature3_title": "Video Extraction",
        "feature3_desc": "Paste any video URL and we'll extract the transcript and process it into a learning guide.",
        "final_cta_title": "Ready to read less and learn more?",
        "final_cta_subtitle": "Join Omni Portal and turn your next book into a summary, an audiobook, and a mind map — all at once.",
        "final_cta_button": "Get started for free",
        "footer_tagline": "Turning books into knowledge you can hear, see, and skim.",
        "footer_rights": "All rights reserved."
      },

      "login_page": {
        "subtitle": "Welcome back to Omni Portal",
        "no_account": "Don't have an account?",
        "error_default": "Failed to login"
      },

      "signup_page": {
        "subtitle": "Create your Omni Portal account",
        "have_account": "Already have an account?",
        "check_email": "Check your email for the confirmation link!",
        "error_default": "Failed to sign up"
      },

      "dashboard_page": {
        "welcome_back": "Welcome back",
        "overview": "Here's a quick overview of your Omni Portal.",
        "trial_active": "Free Trial Active",
        "trial_remaining": "You have 2 free AI generations remaining.",
        "use_generation": "Use a Generation",
        "uses_consumed": "1 / 3 Uses Consumed",
        "start_processing_title": "Start Processing",
        "start_processing_desc": "Upload a file, choose a book, or paste a YouTube link to generate AI content.",
        "get_started": "Get started",
        "your_library_title": "Your Library",
        "your_library_desc": "View your previously generated summaries, audio, and mind maps.",
        "view_library": "View library",
        "recent_activity_title": "Recent Activity",
        "recent_activity_desc": "You generated \"Atomic Habits Summary\" 2 days ago.",
        "see_history": "See history"
      },

      "processing": {
        "title": "Start AI Processing",
        "subtitle": "Choose an input method to generate summaries, audio, and mind maps.",
        "alert_select_file": "Please select a file first.",
        "alert_enter_youtube": "Please enter a YouTube URL.",
        "error_starting": "Error starting pipeline: ",
        "tab_upload": "Upload File",
        "tab_library": "Server Library",
        "tab_youtube": "YouTube URL",
        "upload_title": "Upload your document",
        "upload_desc": "Supports PDF, EPUB, and TXT up to 50MB",
        "browse_files": "Browse Files",
        "library_desc": "Select a book from our pre-hosted server library.",
        "id_label": "ID",
        "youtube_desc": "Paste a YouTube video URL to extract the transcript and process it.",
        "youtube_url_label": "YouTube URL",
        "options_title": "Pipeline Options",
        "opt_audio_title": "Generate Audio",
        "opt_audio_desc": "Create studio-quality narration",
        "opt_audio_translate_title": "Translated Audio",
        "opt_audio_translate_desc": "Generate Arabic translated audio",
        "opt_translate_title": "Arabic Translation",
        "opt_translate_desc": "Translate outputs to Arabic",
        "opt_mindmap_title": "Generate Mind Map",
        "opt_mindmap_desc": "Create visual representations",
        "opt_epub_title": "Generate EPUB",
        "opt_epub_desc": "Create downloadable e-book",
        "estimated_time": "Estimated Time",
        "starting": "Starting...",
        "start_pipeline": "Start AI Pipeline",
        "default_estimate": "~5 mins"
      },

      "mybooks": {
        "title": "My Books",
        "subtitle": "Your generated summaries, audiobooks, and mindmaps.",
        "filter_all": "All",
        "filter_youtube": "YouTube",
        "filter_upload": "Upload",
        "filter_catalog": "Catalog",
        "empty_title": "No books found",
        "empty_desc": "You haven't generated any content for this category yet.",
        "unknown_title": "Unknown Title",
        "asset_unavailable": "This item hasn't finished generating yet."
      },

      "library": {
        "title": "Discover Your Next Book",
        "subtitle": "Explore our curated library of top literature. Instantly generate audio, mindmaps, and summaries with a single click.",
        "search_placeholder": "Search by title or author...",
        "available_books": "Available Books",
        "process_book": "Process Book",
        "read_book": "Read Book",
        "unknown_author": "Unknown Author",
        "est_process_prefix": "Est. process:",
        "read_epub_title": "Read EPUB",
        "audio_generation_title": "Audio Generation",
        "interactive_mindmap_title": "Interactive Mindmap"
      },

      "progress": {
        "initializing": "Initializing...",
        "title": "AI Generation in Progress",
        "starting_step": "Starting",
        "completed": "Generation completed successfully! You can now view it in your Library.",
        "ended_with_status": "Job ended with status:"
      },

      "epub_reader": {
        "toggle_contents": "Toggle contents",
        "download": "Download",
        "close": "Close (Esc)",
        "contents": "Contents",
        "no_contents": "No contents",
        "load_error": "Could not load EPUB preview",
        "download_instead": "Download the file instead",
        "previous": "Previous (←)",
        "next": "Next (→)"
      }
    }
  },
  ar: {
    translation: {
      "app_name": "SeeOurBook",
      "login": "تسجيل الدخول",
      "signup": "إنشاء حساب",
      "dashboard": "لوحة التحكم",
      "ai_process": "المعالجة بالذكاء الاصطناعي",
      "my_library": "مكتبتي",
      "logout": "تسجيل الخروج",
      "free_trial": "تجربة مجانية",
      "user": "مستخدم",
      "switch_lang": "English",

      "nav": {
        "server_catalog": "مكتبة السيرفر",
        "my_books": "كتبي"
      },

      "common": {
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "start_processing": "ابدأ المعالجة",
        "in_progress": "قيد التنفيذ",
        "failed": "فشل",
        "summary": "الملخص",
        "audio": "الصوت",
        "audio_original": "الصوت الأصلي",
        "audio_translated": "الصوت المترجم",
        "mindmap": "الخريطة الذهنية",
        "epub": "EPUB"
      },

      "landing": {
        "badge": "منصة Omni متاحة الآن",
        "title_line1": "اقرأ أقل.",
        "title_line2": "تعلّم أكثر.",
        "subtitle": "حوّل أي كتاب أو PDF أو فيديو إلى تجربة تعلّم متكاملة بملخصات ثنائية اللغة، صوت كامل، وخرائط ذهنية تفاعلية في ثوانٍ.",
        "cta": "ابدأ تجربتك المجانية",
        "no_cc": "بدون الحاجة لبطاقة ائتمان",
        "mock_summary_title": "ملخص — Atomic Habits",
        "mock_summary_line1": "التغييرات الصغيرة والمستمرة تتراكم لتحقق",
        "mock_summary_line2": "نتائج مذهلة مع مرور الوقت...",
        "mock_audio_label": "الكتاب الصوتي كاملاً",
        "mock_mindmap_label": "خريطة ذهنية",
        "mock_status": "جاهز",
        "feature1_title": "ملخصات ذكية",
        "feature1_desc": "احصل على جوهر أي كتاب فورًا. متوفر باللغتين العربية والإنجليزية.",
        "feature2_title": "صوت غامر",
        "feature2_desc": "استمع أثناء تنقلك بأصوات ذكاء اصطناعي بجودة استوديو تروي الكتاب كاملاً.",
        "feature3_title": "استخراج من الفيديو",
        "feature3_desc": "الصق رابط أي فيديو وسنستخرج النص الصوتي ونحوّله إلى دليل تعلّمي.",
        "final_cta_title": "مستعد لتقرأ أقل وتتعلّم أكثر؟",
        "final_cta_subtitle": "انضم إلى منصة Omni وحوّل كتابك القادم إلى ملخص، وكتاب صوتي، وخريطة ذهنية، كل ذلك دفعة واحدة.",
        "final_cta_button": "ابدأ مجانًا الآن",
        "footer_tagline": "نحوّل الكتب إلى معرفة يمكنك سماعها ورؤيتها وتصفّحها.",
        "footer_rights": "جميع الحقوق محفوظة."
      },

      "login_page": {
        "subtitle": "أهلاً بعودتك إلى منصة Omni",
        "no_account": "ليس لديك حساب؟",
        "error_default": "فشل تسجيل الدخول"
      },

      "signup_page": {
        "subtitle": "أنشئ حسابك في منصة Omni",
        "have_account": "لديك حساب بالفعل؟",
        "check_email": "تحقق من بريدك الإلكتروني للحصول على رابط التأكيد!",
        "error_default": "فشل إنشاء الحساب"
      },

      "dashboard_page": {
        "welcome_back": "أهلاً بعودتك",
        "overview": "إليك نظرة سريعة على منصة Omni الخاصة بك.",
        "trial_active": "التجربة المجانية نشطة",
        "trial_remaining": "لديك عمليتا توليد مجانيتان متبقيتان بالذكاء الاصطناعي.",
        "use_generation": "استخدم عملية توليد",
        "uses_consumed": "تم استخدام 1 / 3",
        "start_processing_title": "ابدأ المعالجة",
        "start_processing_desc": "ارفع ملفًا، اختر كتابًا، أو الصق رابط يوتيوب لتوليد محتوى بالذكاء الاصطناعي.",
        "get_started": "ابدأ الآن",
        "your_library_title": "مكتبتك",
        "your_library_desc": "شاهد ملخصاتك وصوتياتك وخرائطك الذهنية التي تم توليدها سابقًا.",
        "view_library": "عرض المكتبة",
        "recent_activity_title": "النشاط الأخير",
        "recent_activity_desc": "قمت بتوليد \"ملخص Atomic Habits\" منذ يومين.",
        "see_history": "عرض السجل"
      },

      "processing": {
        "title": "ابدأ المعالجة بالذكاء الاصطناعي",
        "subtitle": "اختر طريقة الإدخال لتوليد الملخصات والصوت والخرائط الذهنية.",
        "alert_select_file": "الرجاء اختيار ملف أولاً.",
        "alert_enter_youtube": "الرجاء إدخال رابط يوتيوب.",
        "error_starting": "خطأ في بدء المعالجة: ",
        "tab_upload": "رفع ملف",
        "tab_library": "مكتبة السيرفر",
        "tab_youtube": "رابط يوتيوب",
        "upload_title": "ارفع مستندك",
        "upload_desc": "يدعم PDF وEPUB وTXT حتى 50 ميجابايت",
        "browse_files": "تصفح الملفات",
        "library_desc": "اختر كتابًا من مكتبة السيرفر المستضافة مسبقًا.",
        "id_label": "المعرّف",
        "youtube_desc": "الصق رابط فيديو يوتيوب لاستخراج النص الصوتي ومعالجته.",
        "youtube_url_label": "رابط يوتيوب",
        "options_title": "خيارات المعالجة",
        "opt_audio_title": "توليد الصوت",
        "opt_audio_desc": "إنشاء رواية صوتية بجودة استوديو",
        "opt_audio_translate_title": "الصوت المترجم",
        "opt_audio_translate_desc": "توليد الرواية الصوتية المترجمة للعربية",
        "opt_translate_title": "الترجمة إلى العربية",
        "opt_translate_desc": "ترجمة المخرجات إلى اللغة العربية",
        "opt_mindmap_title": "توليد خريطة ذهنية",
        "opt_mindmap_desc": "إنشاء تمثيلات بصرية للمحتوى",
        "opt_epub_title": "توليد EPUB",
        "opt_epub_desc": "إنشاء كتاب إلكتروني قابل للتنزيل",
        "estimated_time": "الوقت المقدّر",
        "starting": "جارٍ البدء...",
        "start_pipeline": "ابدأ معالجة الذكاء الاصطناعي",
        "default_estimate": "~٥ دقائق"
      },

      "mybooks": {
        "title": "كتبي",
        "subtitle": "ملخصاتك وكتبك الصوتية وخرائطك الذهنية التي تم توليدها.",
        "filter_all": "الكل",
        "filter_youtube": "يوتيوب",
        "filter_upload": "مرفوع",
        "filter_catalog": "الفهرس",
        "empty_title": "لا توجد كتب",
        "empty_desc": "لم تقم بتوليد أي محتوى لهذه الفئة بعد.",
        "unknown_title": "عنوان غير معروف",
        "asset_unavailable": "لم يتم الانتهاء من توليد هذا العنصر بعد."
      },

      "library": {
        "title": "اكتشف كتابك التالي",
        "subtitle": "استكشف مكتبتنا المنتقاة من أفضل الأعمال الأدبية. ولّد الصوت والخرائط الذهنية والملخصات فورًا بنقرة واحدة.",
        "search_placeholder": "ابحث بالعنوان أو المؤلف...",
        "available_books": "الكتب المتاحة",
        "process_book": "معالجة الكتاب",
        "read_book": "قراءة الكتاب",
        "unknown_author": "مؤلف غير معروف",
        "est_process_prefix": "الوقت المقدّر للمعالجة:",
        "read_epub_title": "قراءة EPUB",
        "audio_generation_title": "توليد الصوت",
        "interactive_mindmap_title": "خريطة ذهنية تفاعلية"
      },

      "progress": {
        "initializing": "جارٍ التهيئة...",
        "title": "توليد الذكاء الاصطناعي قيد التنفيذ",
        "starting_step": "جارٍ البدء",
        "completed": "اكتمل التوليد بنجاح! يمكنك الآن مشاهدته في مكتبتك.",
        "ended_with_status": "انتهت المهمة بالحالة:"
      },

      "epub_reader": {
        "toggle_contents": "إظهار/إخفاء الفهرس",
        "download": "تنزيل",
        "close": "إغلاق (Esc)",
        "contents": "الفهرس",
        "no_contents": "لا يوجد فهرس",
        "load_error": "تعذّر تحميل معاينة EPUB",
        "download_instead": "تنزيل الملف بدلاً من ذلك",
        "previous": "السابق (←)",
        "next": "التالي (→)"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
