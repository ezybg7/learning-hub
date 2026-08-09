/* ============================================================
   Learning Hub — exam registry
   Every exam is a section of the site; every chapter registers
   its metadata here. Chapter CONTENT lives in data/<exam>/*.js
   and is lazy-loaded via the `src` path when status is "ready".

   To publish a new chapter:
     1. Add data/<exam>/chapter-NN.js (LEARN.registerChapter)
     2. Flip that chapter's status below to "ready" + set src
   ============================================================ */

window.LEARN = (() => {
  const exams = [];
  const content = {};
  return {
    exams,
    content,
    registerExam(def) { exams.push(def); },
    registerChapter(def) {
      (content[def.examId] = content[def.examId] || {})[def.id] = def;
    },
  };
})();

/* ---------------- AWS Certified Cloud Practitioner ---------------- */
window.LEARN.registerExam({
  id: "aws-ccp",
  title: "AWS Certified Cloud Practitioner",
  short: "AWS Cloud Practitioner",
  code: "CLF-C02",
  accent: "#ff9900",
  blurb: "Foundational AWS cert — cloud concepts, security, core services, and pricing, taught in plain English with a quiz after every burst.",
  examDate: "2026-08-31",
  facts: ["65 questions", "90 minutes", "Pass: 700/1000", "$100 USD", "Online or test center"],
  domains: [
    { name: "Cloud Technology & Services", pct: 34 },
    { name: "Security & Compliance", pct: 30 },
    { name: "Cloud Concepts", pct: 24 },
    { name: "Billing, Pricing & Support", pct: 12 },
  ],
  chapters: [
    /* ---- Week 1 — Foundations ---- */
    { id: "ch01", kind: "chapter", num: 1, title: "Cloud Concepts",
      blurb: "What the cloud is, why it wins, and the vocabulary AWS loves.",
      day: "Day 1 · Sun Aug 9", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/chapter-01.js" },
    { id: "ch02", kind: "chapter", num: 2, title: "AWS Global Infrastructure",
      blurb: "Regions, Availability Zones, edge locations — and HA vs fault tolerance.",
      day: "Day 2 · Mon Aug 10", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/chapter-02.js" },
    { id: "ch03", kind: "chapter", num: 3, title: "Compute",
      blurb: "EC2 and its pricing models, Lambda, containers, Beanstalk, Auto Scaling.",
      day: "Days 3–4 · Aug 11–12", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/chapter-03.js" },
    { id: "ch04", kind: "chapter", num: 4, title: "Storage",
      blurb: "S3 storage classes, EBS vs EFS, Glacier, Snow family, Storage Gateway.",
      day: "Day 5 · Thu Aug 13", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/chapter-04.js" },
    { id: "ch05", kind: "chapter", num: 5, title: "Networking & Content Delivery",
      blurb: "VPC, security groups vs NACLs, Route 53, CloudFront, load balancers.",
      day: "Days 6–7 · Aug 14–15", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/chapter-05.js" },
    { id: "mini1", kind: "checkpoint", icon: "🏁", title: "Week 1 Mini-Exam",
      blurb: "20 fresh questions across Chapters 1–5.",
      day: "Day 7 · Sat Aug 15", week: "Week 1 — Foundations",
      status: "ready", src: "data/aws-ccp/mini-exam-1.js" },

    /* ---- Week 2 — Databases, security & money ---- */
    { id: "ch06", kind: "chapter", num: 6, title: "Databases",
      blurb: "RDS vs Aurora vs DynamoDB, Redshift, ElastiCache — when to use which.",
      day: "Day 8 · Sun Aug 16", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/chapter-06.js" },
    { id: "ch07", kind: "chapter", num: 7, title: "Security & Identity",
      blurb: "Shared Responsibility Model, IAM, and the security service zoo. Biggest domain: 30%.",
      day: "Days 9–10 · Aug 17–18", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/chapter-07.js" },
    { id: "ch08", kind: "chapter", num: 8, title: "Monitoring & Management",
      blurb: "CloudWatch vs CloudTrail vs Config, Trusted Advisor, Systems Manager.",
      day: "Day 11 · Wed Aug 19", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/chapter-08.js" },
    { id: "ch09", kind: "chapter", num: 9, title: "Accounts & Governance",
      blurb: "Organizations, SCPs, consolidated billing, Control Tower.",
      day: "Day 12 · Thu Aug 20", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/chapter-09.js" },
    { id: "ch10", kind: "chapter", num: 10, title: "Billing, Pricing & Support",
      blurb: "Free Tier, Cost Explorer vs Budgets, and the five support plans.",
      day: "Day 13 · Fri Aug 21", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/chapter-10.js" },
    { id: "mini2", kind: "checkpoint", icon: "🏁", title: "Week 2 Mini-Exam",
      blurb: "25 fresh questions across Chapters 6–10, security-heavy.",
      day: "Day 14 · Sat Aug 22", week: "Week 2 — Databases, Security & Money",
      status: "ready", src: "data/aws-ccp/mini-exam-2.js" },

    /* ---- Week 3 — Frameworks & rehearsal ---- */
    { id: "ch11", kind: "chapter", num: 11, title: "Frameworks, Migration & the Service Zoo",
      blurb: "Well-Architected pillars, CAF, migration tools, and name-recognition for analytics, AI/ML, and dev tools.",
      day: "Days 15–16 · Aug 23–24", week: "Week 3 — Frameworks & Rehearsal",
      status: "soon" },
    { id: "mock1", kind: "checkpoint", icon: "🎯", title: "Mock Exam #1",
      blurb: "Full 65 questions, timed 90 minutes. Target 65%+.",
      day: "Day 17 · Tue Aug 25", week: "Week 3 — Frameworks & Rehearsal",
      status: "soon" },
    { id: "mock2", kind: "checkpoint", icon: "🎯", title: "Mock Exam #2",
      blurb: "Full dress rehearsal. 75%+ means you're ready for the real thing.",
      day: "Day 20 · Fri Aug 28", week: "Week 3 — Frameworks & Rehearsal",
      status: "soon" },
  ],
});
