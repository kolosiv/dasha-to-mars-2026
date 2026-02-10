import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, Rocket } from "lucide-react";
import MarsScene from "./components/MarsScene.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-void p-8">
          <div className="glass-panel max-w-2xl p-8 text-white">
            <h1 className="mb-4 text-xl font-bold text-red-400">
              Error Loading Mission
            </h1>
            <p className="mb-4 text-sm">
              {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-holo px-4 py-2 text-sm font-mono text-black"
            >
              RELOAD
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const terminalLines = [
  'Инициализация протокола "LOVE-X"...',
  "Проверка систем жизнеобеспечения... НОРМА",
  "Анализ совместимости экипажа... 100%",
  "Командир: Ваня... ГОТОВ",
  "Второй пилот: Даша... ПОИСК СИГНАЛА...",
  "СВЯЗЬ УСТАНОВЛЕНА ❤️"
];

function useTypewriter(lines, onDone, speed = 32, lineDelay = 560) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const nextLines = [];
      for (const line of lines) {
        if (cancelled) return;
        let current = "";
        nextLines.push("");
        const linePos = nextLines.length - 1;
        for (const char of line) {
          if (cancelled) return;
          current += char;
          nextLines[linePos] = current;
          setVisibleLines([...nextLines]);
          await new Promise((r) => setTimeout(r, speed));
        }
        await new Promise((r) => setTimeout(r, lineDelay));
      }
      if (!cancelled && onDone) {
        setTimeout(onDone, 800);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(lines), onDone, speed, lineDelay]);

  return visibleLines;
}

function PhaseTerminal({ onComplete }) {
  const visibleLines = useTypewriter(terminalLines, onComplete);

  return (
    <motion.div
      key="terminal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative flex min-h-screen items-center justify-center bg-void overflow-hidden"
    >
      <MarsScene orbitPhase={false} />
      <div className="scanline-overlay" />
      <div className="noise-overlay" />

      <motion.div
        className="glass-panel border-cyan-500/30 bg-black/65 p-8 md:p-10 w-[92vw] max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-cyan-300/80 uppercase tracking-[0.35em]">
          <span className="terminal-glow">MISSION: ETERNITY / PRE-FLIGHT</span>
          <span className="text-cyan-200/70">SPACEX-ROMANCE v2.26</span>
        </div>

        <div className="mb-6 flex items-center gap-3 text-sm text-cyan-200/85 font-mono">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          <span>СТАТУС КОНСОЛИ: ОНЛАЙН</span>
        </div>

        <div className="space-y-2 font-mono text-[13px] leading-relaxed text-cyan-100/90 min-h-[200px]">
          {visibleLines.length === 0 ? (
            <div className="flex items-center gap-2 text-cyan-500/60">
              <span>root@love-x:&gt;</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ▌
              </motion.span>
            </div>
          ) : (
            visibleLines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2"
              >
                <span className="text-cyan-500/60">root@love-x:&gt;</span>
                <span className="terminal-glow">{line}</span>
              </div>
            ))
          )}

          {visibleLines.length > 0 && (
            <motion.div
              className="flex items-center gap-2 mt-2 text-cyan-300/70"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              <span className="text-cyan-400">▌</span>
              <span>ОЖИДАНИЕ СИГНАЛА ОТ ВТОРОГО ПИЛОТА...</span>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between text-xs text-cyan-200/60 font-mono">
          <span>Дата запуска: 14.02.2026</span>
          <span>RELAY LINK: VANYA ⇄ DASHA</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BoardingCard({ title, name, status, seat, accent }) {
  return (
    <motion.div
      className="glass-panel relative flex flex-col justify-between overflow-hidden border-white/12 bg-white/7"
      whileHover={{ y: -4, borderColor: "rgba(79, 209, 255, 0.6)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-holo/40 via-transparent to-transparent blur-3xl" />
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
        <span>{title}</span>
        <span className="flex items-center gap-1 text-holo">
          <Sparkles size={14} />
          LOVE-X
        </span>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              ПАССАЖИР
            </div>
            <div className="mt-1 text-xl font-semibold tracking-tight text-white">
              {name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              МЕСТО
            </div>
            <div className="mt-1 font-mono text-lg text-holo">{seat}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/75">
          <div>
            <div className="text-white/45">СТАТУС</div>
            <div className="mt-1 text-[11px] text-holo">{status}</div>
          </div>
          <div className="text-right">
            <div className="text-white/45">РОЛЬ</div>
            <div className="mt-1 text-[11px] text-white/85">{accent}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 text-[10px] font-mono text-white/70 border-t border-dashed border-white/15">
          <div>
            <div className="text-white/45">РЕЙС</div>
            <div className="mt-1 text-[11px]">FOREVER-2026</div>
          </div>
          <div>
            <div className="text-white/45">ДАТА</div>
            <div className="mt-1 text-[11px]">14 ФЕВРАЛЯ</div>
          </div>
          <div>
            <div className="text-white/45">ПУНКТ</div>
            <div className="mt-1 text-[11px]">КОЛОНИЯ МАРС</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/25 px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
        CHECK-IN COMPLETE · NO RETURN FLIGHT BOOKED
      </div>
    </motion.div>
  );
}

function PhaseOrbit({ onBeginWarp }) {
  return (
    <motion.div
      key="orbit"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#050712] via-[#050712] to-[#080414]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <MarsScene orbitPhase />
      <div className="scanline-overlay" />
      <div className="noise-overlay" />

      <div className="relative z-20 flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-20 md:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              LOVE-X / ORBITAL BOARDING
            </div>
            <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.7)] sm:text-4xl md:text-5xl">
              Mission: Eternity{" "}
              <span className="block text-base font-normal text-white/70 md:text-lg">
                Реализм Илона Маска. Романтика, которой хватает на всю
                вселенную.
              </span>
            </h1>
          </div>
          <div className="glass-panel border-white/10 bg-black/50 px-4 py-3 text-xs font-mono text-white/70">
            <div className="flex items-center justify-between gap-4">
              <span>Текущая орбита: MARS INSERTION</span>
              <span className="flex items-center gap-1 text-mars">
                <Heart size={14} className="fill-mars/60" />
                <span>100%</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-5">
            <BoardingCard
              title="БОРДИНГ ПАСС"
              name="ВАНЯ"
              status="КОМАНДИР"
              seat="01A"
              accent="ПИЛОТ"
            />
            <BoardingCard
              title="БОРДИНГ ПАСС"
              name="ДАША"
              status="МОЯ ВСЕЛЕННАЯ"
              seat="01B"
              accent="ВТОРОЙ ПИЛОТ"
            />
          </div>

          <motion.div
            className="glass-panel relative flex h-full flex-col justify-between border-white/10 bg-black/60 px-5 py-5 md:px-6 md:py-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-mars/40 blur-3xl opacity-70" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-holo/40 blur-3xl opacity-50" />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/70">
                <span>РЕЙС: FOREVER-2026</span>
                <span>РЕЖИМ: ЖИЗНЬ × 2</span>
              </div>

              <div className="space-y-3 text-[13px] text-white/80">
              <p>
  Забудь про тестовые запуски и симуляции. В масштабах бесконечной Вселенной
  шансы встретить своего человека стремятся к нулю, но мы сломали эту
  статистику. Теперь перед нами —{" "}
  <span className="font-semibold text-holo">
    главная миссия нашей жизни
  </span>
  .
</p>
<p>
  Земля — это лишь точка старта. Мы берем билет в один конец, потому что я не
  планирую возвращаться в прошлое, где нас не было. Впереди неизвестность, но
  термодинамика бессильна: даже в ледяном космосе мне будет тепло, пока{" "}
  <span className="font-semibold text-holo">
    твой скафандр рядом с моим
  </span>
  .
</p>
<p>
  Если ты нажимаешь «Полетели», ты выбираешь не просто планету. Ты выбираешь
  быть моей единственной константой в любом уравнении. Все турбулентности,
  перегрузки и черные дыры мы пройдем вместе.{" "}
  <span className="font-semibold text-holo">
    Эта Вселенная теперь наша
  </span>
  .
</p>
              </div>
            </div>

            <div className="relative mt-6 flex flex-col gap-4">
              <button
                type="button"
                onClick={onBeginWarp}
                className="group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-holo/60 bg-gradient-to-r from-holo/30 via-holo/60 to-holo/30 px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#020617] shadow-[0_0_24px_rgba(79,209,255,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                  />
                  НАЧАТЬ ПОЛЁТ
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20"
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: "linear" }}
                />
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>НАЖМИ, ЕСЛИ ГОТОВА ЛЕТЕТЬ НАВСЕГДА</span>
                <span>ETA МАРС: ∞ ЛЕТ, ∞ МОМЕНТОВ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PhaseHyperdrive({ onArrive }) {
  useEffect(() => {
    const timeout = setTimeout(onArrive, 2600);
    return () => clearTimeout(timeout);
  }, [onArrive]);

  return (
    <motion.div
      key="hyperdrive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b,black_60%)]" />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {Array.from({ length: 220 }).map((_, i) => {
            const delay = Math.random() * 0.8;
            const duration = 0.7 + Math.random() * 0.3;
            const left = Math.random() * 100;
            const hue = 200 + Math.random() * 40;
            const height = 18 + Math.random() * 40;
            const blur = Math.random() * 2;
            return (
              <motion.div
                key={i}
                className="absolute w-px"
                style={{
                  left: `${left}%`,
                  top: "-10%",
                  height,
                  background: `linear-gradient(to bottom, hsla(${hue},100%,70%,0) 0%, hsla(${hue},100%,80%,0.85) 40%, hsla(${hue},100%,60%,0) 100%)`,
                  filter: `blur(${blur}px)`
                }}
                initial={{ y: "0%", opacity: 0 }}
                animate={{ y: "130%", opacity: [0, 1, 0] }}
                transition={{
                  delay,
                  duration,
                  ease: [0.2, 0.8, 0.2, 1]
                }}
              />
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 text-center font-mono text-xs uppercase tracking-[0.3em] text-sky-100/80"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        ГИПЕРПРЫЖОК АКТИВИРОВАН · LOVE-X
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ times: [0, 0.7, 1], duration: 2.3, ease: "easeIn" }}
      />
    </motion.div>
  );
}

function PhaseLanding() {
  const dust = useMemo(
    () =>
      Array.from({ length: 32 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 10 + Math.random() * 12,
        size: 2 + Math.random() * 3,
        opacity: 0.12 + Math.random() * 0.25
      })),
    []
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        left: 5 + Math.random() * 90,
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 10,
        scale: 0.6 + Math.random() * 0.9
      })),
    []
  );

  return (
    <motion.div
      key="landing"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mars-sunset"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#2b0b16] via-transparent to-transparent" />

      {dust.map((d, idx) => (
        <motion.div
          key={`dust-${idx}`}
          className="pointer-events-none absolute rounded-full bg-orange-100"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            bottom: "-10%",
            opacity: d.opacity
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-120%", opacity: [0, d.opacity, 0] }}
          transition={{
            delay: d.delay,
            duration: d.duration,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {hearts.map((h, idx) => (
        <motion.div
          key={`heart-${idx}`}
          className="pointer-events-none absolute text-pink-200/80"
          style={{ left: `${h.left}%`, bottom: "-5%", transformOrigin: "center" }}
          initial={{ y: 0, opacity: 0, scale: h.scale }}
          animate={{
            y: "-125%",
            opacity: [0, 0.9, 0],
            scale: h.scale * 1.1
          }}
          transition={{
            delay: h.delay,
            duration: h.duration,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          <Heart className="h-4 w-4 md:h-5 md:w-5 fill-pink-200/60" />
        </motion.div>
      ))}

      <div className="relative z-10 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="glass-panel mx-auto max-w-3xl border-white/15 bg-black/35 px-6 py-8 sm:px-10 sm:py-10"
        >
          <div className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-white/60">
            МАРС. ПОВЕРХНОСТЬ. КООРДИНАТЫ: VANJA × DASHA
          </div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Я готов лететь на Марс, только если ты будешь рядом.
          </h2>
          <p className="mt-5 text-sm text-white/80 sm:text-base">
            С Днём святого Валентина, Даша.{" "}
            <span className="font-mono text-pink-200/90">
              MISSION: ETERNITY // STATUS: ONLY WITH YOU.
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("terminal");

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {phase === "terminal" && (
            <PhaseTerminal onComplete={() => setPhase("orbit")} />
          )}
          {phase === "orbit" && (
            <PhaseOrbit onBeginWarp={() => setPhase("hyperdrive")} />
          )}
          {phase === "hyperdrive" && (
            <PhaseHyperdrive onArrive={() => setPhase("landing")} />
          )}
          {phase === "landing" && <PhaseLanding />}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}


