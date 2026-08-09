/* ============================================================
   AWS CCP — Chapter 7: Security & Identity
   Days 9–10 · The 30% domain. Shared Responsibility Model,
   IAM, encryption, network protection, threat detection,
   compliance. Two study sessions — worth every minute.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch07",
  num: 7,
  title: "Security & Identity",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "The Shared Responsibility Model — the most-tested idea on the exam",
      minutes: 6,
      html: `
        <p>Who's responsible for security in the cloud — you or AWS? Answer: <strong>both, with a clean dividing line</strong>. Memorize the slogan:</p>
        <div class="callout"><b>The line</b>
        <strong>AWS is responsible for security OF the cloud.</strong> The physical world: data centers, hardware, networking gear, and the software that runs AWS services (the hypervisor, managed-service infrastructure).<br><br>
        <strong>You are responsible for security IN the cloud.</strong> Everything you put there and how you configure it: your <strong>data</strong>, <strong>IAM users and permissions</strong>, <strong>security group rules</strong>, <strong>encryption choices</strong>, and — on EC2 — the <strong>guest operating system, its patches, and installed software</strong>.</div>
        <p>The split SHIFTS with how managed the service is:</p>
        <ul>
          <li><strong>EC2 (IaaS)</strong> — you carry the most: guest OS patching, firewall config, everything above the hypervisor.</li>
          <li><strong>RDS/Lambda (managed)</strong> — AWS patches the OS and runtime; you still own your data, access rules, and settings.</li>
          <li><strong>Always yours, no matter the service:</strong> your data, its classification, IAM, and what you choose to encrypt.</li>
          <li><strong>Always AWS's:</strong> the buildings, the racks, the physical network, the hypervisor.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Expect 3–5 questions on this. Fast rules: anything <strong>physical</strong> or about <strong>AWS's own software/facilities</strong> → AWS. Anything about <strong>your data, your configurations, your users, guest OS on EC2</strong> → customer. "Patching" is the trap word: EC2 guest OS patching = customer; RDS engine patching = AWS; the hypervisor = AWS.</div>
      `,
      quiz: [
        {
          q: "Under the Shared Responsibility Model, which is a CUSTOMER responsibility?",
          options: [
            "Physical security of data centers",
            "Patching the hypervisor",
            "Configuring security group rules and IAM permissions",
            "Replacing failed hard drives",
          ],
          answer: [2],
          explain: "Your configurations, your access control, your data = security IN the cloud = you. Facilities, hardware, hypervisor = OF the cloud = AWS.",
        },
        {
          q: "A company runs an application on EC2. Who patches the guest operating system on the instance?",
          options: ["AWS", "The customer", "Neither — EC2 has no OS", "The internet service provider"],
          answer: [1],
          explain: "On EC2 (IaaS), everything above the hypervisor is yours — including the guest OS and its patches. (On RDS, AWS patches the database OS — that's the managed-service shift.)",
        },
        {
          q: "Which responsibility is ALWAYS AWS's, regardless of service?",
          options: [
            "Classifying your company's data",
            "Physical security of the data centers",
            "Your IAM password policy",
            "Deciding what data to encrypt",
          ],
          answer: [1],
          explain: "The physical layer never transfers: buildings, hardware, and the infrastructure software are AWS's domain in every scenario.",
        },
        {
          q: "For Amazon RDS, which task belongs to AWS rather than the customer?",
          options: [
            "Patching the database engine and underlying OS",
            "Deciding who can access the database",
            "Choosing what data to store",
            "Writing the application's queries",
          ],
          answer: [0],
          explain: "Managed service = AWS takes the OS/engine patching. You keep data, access control, and configuration — those never leave your side of the line.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "IAM part 1 — users, groups, policies, and the root account",
      minutes: 6,
      html: `
        <p><strong>AWS IAM (Identity and Access Management)</strong> controls WHO can do WHAT in your AWS account. It's free, and it's <strong>global</strong> — not tied to any Region. The cast:</p>
        <ul>
          <li><strong>Root user</strong> — the identity that created the account. Unlimited, unrestrictable power. Best practice: <strong>enable MFA, lock it away, never use it for daily work</strong> — only for the handful of tasks that require root (like closing the account).</li>
          <li><strong>IAM users</strong> — individual identities for people or applications, with a password (console) and/or <strong>access keys</strong> (programmatic API access).</li>
          <li><strong>IAM groups</strong> — collections of users. Attach permissions to the GROUP ("Developers," "Finance") and members inherit them. Managing people one-by-one is the anti-pattern.</li>
          <li><strong>IAM policies</strong> — <strong>JSON documents</strong> that define permissions: which <em>actions</em>, on which <em>resources</em>, allow or deny. Attach to users, groups, or roles.</li>
        </ul>
        <div class="callout"><b>The golden rule: least privilege</b>
        Grant the MINIMUM permissions needed to do the job — no more. New users start with zero permissions until a policy says otherwise. Every "how should permissions be granted?" question wants this phrase.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Grant permissions to many similar users efficiently" → <strong>groups</strong>. "Documents that define permissions" → <strong>policies (JSON)</strong>. "First things to do with a new account" → <strong>MFA on root, stop using root, create IAM identities</strong>. IAM is <strong>global</strong>, and it's <strong>free</strong>.</div>
      `,
      quiz: [
        {
          q: "What is the recommended way to handle the AWS root user?",
          options: [
            "Use it for all daily administration",
            "Enable MFA on it and reserve it for the rare tasks that require root",
            "Share its credentials with the whole team",
            "Delete it after creating the account",
          ],
          answer: [1],
          explain: "Root can do anything and can't be limited — so protect it with MFA and park it. Daily work happens through IAM identities with least privilege.",
        },
        {
          q: "Fifty developers need identical AWS permissions. The best-practice approach is…",
          options: [
            "Attach fifty individual policies, one per user",
            "Create a Developers group, attach the policy to it, and add the users",
            "Share one IAM user among all fifty",
            "Give them the root password",
          ],
          answer: [1],
          explain: "Groups are the scaling mechanism for permissions: one policy attachment, membership handles the rest. Shared credentials are never a best practice.",
        },
        {
          q: "IAM policies are written as…",
          options: ["JSON documents", "Excel spreadsheets", "Python scripts", "Email requests to AWS"],
          answer: [0],
          explain: "Policies are JSON: effect (allow/deny) + actions + resources. You'll recognize, not write, them at CCP level.",
        },
        {
          q: "The principle of least privilege means…",
          options: [
            "Everyone gets admin access to move fast",
            "Grant only the minimum permissions required to perform a task",
            "Only the root user does any work",
            "Permissions expire daily",
          ],
          answer: [1],
          explain: "Minimum necessary access — the phrase the exam wants in every permissions scenario.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "IAM part 2 — roles, MFA, and federated sign-in",
      minutes: 5,
      html: `
        <p>Three more IAM ideas complete the picture:</p>
        <ul>
          <li><strong>IAM roles</strong> — identities with permissions but <strong>NO permanent credentials</strong>. They're <strong>assumed temporarily</strong> — by AWS services, by users, even by other accounts. THE classic case: an EC2 instance needs to read S3. Wrong answer: store access keys on the instance. Right answer: <strong>attach a role</strong> — temporary credentials are delivered and rotated automatically.</li>
          <li><strong>MFA (multi-factor authentication)</strong> — password + a second factor (authenticator app, hardware key). Best practice for root AND privileged users. "Something you know + something you have."</li>
          <li><strong>IAM Identity Center</strong> (successor to AWS SSO) — <strong>one sign-in for your whole workforce</strong> across MULTIPLE AWS accounts and business apps, connectable to an existing identity provider (like Active Directory). The answer for "centrally manage sign-in across many accounts."</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        The role question appears on nearly every exam: "<em>an application on EC2 needs access to S3/DynamoDB — what's the secure way?</em>" → <strong>IAM role attached to the instance</strong>. Any answer mentioning access keys stored on the server, in code, or in a file is wrong. "SSO across many AWS accounts" → <strong>IAM Identity Center</strong>.</div>
      `,
      quiz: [
        {
          q: "An application on an EC2 instance must read from an S3 bucket. What is the SECURE, recommended way to grant access?",
          options: [
            "Hard-code an IAM user's access keys in the application",
            "Attach an IAM role to the EC2 instance",
            "Use the root user's credentials",
            "Make the bucket public",
          ],
          answer: [1],
          explain: "Roles provide automatic, temporary, rotated credentials — no secrets to store or leak. Hard-coded keys are the exam's favorite wrong answer.",
        },
        {
          q: "What distinguishes an IAM role from an IAM user?",
          options: [
            "Roles cost money; users are free",
            "A role has no permanent credentials and is assumed temporarily",
            "Roles can't have policies",
            "Users are only for services",
          ],
          answer: [1],
          explain: "Users = long-term identities with passwords/keys. Roles = temporary hats that services or people put on, with credentials that auto-expire.",
        },
        {
          q: "MFA strengthens sign-in by requiring…",
          options: [
            "Two different passwords",
            "A password plus a second factor like an authenticator-app code",
            "A longer username",
            "Approval from AWS Support",
          ],
          answer: [1],
          explain: "Something you know (password) + something you have (device/token). A stolen password alone is no longer enough.",
        },
        {
          q: "A company with 12 AWS accounts wants employees to sign in ONCE and access all of them centrally. Which service?",
          options: ["IAM Identity Center", "Amazon Cognito", "AWS Artifact", "Security groups"],
          answer: [0],
          explain: "IAM Identity Center = workforce single sign-on across multiple accounts and apps, pluggable into your existing directory. (Cognito, for contrast, handles sign-in for your app's CUSTOMERS.)",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Encryption — KMS, ACM, Secrets Manager",
      minutes: 5,
      html: `
        <p>Encryption scrambles data so it's useless without the key. Two states to protect:</p>
        <ul>
          <li><strong>At rest</strong> — data sitting in storage (S3, EBS, RDS…). One checkbox in most AWS services.</li>
          <li><strong>In transit</strong> — data moving over networks, protected by TLS/HTTPS.</li>
        </ul>
        <p>The key-and-secret services:</p>
        <table>
          <tr><th>Service</th><th>Job</th><th>Trigger phrase</th></tr>
          <tr><td><strong>AWS KMS</strong></td><td>Create and manage <strong>encryption keys</strong>; integrates with practically every AWS service for at-rest encryption</td><td>"managed encryption keys"</td></tr>
          <tr><td><strong>AWS CloudHSM</strong></td><td><strong>Dedicated hardware</strong> security modules, single-tenant, for strict compliance</td><td>"dedicated hardware key storage"</td></tr>
          <tr><td><strong>AWS Certificate Manager (ACM)</strong></td><td>Provision and auto-renew <strong>TLS/SSL certificates</strong> (free for AWS-facing use)</td><td>"HTTPS certificates"</td></tr>
          <tr><td><strong>AWS Secrets Manager</strong></td><td>Store secrets (DB passwords, API keys) and <strong>rotate them automatically</strong></td><td>"store and rotate credentials"</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Remember from the Shared Responsibility Model: AWS provides the encryption TOOLS, but <strong>choosing to encrypt your data is a customer responsibility</strong>. "Automatically rotate database passwords" → <strong>Secrets Manager</strong>. "Manage keys for encrypting data at rest" → <strong>KMS</strong>.</div>
      `,
      quiz: [
        {
          q: "Which service creates and manages the encryption keys used to encrypt data at rest across AWS services?",
          options: ["AWS KMS", "AWS WAF", "Amazon Inspector", "AWS Artifact"],
          answer: [0],
          explain: "Key Management Service is the key factory and vault, wired into S3, EBS, RDS, and nearly everything else.",
        },
        {
          q: "A team wants database passwords stored centrally and rotated automatically on a schedule. Which service?",
          options: ["AWS Secrets Manager", "Amazon S3", "AWS CloudTrail", "IAM groups"],
          answer: [0],
          explain: "Secrets Manager stores, retrieves, and auto-rotates credentials — no more passwords pasted into config files.",
        },
        {
          q: "Encrypting data moving between a user's browser and your website (HTTPS) protects data…",
          options: ["At rest", "In transit", "In memory only", "It doesn't protect anything"],
          answer: [1],
          explain: "Moving data = in transit = TLS/HTTPS (certificates via ACM). Data sitting in storage = at rest (keys via KMS).",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Network protection — WAF and Shield",
      minutes: 4,
      html: `
        <p>Two services guard your applications from hostile traffic — and the exam loves asking which handles which attack:</p>
        <ul>
          <li><strong>AWS WAF (Web Application Firewall)</strong> — inspects <strong>web requests</strong> and blocks malicious patterns: <strong>SQL injection</strong>, <strong>cross-site scripting (XSS)</strong>, requests from specific IPs or countries. It attaches to CloudFront, Application Load Balancers, and API Gateway.</li>
          <li><strong>AWS Shield</strong> — protection against <strong>DDoS attacks</strong> (flooding your app with traffic to knock it over). Two tiers:
            <ul>
              <li><strong>Shield Standard</strong> — automatic, <strong>free</strong>, always on for everyone.</li>
              <li><strong>Shield Advanced</strong> — paid: bigger-attack protection, 24/7 access to the AWS response team, and cost protection against attack-driven usage spikes.</li>
            </ul></li>
        </ul>
        <div class="callout"><b>Which guard for which attack?</b>
        Malicious REQUEST CONTENT (injection, XSS, bad bots) → <strong>WAF</strong>. Overwhelming VOLUME (DDoS) → <strong>Shield</strong>. They complement each other and are often used together.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "SQL injection / cross-site scripting" → <strong>WAF</strong>, every time. "DDoS" → <strong>Shield</strong>, every time. "Free automatic DDoS protection" → <strong>Shield Standard</strong>; "24/7 DDoS response team + cost protection" → <strong>Shield Advanced</strong>.</div>
      `,
      quiz: [
        {
          q: "A security review requires blocking SQL injection and cross-site scripting attacks against a web application behind an ALB. Which service?",
          options: ["AWS Shield", "AWS WAF", "Amazon GuardDuty", "AWS KMS"],
          answer: [1],
          explain: "Malicious request patterns = WAF's territory. It filters web traffic at CloudFront, ALB, or API Gateway.",
        },
        {
          q: "Which protection does EVERY AWS customer get automatically, at no charge?",
          options: ["Shield Advanced", "Shield Standard DDoS protection", "A dedicated security team", "Free penetration testing"],
          answer: [1],
          explain: "Shield Standard is on by default for everyone. Advanced is the paid tier with the response team and cost protection.",
        },
        {
          q: "A gaming company suffers frequent large DDoS attacks and wants 24/7 expert response plus protection from attack-related cost spikes. It should buy…",
          options: ["AWS Shield Advanced", "AWS WAF alone", "Amazon Macie", "AWS Config"],
          answer: [0],
          explain: "Those two perks — DDoS response team access and cost protection — are Shield Advanced's signature features.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b6",
      title: "The watchers — GuardDuty, Inspector, Macie, Security Hub, Detective",
      minutes: 6,
      html: `
        <p>Five detection services with confusingly similar vibes. The exam tests whether you can match each to its ONE job:</p>
        <table>
          <tr><th>Service</th><th>Its one job</th><th>Memory hook</th></tr>
          <tr><td><strong>Amazon GuardDuty</strong></td><td><strong>Threat detection</strong> — ML analysis of account activity (CloudTrail, VPC flow, DNS logs) to spot attacks and compromised resources</td><td>The guard dog watching for intruders</td></tr>
          <tr><td><strong>Amazon Inspector</strong></td><td><strong>Vulnerability scanning</strong> — checks EC2 instances, container images, and Lambda for known software vulnerabilities and unintended network exposure</td><td>The building inspector finding weak spots</td></tr>
          <tr><td><strong>Amazon Macie</strong></td><td><strong>Sensitive-data discovery</strong> — ML that finds PII (names, card numbers) in your <strong>S3 buckets</strong></td><td>Macie finds your Personal Info</td></tr>
          <tr><td><strong>AWS Security Hub</strong></td><td><strong>Aggregator</strong> — one dashboard collecting findings from GuardDuty, Inspector, Macie, and more, scored against best practices</td><td>The hub where all alerts meet</td></tr>
          <tr><td><strong>Amazon Detective</strong></td><td><strong>Investigation</strong> — digs into a finding's root cause: what happened, when, how far it spread</td><td>The detective works the case afterward</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Keyword → answer: "threat detection / unusual API activity" → <strong>GuardDuty</strong> · "software vulnerabilities on EC2" → <strong>Inspector</strong> · "PII in S3" → <strong>Macie</strong> · "single pane of glass for security findings" → <strong>Security Hub</strong> · "investigate root cause" → <strong>Detective</strong>.</div>
      `,
      quiz: [
        {
          q: "Which service uses machine learning to continuously monitor for malicious activity, like unusual API calls or communication with known bad IPs?",
          options: ["Amazon GuardDuty", "Amazon Macie", "AWS WAF", "AWS Artifact"],
          answer: [0],
          explain: "GuardDuty is the threat detector, chewing through CloudTrail/VPC/DNS logs for signs of compromise.",
        },
        {
          q: "A compliance team must find any unprotected personally identifiable information (PII) stored across hundreds of S3 buckets. Which service?",
          options: ["Amazon Inspector", "Amazon Macie", "AWS Shield", "AWS KMS"],
          answer: [1],
          explain: "Macie = ML-powered sensitive-data discovery in S3. PII + S3 in the same sentence is the giveaway.",
        },
        {
          q: "Which service scans EC2 instances and container images for known software vulnerabilities?",
          options: ["Amazon Detective", "Amazon Inspector", "AWS Security Hub", "Amazon Neptune"],
          answer: [1],
          explain: "Inspector = automated vulnerability assessment for your compute (EC2, ECR images, Lambda).",
        },
        {
          q: "A CISO wants ONE dashboard aggregating security findings from GuardDuty, Inspector, and Macie with compliance scores. Which service?",
          options: ["AWS Security Hub", "Amazon CloudWatch", "AWS Config", "Amazon Detective"],
          answer: [0],
          explain: "Security Hub is the aggregation layer — the 'single pane of glass' phrase in a security context points straight at it.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b7",
      title: "Proving it — compliance and AWS Artifact",
      minutes: 4,
      html: `
        <p>Regulated industries must PROVE their infrastructure meets standards — PCI DSS (payments), HIPAA (health), SOC reports, ISO 27001, GDPR (EU privacy). How does that work on AWS?</p>
        <ul>
          <li>AWS gets its infrastructure <strong>audited and certified</strong> against dozens of global standards. You <strong>inherit</strong> those infrastructure certifications — you don't audit AWS's data centers yourself (you couldn't; nobody tours them).</li>
          <li><strong>AWS Artifact</strong> is the <strong>self-service portal for AWS's compliance documents</strong>: download SOC reports, PCI attestations, ISO certificates, and sign agreements (like a HIPAA BAA) on demand. It's free. Hand these to YOUR auditors.</li>
          <li>Shared responsibility applies here too: AWS's certifications cover the infrastructure; <strong>configuring YOUR workloads compliantly is still your job</strong>.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Where can a company <strong>download AWS's compliance reports</strong> (SOC/PCI/ISO) for its auditors?" → <strong>AWS Artifact</strong>. That one phrasing covers nearly every Artifact question ever written. Don't confuse it with Audit Manager (automates collecting evidence about YOUR usage — just recognize the name).</div>
      `,
      quiz: [
        {
          q: "An auditor asks for AWS's SOC 2 report and PCI DSS attestation. Where does the company get them?",
          options: ["AWS Artifact", "Amazon Inspector", "AWS Support tickets only", "The AWS marketing site"],
          answer: [0],
          explain: "Artifact = on-demand, self-service downloads of AWS's compliance reports and agreements. Free, instant, made for exactly this request.",
        },
        {
          q: "AWS holds an ISO 27001 certification for its infrastructure. What does this mean for a customer's own compliance?",
          options: [
            "The customer is automatically fully compliant",
            "The customer inherits AWS's infrastructure certification but must still configure its own workloads compliantly",
            "Compliance is impossible on AWS",
            "Only the root user is compliant",
          ],
          answer: [1],
          explain: "Shared responsibility, compliance edition: AWS covers the infrastructure's certification; your configurations and data handling remain on you.",
        },
        {
          q: "AWS Artifact is best described as…",
          options: [
            "A vulnerability scanner",
            "A self-service portal for AWS compliance reports and agreements",
            "A backup service",
            "A DDoS protection tier",
          ],
          answer: [1],
          explain: "Reports (SOC, PCI, ISO) + agreements (e.g., HIPAA BAA), downloadable any time. That's the whole service — and it's on the exam constantly.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>Shared Responsibility Model</strong>: AWS secures the cloud itself (facilities, hardware, hypervisor, managed-service software); you secure what's IN it (data, IAM, security groups, encryption choices, EC2 guest OS patching). More managed service = less on you — but data and access control are ALWAYS yours.",
    "<strong>Root user</strong>: MFA it, lock it away, never use it daily. <strong>IAM is global and free.</strong>",
    "IAM building blocks: <strong>users</strong> (long-term identities) → organize into <strong>groups</strong> → permissions via JSON <strong>policies</strong> → grant the minimum (<strong>least privilege</strong>).",
    "<strong>Roles</strong> = temporary, credential-less identities. EC2-needs-S3? Attach a role — never store access keys on instances. <strong>IAM Identity Center</strong> = workforce SSO across many accounts.",
    "Encryption: at rest (<strong>KMS</strong> keys; <strong>CloudHSM</strong> for dedicated hardware) · in transit (TLS certs from <strong>ACM</strong>) · secrets stored + auto-rotated in <strong>Secrets Manager</strong>. Choosing to encrypt = customer responsibility.",
    "<strong>WAF</strong> blocks malicious request content (SQL injection, XSS) · <strong>Shield</strong> fights DDoS (Standard = free/automatic; Advanced = response team + cost protection).",
    "The watchers: <strong>GuardDuty</strong> threat detection · <strong>Inspector</strong> vulnerability scans · <strong>Macie</strong> PII in S3 · <strong>Security Hub</strong> aggregates findings · <strong>Detective</strong> investigates root cause.",
    "<strong>AWS Artifact</strong> = download AWS's compliance reports (SOC, PCI, ISO) and sign agreements. You inherit infrastructure certifications; compliant configuration is still your job.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Under the Shared Responsibility Model, which are CUSTOMER responsibilities? (Select TWO)",
        options: [
          "Configuring IAM users and permissions",
          "Maintaining the physical network cables",
          "Patching the guest OS on EC2 instances",
          "Patching the hypervisor",
        ],
        answer: [0, 2],
        explain: "IAM configuration and EC2 guest-OS patching sit on your side of the line. Physical infrastructure and the hypervisor are AWS's, always.",
      },
      {
        q: "Which task shifts from customer to AWS when moving a database from EC2 to Amazon RDS?",
        options: [
          "Choosing what data to store",
          "Patching the database's underlying operating system",
          "Granting users access to the data",
          "Classifying data sensitivity",
        ],
        answer: [1],
        explain: "That's the managed-service effect: RDS takes over OS/engine patching. Data, access, and classification never shift.",
      },
      {
        q: "What should be done with the root user immediately after creating an AWS account? (Select TWO)",
        options: [
          "Enable multi-factor authentication on it",
          "Use it for all daily operations",
          "Create IAM identities for everyday work",
          "Email its password to the team",
        ],
        answer: [0, 2],
        explain: "MFA the root user, then step away from it — day-to-day work belongs to least-privilege IAM identities.",
      },
      {
        q: "An application running on EC2 needs to write to DynamoDB. The security best practice is to…",
        options: [
          "Store an IAM user's access keys in the application code",
          "Attach an IAM role to the instance",
          "Use the root user's access keys",
          "Disable authentication on DynamoDB",
        ],
        answer: [1],
        explain: "Roles deliver auto-rotated temporary credentials to the instance. Credentials-in-code is the perennial wrong answer.",
      },
      {
        q: "IAM policies are…",
        options: [
          "JSON documents defining allowed or denied actions on resources",
          "Physical security badges",
          "Monthly billing statements",
          "Network firewall appliances",
        ],
        answer: [0],
        explain: "Policy = JSON permission document, attachable to users, groups, and roles.",
      },
      {
        q: "Which service provides single sign-on for employees across multiple AWS accounts?",
        options: ["IAM Identity Center", "AWS Artifact", "Amazon GuardDuty", "AWS CloudHSM"],
        answer: [0],
        explain: "IAM Identity Center (ex-AWS SSO) = one workforce login, centrally managed access to all your accounts.",
      },
      {
        q: "A company must encrypt data at rest in S3 and EBS using centrally managed keys. Which service manages the keys?",
        options: ["AWS KMS", "AWS WAF", "Amazon Detective", "AWS Shield"],
        answer: [0],
        explain: "KMS is the managed key service integrated across AWS storage and database services for at-rest encryption.",
      },
      {
        q: "Which service automatically rotates database credentials on a schedule?",
        options: ["AWS Secrets Manager", "AWS Artifact", "Amazon Macie", "AWS Batch"],
        answer: [0],
        explain: "Secrets Manager stores secrets and rotates them automatically — its differentiating feature.",
      },
      {
        q: "A web application must be protected from SQL injection and cross-site scripting. Which service does this?",
        options: ["AWS Shield Standard", "AWS WAF", "Amazon GuardDuty", "AWS KMS"],
        answer: [1],
        explain: "Request-content attacks = WAF. Shield handles volume (DDoS); GuardDuty detects threats but doesn't filter web requests.",
      },
      {
        q: "Which DDoS protection is included free and automatically for all AWS customers?",
        options: ["AWS Shield Standard", "AWS Shield Advanced", "AWS WAF", "Amazon Inspector"],
        answer: [0],
        explain: "Shield Standard is always on for everyone. Advanced is the paid tier adding the 24/7 response team and cost protection.",
      },
      {
        q: "Match the need: 'Detect compromised instances and unusual API activity using ML analysis of logs.'",
        options: ["Amazon GuardDuty", "Amazon Macie", "AWS Config", "AWS Artifact"],
        answer: [0],
        explain: "Threat detection from CloudTrail/VPC/DNS log analysis = GuardDuty, the guard dog.",
      },
      {
        q: "Match the need: 'Discover credit card numbers accidentally stored in S3 buckets.'",
        options: ["Amazon Inspector", "Amazon Macie", "AWS Security Hub", "AWS Shield"],
        answer: [1],
        explain: "Sensitive data (PII) discovery in S3 = Macie. Inspector scans compute for vulnerabilities, not buckets for data.",
      },
      {
        q: "A security team wants one consolidated view of findings from multiple AWS security services, scored against standards. Which service?",
        options: ["AWS Security Hub", "Amazon Detective", "AWS Artifact", "Amazon Timestream"],
        answer: [0],
        explain: "Security Hub aggregates GuardDuty/Inspector/Macie findings into a single prioritized dashboard.",
      },
      {
        q: "Where does a customer obtain AWS's PCI DSS attestation and SOC reports for an audit?",
        options: ["AWS Artifact", "AWS Secrets Manager", "The AWS forums", "Amazon ECR"],
        answer: [0],
        explain: "Artifact = the compliance-document vending machine. Auditor asks, you download, done.",
      },
    ],
  },
});
