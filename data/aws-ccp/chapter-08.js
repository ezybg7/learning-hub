/* ============================================================
   AWS CCP — Chapter 8: Monitoring & Management
   Day 11 · CloudWatch vs CloudTrail vs Config (the big three),
   Trusted Advisor, Health, Systems Manager, CloudFormation.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch08",
  num: 8,
  title: "Monitoring & Management",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "CloudWatch — what is happening?",
      minutes: 5,
      html: `
        <p><strong>Amazon CloudWatch</strong> is AWS's monitoring service — the dashboard of gauges for everything you run. It answers: <strong>"How are my resources performing RIGHT NOW?"</strong></p>
        <ul>
          <li><strong>Metrics</strong> — numbers over time: CPU utilization, disk I/O, request counts, error rates. Nearly every AWS service publishes them automatically.</li>
          <li><strong>Alarms</strong> — watch a metric and ACT when it crosses a threshold: notify you (via SNS), or trigger Auto Scaling ("CPU over 70% for 5 minutes → add instances").</li>
          <li><strong>Dashboards</strong> — custom visual walls of your key metrics.</li>
          <li><strong>CloudWatch Logs</strong> — collect, store, and search log files from EC2, Lambda, and on-prem servers in one place.</li>
        </ul>
        <div class="callout"><b>The heartbeat monitor</b>
        Think of CloudWatch as the hospital monitor beeping beside your infrastructure: vitals (metrics), alarms when vitals go bad, and a chart history the doctors can scroll (dashboards + logs).</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "monitor CPU utilization," "set an alarm," "collect application logs," "performance dashboards" → <strong>CloudWatch</strong>. It also feeds Auto Scaling — alarms are what make elasticity automatic.</div>
      `,
      quiz: [
        {
          q: "A team wants an alert when an EC2 instance's CPU stays above 80% for ten minutes. Which service provides this?",
          options: ["AWS CloudTrail", "Amazon CloudWatch alarms", "AWS Config", "AWS Artifact"],
          answer: [1],
          explain: "Performance metrics + threshold alerts = CloudWatch. An alarm on the CPUUtilization metric does exactly this.",
        },
        {
          q: "Where would you centrally collect and search application log files from many EC2 instances and Lambda functions?",
          options: ["CloudWatch Logs", "AWS Artifact", "Amazon Macie", "S3 Glacier only"],
          answer: [0],
          explain: "CloudWatch Logs is the log aggregation service — one searchable home for logs across your fleet.",
        },
        {
          q: "What can a CloudWatch alarm do when triggered? (best answer)",
          options: [
            "Only send emails",
            "Notify people AND trigger actions like Auto Scaling",
            "Delete your account",
            "Nothing — alarms are display-only",
          ],
          answer: [1],
          explain: "Alarms are actionable: notifications via SNS, Auto Scaling triggers, EC2 actions. They're the nervous system connecting metrics to responses.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "CloudTrail — who did that?",
      minutes: 4,
      html: `
        <p><strong>AWS CloudTrail</strong> is the security camera on your AWS account. It records <strong>API calls and account activity</strong>: WHO did WHAT, WHEN, and FROM WHERE. Every console click, CLI command, and SDK call becomes an event.</p>
        <ul>
          <li>"Who terminated that instance at 2 AM?" — CloudTrail knows: the user, the time, the source IP.</li>
          <li>Events from the last <strong>90 days</strong> are viewable by default; create a <strong>trail</strong> to keep history in S3 forever.</li>
          <li>It's the backbone of <strong>auditing, compliance investigations, and security forensics</strong> (and one of GuardDuty's log sources — Chapter 7 tie-in).</li>
        </ul>
        <div class="callout"><b>CloudWatch vs CloudTrail — the exam's favorite mix-up</b>
        <strong>CloudWatch = performance</strong> ("CPU is at 90%"). <strong>CloudTrail = actions/audit</strong> ("Bob deleted the bucket at 14:32"). Metrics vs history. Health vs accountability. If the question says WHO — it's CloudTrail.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "audit," "track user activity," "record API calls," "who made this change" → <strong>CloudTrail</strong>. Also: it's about ACCOUNT actions, not resource settings — that third sibling is next.</div>
      `,
      quiz: [
        {
          q: "A security team must determine which IAM user deleted a production S3 bucket last Tuesday. Which service holds the answer?",
          options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Trusted Advisor", "Amazon Inspector"],
          answer: [1],
          explain: "Who-did-what-when = CloudTrail, the API activity record. CloudWatch would only tell you how the bucket was performing.",
        },
        {
          q: "What does CloudTrail record?",
          options: [
            "CPU and memory metrics",
            "API calls and account activity — the who, what, when, and where",
            "Only failed login attempts",
            "Customer credit card data",
          ],
          answer: [1],
          explain: "Every API action in the account becomes an auditable event. That's CloudTrail's entire purpose.",
        },
        {
          q: "Complete the pair: CloudWatch is to performance monitoring as CloudTrail is to…",
          options: ["Cost optimization", "Auditing user and API activity", "DNS routing", "Content delivery"],
          answer: [1],
          explain: "The exam tests this contrast constantly: CloudWatch watches metrics; CloudTrail records actions.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "Config — what changed, and is it compliant?",
      minutes: 4,
      html: `
        <p>Third sibling: <strong>AWS Config</strong> tracks your <strong>resource configurations over time</strong> and evaluates them against rules. It answers: <strong>"How are my resources set up, how did that change, and does it match policy?"</strong></p>
        <ul>
          <li><strong>Configuration history</strong> — a timeline per resource: this security group allowed only 443… until Thursday, when port 22 was opened.</li>
          <li><strong>Config rules</strong> — continuous compliance checks: "all EBS volumes must be encrypted," "no security group may allow 0.0.0.0/0 on port 22." Violations get flagged.</li>
        </ul>
        <div class="callout"><b>The three siblings, one line each</b>
        <strong>CloudWatch</strong>: how are resources PERFORMING? · <strong>CloudTrail</strong>: WHO did what? · <strong>Config</strong>: how are resources CONFIGURED, and did that drift from policy? Together: performance, actions, settings.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "track configuration changes," "resource inventory over time," "continuously check compliance of settings" → <strong>AWS Config</strong>. A question about a security group's rules CHANGING is Config; about who changed them is CloudTrail.</div>
      `,
      quiz: [
        {
          q: "A company must continuously verify that every EBS volume in the account is encrypted, and flag any that aren't. Which service?",
          options: ["AWS Config rules", "Amazon CloudWatch", "AWS CloudTrail", "AWS Shield"],
          answer: [0],
          explain: "Ongoing configuration-compliance checks = Config rules. It watches settings, not performance or actions.",
        },
        {
          q: "An auditor asks how a security group's rules have changed over the past six months. Which service shows that timeline?",
          options: ["AWS Config", "Amazon Macie", "AWS Batch", "Amazon Route 53"],
          answer: [0],
          explain: "Config keeps per-resource configuration history — the settings timeline. (Who made each change would come from CloudTrail.)",
        },
        {
          q: "Match each to its question: performance? / who did it? / how is it configured?",
          options: [
            "CloudWatch / CloudTrail / Config",
            "CloudTrail / Config / CloudWatch",
            "Config / CloudWatch / CloudTrail",
            "They all answer everything",
          ],
          answer: [0],
          explain: "CloudWatch=performance, CloudTrail=actions/audit, Config=configuration state. Lock this trio in — it's near-guaranteed exam material.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Trusted Advisor & the Health Dashboard — AWS's free consultants",
      minutes: 5,
      html: `
        <p>Two services that WATCH OUT for you:</p>
        <ul>
          <li><strong>AWS Trusted Advisor</strong> — automated best-practice checks across <strong>five pillars</strong>: <strong>cost optimization</strong> (idle instances, unused EIPs), <strong>performance</strong>, <strong>security</strong> (open ports, missing MFA on root), <strong>fault tolerance</strong> (missing Multi-AZ, un-backed-up volumes), and <strong>service limits</strong> (approaching quotas). Everyone gets a <strong>core set of checks free</strong> (basic security + service limits); the <strong>full suite requires a Business or Enterprise support plan</strong> — a fact the exam loves.</li>
          <li><strong>AWS Health Dashboard</strong> — two views: the public status of AWS services, and — the useful one — <strong>your account-specific view</strong>: events and scheduled maintenance affecting YOUR resources ("your instance's hardware is scheduled for retirement").</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Recommendations to reduce cost / close security gaps / check service limits" → <strong>Trusted Advisor</strong>. "Is an AWS outage affecting MY account?" → <strong>Health Dashboard</strong>. And the trivia: full Trusted Advisor checks come with <strong>Business+ support plans</strong> (foreshadowing Chapter 10).</div>
      `,
      quiz: [
        {
          q: "Which service automatically flags idle EC2 instances, security groups open to the world, and approaching service limits?",
          options: ["AWS Trusted Advisor", "Amazon Detective", "AWS CloudFormation", "Amazon EFS"],
          answer: [0],
          explain: "Best-practice checks across cost, performance, security, fault tolerance, and limits = Trusted Advisor, the built-in consultant.",
        },
        {
          q: "Who gets ACCESS to the complete set of Trusted Advisor checks?",
          options: [
            "Every account, free",
            "Accounts with Business or Enterprise support plans",
            "Only the root user",
            "Nobody — it's internal to AWS",
          ],
          answer: [1],
          explain: "Core checks are free for all; the full suite unlocks at Business support and above — a favorite exam detail.",
        },
        {
          q: "Where would you check whether a reported AWS service issue is impacting YOUR specific resources?",
          options: ["AWS Health Dashboard (account view)", "Amazon CloudFront", "AWS Artifact", "Cost Explorer"],
          answer: [0],
          explain: "The Health Dashboard's personalized view shows events touching your account — outages, degradations, and scheduled maintenance on your stuff.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Systems Manager & CloudFormation — managing fleets, building from blueprints",
      minutes: 6,
      html: `
        <p>Two management heavyweights close the chapter:</p>
        <ul>
          <li><strong>AWS Systems Manager (SSM)</strong> — the operations toolbox for your server fleet (EC2 AND on-premises): <strong>Run Command</strong> (execute a command on 500 instances at once, no SSH), <strong>Patch Manager</strong> (automate OS patching at scale), <strong>Session Manager</strong> (browser-based shell access with <strong>no open SSH ports and no key files</strong> — auditable via CloudTrail), and <strong>Parameter Store</strong> (config values and secrets).</li>
          <li><strong>AWS CloudFormation</strong> — <strong>infrastructure as code</strong>: describe your entire environment (VPC, subnets, instances, databases) in a <strong>JSON/YAML template</strong>, and CloudFormation builds it — identically, every time. Version-control your infrastructure, spin up matching dev/test/prod stacks, tear down cleanly. The service is free; you pay only for the resources it creates.</li>
        </ul>
        <div class="callout"><b>Why IaC matters</b>
        Clicking around the console works once. Templates work a thousand times, identically, reviewable like code. "We need this same environment in another Region by Friday" → CloudFormation, same template, new Region, done.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Patch hundreds of instances / run commands across the fleet / shell access without SSH keys" → <strong>Systems Manager</strong>. "Provision infrastructure repeatedly from templates," "infrastructure as code," "deploy identical environments" → <strong>CloudFormation</strong>.</div>
      `,
      quiz: [
        {
          q: "An ops team must apply OS patches to 300 EC2 instances on a schedule, without logging into each one. Which service?",
          options: ["AWS Systems Manager Patch Manager", "AWS CloudFormation", "Amazon CloudFront", "AWS Artifact"],
          answer: [0],
          explain: "Fleet-scale patching = Systems Manager's Patch Manager. SSM is the many-servers operations toolbox.",
        },
        {
          q: "A company wants to define its network, servers, and database in a version-controlled template and deploy identical copies to three environments. Which service?",
          options: ["AWS CloudFormation", "AWS Config", "Amazon EKS", "AWS Health Dashboard"],
          answer: [0],
          explain: "Infrastructure as code from JSON/YAML templates = CloudFormation. Same template in, same environment out, every time.",
        },
        {
          q: "Which Systems Manager capability provides shell access to instances WITHOUT opening SSH ports or managing key pairs?",
          options: ["Session Manager", "Parameter Store", "Run Command", "Patch Manager"],
          answer: [0],
          explain: "Session Manager = browser/CLI shell through AWS's control plane — no inbound ports, no keys, every session auditable.",
        },
        {
          q: "How much does the CloudFormation service itself cost?",
          options: [
            "Nothing — you pay only for the resources the templates create",
            "$100 per template",
            "1% of your monthly bill",
            "It requires Enterprise support",
          ],
          answer: [0],
          explain: "CloudFormation is free; the EC2/RDS/etc. it provisions bill normally. A recurring exam fact for several 'deployment' services.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "The big three: <strong>CloudWatch</strong> = performance (metrics, alarms, logs, dashboards) · <strong>CloudTrail</strong> = audit (who did what API call, when, from where) · <strong>Config</strong> = configuration state (settings history + compliance rules). Performance / actions / settings.",
    "CloudWatch <strong>alarms act</strong>: notify via SNS and trigger Auto Scaling — they're what makes elasticity automatic.",
    "CloudTrail: 90 days of events by default; a <strong>trail</strong> preserves history to S3. It's the forensics backbone (and feeds GuardDuty).",
    "<strong>Config rules</strong> continuously flag non-compliant settings ('unencrypted volume,' 'port 22 open to world').",
    "<strong>Trusted Advisor</strong>: best-practice checks in 5 categories — cost, performance, security, fault tolerance, service limits. Core checks free; <strong>full suite needs Business/Enterprise support</strong>.",
    "<strong>Health Dashboard</strong>: AWS status + your account-specific events and scheduled maintenance.",
    "<strong>Systems Manager</strong>: fleet ops — Run Command, Patch Manager, <strong>Session Manager (no SSH ports/keys)</strong>, Parameter Store.",
    "<strong>CloudFormation</strong> = infrastructure as code: JSON/YAML templates → identical, repeatable environments. Free service; pay for what it builds.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which service tracks resource performance metrics like CPU utilization and lets you set threshold alarms?",
        options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Config", "AWS Artifact"],
        answer: [0],
        explain: "Metrics + alarms + dashboards + logs = CloudWatch, the performance monitor.",
      },
      {
        q: "A compliance investigation needs a record of every API call made in the account last month, including caller identity and source IP. Which service?",
        options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Trusted Advisor", "Amazon Macie"],
        answer: [1],
        explain: "The API audit log is CloudTrail. Who/what/when/where for every account action.",
      },
      {
        q: "Which service maintains a history of resource configuration changes and evaluates settings against compliance rules?",
        options: ["AWS Config", "Amazon CloudWatch", "AWS Batch", "Amazon Neptune"],
        answer: [0],
        explain: "Configuration timelines + rule evaluation = Config, the settings watchdog.",
      },
      {
        q: "Traffic spikes should automatically add EC2 instances. Which pairing makes that happen?",
        options: [
          "CloudWatch alarm triggering an Auto Scaling policy",
          "CloudTrail event triggering a snapshot",
          "Config rule triggering a support ticket",
          "Trusted Advisor triggering a refund",
        ],
        answer: [0],
        explain: "CloudWatch watches the metric; the alarm fires the scaling policy. That loop IS elasticity in practice.",
      },
      {
        q: "Which TWO recommendations would AWS Trusted Advisor surface? (Select TWO)",
        options: [
          "Idle EC2 instances wasting money",
          "Which employee to promote",
          "Security groups with unrestricted access",
          "Next quarter's revenue forecast",
        ],
        answer: [0, 2],
        explain: "Trusted Advisor's pillars include cost optimization (idle resources) and security (open access). It advises on AWS hygiene, not business strategy.",
      },
      {
        q: "The COMPLETE set of Trusted Advisor checks is available to accounts with…",
        options: [
          "Any support plan",
          "Business or Enterprise support plans",
          "A Free Tier account only",
          "An IAM group named 'Admins'",
        ],
        answer: [1],
        explain: "Free core checks for everyone; the full battery unlocks with Business+ support. Classic exam trivia.",
      },
      {
        q: "Where do you see AWS-side events — like scheduled hardware maintenance — that specifically affect YOUR resources?",
        options: ["AWS Health Dashboard", "Amazon QuickSight", "AWS WAF", "Cost Explorer"],
        answer: [0],
        explain: "The Health Dashboard's account view personalizes AWS's operational status to your resources.",
      },
      {
        q: "An engineer needs interactive shell access to private EC2 instances without opening port 22 or distributing SSH keys. Which capability?",
        options: ["Systems Manager Session Manager", "An Internet Gateway", "CloudFormation StackSets", "Amazon Inspector"],
        answer: [0],
        explain: "Session Manager tunnels shell sessions through AWS — no inbound ports, no keys, fully audited.",
      },
      {
        q: "Which service enables 'infrastructure as code' using JSON or YAML templates?",
        options: ["AWS CloudFormation", "AWS Config", "Amazon ECR", "AWS Health Dashboard"],
        answer: [0],
        explain: "CloudFormation turns templates into running environments — repeatable, reviewable, version-controlled infrastructure.",
      },
      {
        q: "A company must reproduce its exact production environment in a new Region for disaster recovery testing. The FASTEST reliable approach is…",
        options: [
          "Manually re-click everything in the console",
          "Deploy the existing CloudFormation template to the new Region",
          "Email AWS Support to copy the account",
          "Take screenshots of the console settings",
        ],
        answer: [1],
        explain: "That's the IaC payoff: the same template deploys an identical stack anywhere, in minutes, with no forgotten settings.",
      },
      {
        q: "Which question is CloudTrail — not CloudWatch — built to answer?",
        options: [
          "What's the current CPU utilization?",
          "Which user modified the security group at 3:14 PM?",
          "How many requests per second is the ALB serving?",
          "What's the p99 latency?",
        ],
        answer: [1],
        explain: "Identity + action + timestamp = audit trail = CloudTrail. The other three are performance metrics — CloudWatch.",
      },
      {
        q: "Patching the operating systems of a large mixed fleet (EC2 + on-premises servers) at scale is a job for…",
        options: ["AWS Systems Manager", "Amazon CloudFront", "AWS Snow Family", "Amazon Aurora"],
        answer: [0],
        explain: "Systems Manager manages fleets wherever they run — Run Command, Patch Manager, and friends handle scale operations.",
      },
    ],
  },
});
