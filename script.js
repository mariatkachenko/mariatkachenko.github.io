export const translations = {
  ru: {
    'a11y.skip':'К содержанию','nav.work':'Работы','nav.approach':'Подход','nav.about':'Обо мне','nav.available':'Доступна для проектов','hero.eyebrow':'Продуктовый дизайнер · Москва / Remote','hero.title':'Превращаю сложные системы в понятные продукты.','hero.intro':'Проектирую B2B и финтех-продукты: от исследования и стратегии до интерфейса, который меняет метрики бизнеса.','work.label':'Избранные работы','work.note':'2022—2025','case.role':'Роль','case.result':'Результат','case1.title':'Signal — аналитика без шума','case1.desc':'Пересобрала онбординг и ключевой сценарий B2B-платформы, чтобы команды быстрее находили причины отклонений.','case1.role':'Lead Product Designer','case1.metric':'к активации','case2.title':'Mint — инвестиции без тревоги','case2.desc':'Упростила первую покупку актива и объяснила риски человеческим языком для начинающих инвесторов.','case2.role':'Senior Product Designer','case2.metric':'к конверсии','case3.title':'Loop — город в одном маршруте','case3.desc':'Объединила разные виды транспорта в единый сценарий планирования, оплаты и поддержки поездки.','case3.role':'Product Designer','case3.metric':'времени сценария','approach.label':'Как я работаю','approach.note':'Ясность важнее декора','approach.title':'Дизайн — это способ принимать хорошие решения вместе.','principle1.title':'Сначала контекст','principle1.desc':'Интервью, данные и ограничения помогают найти настоящую задачу, а не полировать симптом.','principle2.title':'Система, не экран','principle2.desc':'Проектирую сценарий целиком и собираю решения в устойчивые паттерны.','principle3.title':'Проверять рано','principle3.desc':'Прототипы и эксперименты превращают мнения в знания до дорогой разработки.','about.label':'Обо мне','about.title':'Я — Александра, продуктовый дизайнер с любовью к сложным задачам.','about.text':'Работала с командами от ранних стартапов до зрелых платформ. Соединяю исследование, продуктовую стратегию и сильный визуальный язык. Помогаю командам видеть целое и двигаться быстрее.','contact.eyebrow':'Есть сложная продуктовая задача?','contact.title':'Давайте сделаем её понятной.','contact.top':'Наверх ↑','footer.note':'Спроектировано с вниманием к смыслу и деталям.'
  },
  en: {
    'a11y.skip':'Skip to content','nav.work':'Work','nav.approach':'Approach','nav.about':'About','nav.available':'Available for projects','hero.eyebrow':'Product designer · Moscow / Remote','hero.title':'I turn complex systems into clear products.','hero.intro':'I design B2B and fintech products—from research and strategy to interfaces that move business metrics.','work.label':'Selected work','work.note':'2022—2025','case.role':'Role','case.result':'Outcome','case1.title':'Signal — analytics without noise','case1.desc':'Redesigned onboarding and the core B2B workflow so teams could find the causes behind anomalies faster.','case1.role':'Lead Product Designer','case1.metric':'activation','case2.title':'Mint — investing without anxiety','case2.desc':'Simplified the first asset purchase and explained risks in plain language for new investors.','case2.role':'Senior Product Designer','case2.metric':'conversion','case3.title':'Loop — one route through the city','case3.desc':'Unified multiple transport modes into a single journey for planning, payment, and trip support.','case3.role':'Product Designer','case3.metric':'task time','approach.label':'How I work','approach.note':'Clarity over decoration','approach.title':'Design is how teams make better decisions together.','principle1.title':'Context first','principle1.desc':'Interviews, data, and constraints reveal the real problem instead of polishing a symptom.','principle2.title':'System, not screen','principle2.desc':'I design the whole journey and turn decisions into durable patterns.','principle3.title':'Test early','principle3.desc':'Prototypes and experiments turn opinions into knowledge before development gets expensive.','about.label':'About','about.title':'I’m Alexandra, a product designer drawn to complex problems.','about.text':'I’ve worked with teams from early-stage startups to mature platforms. I combine research, product strategy, and a strong visual language—helping teams see the whole and move faster.','contact.eyebrow':'Got a complex product challenge?','contact.title':'Let’s make it clear.','contact.top':'Back to top ↑','footer.note':'Designed with care for meaning and detail.'
  }
};

export function setLanguage(language) {
  if (typeof document === 'undefined' || !translations[language]) return;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  try { localStorage.setItem('portfolio-language', language); } catch { /* storage is optional */ }
}

if (typeof document !== 'undefined') {
  let initialLanguage = 'ru';
  try { initialLanguage = localStorage.getItem('portfolio-language') || 'ru'; } catch { /* use Russian */ }
  setLanguage(translations[initialLanguage] ? initialLanguage : 'ru');
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('has-js');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }
}
