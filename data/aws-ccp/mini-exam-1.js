/* ============================================================
   AWS CCP — Week 1 Mini-Exam
   Day 7 · 20 fresh questions spanning Chapters 1–5.
   Checkpoint: no bursts, straight to the exam.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "mini1",
  title: "Week 1 Mini-Exam",

  bursts: [],

  overview: [
    "<strong>20 questions</strong> covering everything from Week 1 — Chapters 1–5. Pass mark 70%, just like chapter exams.",
    "Coverage: cloud concepts &amp; economics (Ch 1) · Regions, AZs, edge, resilience vocabulary (Ch 2) · EC2, pricing models, Lambda, containers (Ch 3) · S3, EBS, EFS, Snow, gateways (Ch 4) · VPC, SG vs NACL, VPN/DX, Route 53, CloudFront (Ch 5).",
    "These are <strong>fresh questions</strong> — not repeats from the chapter exams. Expect a few Select-TWO.",
    "Score under 70%? No drama — the review screen shows exactly which chapters to revisit, and you can retake any time.",
  ],

  exam: {
    passPct: 70,
    questions: [
      {
        q: "A company shuts down its data center and moves everything to AWS, eliminating hardware refresh cycles and paying monthly based on usage. Which TWO cloud benefits does this illustrate? (Select TWO)",
        options: [
          "Trading capital expense for variable expense",
          "Increased hardware ownership",
          "No longer maintaining physical data centers",
          "Guaranteed fixed IT costs forever",
        ],
        answer: [0, 2],
        explain: "Ch 1: CapEx→OpEx and goodbye-data-centers are two of the six advantages. Cloud bills are variable, not fixed — that's the point.",
      },
      {
        q: "Which service model gives AWS responsibility for the operating system, runtime, AND application — you just use the software?",
        options: ["IaaS", "PaaS", "SaaS", "On-premises"],
        answer: [2],
        explain: "Ch 1: SaaS is the finished product (think Gmail). IaaS hands you the OS; PaaS hands you a code platform.",
      },
      {
        q: "A pharma company must keep clinical data within Canada while also wanting low latency for its Toronto staff. What satisfies BOTH needs?",
        options: [
          "Deploying in the Canada Region",
          "Deploying in the cheapest Region",
          "Using more edge locations",
          "Buying Reserved Instances",
        ],
        answer: [0],
        explain: "Ch 2: Region choice solves compliance (data residency) and proximity at once — pick the Region where the law and the users are.",
      },
      {
        q: "Each AWS Availability Zone is…",
        options: [
          "A separate continent",
          "One or more discrete data centers with independent power and networking",
          "A marketing name for a server rack",
          "Shared infrastructure with other cloud providers",
        ],
        answer: [1],
        explain: "Ch 2: AZ = isolated data-center cluster(s) within a Region, connected to sibling AZs by private fiber.",
      },
      {
        q: "An architecture spans three AZs behind a load balancer with Auto Scaling. A whole data center loses power and users notice nothing. This design achieved…",
        options: ["Vertical scaling", "High availability", "Data residency", "Lower durability"],
        answer: [1],
        explain: "Ch 2+3: Multi-AZ + ELB + Auto Scaling is the HA blueprint — no single point of failure, traffic shifts to survivors.",
      },
      {
        q: "Which scenario is the BEST fit for Spot Instances?",
        options: [
          "A production payment database",
          "Overnight image-rendering jobs that checkpoint and resume freely",
          "A customer-facing API requiring 100% uptime",
          "A licensing-restricted app needing dedicated hardware",
        ],
        answer: [1],
        explain: "Ch 3: Spot = up to 90% off for interruption-tolerant work. Databases and always-on APIs can't accept 2-minute-warning evictions.",
      },
      {
        q: "A workload runs steadily 24/7 and the team can commit to three years but wants freedom to change instance families and even move some work to Fargate. Best discount vehicle?",
        options: ["Standard Reserved Instances", "Compute Savings Plans", "On-Demand", "Spot"],
        answer: [1],
        explain: "Ch 3: Savings Plans commit $/hour, not a machine — the flexible commitment discount that follows the workload across compute types.",
      },
      {
        q: "Which TWO are true of AWS Lambda? (Select TWO)",
        options: [
          "Charges accrue even when idle",
          "Executions are capped at 15 minutes",
          "It scales automatically with incoming events",
          "You must patch its underlying servers monthly",
        ],
        answer: [1, 2],
        explain: "Ch 3: Lambda auto-scales, bills only while running, needs zero server care, and caps runs at 15 minutes.",
      },
      {
        q: "A team wants managed Kubernetes without running containers on servers they manage. Which combination?",
        options: [
          "EKS on Fargate",
          "ECR on Lightsail",
          "EC2 with an AMI",
          "Beanstalk on Outposts",
        ],
        answer: [0],
        explain: "Ch 3: Kubernetes → EKS; serverless container compute → Fargate. Together: managed K8s with no instances to babysit.",
      },
      {
        q: "Which storage type does Amazon S3 provide?",
        options: ["Block storage", "Object storage", "File storage", "Tape storage"],
        answer: [1],
        explain: "Ch 4: S3 = objects in buckets via API. EBS is block; EFS/FSx are file.",
      },
      {
        q: "Surveillance footage must be kept 7 years for legal reasons, is essentially never watched, and retrieval can wait half a day. The MOST cost-effective class is…",
        options: ["S3 Standard", "S3 Standard-IA", "S3 Glacier Deep Archive", "S3 Intelligent-Tiering"],
        answer: [2],
        explain: "Ch 4: never-accessed + long retention + hours-OK retrieval = Deep Archive, the cheapest tier in S3.",
      },
      {
        q: "An EBS volume in us-east-1a must provide storage for an instance in us-east-1b. What must happen?",
        options: [
          "Attach it directly across AZs",
          "Snapshot the volume and restore it in us-east-1b",
          "Convert it to a security group",
          "Nothing — volumes span all AZs",
        ],
        answer: [1],
        explain: "Ch 4: EBS is AZ-bound. Snapshots are the vehicle for moving volumes between AZs (or Regions).",
      },
      {
        q: "Which service provides a shared elastic file system that many Linux instances across multiple AZs can mount simultaneously?",
        options: ["Amazon EBS", "Amazon EFS", "Instance store", "Amazon ECR"],
        answer: [1],
        explain: "Ch 4: shared + Linux + multi-AZ = EFS. EBS attaches to one instance; instance store is ephemeral local disk.",
      },
      {
        q: "A mining site with no reliable internet must both process sensor data locally and eventually ship 200 TB to AWS. Which service handles this?",
        options: ["AWS Storage Gateway", "AWS Snowball Edge", "AWS DataSync over satellite", "Amazon CloudFront"],
        answer: [1],
        explain: "Ch 4: disconnected site + huge transfer + local compute = Snowball Edge, the rugged ship-it-physically device.",
      },
      {
        q: "In a standard VPC design, which resource belongs in a PUBLIC subnet?",
        options: ["The relational database", "The internet-facing load balancer", "The app servers", "The EBS volumes"],
        answer: [1],
        explain: "Ch 5: only the front door faces the internet. Databases and app tiers hide in private subnets behind it.",
      },
      {
        q: "Which TWO differences separate security groups from network ACLs? (Select TWO)",
        options: [
          "Security groups are stateful; NACLs are stateless",
          "Security groups protect subnets; NACLs protect instances",
          "NACLs support deny rules; security groups do not",
          "NACLs are stateful; security groups are stateless",
        ],
        answer: [0, 2],
        explain: "Ch 5: SG = instance-level, stateful, allow-only. NACL = subnet-level, stateless, allow+deny. Options B and D flip the facts.",
      },
      {
        q: "Private-subnet instances need outbound internet access for patches while staying unreachable from outside. Add a…",
        options: ["NAT Gateway", "second Internet Gateway", "VPC peering connection", "Dedicated Host"],
        answer: [0],
        explain: "Ch 5: NAT Gateway = the one-way door. Out yes, in no.",
      },
      {
        q: "A brokerage requires a connection to AWS with consistent sub-10ms latency that never touches the public internet. It should order…",
        options: ["A Site-to-Site VPN", "AWS Direct Connect", "AWS Client VPN", "A VPC endpoint"],
        answer: [1],
        explain: "Ch 5: dedicated private physical circuit = Direct Connect. VPNs are encrypted but ride the unpredictable public internet.",
      },
      {
        q: "Route 53 is configured to send users to a secondary Region only when health checks report the primary as unhealthy. This is ______ routing.",
        options: ["weighted", "geolocation", "failover", "simple"],
        answer: [2],
        explain: "Ch 5: health-check-driven standby switchover = failover routing, DNS-level disaster recovery.",
      },
      {
        q: "A global news site is slow for readers far from its origin servers. Which service most directly speeds up delivery of its pages, images, and videos?",
        options: ["Amazon CloudFront", "AWS Global Accelerator", "AWS Transit Gateway", "Amazon EFS"],
        answer: [0],
        explain: "Ch 2+5: cacheable CONTENT served globally = CloudFront at the edge locations. Global Accelerator optimizes app traffic paths but doesn't cache pages.",
      },
    ],
  },
});
