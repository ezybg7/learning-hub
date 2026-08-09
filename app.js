/* ============================================================
   Learning Hub — app engine
   Hash router · burst/quiz engine · chapter exams · progress
   No dependencies, no build step.
   ============================================================ */
(() => {
  "use strict";

  const L = window.LEARN;
  const main = document.getElementById("main");

  /* ---------------- store ---------------- */
  const KEY = "learnhub.v1";
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { S = {}; }
  S.exams = S.exams || {};
  S.activity = S.activity || [];
  S.answered = S.answered || 0;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

  const chState = (eid, cid) => {
    const e = S.exams[eid] = S.exams[eid] || { chapters: {} };
    return e.chapters[cid] = e.chapters[cid] || { bursts: {}, best: null, done: false, total: 0 };
  };

  /* ---------------- theme ---------------- */
  if (S.theme) document.documentElement.dataset.theme = S.theme;
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches)
    document.documentElement.dataset.theme = "light";

  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    S.theme = next; save();
  });

  /* ---------------- streak ---------------- */
  const localDate = (d) => {
    const x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  };

  const markActivity = () => {
    const t = localDate();
    if (!S.activity.includes(t)) { S.activity.push(t); save(); }
    paintStreak();
  };

  const streak = () => {
    const set = new Set(S.activity);
    let n = 0;
    const d = new Date();
    if (!set.has(localDate(d))) d.setDate(d.getDate() - 1); // allow "today not studied yet"
    while (set.has(localDate(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };

  const paintStreak = () => {
    const n = streak();
    const pill = document.getElementById("streakPill");
    pill.hidden = n < 1;
    document.getElementById("streakCount").textContent = n;
  };

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const KEYS = "ABCDEFGHI";

  const setsEqual = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

  const shuffled = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ---------------- text-to-speech ---------------- */
  const TTS = (() => {
    const synth = window.speechSynthesis || null;
    let voices = [];
    let queue = [];
    let speaking = false;
    let paused = false;
    let currentBtn = null;

    S.tts = S.tts || { rate: 1, voice: null };

    const ICONS = {
      idle: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
      speaking: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.4"/><rect x="14" y="5" width="4" height="14" rx="1.4"/></svg>',
      paused: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    };

    const loadVoices = () => {
      if (!synth) return;
      const all = synth.getVoices();
      voices = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
      if (!voices.length) voices = all;
      const sel = document.getElementById("ttsVoice");
      if (sel && voices.length) {
        sel.innerHTML = voices.map((v) =>
          `<option value="${esc(v.name)}" ${v.name === S.tts.voice ? "selected" : ""}>${esc(v.name.replace(/\s*\(.+\)$/, ""))}</option>`).join("");
        if (!voices.some((v) => v.name === S.tts.voice)) sel.value = (pickVoice() || {}).name || "";
      }
    };
    if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

    const pickVoice = () =>
      voices.find((v) => v.name === S.tts.voice) ||
      voices.find((v) => /samantha|google us english/i.test(v.name)) ||
      voices.find((v) => v.lang === "en-US") ||
      voices[0] || null;

    const toChunks = (text) =>
      (text.match(/[^.!?…]+[.!?…]+\s*|[^.!?…]+$/g) || [text]).map((s) => s.trim()).filter(Boolean);

    const htmlToText = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.innerText.replace(/\s+/g, " ").trim();
    };

    const paint = () => {
      if (!currentBtn) return;
      currentBtn.classList.toggle("speaking", speaking && !paused);
      currentBtn.innerHTML = paused ? ICONS.paused : speaking ? ICONS.speaking : ICONS.idle;
      currentBtn.title = paused ? "Resume" : speaking ? "Pause" : "Listen";
    };

    const speakNext = () => {
      if (!queue.length) { stop(); return; }
      const u = new SpeechSynthesisUtterance(queue.shift());
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = S.tts.rate || 1;
      u.onend = () => { if (speaking && !paused) speakNext(); };
      u.onerror = () => { if (speaking) speakNext(); };
      synth.speak(u);
    };

    const stop = () => {
      if (!synth) return;
      speaking = false; paused = false; queue = [];
      synth.cancel();
      if (currentBtn) {
        currentBtn.classList.remove("speaking");
        currentBtn.innerHTML = ICONS.idle;
        currentBtn.title = "Listen";
        currentBtn = null;
      }
    };

    const toggle = (btn, html, lead) => {
      if (!synth) return;
      if (currentBtn === btn) {
        if (paused) { synth.resume(); paused = false; }
        else { synth.pause(); paused = true; }
        paint(); return;
      }
      stop();
      currentBtn = btn; speaking = true; paused = false;
      queue = toChunks((lead ? lead + ". " : "") + htmlToText(html));
      speakNext(); paint();
      markActivity();
    };

    return { toggle, stop, loadVoices, available: !!synth, icon: ICONS.idle };
  })();

  /* SVG gradient defs (once) */
  const defs = document.createElement("div");
  defs.innerHTML = '<svg style="position:absolute;width:0;height:0" aria-hidden="true"><defs>' +
    '<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#6E7CFF"/><stop offset="1" stop-color="#38D9F5"/>' +
    "</linearGradient></defs></svg>";
  document.body.appendChild(defs);

  const ring = (pct, size, label) => {
    const st = 8, r = (size - st) / 2, c = 2 * Math.PI * r;
    const off = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${st}"/>
        <circle class="ring-val" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${st}"
          stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
      </svg>
      <div class="ring-label" style="font-size:${size / 4.6}px">${pct}%${label ? `<small>${esc(label)}</small>` : ""}</div>
    </div>`;
  };

  /* ---------------- progress math ---------------- */
  const chapterProgress = (exam, ch) => {
    const st = chState(exam.id, ch.id);
    if (st.done) return 100;
    if (ch.kind === "checkpoint") return st.best != null ? Math.min(st.best, 99) : 0;
    if (!st.total) return 0;
    const done = Object.keys(st.bursts).length;
    return Math.round((done / st.total) * 80);
  };

  const examProgress = (exam) =>
    Math.round(exam.chapters.reduce((s, c) => s + chapterProgress(exam, c), 0) / exam.chapters.length);

  const countdown = (exam) => {
    if (!exam.examDate) return "";
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(exam.examDate + "T00:00:00") - now) / 864e5);
    if (days > 1) return `<b>${days}</b> days to exam`;
    if (days === 1) return "<b>Exam is tomorrow</b>";
    if (days === 0) return "<b>Exam day!</b> 🎯";
    return "Exam date passed — did you crush it?";
  };

  /* ---------------- router ---------------- */
  const setView = (html, accent) => {
    TTS.stop();
    main.innerHTML = html;
    if (accent) main.style.setProperty("--exam-accent", accent);
    else main.style.removeProperty("--exam-accent");
    main.classList.remove("view"); void main.offsetWidth; main.classList.add("view");
    window.scrollTo({ top: 0 });
  };

  const route = () => {
    runnerKeys(null); // detach any exam-runner keyboard handler
    const parts = (location.hash.slice(1) || "/").split("/").filter(Boolean);
    document.querySelectorAll(".topnav a").forEach((a) =>
      a.classList.toggle("active", parts.length === 0));
    if (parts[0] === "exam" && parts[1]) {
      const exam = L.exams.find((e) => e.id === parts[1]);
      if (exam && parts[2] === "ch" && parts[3]) return renderChapter(exam, parts[3]);
      if (exam) return renderExam(exam);
    }
    renderHome();
  };
  window.addEventListener("hashchange", route);

  /* ---------------- home ---------------- */
  const renderHome = () => {
    const chaptersDone = L.exams.reduce((n, ex) =>
      n + ex.chapters.filter((c) => chState(ex.id, c.id).done).length, 0);
    const bests = [];
    L.exams.forEach((ex) => ex.chapters.forEach((c) => {
      const b = chState(ex.id, c.id).best;
      if (b != null) bests.push(b);
    }));
    const avg = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
    const overall = L.exams.length
      ? Math.round(L.exams.reduce((s, e) => s + examProgress(e), 0) / L.exams.length) : 0;

    const cards = L.exams.map((ex) => {
      const p = examProgress(ex);
      const ready = ex.chapters.filter((c) => c.status === "ready").length;
      return `<a class="card hoverable exam-card" href="#/exam/${ex.id}" style="--exam-accent:${ex.accent}">
        <div class="exam-head">
          <div>
            <div class="exam-code">${esc(ex.code)}</div>
            <h3>${esc(ex.title)}</h3>
          </div>
          ${ring(p, 54)}
        </div>
        <div class="exam-blurb">${esc(ex.blurb)}</div>
        <div class="progress-track"><div class="progress-fill" style="width:${p}%"></div></div>
        <div class="exam-meta">
          <span class="chip">${ready}/${ex.chapters.length} chapters live</span>
          <span class="countdown">${countdown(ex)}</span>
        </div>
      </a>`;
    }).join("");

    setView(`
      <section class="hero">
        <div>
          <div class="eyebrow">Everett's Learning Hub</div>
          <h1>Learn it. Quiz it.<br><span class="hero-grad">Own it.</span></h1>
          <p>Every cert lives here — taught in short bursts, locked in with quizzes, proven with chapter exams. Progress saves automatically on this device.</p>
        </div>
        ${ring(overall, 120, "overall")}
      </section>
      <div class="stat-row">
        <div class="stat"><div class="stat-num">🔥 ${streak()}</div><div class="stat-cap">day streak</div></div>
        <div class="stat"><div class="stat-num">${chaptersDone}</div><div class="stat-cap">chapters conquered</div></div>
        <div class="stat"><div class="stat-num">${S.answered}</div><div class="stat-cap">questions answered</div></div>
        <div class="stat"><div class="stat-num">${avg != null ? avg + "%" : "—"}</div><div class="stat-cap">avg exam score</div></div>
      </div>
      <div class="section-title"><h2>Exams</h2><span>each one is a full section of the site</span></div>
      <div class="exam-grid">
        ${cards}
        <div class="card ghost-card"><div><div style="font-size:1.6rem">✨</div><b>Your next cert goes here</b><br><span style="font-size:.85rem">Tell Claude which exam is next and a new section appears.</span></div></div>
      </div>`);
  };

  /* ---------------- exam page ---------------- */
  const renderExam = (exam) => {
    const p = examProgress(exam);

    const domainRows = exam.domains.map((d) => `
      <div class="domain-row">
        <span class="domain-name">${esc(d.name)}</span>
        <div class="domain-bar"><i style="width:${d.pct}%"></i></div>
        <span class="domain-pct">${d.pct}%</span>
      </div>`).join("");

    let week = null, rows = "";
    exam.chapters.forEach((ch) => {
      if (ch.week !== week) { week = ch.week; rows += `<div class="week-label">${esc(week)}</div><div class="chapter-list">`; }
      const st = chState(exam.id, ch.id);
      const prog = chapterProgress(exam, ch);
      const cls = st.done ? "done" : ch.status === "ready" ? "ready" : "soon";
      const num = ch.kind === "checkpoint" ? (ch.icon || "🏁") : (st.done ? "✓" : ch.num);
      const side = st.done
        ? `<span class="ch-score">${st.best}%</span><span class="chip ok">Done</span>`
        : ch.status === "ready"
          ? `<span class="btn sm primary">${prog > 0 ? "Continue" : "Start"}</span>`
          : `<span class="chip">Coming up</span>`;
      rows += `<a class="card hoverable chapter-row ${cls} ${ch.kind === "checkpoint" ? "exam-row" : ""}" href="#/exam/${exam.id}/ch/${ch.id}">
        <span class="ch-num">${num}</span>
        <span><h4>${esc(ch.title)}</h4><div class="ch-sub">${esc(ch.day)} — ${esc(ch.blurb)}</div></span>
        <span class="ch-side">${side}</span>
      </a>`;
      const next = exam.chapters[exam.chapters.indexOf(ch) + 1];
      if (!next || next.week !== week) rows += "</div>";
    });

    setView(`
      <nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span>${esc(exam.short)}</span></nav>
      <section class="exam-hero">
        <div>
          <h1>${esc(exam.title)}</h1>
          <div class="facts">
            <span class="chip accent" style="color:${exam.accent};background:color-mix(in srgb, ${exam.accent} 14%, transparent)">${esc(exam.code)}</span>
            ${exam.facts.map((f) => `<span class="chip">${esc(f)}</span>`).join("")}
            <span class="chip">${countdown(exam)}</span>
          </div>
        </div>
        ${ring(p, 110, "of the journey")}
      </section>
      <div class="card domain-panel">
        <h3>What the exam weighs — and where we hit it hardest</h3>
        ${domainRows}
      </div>
      ${rows}`, exam.accent);
  };

  /* ---------------- chapter: coming soon ---------------- */
  const renderSoon = (exam, ch) => {
    setView(`
      <nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><a href="#/exam/${exam.id}">${esc(exam.short)}</a><span class="sep">/</span><span>${esc(ch.title)}</span></nav>
      <div class="soon-wrap">
        <div class="soon-emoji">🌱</div>
        <h2>${esc(ch.title)}</h2>
        <p><b>${esc(ch.day)}</b> — ${esc(ch.blurb)}</p>
        <p>This one gets built during your study session. Open Claude and say <b>“build ${esc(ch.title)}”</b> and it'll appear here, bursts, quizzes and all.</p>
        <a class="btn" href="#/exam/${exam.id}">← Back to ${esc(exam.short)}</a>
      </div>`, exam.accent);
  };

  /* ---------------- chapter content loader ---------------- */
  const loadContent = (exam, ch) => new Promise((res) => {
    const got = () => L.content[exam.id] && L.content[exam.id][ch.id];
    if (got()) return res(got());
    if (!ch.src) return res(null);
    const s = document.createElement("script");
    s.src = ch.src;
    s.onload = () => res(got() || null);
    s.onerror = () => res(null);
    document.head.appendChild(s);
  });

  /* ---------------- chapter page ---------------- */
  const renderChapter = (exam, chId) => {
    const ch = exam.chapters.find((c) => c.id === chId);
    if (!ch) return renderExam(exam);
    if (ch.status !== "ready") return renderSoon(exam, ch);

    setView(`<div class="soon-wrap"><div class="soon-emoji">⏳</div><h2>Loading chapter…</h2></div>`, exam.accent);

    loadContent(exam, ch).then((content) => {
      if (!content) {
        setView(`<div class="soon-wrap"><div class="soon-emoji">😵</div><h2>Couldn't load this chapter</h2>
          <p>The content file seems to be missing (<code>${esc(ch.src || "?")}</code>).</p>
          <a class="btn" href="#/exam/${exam.id}">← Back</a></div>`, exam.accent);
        return;
      }
      const st = chState(exam.id, ch.id);
      if (st.total !== content.bursts.length) { st.total = content.bursts.length; save(); }
      paintChapter(exam, ch, content);
    });
  };

  const paintChapter = (exam, ch, content) => {
    const st = chState(exam.id, ch.id);
    const isCheck = ch.kind === "checkpoint";
    const totalMin = content.bursts.reduce((s, b) => s + (b.minutes || 5), 0);

    setView(`
      <nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><a href="#/exam/${exam.id}">${esc(exam.short)}</a><span class="sep">/</span><span>${isCheck ? esc(ch.title) : `Chapter ${ch.num}`}</span></nav>
      <header class="chapter-head">
        <h1>${isCheck ? `${ch.icon || "🏁"} ${esc(content.title)}` : `Chapter ${ch.num} — ${esc(content.title)}`}</h1>
        <div class="ch-meta">
          <span class="chip accent">${esc(ch.day)}</span>
          ${isCheck
            ? `<span class="chip">${content.exam.questions.length} questions</span><span class="chip">pass ≥ ${content.exam.passPct}%</span>`
            : `<span class="chip">${content.bursts.length} bursts</span><span class="chip">~${totalMin} min</span>`}
          ${st.best != null ? `<span class="chip ok">Best exam score: ${st.best}%</span>` : ""}
        </div>
        <div class="chapter-progressbar">
          <div class="progress-track"><div class="progress-fill" id="chProg"></div></div>
          <span id="chProgLabel"></span>
        </div>
        ${TTS.available ? `
        <div class="tts-bar">
          <span class="tts-label">🎧 Read aloud</span>
          <select id="ttsVoice" class="tts-select" title="Voice"></select>
          <button class="btn sm ghost" id="ttsRate" title="Reading speed"></button>
        </div>` : ""}
      </header>
      <div id="bursts"></div>
      <div id="afterBursts"></div>`, exam.accent);

    /* tts controls */
    if (TTS.available) {
      TTS.loadVoices();
      const rateBtn = document.getElementById("ttsRate");
      const RATES = [0.9, 1, 1.25, 1.5];
      const paintRate = () => { rateBtn.textContent = (S.tts.rate || 1) + "×"; };
      paintRate();
      rateBtn.addEventListener("click", () => {
        const i = RATES.indexOf(S.tts.rate || 1);
        S.tts.rate = RATES[(i + 1) % RATES.length];
        save(); paintRate();
      });
      document.getElementById("ttsVoice").addEventListener("change", (e) => {
        S.tts.voice = e.target.value; save();
      });
    }

    paintBursts(exam, ch, content);
  };

  const burstsDoneCount = (st, content) =>
    content.bursts.filter((b) => st.bursts[b.id]).length;

  const paintBursts = (exam, ch, content, openId) => {
    TTS.stop();
    const st = chState(exam.id, ch.id);
    const wrap = document.getElementById("bursts");
    if (!wrap) return;
    const doneN = burstsDoneCount(st, content);
    const allDone = doneN === content.bursts.length;
    const activeIdx = content.bursts.findIndex((b) => !st.bursts[b.id]);

    /* progress bar */
    const isCheck = ch.kind === "checkpoint";
    const prog = document.getElementById("chProg");
    const shownPct = st.done ? 100
      : content.bursts.length ? Math.round((doneN / content.bursts.length) * 80)
      : st.best != null ? Math.min(st.best, 99) : 0;
    if (prog) prog.style.width = shownPct + "%";
    const lbl = document.getElementById("chProgLabel");
    if (lbl) lbl.textContent = st.done
      ? (isCheck ? "Passed 🎉" : "Chapter complete 🎉")
      : isCheck
        ? (st.best != null ? `best ${st.best}% — pass at ${content.exam.passPct}%` : "no bursts here — straight to the questions")
        : `${doneN}/${content.bursts.length} bursts · exam ${st.best != null ? "best " + st.best + "%" : "locked"}`;

    wrap.innerHTML = content.bursts.map((b, i) => {
      const done = !!st.bursts[b.id];
      const active = i === activeIdx;
      const open = openId ? b.id === openId : active;
      const locked = !done && !active;
      return `<section class="card burst ${done ? "done" : ""} ${active ? "active" : ""} ${locked ? "locked" : ""} ${open && !active ? "open" : ""}" data-burst="${b.id}">
        <div class="burst-head" data-toggle="${b.id}">
          <span class="b-idx">${done ? "✓" : i + 1}</span>
          <h3>${esc(b.title)}</h3>
          ${TTS.available && !locked ? `<button class="listen-btn" data-listen="${b.id}" title="Listen">${TTS.icon}</button>` : ""}
          <span class="b-min">${b.minutes || 5} min read</span>
        </div>
        <div class="burst-body">
          <div class="lesson">${b.html}</div>
          ${b.quiz && b.quiz.length ? `
            <div class="quiz">
              <div class="quiz-title">⚡ Quick quiz — lock it in</div>
              ${b.quiz.map((q, qi) => qBlock(q, `${b.id}-${qi}`)).join("")}
              <div class="burst-done-bar">
                <span class="locked-note" id="note-${b.id}">${done ? "Completed ✓ — review any time." : "Answer every question correctly to finish this burst."}</span>
              </div>
            </div>` : `
            <div class="burst-done-bar">
              <span></span>
              <button class="btn primary" data-finish="${b.id}">Got it — continue →</button>
            </div>`}
        </div>
      </section>`;
    }).join("");

    /* after bursts: overview + chapter exam CTA */
    const after = document.getElementById("afterBursts");
    after.innerHTML = `
      <div class="card overview-card">
        <h3>📌 ${isCheck ? "What this exam covers" : "Chapter overview — the points that matter"}
          ${TTS.available ? `<button class="listen-btn" data-listen-overview title="Listen">${TTS.icon}</button>` : ""}
        </h3>
        <ul>${content.overview.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
      <div class="card exam-cta">
        <div>
          <h3>${isCheck ? esc(content.title) : `Chapter ${ch.num} Exam`}</h3>
          <p>${content.exam.questions.length} exam-style questions · pass at ${content.exam.passPct}% · no peeking back at the lessons</p>
        </div>
        ${allDone
          ? `<button class="btn primary" id="startExam">${st.best != null ? "Retake exam" : isCheck ? "Start exam" : "Start chapter exam"} →</button>`
          : `<span class="locked-note">🔒 Finish all ${content.bursts.length} bursts to unlock</span>`}
      </div>`;

    /* wire bursts */
    wrap.querySelectorAll("[data-toggle]").forEach((h) => {
      h.addEventListener("click", () => {
        const id = h.dataset.toggle;
        const b = content.bursts.find((x) => x.id === id);
        const i = content.bursts.indexOf(b);
        const done = !!st.bursts[id];
        const active = i === content.bursts.findIndex((x) => !st.bursts[x.id]);
        if (!done && !active) return; // locked
        const sec = h.closest(".burst");
        if (sec.classList.contains("open") || sec.classList.contains("active")) {
          if (done) sec.classList.toggle("open");
        } else paintBursts(exam, ch, content, id);
      });
    });

    wrap.querySelectorAll("[data-finish]").forEach((btn) =>
      btn.addEventListener("click", () => completeBurst(exam, ch, content, btn.dataset.finish)));

    /* listen buttons */
    wrap.querySelectorAll("[data-listen]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const b = content.bursts.find((x) => x.id === btn.dataset.listen);
        if (b) TTS.toggle(btn, b.html, b.title);
      }));
    const ovBtn = after.querySelector("[data-listen-overview]");
    if (ovBtn) ovBtn.addEventListener("click", () =>
      TTS.toggle(ovBtn, content.overview.join(". "), isCheck ? `${content.title}. What it covers` : `Chapter ${ch.num} overview. The points that matter`));

    wireQuizzes(wrap, content, (burstId) => {
      /* called when a whole burst quiz is fully correct */
      completeBurst(exam, ch, content, burstId);
    });

    const startBtn = document.getElementById("startExam");
    if (startBtn) startBtn.addEventListener("click", () => runExam(exam, ch, content));
  };

  const completeBurst = (exam, ch, content, burstId) => {
    const st = chState(exam.id, ch.id);
    if (!st.bursts[burstId]) {
      st.bursts[burstId] = true; save(); markActivity();
    }
    paintBursts(exam, ch, content);
    const next = content.bursts.find((b) => !st.bursts[b.id]);
    const target = next
      ? document.querySelector(`[data-burst="${next.id}"]`)
      : document.getElementById("afterBursts");
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  /* ---------------- quiz blocks (inside bursts) ---------------- */
  const qBlock = (q, uid) => {
    const multi = q.answer.length > 1;
    return `<div class="q-block" data-q="${uid}" data-multi="${multi ? 1 : 0}">
      <div class="q-text">${esc(q.q)}${multi ? `<span class="q-multi">SELECT ${q.answer.length === 2 ? "TWO" : q.answer.length}</span>` : ""}</div>
      <div class="opts">
        ${shuffled(q.options.map((_, i) => i)).map((oi, pos) => `<button class="opt" data-i="${oi}"><span class="key">${KEYS[pos]}</span><span>${esc(q.options[oi])}</span></button>`).join("")}
      </div>
      <div class="q-actions">
        ${multi ? `<button class="btn sm" data-check>Check answer</button>` : ""}
        <button class="btn sm ghost" data-retry hidden>Try again ↺</button>
      </div>
      <div class="explain" hidden></div>
    </div>`;
  };

  const wireQuizzes = (root, content, onBurstComplete) => {
    root.querySelectorAll(".burst").forEach((sec) => {
      const burstId = sec.dataset.burst;
      const burst = content.bursts.find((b) => b.id === burstId);
      if (!burst || !burst.quiz || !burst.quiz.length) return;

      const blocks = [...sec.querySelectorAll(".q-block")];

      const checkAllCorrect = () => {
        if (blocks.every((b) => b.dataset.ok === "1")) {
          const note = sec.querySelector(`#note-${burstId}`);
          if (note) note.innerHTML = "<b style='color:var(--ok)'>Nailed it ✓</b> moving on…";
          setTimeout(() => onBurstComplete(burstId), 650);
        }
      };

      blocks.forEach((block, qi) => {
        const q = burst.quiz[qi];
        const multi = q.answer.length > 1;
        const opts = [...block.querySelectorAll(".opt")];
        const explain = block.querySelector(".explain");
        const retry = block.querySelector("[data-retry]");
        const checkBtn = block.querySelector("[data-check]");
        const answer = new Set(q.answer);

        const grade = () => {
          const sel = new Set(opts.filter((o) => o.classList.contains("selected")).map((o) => +o.dataset.i));
          if (!sel.size) return;
          const right = setsEqual(sel, answer);
          opts.forEach((o) => {
            const i = +o.dataset.i;
            o.disabled = true;
            if (answer.has(i)) o.classList.add("correct");
            else if (sel.has(i)) o.classList.add("wrong");
          });
          explain.hidden = false;
          explain.className = "explain " + (right ? "good" : "bad");
          explain.innerHTML = `<b>${right ? "Correct ✓" : "Not quite."}</b> ${esc(q.explain)}`;
          if (checkBtn) checkBtn.hidden = true;
          S.answered++; save(); markActivity();
          if (right) { block.dataset.ok = "1"; checkAllCorrect(); }
          else retry.hidden = false;
        };

        opts.forEach((o) => o.addEventListener("click", () => {
          if (o.disabled) return;
          if (multi) o.classList.toggle("selected");
          else { opts.forEach((x) => x.classList.remove("selected")); o.classList.add("selected"); grade(); }
        }));

        if (checkBtn) checkBtn.addEventListener("click", grade);

        retry.addEventListener("click", () => {
          opts.forEach((o) => { o.disabled = false; o.classList.remove("selected", "correct", "wrong"); });
          explain.hidden = true; retry.hidden = true;
          if (checkBtn) checkBtn.hidden = false;
        });
      });
    });
  };

  /* ---------------- chapter exam runner ---------------- */
  let keyHandler = null;
  const runnerKeys = (fn) => {
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener("keydown", fn);
  };

  const runExam = (exam, ch, content) => {
    const qs = shuffled(content.exam.questions);
    const answers = qs.map(() => new Set());
    const orders = qs.map((q) => shuffled(q.options.map((_, i) => i))); // stable option shuffle per question
    let idx = 0;

    const paint = () => {
      const q = qs[idx];
      const multi = q.answer.length > 1;
      const sel = answers[idx];
      setView(`
        <div class="runner">
          <div class="runner-top">
            <a class="btn sm ghost" href="#/exam/${exam.id}/ch/${ch.id}" data-quit>✕ Quit</a>
            <div class="progress-track"><div class="progress-fill" style="width:${((idx) / qs.length) * 100}%"></div></div>
            <span>${idx + 1} / ${qs.length}</span>
          </div>
          <div class="card" style="padding:28px">
            <div class="runner-q">${esc(q.q)}${multi ? `<span class="q-multi" style="display:block;margin-top:6px;font-size:.78rem;color:var(--warn)">SELECT ${q.answer.length === 2 ? "TWO" : q.answer.length}</span>` : ""}</div>
            <div class="opts">
              ${orders[idx].map((oi, pos) => `<button class="opt ${sel.has(oi) ? "selected" : ""}" data-i="${oi}"><span class="key">${KEYS[pos]}</span><span>${esc(q.options[oi])}</span></button>`).join("")}
            </div>
            <div class="runner-nav">
              <button class="btn" id="prevQ" ${idx === 0 ? "disabled" : ""}>← Previous</button>
              <button class="btn primary" id="nextQ" ${sel.size ? "" : "disabled"}>${idx === qs.length - 1 ? "Submit exam" : "Next →"}</button>
            </div>
          </div>
          <p style="text-align:center;color:var(--text-faint);font-size:.8rem;margin-top:14px">tip: press A–${KEYS[q.options.length - 1]} to answer · Enter to continue</p>
        </div>`, exam.accent);

      const opts = [...main.querySelectorAll(".opt")];
      const nextBtn = document.getElementById("nextQ");
      const refresh = () => { nextBtn.disabled = !answers[idx].size; opts.forEach((o) => o.classList.toggle("selected", answers[idx].has(+o.dataset.i))); };

      opts.forEach((o) => o.addEventListener("click", () => {
        const i = +o.dataset.i;
        if (multi) { answers[idx].has(i) ? answers[idx].delete(i) : answers[idx].add(i); }
        else { answers[idx] = new Set([i]); }
        refresh();
      }));

      document.getElementById("prevQ").addEventListener("click", () => { if (idx > 0) { idx--; paint(); } });
      nextBtn.addEventListener("click", () => {
        if (!answers[idx].size) return;
        if (idx < qs.length - 1) { idx++; paint(); } else finish();
      });
      main.querySelector("[data-quit]").addEventListener("click", () => runnerKeys(null));

      runnerKeys((e) => {
        const k = e.key.toUpperCase();
        const ki = KEYS.indexOf(k);
        if (ki > -1 && ki < q.options.length) { opts[ki].click(); }
        else if (e.key === "Enter") { e.preventDefault(); nextBtn.click(); }
        else if (e.key === "ArrowLeft" && idx > 0) { idx--; paint(); }
      });
    };

    const finish = () => {
      runnerKeys(null);
      let correct = 0;
      const review = qs.map((q, i) => {
        const ok = setsEqual(answers[i], new Set(q.answer));
        if (ok) correct++;
        return { q, ok, picked: [...answers[i]].sort() };
      });
      const score = Math.round((correct / qs.length) * 100);
      const pass = score >= content.exam.passPct;

      const st = chState(exam.id, ch.id);
      if (st.best == null || score > st.best) st.best = score;
      if (pass) st.done = true;
      S.answered += qs.length;
      save(); markActivity();
      if (pass) confetti();

      setView(`
        <div class="runner">
          <div class="card results">
            <div class="big-score">${score}%</div>
            <div class="verdict ${pass ? "pass" : "fail"}">${pass
              ? (score === 100 ? "Perfect score. Absolutely flawless. 🏆" : "Passed — chapter conquered! 🎉")
              : "Not yet — review below, then run it back. 💪"}</div>
            <div class="res-sub">${correct} of ${qs.length} correct · pass mark ${content.exam.passPct}% · best ${st.best}%</div>
            <div class="res-actions">
              <button class="btn" id="retake">Retake ↺</button>
              <a class="btn" href="#/exam/${exam.id}/ch/${ch.id}">Back to chapter</a>
              <a class="btn primary" href="#/exam/${exam.id}">All chapters →</a>
            </div>
            <div class="review-list">
              ${review.map((r, i) => `
                <div class="review-item">
                  <div class="rev-q">${i + 1}. ${esc(r.q.q)}</div>
                  <div class="rev-a ${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} You: ${r.picked.map((p) => esc(r.q.options[p])).join(" · ") || "—"}</div>
                  ${r.ok ? "" : `<div class="rev-a ok">✓ Answer: ${r.q.answer.map((a) => esc(r.q.options[a])).join(" · ")}</div>`}
                  <div class="rev-x">${esc(r.q.explain)}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>`, exam.accent);

      document.getElementById("retake").addEventListener("click", () => runExam(exam, ch, content));
    };

    paint();
  };

  /* ---------------- confetti ---------------- */
  const confetti = () => {
    const cv = document.getElementById("confetti");
    const ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ["#6E7CFF", "#38D9F5", "#34D399", "#FBBF24", "#F87171", "#FF9900"];
    const parts = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width,
      y: -20 - Math.random() * cv.height * 0.3,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 2.2 + Math.random() * 3.4,
      vx: -1.6 + Math.random() * 3.2,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
    const t0 = performance.now();
    const tick = (t) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t - t0 < 2800) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, cv.width, cv.height);
    };
    requestAnimationFrame(tick);
  };

  /* ---------------- boot ---------------- */
  paintStreak();
  route();
})();
