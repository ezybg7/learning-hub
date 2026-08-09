/* ============================================================
   AWS CCP — Chapter 9: Accounts & Governance
   Day 12 · Organizations, SCPs, consolidated billing,
   Control Tower, Service Catalog.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch09",
  num: 9,
  title: "Accounts & Governance",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "AWS Organizations — one company, many accounts",
      minutes: 5,
      html: `
        <p>Real companies don't use ONE AWS account — they use dozens: one per team, per environment (dev/test/prod), per project. Separate accounts give isolation (a dev mistake can't touch prod) and clean billing lines. But dozens of accounts need central control.</p>
        <p><strong>AWS Organizations</strong> is that control layer:</p>
        <ul>
          <li>A <strong>management account</strong> sits at the top; <strong>member accounts</strong> join under it.</li>
          <li>Accounts are grouped into <strong>OUs (organizational units)</strong> — folders like "Production," "Sandbox," "Finance" — so policies apply to whole groups at once.</li>
          <li><strong>Consolidated billing</strong> — ONE bill for every account (next burst).</li>
          <li>Centralized policy control via <strong>SCPs</strong> (burst 3).</li>
        </ul>
        <div class="callout"><b>The org chart analogy</b>
        Organizations is literally a company org chart for AWS accounts: management account = headquarters, OUs = departments, member accounts = teams. Rules set at HQ flow down the chart.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "centrally manage multiple AWS accounts," "group accounts," "apply policies across accounts" → <strong>AWS Organizations</strong>. Multi-account is AWS's recommended practice, not an edge case.</div>
      `,
      quiz: [
        {
          q: "A company with 30 AWS accounts wants central management, grouping, and shared policies. Which service?",
          options: ["AWS Organizations", "IAM groups", "Amazon Connect", "AWS Batch"],
          answer: [0],
          explain: "Organizations is the multi-ACCOUNT manager. (IAM groups organize users WITHIN one account — a classic mix-up.)",
        },
        {
          q: "Within Organizations, what is an OU (organizational unit)?",
          options: [
            "A type of EC2 instance",
            "A group of accounts that policies can be applied to together",
            "A billing currency",
            "An AWS Region",
          ],
          answer: [1],
          explain: "OUs are the folders of the account org chart — attach a policy to the OU and every account inside inherits it.",
        },
        {
          q: "Why do companies use SEPARATE AWS accounts for dev and production?",
          options: [
            "AWS requires it",
            "Isolation — mistakes and access in one environment can't affect the other",
            "Separate accounts are free",
            "Production doesn't work otherwise",
          ],
          answer: [1],
          explain: "Account boundaries are the strongest isolation AWS offers: blast radius, access, and billing all stay contained.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "Consolidated billing — one bill, shared discounts",
      minutes: 4,
      html: `
        <p>Organizations' most exam-tested feature is <strong>consolidated billing</strong>:</p>
        <ul>
          <li><strong>One bill</strong> — the management account pays for all member accounts. Finance sees one invoice, itemized per account.</li>
          <li><strong>Combined usage for volume discounts</strong> — AWS prices tier downward with volume (e.g., S3 gets cheaper per GB at higher tiers). Consolidated billing <strong>pools all accounts' usage</strong> to reach those cheaper tiers faster than any account could alone.</li>
          <li><strong>Shared Reserved Instances & Savings Plans</strong> — unused RI/Savings Plan discounts in one account <strong>automatically apply to matching usage in sibling accounts</strong>. Nothing wasted.</li>
          <li>It's free — there's no charge for Organizations or consolidated billing.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Benefits of consolidated billing?" → <strong>one bill, combined volume discounts, shared RI/Savings Plans discounts</strong>. That trio is the answer, usually as a Select-TWO.</div>
      `,
      quiz: [
        {
          q: "Which are benefits of consolidated billing in AWS Organizations? (Select TWO)",
          options: [
            "Combined usage across accounts reaches volume-discount tiers faster",
            "Each account must pay separately",
            "Unused Reserved Instance discounts can apply across member accounts",
            "It doubles the Free Tier for every account",
          ],
          answer: [0, 2],
          explain: "Pooled usage tiers + shared RI/SP discounts (plus the single bill) are the canonical benefits. Free Tier doubling isn't a thing.",
        },
        {
          q: "Account A bought Reserved Instances it isn't fully using. Account B (same organization) runs matching instances On-Demand. What happens with consolidated billing?",
          options: [
            "Nothing — discounts never cross accounts",
            "The unused RI discount automatically applies to Account B's matching usage",
            "Account B is suspended",
            "The RI is refunded",
          ],
          answer: [1],
          explain: "RI and Savings Plans discounts float across the consolidated family, landing wherever matching usage exists — no discount stranded.",
        },
        {
          q: "How much extra does AWS charge for using Organizations and consolidated billing?",
          options: ["Nothing", "1% of the total bill", "$99/month", "It requires Enterprise support"],
          answer: [0],
          explain: "Organizations is free — the savings mechanisms cost nothing to turn on.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "SCPs — guardrails that outrank everyone",
      minutes: 5,
      html: `
        <p><strong>Service Control Policies (SCPs)</strong> are Organizations' enforcement tool: policies attached to accounts or OUs that set the <strong>maximum possible permissions</strong> inside them.</p>
        <ul>
          <li>An SCP is a <strong>guardrail, not a grant</strong>: it never GIVES permissions — it draws the outer boundary of what IAM inside the account can ever allow.</li>
          <li>It binds <strong>everyone in the member account — including its administrators</strong>. If the SCP says "no one may leave us-east-1" or "nobody can disable CloudTrail," even the account's full admin cannot.</li>
          <li>IAM still works normally INSIDE the boundary: a user needs BOTH an IAM allow AND the action to be within the SCP's limits.</li>
        </ul>
        <div class="callout"><b>The fence analogy</b>
        IAM policies hand out keys to rooms inside the house. The SCP is the fence around the property — no key opens a gate the fence doesn't have. HQ builds the fences; teams manage their own keys inside.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "<em>prevent ANY user in an account — even admins — from doing X</em>," "restrict which Regions/services member accounts can use," "guardrails across accounts" → <strong>SCP</strong>. If it's about one user's permissions inside an account → plain IAM policy.</div>
      `,
      quiz: [
        {
          q: "A company must ensure that NO ONE in its sandbox accounts — including account admins — can launch resources outside approved Regions. Which mechanism?",
          options: [
            "An IAM password policy",
            "A Service Control Policy on the sandbox OU",
            "A security group",
            "An S3 lifecycle rule",
          ],
          answer: [1],
          explain: "Only SCPs bind whole accounts including their admins. Attach it at the OU and every account inside inherits the guardrail.",
        },
        {
          q: "What does an SCP actually DO?",
          options: [
            "Grants permissions to users",
            "Sets the maximum permissions available in an account — a boundary, not a grant",
            "Encrypts data at rest",
            "Routes network traffic",
          ],
          answer: [1],
          explain: "SCPs limit; IAM grants. A user acts only where both agree — inside the fence AND holding the key.",
        },
        {
          q: "An SCP blocks 'cloudtrail:StopLogging' on an account. The account's administrator tries to stop CloudTrail. Result?",
          options: [
            "Admins bypass SCPs",
            "The action is denied — SCPs apply even to account administrators",
            "It works but sends an alert",
            "The account is deleted",
          ],
          answer: [1],
          explain: "That's the whole point of SCPs: guardrails that outrank everyone inside the member account, admins included.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Control Tower & Service Catalog — governance on autopilot",
      minutes: 5,
      html: `
        <p>Two services that package governance so you don't hand-build it:</p>
        <ul>
          <li><strong>AWS Control Tower</strong> — sets up and governs a <strong>multi-account environment ("landing zone") automatically</strong>, following AWS best practices: Organizations structure, pre-configured <strong>guardrails</strong> (preventive and detective), centralized logging, and a dashboard. Instead of assembling Organizations + SCPs + logging by hand, Control Tower builds the whole governed estate in an afternoon. New accounts get "vended" pre-configured and compliant.</li>
          <li><strong>AWS Service Catalog</strong> — a curated <strong>internal menu of approved products</strong>: IT publishes vetted, pre-configured stacks ("our standard web server," "approved database setup"), and teams <strong>self-serve deploy</strong> them without needing deep AWS access. Freedom for teams, standards for IT.</li>
        </ul>
        <div class="callout"><b>How they stack</b>
        Organizations is the raw account framework · SCPs are the hand-made guardrails · <strong>Control Tower automates the whole governed setup</strong> · Service Catalog governs WHAT gets deployed inside. Bigger picture, more automation, same goal: control without bottlenecks.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Set up a new multi-account environment with best practices and guardrails, quickly" → <strong>Control Tower</strong>. "Let teams self-service deploy only IT-approved configurations" → <strong>Service Catalog</strong>.</div>
      `,
      quiz: [
        {
          q: "A growing startup wants a best-practice multi-account AWS environment with guardrails and centralized logging, set up with minimal manual effort. Which service?",
          options: ["AWS Control Tower", "Amazon Lightsail", "AWS Batch", "Amazon QuickSight"],
          answer: [0],
          explain: "Control Tower = the automated landing zone: Organizations + guardrails + logging + account vending, assembled for you.",
        },
        {
          q: "IT wants developers to launch ONLY pre-approved, standardized application stacks — self-service, but within the rules. Which service?",
          options: ["AWS Service Catalog", "AWS Artifact", "Amazon Route 53", "AWS Snowball"],
          answer: [0],
          explain: "Service Catalog is the approved-products menu: IT curates, teams deploy freely from it, nothing off-menu.",
        },
        {
          q: "In Control Tower vocabulary, what is a 'landing zone'?",
          options: [
            "An edge location",
            "A well-architected, governed multi-account environment set up as your starting point",
            "A type of subnet",
            "The AWS console homepage",
          ],
          answer: [1],
          explain: "The landing zone is the pre-governed multi-account foundation Control Tower builds — accounts, guardrails, logging, all standing before workloads arrive.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>AWS Organizations</strong> = central management of many accounts: management account → <strong>OUs</strong> → member accounts. Multi-account is the recommended isolation pattern.",
    "<strong>Consolidated billing</strong>: one bill · pooled usage reaches volume-discount tiers faster · unused <strong>RI/Savings Plans discounts share across accounts</strong>. Free.",
    "<strong>SCPs</strong> = guardrails setting MAXIMUM permissions for accounts/OUs — they bind even account admins, and they never grant, only limit. IAM grants inside the fence.",
    "<strong>Control Tower</strong> = automated landing zone: best-practice multi-account setup with preventive/detective guardrails, central logging, and account vending.",
    "<strong>Service Catalog</strong> = curated menu of IT-approved stacks that teams self-service deploy.",
    "Layering: Organizations (framework) → SCPs (rules) → Control Tower (automated setup of both) → Service Catalog (what's deployable inside).",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which service centrally manages multiple AWS accounts, grouping them into organizational units?",
        options: ["AWS Organizations", "IAM Identity Center", "AWS Config", "Amazon Cognito"],
        answer: [0],
        explain: "Organizations is the account-level management layer — OUs, policies, consolidated billing.",
      },
      {
        q: "Which TWO are benefits of consolidated billing? (Select TWO)",
        options: [
          "A single bill covering all member accounts",
          "Free Enterprise support",
          "Combined usage that reaches volume-pricing tiers sooner",
          "Automatic encryption of all data",
        ],
        answer: [0, 2],
        explain: "One bill + pooled volume discounts (+ shared RI/SP benefits) — the consolidated-billing trio the exam returns to again and again.",
      },
      {
        q: "What is the purpose of a Service Control Policy?",
        options: [
          "To grant users additional permissions",
          "To define the maximum permissions available within member accounts",
          "To set EC2 pricing",
          "To configure VPC routing",
        ],
        answer: [1],
        explain: "SCPs are ceilings, not grants — the boundary IAM permissions can never exceed.",
      },
      {
        q: "A regulated company must guarantee that member-account administrators cannot disable audit logging. How?",
        options: [
          "Ask admins nicely in the wiki",
          "Attach an SCP denying the action at the OU level",
          "Set a CloudWatch alarm",
          "Use a stronger password policy",
        ],
        answer: [1],
        explain: "Only an SCP outranks account admins. Deny the API action org-wide and it's structurally impossible, not just discouraged.",
      },
      {
        q: "An SCP allows only us-east-1 usage; a user's IAM policy allows launching instances in any Region. What can the user actually do?",
        options: [
          "Launch anywhere — IAM wins",
          "Launch only in us-east-1 — actions must be inside BOTH the SCP boundary and IAM grants",
          "Launch nowhere",
          "Only read resources",
        ],
        answer: [1],
        explain: "Effective permissions = intersection of SCP ceiling and IAM grant. The fence caps the keys.",
      },
      {
        q: "Which service automatically sets up a governed, best-practice multi-account environment with guardrails and centralized logging?",
        options: ["AWS Control Tower", "AWS CloudFormation alone", "Amazon Inspector", "AWS Direct Connect"],
        answer: [0],
        explain: "Control Tower is the packaged landing-zone builder — Organizations, guardrails, and logging assembled to AWS best practice.",
      },
      {
        q: "What does AWS Service Catalog provide?",
        options: [
          "A public marketplace of third-party software",
          "An internal portfolio of IT-approved products that users can self-service deploy",
          "A list of AWS's compliance documents",
          "A catalog of EC2 instance prices",
        ],
        answer: [1],
        explain: "Service Catalog = your company's approved menu. (The public third-party store is AWS Marketplace — Chapter 10; compliance docs are Artifact.)",
      },
      {
        q: "A company wants dev, test, and prod isolated so that an incident in one can never touch the others. The AWS-recommended approach is…",
        options: [
          "Three separate AWS accounts under Organizations",
          "One account with three tags",
          "Three S3 buckets",
          "Three IAM groups in one account",
        ],
        answer: [0],
        explain: "Account boundaries are the strongest isolation available — the core reason multi-account + Organizations is the recommended architecture.",
      },
      {
        q: "Where in an organization would a policy be attached to affect a GROUP of accounts at once?",
        options: ["An organizational unit (OU)", "A single IAM user", "A subnet", "An edge location"],
        answer: [0],
        explain: "Attach at the OU and every account within inherits — that's the org-chart flow of control.",
      },
      {
        q: "Which statement about SCPs is TRUE?",
        options: [
          "They grant permissions to member accounts",
          "They apply to all identities in an account, including administrators",
          "They cost $10 per policy",
          "They only affect the root of the management account",
        ],
        answer: [1],
        explain: "SCPs bind every identity in the member account — that's what makes them guardrails rather than suggestions. (Fun nuance: the management account itself is exempt.)",
      },
    ],
  },
});
