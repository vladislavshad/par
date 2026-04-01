"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8 },
};

const VALUES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Ручная работа",
    text: "Каждый предмет создаётся мастерами вручную. Никаких конвейеров — только внимание к каждому шву, каждому стежку, каждой детали.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Натуральные материалы",
    text: "Лён, бамбук, мериносовая шерсть, натуральная кожа — мы не используем синтетику. Только то, что безопасно для тела и приятно на ощупь.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Персональный подход",
    text: "Конструктор позволяет настроить всё — от материала и цвета до именной вышивки. Ваш комплект — такой же уникальный, как и вы.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: "Безупречная упаковка",
    text: "Упаковка — часть впечатления. От фирменной крафт-коробки до VIP-кейса из полированной кожи с бархатной подкладкой.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Подбор материалов",
    text: "Работаем только с проверенными поставщиками натуральных тканей. Каждая партия проходит тактильный и визуальный контроль перед запуском в производство.",
  },
  {
    number: "02",
    title: "Ручное производство",
    text: "Мастера с опытом от 10 лет кроят и шьют каждый предмет вручную. Валяние шапок, вышивка золотыми нитями, обработка кожи — всё делается руками.",
  },
  {
    number: "03",
    title: "Персонализация",
    text: "Именная вышивка выполняется на промышленном вышивальном оборудовании с точностью до стежка. Золотые и серебряные нити — настоящая металлизированная пряжа.",
  },
  {
    number: "04",
    title: "Контроль качества",
    text: "Двойная проверка: мастер-контроль на производстве и финальная инспекция перед упаковкой. Ни один комплект не уходит с дефектом.",
  },
  {
    number: "05",
    title: "Упаковка и доставка",
    text: "Бережная упаковка в выбранный вами формат — от льняной сумки до кожаного кейса. Доставка курьером по Москве и транспортной компанией по всей России.",
  },
];

const MATERIALS = [
  {
    name: "Войлок ручной валки",
    detail: "Плотность 5-8 мм, натуральная шерсть",
    use: "Шапки, подстилки, тапочки",
  },
  {
    name: "Мериносовая шерсть",
    detail: "Тончайшее волокно, мягкость кашемира",
    use: "Премиальные шапки и тапочки",
  },
  {
    name: "Фетр",
    detail: "Гладкая плотная структура",
    use: "Шапки с выраженной формой",
  },
  {
    name: "Египетский хлопок",
    detail: "400-500 г/м², длинноволокнистый",
    use: "Полотенца, халаты, килты",
  },
  {
    name: "Бамбуковое волокно",
    detail: "Антибактериальный, шелковистый",
    use: "Полотенца, халаты",
  },
  {
    name: "Натуральный лён",
    detail: "100% лён, вафельное и гладкое плетение",
    use: "Полотенца, килты, халаты",
  },
  {
    name: "Натуральная кожа",
    detail: "Полная выделка, полировка вручную",
    use: "Сумки, кейсы, фурнитура",
  },
  {
    name: "Металлизированная пряжа",
    detail: "Золотые и серебряные нити для вышивки",
    use: "Именная вышивка, логотипы",
  },
];

const GUARANTEES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Гарантия качества",
    text: "Если вы обнаружите производственный дефект — бесплатно заменим или вернём деньги.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.143-.504 1.125-1.125a17.902 17.902 0 00-3.213-9.174L17.1 4.117A2.25 2.25 0 0015.26 3H8.25M3.75 15h.008" />
      </svg>
    ),
    title: "Бережная доставка",
    text: "Курьером по Москве за 1-2 дня. По России — транспортной компанией с трек-номером.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "Персональный менеджер",
    text: "На связи в Telegram и WhatsApp. Поможем с выбором, ответим на вопросы, проконтролируем заказ.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Срок изготовления 5-7 дней",
    text: "Индивидуальное производство требует времени. Но мы не задерживаем — каждый заказ на контроле.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/95 to-bg-primary" />
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-gold) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center max-w-3xl mx-auto px-4 py-32"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-gold tracking-[0.4em] uppercase text-xs">О мануфактуре</span>
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8">
            Мы создаём вещи,
            <br />
            которые <span className="text-gold">хочется передать</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            ПАРЪ — это мануфактура банных комплектов, где ручная работа, натуральные материалы и внимание к деталям превращают обычные банные принадлежности в предметы, которыми гордятся.
          </p>
        </motion.div>
      </section>

      {/* ═══ Brand Story ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-6 text-center">
              Наша история
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12">
              От идеи — к мануфактуре
            </h2>
            <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
              <p>
                Всё началось с простого вопроса: почему в&nbsp;бане — месте силы, отдыха
                и&nbsp;традиции — люди пользуются безликими вещами из&nbsp;масс-маркета?
                Синтетические шапки, тонкие полотенца, одноразовые тапочки — всё это не&nbsp;про
                уважение к&nbsp;себе и&nbsp;не&nbsp;про удовольствие.
              </p>
              <p>
                Мы решили это изменить. ПАРЪ — это ответ для тех, кто ценит качество в&nbsp;каждой
                детали. Мы собрали команду мастеров — валяльщиков, швей, вышивальщиц, кожевников —
                и&nbsp;построили производство, где каждый предмет создаётся как&nbsp;штучная работа.
              </p>
              <p>
                Онлайн-конструктор — наша гордость. Он позволяет вам выбрать всё: форму шапки,
                плотность ткани, цвет, тип вышивки, шрифт, цвет нити и&nbsp;даже упаковку.
                Результат — комплект, который не&nbsp;встретишь больше ни&nbsp;у&nbsp;кого.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Values ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Принципы
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Что для нас важно
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-bg-secondary border border-white/5 p-8 group hover:border-gold/20 transition-colors"
              >
                <div className="text-gold mb-5 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-3">{v.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Production Process ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Производство
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Путь от заказа до&nbsp;вашего порога
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden sm:block" />

            <div className="space-y-12">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-6 sm:gap-8"
                >
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-12 h-12 bg-bg-primary border border-gold/30 flex items-center justify-center">
                      <span className="text-gold font-serif text-sm font-bold">{step.number}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-text-muted leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Materials Grid ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Материалы
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Только натуральное
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Мы принципиально не используем синтетику. Каждый материал подбирается
              по тактильным ощущениям, долговечности и безопасности.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MATERIALS.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-bg-secondary border border-white/5 p-6 hover:border-gold/20 transition-colors"
              >
                <h4 className="font-serif font-semibold mb-1">{m.name}</h4>
                <p className="text-gold text-xs mb-2">{m.detail}</p>
                <p className="text-text-muted text-sm">{m.use}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              { number: "100%", label: "натуральных материалов" },
              { number: "7", label: "предметов в конструкторе" },
              { number: "0", label: "синтетики в составе" },
              { number: "2x", label: "проверка каждого изделия" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6">
                <div className="text-gold text-4xl sm:text-5xl font-serif font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Guarantees ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Забота о клиентах
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Наши гарантии
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {GUARANTEES.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5 bg-bg-secondary border border-white/5 p-6 hover:border-gold/20 transition-colors"
              >
                <div className="text-gold flex-shrink-0 mt-0.5">{g.icon}</div>
                <div>
                  <h3 className="font-serif font-semibold mb-2">{g.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{g.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-6">
              Начните сейчас
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Соберите <span className="text-gold">свой комплект</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              7 предметов, 5+ материалов на каждый, именная вышивка золотом —
              всё настраивается в&nbsp;онлайн-конструкторе за&nbsp;5&nbsp;минут.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/constructor"
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-bg-primary px-8 py-4 text-lg font-medium tracking-wide transition-colors"
              >
                Открыть конструктор
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-gold/30 hover:border-gold text-gold px-8 py-4 text-lg tracking-wide transition-colors"
              >
                На главную
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
