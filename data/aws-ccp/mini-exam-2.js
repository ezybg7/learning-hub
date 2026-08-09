/* ============================================================
   AWS CCP — Week 2 Mini-Exam
   Day 14 · 25 fresh questions, Chapters 6–10, deliberately
   security-heavy (that domain is 30% of the real exam).
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "mini2",
  title: "Week 2 Mini-Exam",

  bursts: [],

  overview: [
    "<strong>25 questions</strong> across Chapters 6–10, weighted the way the real exam weighs things: <strong>security-heavy</strong> (~10 questions), because Security &amp; Compliance is 30% of CLF-C02.",
    "Coverage: databases (Ch 6) · Shared Responsibility, IAM, encryption, protection &amp; detection services (Ch 7) · CloudWatch/CloudTrail/Config, Trusted Advisor, Systems Manager, CloudFormation (Ch 8) · Organizations, SCPs, consolidated billing (Ch 9) · pricing tools, support plans, Marketplace (Ch 10).",
    "All fresh questions — nothing recycled from chapter exams. Expect several Select-TWO.",
    "Pass mark 70%. Score the review carefully: each explanation names the chapter to revisit.",
  ],

  exam: {
    passPct: 70,
    questions: [
      {
        q: "An online store needs a managed relational database for order transactions, with automatic failover if an AZ fails. Which configuration?",
        options: [
          "RDS with Multi-AZ enabled",
          "RDS with read replicas only",
          "DynamoDB global tables",
          "Redshift with two nodes",
        ],
        answer: [0],
        explain: "Ch 6: relational + transactions = RDS; surviving AZ failure = Multi-AZ standby with automatic failover. Read replicas scale reads — they aren't the failover feature.",
      },
      {
        q: "A serverless API built on Lambda needs a database that scales automatically with zero servers to manage and millisecond key-based lookups. Choose the best fit.",
        options: ["Amazon DynamoDB", "RDS for PostgreSQL", "Amazon Redshift", "Amazon Neptune"],
        answer: [0],
        explain: "Ch 6: serverless + key-value + millisecond + auto-scale = DynamoDB, Lambda's usual partner.",
      },
      {
        q: "Which service should a company use to analyze years of historical sales data with complex SQL for BI dashboards?",
        options: ["Amazon Redshift", "Amazon ElastiCache", "Amazon DocumentDB", "AWS DMS"],
        answer: [0],
        explain: "Ch 6: warehouse-scale analytics (OLAP) = Redshift. ElastiCache is a cache; DMS migrates databases.",
      },
      {
        q: "To reduce repeated read pressure on an RDS database, a team adds an in-memory caching layer. Which service?",
        options: ["Amazon ElastiCache", "Amazon Timestream", "AWS Storage Gateway", "Amazon FSx"],
        answer: [0],
        explain: "Ch 6: microsecond in-memory caching in front of a database = ElastiCache (Redis/Memcached).",
      },
      {
        q: "Under the Shared Responsibility Model, which items belong to AWS? (Select TWO)",
        options: [
          "Physical security of data center facilities",
          "A customer's S3 bucket permissions",
          "Maintenance of the hypervisor",
          "Patching the guest OS on a customer's EC2 instance",
        ],
        answer: [0, 2],
        explain: "Ch 7: facilities and hypervisor = security OF the cloud (AWS). Bucket permissions and EC2 guest-OS patches = IN the cloud (customer).",
      },
      {
        q: "Which of these is ALWAYS the customer's responsibility, no matter how managed the service is?",
        options: [
          "Data classification and access decisions",
          "Rack-and-stack of servers",
          "Hypervisor patching",
          "Data center power redundancy",
        ],
        answer: [0],
        explain: "Ch 7: your data and who may touch it never transfers to AWS — the constant on the customer side of the line.",
      },
      {
        q: "A new AWS account is being secured. Which TWO actions are best practices? (Select TWO)",
        options: [
          "Enable MFA on the root user",
          "Use the root user for daily deployments",
          "Create least-privilege IAM identities for daily work",
          "Email the root password to managers",
        ],
        answer: [0, 2],
        explain: "Ch 7: MFA the root user, then set it aside; day-to-day work happens under least-privilege IAM identities.",
      },
      {
        q: "An EC2-hosted app needs to read a DynamoDB table. The secure mechanism is…",
        options: [
          "An IAM role attached to the instance",
          "Access keys pasted into the app's config file",
          "The root user's credentials",
          "Making the table public",
        ],
        answer: [0],
        explain: "Ch 7: roles = temporary, auto-rotated credentials, nothing stored on disk. Keys-in-config is the standing wrong answer.",
      },
      {
        q: "A company wants malicious web requests — SQL injection and XSS — blocked before reaching its application, AND wants protection from large DDoS floods. Which pair?",
        options: [
          "AWS WAF and AWS Shield",
          "Amazon Macie and AWS KMS",
          "AWS Config and CloudTrail",
          "Amazon Inspector and AWS Batch",
        ],
        answer: [0],
        explain: "Ch 7: request-content attacks → WAF; volumetric DDoS → Shield. They're complementary layers, often deployed together.",
      },
      {
        q: "Which service continuously analyzes CloudTrail, VPC Flow Logs, and DNS logs with machine learning to detect threats like compromised credentials?",
        options: ["Amazon GuardDuty", "Amazon Macie", "AWS Artifact", "AWS Secrets Manager"],
        answer: [0],
        explain: "Ch 7: intelligent threat detection over account activity = GuardDuty, the guard dog.",
      },
      {
        q: "Before a product launch, security wants EC2 instances scanned for unpatched software vulnerabilities. Which service?",
        options: ["Amazon Inspector", "Amazon Detective", "AWS Shield", "AWS Budgets"],
        answer: [0],
        explain: "Ch 7: vulnerability assessment of compute (EC2, container images, Lambda) = Inspector.",
      },
      {
        q: "A privacy audit requires locating any social security numbers stored in S3. Which service is purpose-built for this?",
        options: ["Amazon Macie", "AWS WAF", "Amazon CloudWatch", "AWS Control Tower"],
        answer: [0],
        explain: "Ch 7: ML-driven PII discovery in S3 = Macie. Sensitive data + S3 = Macie, every time.",
      },
      {
        q: "Encryption keys for data at rest should be centrally created and managed. TLS certificates for HTTPS should be provisioned and auto-renewed. Which pair of services?",
        options: [
          "AWS KMS and AWS Certificate Manager",
          "AWS Shield and AWS WAF",
          "Amazon Inspector and Amazon Macie",
          "AWS Config and AWS Artifact",
        ],
        answer: [0],
        explain: "Ch 7: keys → KMS; TLS/SSL certificates → ACM. At rest and in transit, respectively.",
      },
      {
        q: "Where does a company download AWS's ISO certifications and SOC reports to hand to its auditors?",
        options: ["AWS Artifact", "AWS Marketplace", "Cost Explorer", "Amazon ECR"],
        answer: [0],
        explain: "Ch 7: Artifact is the self-service compliance-document portal — the inheritance paperwork for audits.",
      },
      {
        q: "Which service answers 'Who deleted the RDS instance, and from which IP address?'",
        options: ["AWS CloudTrail", "Amazon CloudWatch", "AWS Trusted Advisor", "Amazon Route 53"],
        answer: [0],
        explain: "Ch 8: who-did-what API auditing = CloudTrail. CloudWatch would only show the performance metrics going quiet.",
      },
      {
        q: "A team needs dashboards of application metrics, plus an alarm that adds instances when CPU crosses 75%. Which service (with Auto Scaling)?",
        options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Config", "AWS Artifact"],
        answer: [0],
        explain: "Ch 8: metrics, dashboards, and actionable alarms = CloudWatch — the trigger side of elasticity.",
      },
      {
        q: "Compliance requires proof that no security group has ever allowed unrestricted SSH, with a full timeline of configuration changes. Which service provides this?",
        options: ["AWS Config", "Amazon GuardDuty", "AWS Batch", "Amazon EFS"],
        answer: [0],
        explain: "Ch 8: configuration history + compliance rules = Config. It watches settings over time; CloudTrail watches actors.",
      },
      {
        q: "Which service recommendation would you expect from AWS Trusted Advisor?",
        options: [
          "\"These EC2 instances are idle — consider stopping them to save money\"",
          "\"Hire three more engineers\"",
          "\"Switch cloud providers\"",
          "\"Your website's color scheme needs work\"",
        ],
        answer: [0],
        explain: "Ch 8: Trusted Advisor checks cost, performance, security, fault tolerance, and service limits — idle-resource findings are its bread and butter.",
      },
      {
        q: "An ops team wants shell access to private instances without opening SSH ports, plus automated patching across the fleet. Which service delivers both?",
        options: ["AWS Systems Manager", "Amazon CloudFront", "AWS Direct Connect", "Amazon Aurora"],
        answer: [0],
        explain: "Ch 8: Session Manager (portless shell) and Patch Manager are both Systems Manager capabilities — the fleet-ops toolbox.",
      },
      {
        q: "A company defines its full environment in YAML and deploys identical dev, staging, and prod stacks from it. Which service and concept?",
        options: [
          "AWS CloudFormation — infrastructure as code",
          "AWS Config — compliance rules",
          "Amazon ECR — container registry",
          "AWS Backup — recovery plans",
        ],
        answer: [0],
        explain: "Ch 8: templates → identical repeatable environments = CloudFormation, the IaC service (free; pay for created resources).",
      },
      {
        q: "Which TWO does consolidated billing under AWS Organizations provide? (Select TWO)",
        options: [
          "A single bill across all member accounts",
          "Sharing of unused Reserved Instance discounts across accounts",
          "Exemption from all data transfer charges",
          "Automatic Enterprise support for members",
        ],
        answer: [0, 1],
        explain: "Ch 9: one bill + pooled volume tiers + cross-account RI/SP discount sharing. It doesn't waive transfer fees or upgrade support.",
      },
      {
        q: "Security must guarantee that no identity in any development account — administrators included — can disable CloudTrail or leave approved Regions. The mechanism is…",
        options: [
          "Service Control Policies applied via AWS Organizations",
          "A strongly-worded IAM group name",
          "Individual IAM policies in each account",
          "A CloudWatch dashboard",
        ],
        answer: [0],
        explain: "Ch 9: SCPs are the only guardrails that outrank member-account admins — the ceiling IAM can never exceed.",
      },
      {
        q: "A company wants a governed multi-account foundation — guardrails, central logging, account vending — built to AWS best practices with minimal manual assembly. Which service?",
        options: ["AWS Control Tower", "AWS Service Catalog", "Amazon Connect", "AWS Snow Family"],
        answer: [0],
        explain: "Ch 9: Control Tower automates the landing zone that you'd otherwise hand-build from Organizations + SCPs + logging.",
      },
      {
        q: "Finance wants an alert at 90% of the monthly cloud budget, and a breakdown of current spend by department. Which pair?",
        options: [
          "AWS Budgets + Cost Explorer with cost allocation tags",
          "Pricing Calculator + AWS Artifact",
          "CloudWatch + CloudTrail",
          "Trusted Advisor + AWS Config",
        ],
        answer: [0],
        explain: "Ch 10: threshold alerts = Budgets; spend analysis sliced by tags = Cost Explorer + cost allocation tags.",
      },
      {
        q: "A production company needs 24/7 phone support, full Trusted Advisor checks, and <1-hour response for production outages — without paying for a designated TAM. Which plan?",
        options: ["Business", "Developer", "Enterprise", "Basic"],
        answer: [0],
        explain: "Ch 10: that feature set is exactly the Business plan. The designated TAM (and 15-minute response) is what Enterprise adds.",
      },
    ],
  },
});
