/* ============================================================
   AWS CCP — Chapter 10: Billing, Pricing & Support
   Day 13 · Free Tier, the cost toolbox, tags, the five
   support plans, Marketplace & partners. 12% of the exam,
   and some of its easiest points.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch10",
  num: 10,
  title: "Billing, Pricing & Support",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "How AWS pricing thinks — and the Free Tier",
      minutes: 5,
      html: `
        <p>AWS pricing rests on three philosophies (they echo Chapter 1 on purpose):</p>
        <ul>
          <li><strong>Pay as you go</strong> — no upfront costs, pay for what you use, stop paying when you stop.</li>
          <li><strong>Save when you commit</strong> — Reserved Instances and Savings Plans (Chapter 3) trade commitment for up to ~72% off.</li>
          <li><strong>Pay less by using more</strong> — volume tiers: the more S3 you store or data you transfer, the cheaper each additional unit gets.</li>
        </ul>
        <p>One more cost fact worth knowing: <strong>data transfer IN to AWS is free; data transfer OUT to the internet costs money</strong> — a recurring surprise on bills and a recurring question on exams.</p>
        <div class="callout"><b>The Free Tier — three different flavors</b>
        <ul>
          <li><strong>Always free</strong> — never expires: e.g., 1M Lambda requests/month, 25 GB of DynamoDB.</li>
          <li><strong>12 months free</strong> — from account creation: e.g., 750 hrs/month of a micro EC2 instance, 5 GB of S3.</li>
          <li><strong>Trials</strong> — short-term tastes of specific services (e.g., some offer 30–90 days).</li>
        </ul></div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Know the three Free Tier types by name — "which type of free tier is X?" appears verbatim. And remember: <strong>inbound transfer free, outbound paid</strong>.</div>
      `,
      quiz: [
        {
          q: "Which THREE-part philosophy describes AWS pricing? (best answer)",
          options: [
            "Pay as you go · save when you commit · pay less by using more",
            "Fixed annual contracts only",
            "One price for every service",
            "Free forever for startups",
          ],
          answer: [0],
          explain: "Those three pillars underlie every AWS pricing question — usage-based, commitment discounts, and volume tiers.",
        },
        {
          q: "AWS Lambda's 1 million free requests per month is an example of which Free Tier type?",
          options: ["12 months free", "Always free", "A trial", "Spot pricing"],
          answer: [1],
          explain: "Lambda's monthly allowance never expires — 'always free.' The 12-month offers (like EC2 micro hours) end after the first year.",
        },
        {
          q: "Which data transfer typically costs money on AWS?",
          options: [
            "Data transferred INTO AWS from the internet",
            "Data transferred OUT of AWS to the internet",
            "Both are always free",
            "Neither is ever free",
          ],
          answer: [1],
          explain: "In: free. Out to the internet: billed per GB. It's why data-heavy egress architectures get expensive — and why the exam checks this.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "Estimating BEFORE you build — AWS Pricing Calculator",
      minutes: 3,
      html: `
        <p>Before a company migrates or launches anything, someone asks: <strong>"What will this cost us on AWS?"</strong></p>
        <p>The <strong>AWS Pricing Calculator</strong> answers it: a free web tool where you model your planned architecture — "20 EC2 instances of this size, 10 TB of S3, an RDS database in this Region" — and get a monthly <strong>estimate</strong> you can share as a link or export.</p>
        <ul>
          <li>It's for the <strong>FUTURE</strong>: planning, budgeting proposals, comparing configurations and Regions before committing.</li>
          <li>It doesn't touch your account — no deployment, no charge, no login required.</li>
        </ul>
        <div class="callout"><b>The timeline trick for cost tools</b>
        This chapter has three lookalike tools. Sort them by TIME: <strong>Pricing Calculator = before</strong> (estimate plans) · <strong>Budgets = present</strong> (alert as spend happens) · <strong>Cost Explorer = past→forecast</strong> (analyze history, project forward). Anchor this now; the next burst fills in the other two.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Estimate the monthly cost BEFORE migrating/deploying" → <strong>Pricing Calculator</strong>. If resources are already running and you're analyzing actual spend, it's never the Calculator.</div>
      `,
      quiz: [
        {
          q: "A company planning its migration wants a monthly cost estimate for the architecture it intends to build. Which tool?",
          options: ["AWS Pricing Calculator", "Cost Explorer", "AWS Budgets", "CloudTrail"],
          answer: [0],
          explain: "Future/planned costs = Pricing Calculator. The other tools work on real spend in a real account.",
        },
        {
          q: "The AWS Pricing Calculator…",
          options: [
            "Analyzes last month's actual bill",
            "Models planned workloads to produce shareable cost estimates",
            "Automatically buys Reserved Instances",
            "Requires a Business support plan",
          ],
          answer: [1],
          explain: "It's a free modeling tool for what-if pricing — no account changes, just estimates you can export and share.",
        },
        {
          q: "Which question is the Pricing Calculator the WRONG tool for?",
          options: [
            "What would 50 TB of S3 cost per month?",
            "Which service drove last month's bill increase?",
            "What's the cost difference between two Regions for our planned stack?",
            "What would our database tier cost on Aurora?",
          ],
          answer: [1],
          explain: "Analyzing what already happened is Cost Explorer's job. The Calculator only models hypotheticals.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "Watching real spend — Cost Explorer, Budgets, CUR",
      minutes: 5,
      html: `
        <p>Once workloads are running, three tools track the real money:</p>
        <ul>
          <li><strong>AWS Cost Explorer</strong> — <strong>visualize and analyze</strong> your actual spend: charts by service, account, Region, or tag; spot trends ("EC2 spend up 40% since March"); and get <strong>forecasts</strong> projecting the months ahead. Your interactive bill detective.</li>
          <li><strong>AWS Budgets</strong> — set limits and <strong>get alerted</strong>: "email me at 80% of $1,000/month," "alert if forecasted spend will exceed budget." Tracks cost, usage, and even RI/Savings-Plan utilization. Alerts — it warns; it doesn't shut things off by itself.</li>
          <li><strong>Cost & Usage Report (CUR)</strong> — the <strong>most detailed</strong> option: every line item, hourly granularity, delivered to S3 for finance teams and analysis tools to crunch.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Keyword mapping: "visualize/analyze past spend, forecast" → <strong>Cost Explorer</strong> · "alert me when spending approaches a threshold" → <strong>Budgets</strong> · "most granular, line-item data to S3" → <strong>CUR</strong> · "estimate before building" → <strong>Pricing Calculator</strong>. Four tools, four verbs: estimate, analyze, alert, itemize.</div>
      `,
      quiz: [
        {
          q: "A manager wants an email when monthly AWS spend hits 80% of the $5,000 limit. Which tool?",
          options: ["AWS Budgets", "Pricing Calculator", "Cost & Usage Report", "AWS Config"],
          answer: [0],
          explain: "Threshold alerts on actual or forecasted spend = Budgets. It's the alarm system of the cost toolbox.",
        },
        {
          q: "Which tool provides interactive charts of historical spend by service and forecasts future costs?",
          options: ["AWS Cost Explorer", "AWS Artifact", "Amazon Inspector", "AWS Budgets"],
          answer: [0],
          explain: "Analyze + visualize + forecast = Cost Explorer, the bill's analytics dashboard.",
        },
        {
          q: "A finance team needs the most granular billing data possible — hourly line items — delivered for their own analysis tools. Which option?",
          options: ["The Cost and Usage Report (CUR)", "The monthly PDF invoice", "Trusted Advisor", "CloudWatch metrics"],
          answer: [0],
          explain: "CUR is the firehose: maximum-detail billing data written to S3 for heavy-duty analysis.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Tags — who spent that?",
      minutes: 3,
      html: `
        <p>One bill, forty projects — how do you know which project spent what? <strong>Tags</strong>: key-value labels you attach to resources (<code>project = phoenix</code>, <code>team = data</code>, <code>env = prod</code>).</p>
        <ul>
          <li>Activate them as <strong>cost allocation tags</strong> and the billing tools can <strong>slice spend by tag</strong> — Cost Explorer filtered to <code>project = phoenix</code> shows exactly what Phoenix costs.</li>
          <li>Tags also power organization (find everything belonging to a team) and even permissions — but for THIS chapter, think cost attribution and chargeback.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Attribute/track costs by project, department, or environment" → <strong>cost allocation tags</strong>. Simple, and it shows up more than you'd expect.</div>
      `,
      quiz: [
        {
          q: "A company wants its single AWS bill broken down by department. The mechanism is…",
          options: [
            "Cost allocation tags on resources",
            "Separate credit cards per department",
            "Renaming EC2 instances",
            "Asking AWS Support monthly",
          ],
          answer: [0],
          explain: "Tag resources by department, activate cost allocation tags, and every cost tool can group and filter by them.",
        },
        {
          q: "A tag is…",
          options: [
            "A key-value label attached to a resource",
            "A type of subnet",
            "A support ticket",
            "An encryption key",
          ],
          answer: [0],
          explain: "Just metadata: key + value, attached to almost any resource — the foundation of cost attribution and resource organization.",
        },
        {
          q: "Which tool combination answers 'What did project X cost last quarter?'",
          options: [
            "Cost allocation tags + Cost Explorer",
            "Pricing Calculator + CloudFront",
            "IAM + KMS",
            "Route 53 + Budgets",
          ],
          answer: [0],
          explain: "Tags label the spend; Cost Explorer slices by the label. Together they answer per-project cost questions in two clicks.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "The five support plans — memorize this table",
      minutes: 6,
      html: `
        <p>AWS Support comes in five plans, and the exam ALWAYS asks about them. The table to burn in:</p>
        <table>
          <tr><th>Plan</th><th>Signature features</th><th>Fastest response</th></tr>
          <tr><td><strong>Basic</strong> (free)</td><td>Docs, forums, service health, core Trusted Advisor checks. <strong>No technical support cases.</strong></td><td>—</td></tr>
          <tr><td><strong>Developer</strong></td><td>Business-hours <strong>email</strong> access to support; general guidance. For testing/dev.</td><td>12 hr (impaired system)</td></tr>
          <tr><td><strong>Business</strong></td><td><strong>24/7 phone, chat, email</strong> · <strong>FULL Trusted Advisor</strong> · production workloads</td><td><strong>&lt; 1 hr</strong> (production down)</td></tr>
          <tr><td><strong>Enterprise On-Ramp</strong></td><td>Business features + annual reviews + a pool of technical account managers</td><td><strong>&lt; 30 min</strong> (business-critical down)</td></tr>
          <tr><td><strong>Enterprise</strong></td><td>Everything + a designated <strong>TAM (Technical Account Manager)</strong> + Concierge billing team</td><td><strong>&lt; 15 min</strong> (business-critical down)</td></tr>
        </table>
        <p>The differentiators the exam probes: <strong>Basic gets NO support cases</strong> · <strong>Business unlocks 24/7 phone/chat + full Trusted Advisor</strong> · <strong>only Enterprise gets a designated TAM</strong> · response times 1 hr / 30 min / 15 min for the top three.</p>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Scenario phrasing: "production workload, 24/7 phone support, under-1-hour response" → <strong>Business</strong>. "Designated Technical Account Manager" → <strong>Enterprise</strong>, full stop. "15-minute response for business-critical systems" → <strong>Enterprise</strong>. "Cheapest plan allowing technical support cases" → <strong>Developer</strong>.</div>
      `,
      quiz: [
        {
          q: "Which support plan is the CHEAPEST that allows opening technical support cases?",
          options: ["Basic", "Developer", "Business", "Enterprise"],
          answer: [1],
          explain: "Basic can't open technical cases at all; Developer (business-hours email) is the entry point for real support.",
        },
        {
          q: "A company running production workloads needs 24/7 phone support and sub-1-hour response when production goes down — at the lowest cost. Which plan?",
          options: ["Developer", "Business", "Enterprise On-Ramp", "Basic"],
          answer: [1],
          explain: "That's the Business plan's exact profile: 24/7 phone/chat, <1hr production-down response, full Trusted Advisor.",
        },
        {
          q: "Which plan includes a DESIGNATED Technical Account Manager (TAM)?",
          options: ["Business", "Enterprise On-Ramp", "Enterprise", "Developer"],
          answer: [2],
          explain: "A named, designated TAM is Enterprise's signature perk (On-Ramp shares a TAM pool — the exam distinguishes these).",
        },
        {
          q: "What response time does Enterprise support promise for business-critical system down cases?",
          options: ["24 hours", "1 hour", "30 minutes", "15 minutes"],
          answer: [3],
          explain: "The ladder: Business <1hr · On-Ramp <30min · Enterprise <15min. Fifteen minutes is the top tier's headline number.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b6",
      title: "Marketplace, partners & pros — the AWS economy",
      minutes: 4,
      html: `
        <p>Last stop: the ecosystem around AWS, name-recognition style:</p>
        <ul>
          <li><strong>AWS Marketplace</strong> — the <strong>app store for third-party software</strong>: buy vendor AMIs, SaaS, and security tools that <strong>bill through your AWS invoice</strong> and often deploy in clicks. "Find and buy third-party software" → Marketplace.</li>
          <li><strong>AWS Partner Network (APN)</strong> — the global community of vetted <strong>consulting partners</strong> (firms that design/migrate/manage for you) and <strong>technology partners</strong> (software vendors). "Find an accredited firm to help with our migration" → APN.</li>
          <li><strong>AWS Professional Services</strong> — <strong>AWS's own consultants</strong> for large enterprise engagements, working alongside your team and partners.</li>
          <li>Bonus names: <strong>AWS IQ</strong> (marketplace for freelance AWS experts) and <strong>AWS Training and Certification</strong> (how you're here!).</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Don't confuse the two catalogs: <strong>Marketplace = buy third-party SOFTWARE</strong> (public) vs <strong>Service Catalog = your company's internal approved stacks</strong> (Chapter 9). And people-help: <strong>APN partners</strong> = external firms; <strong>Professional Services</strong> = AWS's own team.</div>
      `,
      quiz: [
        {
          q: "A team wants to buy a third-party firewall appliance that deploys from a vendor AMI and bills through their AWS invoice. Where?",
          options: ["AWS Marketplace", "AWS Service Catalog", "AWS Artifact", "AWS IQ"],
          answer: [0],
          explain: "Third-party software, consolidated onto the AWS bill = Marketplace, the public app store.",
        },
        {
          q: "A company with no cloud experience wants an accredited external consulting firm to lead its migration. Where does it find one?",
          options: ["The AWS Partner Network (APN)", "AWS Pricing Calculator", "The Free Tier", "CloudWatch"],
          answer: [0],
          explain: "APN is the directory of vetted consulting partners — external experts with AWS accreditation.",
        },
        {
          q: "AWS Professional Services is…",
          options: [
            "AWS's own consulting organization for enterprise engagements",
            "A third-party staffing agency",
            "A free chatbot",
            "The name of the Basic support plan",
          ],
          answer: [0],
          explain: "When AWS itself sends consultants to work with your team, that's Professional Services — distinct from external APN partners.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "Pricing philosophy: <strong>pay as you go · save when you commit · pay less by using more</strong>. Data IN free; data OUT to the internet billed.",
    "Free Tier flavors: <strong>always free</strong> (Lambda 1M req/mo) · <strong>12 months</strong> (EC2 micro 750 hrs/mo, S3 5 GB) · <strong>trials</strong>.",
    "Cost tools by verb: <strong>Pricing Calculator</strong> = ESTIMATE before building · <strong>Cost Explorer</strong> = ANALYZE past + forecast · <strong>Budgets</strong> = ALERT at thresholds · <strong>CUR</strong> = ITEMIZE everything to S3.",
    "<strong>Cost allocation tags</strong> attribute spend to projects/teams — tag it, then slice by tag in Cost Explorer.",
    "Support plans: <strong>Basic</strong> free, no cases · <strong>Developer</strong> business-hours email · <strong>Business</strong> 24/7 phone + full Trusted Advisor + <strong>&lt;1 hr</strong> production-down · <strong>On-Ramp &lt;30 min</strong> · <strong>Enterprise</strong>: designated <strong>TAM</strong>, Concierge, <strong>&lt;15 min</strong> business-critical.",
    "<strong>Marketplace</strong> = buy third-party software on your AWS bill · <strong>APN</strong> = accredited partner firms · <strong>Professional Services</strong> = AWS's own consultants.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which statement matches AWS's pricing philosophy?",
        options: [
          "Pay for what you use, with discounts for commitment and volume",
          "Fixed pricing locked for five years",
          "All services cost the same in every Region",
          "Billing only happens annually",
        ],
        answer: [0],
        explain: "Pay-as-you-go + commit-to-save + volume tiers — the three pillars from burst 1.",
      },
      {
        q: "750 monthly hours of a micro EC2 instance for your account's first year is which Free Tier type?",
        options: ["Always free", "12 months free", "A trial", "Spot pricing"],
        answer: [1],
        explain: "The EC2/S3 starter allowances run for 12 months from account creation, unlike Lambda's always-free monthly grant.",
      },
      {
        q: "Before migrating, a CFO wants a defensible monthly estimate of the target AWS architecture. Which tool produces it?",
        options: ["AWS Pricing Calculator", "AWS Budgets", "Cost Explorer", "AWS Config"],
        answer: [0],
        explain: "Pre-deployment modeling = Pricing Calculator. Nothing exists in the account yet, so the analysis tools have nothing to analyze.",
      },
      {
        q: "Which tool ALERTS stakeholders when actual or forecasted spend crosses a defined threshold?",
        options: ["AWS Budgets", "Pricing Calculator", "AWS Artifact", "Amazon GuardDuty"],
        answer: [0],
        explain: "Budgets = thresholds + notifications (cost, usage, and RI/SP utilization variants).",
      },
      {
        q: "Which tool would identify that storage costs have grown 60% over six months and project next quarter's bill?",
        options: ["AWS Cost Explorer", "AWS Budgets", "Pricing Calculator", "Service Catalog"],
        answer: [0],
        explain: "Trend analysis + forecasting over real historical spend = Cost Explorer.",
      },
      {
        q: "A company needs hourly, line-item billing detail delivered to S3 for its finance data warehouse. Which offering?",
        options: ["Cost and Usage Report", "The console's monthly summary", "Trusted Advisor", "AWS Health Dashboard"],
        answer: [0],
        explain: "CUR is the maximum-granularity export — built exactly for downstream finance tooling.",
      },
      {
        q: "To see exactly how much the 'mobile-app' project spends across shared accounts, a company should…",
        options: [
          "Tag project resources and activate cost allocation tags",
          "Create one account per employee",
          "Read every CloudTrail event",
          "Buy Enterprise support",
        ],
        answer: [0],
        explain: "Tags + cost allocation activation let every billing tool group spend by project — chargeback without restructuring.",
      },
      {
        q: "Which TWO features arrive when upgrading from Developer to Business support? (Select TWO)",
        options: [
          "24/7 phone and chat technical support",
          "A designated Technical Account Manager",
          "The full set of Trusted Advisor checks",
          "Free EC2 usage",
        ],
        answer: [0, 2],
        explain: "Business = 24/7 phone/chat + full Trusted Advisor + <1hr production-down response. The designated TAM waits at Enterprise.",
      },
      {
        q: "Which support plan provides a designated TAM and <15-minute response for business-critical outages?",
        options: ["Business", "Enterprise On-Ramp", "Enterprise", "Developer"],
        answer: [2],
        explain: "Named TAM + 15-minute business-critical response = Enterprise, the top tier.",
      },
      {
        q: "What can users on the FREE Basic support plan do? (Select TWO)",
        options: [
          "Access documentation, whitepapers, and forums",
          "Open technical support cases by phone",
          "View the AWS Health Dashboard and core Trusted Advisor checks",
          "Call their designated TAM",
        ],
        answer: [0, 2],
        explain: "Basic = self-service resources plus health/core checks. Technical cases start at Developer; TAMs at Enterprise.",
      },
      {
        q: "Where would a company purchase a third-party monitoring product that consolidates onto its existing AWS bill?",
        options: ["AWS Marketplace", "AWS Service Catalog", "AWS Organizations", "AWS Outposts"],
        answer: [0],
        explain: "Marketplace is the public third-party software store with AWS-bill integration. Service Catalog is your internal approved menu.",
      },
      {
        q: "A retailer wants an experienced external firm, accredited by AWS, to run its cloud migration. It should engage…",
        options: ["An AWS Partner Network consulting partner", "AWS Artifact", "The Basic support team", "AWS Budgets"],
        answer: [0],
        explain: "APN consulting partners are the accredited outside experts for design/migration/management engagements.",
      },
      {
        q: "Moving 10 TB INTO S3 from the internet costs ______ in data transfer fees; serving 10 TB OUT to internet users costs ______.",
        options: [
          "nothing / per-GB charges",
          "per-GB charges / nothing",
          "nothing / nothing",
          "the same amount each way",
        ],
        answer: [0],
        explain: "Ingress is free; egress to the internet bills per GB — the asymmetry behind many real-world bill surprises.",
      },
    ],
  },
});
