/* ============================================================
   AWS CCP — Chapter 3: Compute
   Days 3–4 · EC2 + pricing models, Auto Scaling, Lambda,
   containers, Beanstalk & friends. Two study sessions.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch03",
  num: 3,
  title: "Compute",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "EC2 — renting virtual computers",
      minutes: 5,
      html: `
        <p><strong>Amazon EC2 (Elastic Compute Cloud)</strong> is the service that started it all: rent a virtual computer — called an <strong>instance</strong> — in an AWS data center. You choose its power, its operating system, and what runs on it. It's the classic <strong>IaaS</strong> from Chapter 1.</p>
        <p>Launching an instance involves a few pieces worth naming:</p>
        <ul>
          <li><strong>AMI (Amazon Machine Image)</strong> — the template: OS + pre-installed software. Launch 1 or 100 identical instances from one AMI.</li>
          <li><strong>Instance type</strong> — the hardware size, like <code>t3.micro</code> or <code>m5.large</code>. Families are tuned for different jobs:</li>
        </ul>
        <table>
          <tr><th>Family</th><th>Optimized for</th><th>Example use</th></tr>
          <tr><td><strong>General purpose</strong></td><td>Balanced CPU/memory</td><td>Web servers, small databases</td></tr>
          <tr><td><strong>Compute optimized</strong></td><td>Heavy CPU</td><td>Gaming servers, batch processing, HPC</td></tr>
          <tr><td><strong>Memory optimized</strong></td><td>Lots of RAM</td><td>In-memory databases, big caches</td></tr>
          <tr><td><strong>Storage optimized</strong></td><td>Fast local disk I/O</td><td>Data warehouses, high-frequency databases</td></tr>
          <tr><td><strong>Accelerated computing</strong></td><td>GPUs/special chips</td><td>Machine learning, graphics</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        You will NOT be asked to memorize instance sizes. You WILL see "an application needs enormous amounts of memory for an in-memory database — which instance family?" → <strong>memory optimized</strong>. Match workload → family and you're done.</div>
      `,
      quiz: [
        {
          q: "What is an AMI?",
          options: [
            "A template (OS + software) used to launch EC2 instances",
            "AWS's monthly invoice",
            "A type of load balancer",
            "The physical server EC2 runs on",
          ],
          answer: [0],
          explain: "Amazon Machine Image = the blueprint for an instance. One AMI can stamp out any number of identical servers — handy for scaling out.",
        },
        {
          q: "A scientific simulation needs maximum raw CPU horsepower. Which EC2 instance family fits?",
          options: ["Memory optimized", "Compute optimized", "Storage optimized", "General purpose"],
          answer: [1],
          explain: "CPU-hungry workloads (simulations, batch processing, game servers) → compute optimized. Map the bottleneck to the family name.",
        },
        {
          q: "An in-memory cache needs to hold a huge dataset entirely in RAM. Which family?",
          options: ["Compute optimized", "General purpose", "Memory optimized", "Accelerated computing"],
          answer: [2],
          explain: "RAM-bound = memory optimized. GPUs (accelerated) are for ML/graphics; storage optimized is for disk I/O; general purpose is the balanced default.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "EC2 pricing part 1 — On-Demand, Reserved, Savings Plans",
      minutes: 6,
      html: `
        <p>How you PAY for EC2 is a guaranteed exam topic. First three options:</p>
        <ul>
          <li><strong>On-Demand</strong> — pay by the second/hour, start and stop anytime, zero commitment. The most flexible and the most expensive per hour. For: unpredictable workloads, short experiments, getting started.</li>
          <li><strong>Reserved Instances (RIs)</strong> — commit to a <strong>1-year or 3-year</strong> term for a specific instance type in exchange for a big discount (up to ~72% vs On-Demand). Pay options: all upfront (cheapest), partial upfront, or no upfront. For: steady, predictable workloads like a database that runs 24/7.</li>
          <li><strong>Savings Plans</strong> — the flexible cousin of RIs: commit to spending a certain <strong>$/hour for 1 or 3 years</strong>, and AWS discounts whatever compute you run under it. Compute Savings Plans even let you switch instance families, Regions, or to Fargate/Lambda while keeping the discount.</li>
        </ul>
        <div class="callout"><b>The mental model</b>
        Commitment buys discount. No commitment (On-Demand) = pay premium for freedom. 1–3 year commitment (RIs / Savings Plans) = up to ~72% off for predictability. Longer term + more upfront = bigger discount.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Runs 24/7 for the next 3 years, minimize cost" → <strong>Reserved Instances or Savings Plans</strong> (all-upfront 3-year is the cheapest). "Unpredictable / spiky / short-term" → <strong>On-Demand</strong>. If the answer choices include both RIs and Savings Plans, look for flexibility hints ("may change instance types") → Savings Plans.</div>
      `,
      quiz: [
        {
          q: "A database server will run continuously, 24/7, for at least three years. Which pricing model minimizes its cost?",
          options: ["On-Demand", "A 3-year Reserved Instance (all upfront)", "Spot Instances", "Free Tier"],
          answer: [1],
          explain: "Steady, predictable, long-running = commit and save. A 3-year all-upfront RI gives the deepest standard discount (up to ~72% off On-Demand).",
        },
        {
          q: "A team is prototyping a brand-new app whose usage is completely unpredictable, and may shut it down next month. Which pricing model fits?",
          options: ["3-year Reserved Instances", "On-Demand", "1-year Savings Plan", "Dedicated Hosts"],
          answer: [1],
          explain: "No commitment, start/stop anytime — that flexibility is exactly what On-Demand's higher hourly rate buys you. Committing for a prototype would waste money.",
        },
        {
          q: "What does a Compute Savings Plan require you to commit to?",
          options: [
            "A specific instance type for 3 years",
            "A consistent amount of compute spend ($/hour) for 1 or 3 years",
            "Using only one Region forever",
            "A minimum number of EC2 instances",
          ],
          answer: [1],
          explain: "Savings Plans commit dollars-per-hour, not a specific machine — so you keep the discount even if you change instance families, Regions, or move work to Fargate/Lambda.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "EC2 pricing part 2 — Spot, Dedicated, and choosing wisely",
      minutes: 5,
      html: `
        <p>Two more pricing models complete the set:</p>
        <ul>
          <li><strong>Spot Instances</strong> — bid on AWS's <strong>spare capacity</strong> for discounts up to <strong>90%</strong>. The catch: AWS can <strong>reclaim them with a 2-minute warning</strong> when it needs the capacity back. Perfect for work that can be interrupted and resumed: batch jobs, data analysis, rendering, test environments. Terrible for: databases, anything that must not stop.</li>
          <li><strong>Dedicated Hosts</strong> — an entire physical server reserved for you alone. The expensive option, used for two reasons: <strong>server-bound software licenses</strong> (per-socket/per-core licensing) and strict <strong>compliance rules</strong> forbidding shared hardware. (A related option, Dedicated Instances, isolates your instances on dedicated hardware with less control — host-level visibility is the Dedicated Host difference. For the exam: "licensing/compliance → Dedicated.")</li>
        </ul>
        <table>
          <tr><th>Scenario keyword</th><th>Model</th></tr>
          <tr><td>"unpredictable," "short-term," "no commitment"</td><td>On-Demand</td></tr>
          <tr><td>"steady state," "24/7," "1–3 years," "predictable"</td><td>Reserved / Savings Plans</td></tr>
          <tr><td>"can tolerate interruptions," "fault-tolerant batch," "cheapest possible"</td><td>Spot</td></tr>
          <tr><td>"per-socket license," "compliance requires dedicated hardware"</td><td>Dedicated Hosts</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Spot questions ALWAYS hint interruptibility ("can be stopped and restarted without issue"). If the workload can't tolerate interruption, Spot is a trap answer — don't take the 90% bait.</div>
      `,
      quiz: [
        {
          q: "A rendering farm processes video overnight; jobs can be stopped and re-queued freely. Which pricing model gives the biggest savings?",
          options: ["On-Demand", "Reserved Instances", "Spot Instances", "Dedicated Hosts"],
          answer: [2],
          explain: "Interruption-tolerant batch work is Spot's sweet spot — up to 90% off in exchange for the 2-minute-warning risk.",
        },
        {
          q: "What happens to a Spot Instance when AWS needs the capacity back?",
          options: [
            "Nothing — Spot instances are guaranteed",
            "It can be interrupted/reclaimed with a two-minute warning",
            "It automatically converts to On-Demand",
            "AWS pays you a penalty",
          ],
          answer: [1],
          explain: "Spot = spare capacity. AWS can take it back with a 2-minute notice, which is why only interruption-tolerant workloads belong there.",
        },
        {
          q: "A company's software license is tied to physical CPU sockets, so auditors require visibility into the actual server. Which EC2 option?",
          options: ["Spot Instances", "On-Demand", "Dedicated Hosts", "Savings Plans"],
          answer: [2],
          explain: "Dedicated Hosts give you a whole physical machine with socket/core visibility — the answer for bring-your-own-license and hardware-isolation compliance scenarios.",
        },
        {
          q: "Which pairing is WRONG?",
          options: [
            "Spot → fault-tolerant batch processing",
            "Reserved → steady 24/7 workloads",
            "On-Demand → unpredictable new workloads",
            "Spot → a production database that must never go down",
          ],
          answer: [3],
          explain: "A must-never-stop database on interruptible capacity is the classic exam trap. Everything else is matched correctly.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Auto Scaling + load balancing — elasticity in action",
      minutes: 5,
      html: `
        <p>Two services turn a pile of EC2 instances into a self-managing fleet:</p>
        <ul>
          <li><strong>Amazon EC2 Auto Scaling</strong> — watches demand and <strong>adds instances when busy, removes them when quiet</strong> (this is Chapter 2's "elasticity" made real). It also does health-based replacement: if an instance dies, Auto Scaling launches a replacement automatically. You set a minimum, maximum, and desired count.</li>
          <li><strong>Elastic Load Balancing (ELB)</strong> — the front door: spreads incoming traffic across your healthy instances, <strong>across multiple AZs</strong>, and stops sending traffic to unhealthy ones. Load balancer + Multi-AZ + Auto Scaling = the classic high-availability trio.</li>
        </ul>
        <p>ELB comes in flavors — for now just recognize: <strong>Application Load Balancer (ALB)</strong> for web/HTTP traffic and <strong>Network Load Balancer (NLB)</strong> for extreme-performance TCP traffic. Details in Chapter 5.</p>
        <div class="callout"><b>Why both?</b>
        Auto Scaling changes HOW MANY servers you have; the load balancer decides WHERE each request goes. Together they give you an app that grows, shrinks, heals, and never depends on one machine.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Automatically adjust the NUMBER of instances based on demand" → <strong>Auto Scaling</strong>. "DISTRIBUTE traffic across instances/AZs" → <strong>ELB</strong>. Questions love swapping these — read whether the need is capacity or distribution.</div>
      `,
      quiz: [
        {
          q: "Which service automatically adds and removes EC2 instances based on demand?",
          options: ["Elastic Load Balancing", "EC2 Auto Scaling", "Amazon CloudFront", "AWS Batch"],
          answer: [1],
          explain: "Auto Scaling owns the instance COUNT. ELB distributes traffic across whatever instances exist — the two are partners, not substitutes.",
        },
        {
          q: "What does Elastic Load Balancing do when an instance fails its health checks?",
          options: [
            "Terminates your AWS account",
            "Stops routing traffic to it",
            "Doubles its traffic to test it",
            "Converts it to a Spot Instance",
          ],
          answer: [1],
          explain: "ELB only sends traffic to healthy targets. Combined with Auto Scaling (which replaces the failed instance), users never notice the failure.",
        },
        {
          q: "A web app needs to stay up if an entire data center fails AND handle traffic spikes automatically. Which combination delivers this?",
          options: [
            "One large EC2 instance with daily backups",
            "ELB + Auto Scaling group spanning multiple AZs",
            "Two instances in the same AZ",
            "CloudFront alone",
          ],
          answer: [1],
          explain: "The classic HA trio: multiple AZs for facility failure, Auto Scaling for demand and self-healing, ELB to spread traffic across all of it.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Serverless — AWS Lambda",
      minutes: 5,
      html: `
        <p><strong>Serverless</strong> doesn't mean no servers — it means <strong>servers you never see or manage</strong>. No provisioning, no patching, no capacity planning; you bring code, AWS runs it.</p>
        <p><strong>AWS Lambda</strong> is the flagship: upload a function, and it runs <strong>in response to events</strong> — a file landing in S3, an API request, a schedule, a database change. Key facts the exam checks:</p>
        <ul>
          <li>You pay <strong>only while code runs</strong> (per request + per millisecond of compute). Idle = $0.</li>
          <li>It <strong>scales automatically</strong> — 1 request or 10,000 concurrent, no config.</li>
          <li>Functions are short-lived: max <strong>15 minutes</strong> per run. Longer jobs belong on EC2, containers, or AWS Batch.</li>
          <li>No servers to manage — AWS handles all infrastructure, patching, and availability.</li>
        </ul>
        <div class="callout"><b>Example</b>
        A user uploads a photo to S3 → the upload event triggers a Lambda function → it creates a thumbnail and saves it back. Nothing ran (or cost anything) before the upload; nothing runs after. That's event-driven, pay-per-use computing.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Trigger phrases for Lambda: "<em>run code without provisioning or managing servers</em>," "<em>pay only for compute time consumed</em>," "<em>event-driven</em>." Trap: a task that "takes several hours" — too long for Lambda's 15-minute limit.</div>
      `,
      quiz: [
        {
          q: "Which statement best describes AWS Lambda?",
          options: [
            "A virtual server you patch and manage",
            "Run code in response to events without managing servers, paying only for compute time used",
            "A container orchestration platform",
            "A tool for buying Reserved Instances",
          ],
          answer: [1],
          explain: "Lambda = event-driven, serverless, pay-per-use code execution. The three phrases in that sentence are exactly how the exam words it.",
        },
        {
          q: "A company wants to run a nightly data-crunching job that takes 4 hours. Why is Lambda the WRONG choice?",
          options: [
            "Lambda can't be scheduled",
            "Lambda functions can run for at most 15 minutes",
            "Lambda only works with Windows",
            "Lambda requires managing servers",
          ],
          answer: [1],
          explain: "The 15-minute execution cap is Lambda's headline limitation. Multi-hour jobs go to EC2, containers, or AWS Batch instead.",
        },
        {
          q: "With Lambda, what do you pay for when your function is NOT running?",
          options: ["A small hourly idle fee", "Nothing", "The cost of one t3.micro", "A monthly minimum"],
          answer: [1],
          explain: "No invocations = no charge. That idle-costs-zero property is why event-driven workloads can be dramatically cheaper serverless.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b6",
      title: "Containers — ECS, EKS, Fargate, ECR",
      minutes: 5,
      html: `
        <p>A <strong>container</strong> (think Docker) packages an app with everything it needs so it runs identically anywhere — a developer's laptop, a test server, production. Containers are lighter and faster to start than full virtual machines.</p>
        <p>AWS's container lineup is a name-recognition game:</p>
        <table>
          <tr><th>Service</th><th>What it is</th></tr>
          <tr><td><strong>Amazon ECS</strong></td><td>Elastic Container Service — AWS's own container <strong>orchestrator</strong> (runs and manages fleets of containers)</td></tr>
          <tr><td><strong>Amazon EKS</strong></td><td>Elastic Kubernetes Service — managed <strong>Kubernetes</strong>, the open-source orchestrator, for teams that want the industry standard</td></tr>
          <tr><td><strong>AWS Fargate</strong></td><td>The <strong>serverless engine</strong> for ECS/EKS — run containers <strong>without managing any EC2 instances</strong> underneath</td></tr>
          <tr><td><strong>Amazon ECR</strong></td><td>Elastic Container Registry — where container <strong>images are stored</strong> (a private Docker Hub)</td></tr>
        </table>
        <p>Mental model: ECS or EKS decide <em>what runs where</em>; the containers then need somewhere to run — either <strong>EC2 instances you manage</strong>, or <strong>Fargate</strong> where AWS manages the compute invisibly.</p>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Containers without managing servers or clusters" → <strong>Fargate</strong>. "Managed Kubernetes" → <strong>EKS</strong> (if the word Kubernetes appears, EKS is the answer). "Store container images" → <strong>ECR</strong>.</div>
      `,
      quiz: [
        {
          q: "A team wants to run Docker containers WITHOUT provisioning or managing any servers. Which service provides this?",
          options: ["Amazon EC2", "AWS Fargate", "Amazon ECR", "AWS Outposts"],
          answer: [1],
          explain: "Fargate is serverless container compute — ECS/EKS orchestrate, Fargate removes the underlying instances from your to-do list.",
        },
        {
          q: "A company standardized on Kubernetes and wants AWS to manage the control plane. Which service?",
          options: ["Amazon ECS", "Amazon EKS", "AWS Lambda", "Amazon Lightsail"],
          answer: [1],
          explain: "Kubernetes → EKS, always. ECS is AWS's own (non-Kubernetes) orchestrator.",
        },
        {
          q: "Where would the team store its private container images on AWS?",
          options: ["Amazon S3 Glacier", "Amazon ECR", "AWS Artifact", "Amazon EBS"],
          answer: [1],
          explain: "Elastic Container Registry is the managed image registry — push images there, and ECS/EKS/Fargate pull from it at deploy time.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b7",
      title: "The rest of the compute family — and how to choose",
      minutes: 5,
      html: `
        <p>Three more names to recognize, then the big picture:</p>
        <ul>
          <li><strong>AWS Elastic Beanstalk</strong> — Chapter 1's PaaS example: upload your code and Beanstalk provisions everything (EC2, load balancer, Auto Scaling, monitoring) for you. You keep full control underneath if you want it, but you don't have to touch it. "<em>Deploy web apps without worrying about infrastructure.</em>"</li>
          <li><strong>Amazon Lightsail</strong> — the beginner bundle: a virtual server + storage + networking for one <strong>simple, predictable monthly price</strong>. For simple websites, blogs, dev servers — cloud with training wheels.</li>
          <li><strong>AWS Batch</strong> — submit large batch-computing jobs; it provisions optimal compute (often Spot) and runs the queue for you. "<em>Run hundreds of thousands of batch jobs.</em>"</li>
        </ul>
        <div class="callout"><b>Choosing compute — the cheat sheet</b>
        <ul>
          <li>Full OS control, any workload → <strong>EC2</strong></li>
          <li>Event-driven code, &lt;15 min, zero server management → <strong>Lambda</strong></li>
          <li>Containers, you manage compute → <strong>ECS/EKS on EC2</strong> · containers, nothing to manage → <strong>on Fargate</strong></li>
          <li>Just deploy my web app → <strong>Elastic Beanstalk</strong></li>
          <li>Simple site, fixed monthly price → <strong>Lightsail</strong></li>
          <li>Massive batch queues → <strong>Batch</strong></li>
        </ul></div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Beanstalk vs Lambda trip-up: Beanstalk deploys <strong>whole web applications</strong> (always-on); Lambda runs <strong>functions on events</strong>. And "predictable low monthly price for a simple website" is Lightsail's signature phrase.</div>
      `,
      quiz: [
        {
          q: "A developer wants to upload code and have AWS automatically handle provisioning, load balancing, scaling, and monitoring for a web app. Which service?",
          options: ["AWS Elastic Beanstalk", "Amazon EC2", "AWS Batch", "Amazon ECR"],
          answer: [0],
          explain: "'Just deploy my app' = Beanstalk, the PaaS layer over EC2/ELB/Auto Scaling. You still own the code; AWS runs the plumbing.",
        },
        {
          q: "A freelancer wants a simple WordPress site with a fixed, predictable monthly bill and minimal AWS learning curve. Best fit?",
          options: ["Amazon Lightsail", "AWS Fargate", "EC2 Spot Instances", "AWS Outposts"],
          answer: [0],
          explain: "Lightsail bundles server+storage+networking at a flat monthly price — the simple-website on-ramp to AWS.",
        },
        {
          q: "Which service is designed to efficiently run hundreds of thousands of queued batch-computing jobs?",
          options: ["AWS Batch", "Amazon Route 53", "AWS Artifact", "Amazon CloudFront"],
          answer: [0],
          explain: "It's in the name — Batch manages job queues and provisions the right compute (often cheap Spot capacity) to chew through them.",
        },
        {
          q: "Which is the BEST compute choice for resizing images whenever users upload them, with zero idle cost?",
          options: ["A 24/7 EC2 instance", "AWS Lambda triggered by S3 uploads", "A Dedicated Host", "Amazon Lightsail"],
          answer: [1],
          explain: "Event-driven, short-running, bursty = Lambda. An always-on EC2 instance would bill around the clock for work that happens in spurts.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>EC2</strong> = rentable virtual servers (IaaS). <strong>AMI</strong> = launch template. Families: general, <strong>compute</strong> (CPU), <strong>memory</strong> (RAM), <strong>storage</strong> (disk I/O), accelerated (GPU) — match the bottleneck.",
    "Pricing: <strong>On-Demand</strong> (flexible, priciest) · <strong>Reserved/Savings Plans</strong> (1–3 yr commit, up to ~72% off, steady workloads) · <strong>Spot</strong> (up to 90% off, 2-minute reclaim warning, interruptible work only) · <strong>Dedicated Hosts</strong> (licensing/compliance).",
    "Savings Plans commit <strong>$/hour</strong>, not a machine — flexible across instance families and even Fargate/Lambda.",
    "<strong>Auto Scaling</strong> changes instance COUNT (elasticity + self-healing); <strong>ELB</strong> DISTRIBUTES traffic across healthy instances in multiple AZs. Together with Multi-AZ = the HA trio.",
    "<strong>Lambda</strong> = serverless, event-driven functions: auto-scales, pay per request + ms, <strong>15-minute max</strong>, zero idle cost.",
    "Containers: <strong>ECS</strong> (AWS orchestrator) · <strong>EKS</strong> (managed Kubernetes) · <strong>Fargate</strong> (serverless container compute) · <strong>ECR</strong> (image registry).",
    "<strong>Beanstalk</strong> = upload code, AWS runs the web app (PaaS) · <strong>Lightsail</strong> = simple bundle, fixed monthly price · <strong>Batch</strong> = massive job queues.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which EC2 pricing model offers the largest discount (up to ~90%) in exchange for the possibility of interruption?",
        options: ["On-Demand", "Reserved Instances", "Spot Instances", "Savings Plans"],
        answer: [2],
        explain: "Spot sells AWS's spare capacity at up to 90% off, reclaimable with a 2-minute warning — the discount-for-interruptibility trade.",
      },
      {
        q: "A steady production workload will run 24/7 for the next three years on the same instance family. Which TWO options provide major discounts for committing? (Select TWO)",
        options: ["Reserved Instances", "On-Demand", "Compute Savings Plans", "Spot Instances"],
        answer: [0, 2],
        explain: "Both RIs and Savings Plans trade a 1- or 3-year commitment for up to ~72% off. On-Demand has no discount; Spot's discount comes from interruptibility, not commitment.",
      },
      {
        q: "What warning do you get before AWS reclaims a Spot Instance?",
        options: ["None", "Two minutes", "One hour", "One week"],
        answer: [1],
        explain: "The famous 2-minute interruption notice — enough to checkpoint and exit gracefully, which is why Spot suits fault-tolerant jobs.",
      },
      {
        q: "An application must scale the NUMBER of EC2 instances automatically as traffic rises and falls. Which service does this?",
        options: ["Elastic Load Balancing", "EC2 Auto Scaling", "Amazon CloudWatch alone", "AWS Config"],
        answer: [1],
        explain: "Auto Scaling owns capacity (count); ELB owns distribution. CloudWatch supplies the metrics but doesn't launch instances by itself.",
      },
      {
        q: "Which service distributes incoming web traffic across healthy EC2 instances in multiple Availability Zones?",
        options: ["Elastic Load Balancing", "Amazon ECR", "AWS Batch", "EC2 Auto Scaling"],
        answer: [0],
        explain: "That's ELB's whole job — spread traffic, skip unhealthy targets, span AZs.",
      },
      {
        q: "Which characteristics describe AWS Lambda? (Select TWO)",
        options: [
          "You pay only for compute time consumed",
          "Functions can run for up to 24 hours",
          "It runs code in response to events without server management",
          "It requires choosing an instance type",
        ],
        answer: [0, 2],
        explain: "Lambda = event-driven + pay-per-use + serverless. The limit is 15 minutes (not 24 hours), and there are no instance types to pick.",
      },
      {
        q: "A media company transcodes videos in jobs lasting 3–6 hours each. Why should it use EC2/Batch rather than Lambda?",
        options: [
          "Lambda is more expensive per hour",
          "Lambda's maximum execution time is 15 minutes",
          "Lambda can't process video formats",
          "Lambda only runs on weekends",
        ],
        answer: [1],
        explain: "The 15-minute cap rules Lambda out for multi-hour jobs regardless of cost — the exam's favorite Lambda limitation.",
      },
      {
        q: "Which service provides managed Kubernetes on AWS?",
        options: ["Amazon ECS", "Amazon EKS", "AWS Fargate", "Amazon Lightsail"],
        answer: [1],
        explain: "K in EKS = Kubernetes. ECS is AWS's own orchestrator; Fargate is the serverless compute either can run on.",
      },
      {
        q: "A startup wants to run containers but refuses to manage any EC2 instances or clusters. What should it use?",
        options: ["ECS with EC2 launch type", "Fargate", "Dedicated Hosts", "AMIs"],
        answer: [1],
        explain: "Fargate = containers with the servers abstracted away entirely. The EC2 launch type would put instance management back on their plate.",
      },
      {
        q: "Which service lets a developer deploy a web application by uploading code, while AWS handles capacity, load balancing, and health monitoring?",
        options: ["AWS Elastic Beanstalk", "Amazon ECR", "AWS Batch", "Amazon EBS"],
        answer: [0],
        explain: "Beanstalk is the deploy-my-app PaaS. It orchestrates EC2/ELB/Auto Scaling behind the scenes while you focus on code.",
      },
      {
        q: "An in-memory analytics engine needs instances with very large amounts of RAM. Which instance family should be selected?",
        options: ["Compute optimized", "Memory optimized", "Storage optimized", "General purpose"],
        answer: [1],
        explain: "RAM-heavy → memory optimized. Family names map directly to the resource they maximize.",
      },
      {
        q: "A company's compliance policy requires its EC2 workloads to run on physical servers not shared with any other customer, with visibility into sockets and cores for licensing. Which option?",
        options: ["Spot Instances", "Dedicated Hosts", "Savings Plans", "Fargate"],
        answer: [1],
        explain: "Dedicated Hosts = a whole physical box, yours alone, with the hardware visibility that per-socket licenses and strict compliance demand.",
      },
      {
        q: "Which service offers a virtual private server with bundled storage and networking for a low, predictable monthly price?",
        options: ["Amazon Lightsail", "AWS Fargate", "Amazon EKS", "AWS Wavelength"],
        answer: [0],
        explain: "Lightsail is the fixed-price simple-server product — ideal for basic websites and getting started without the full EC2 learning curve.",
      },
      {
        q: "What does 'serverless' mean in AWS?",
        options: [
          "AWS runs applications without any physical servers existing",
          "You don't provision or manage servers — AWS handles the infrastructure invisibly",
          "Applications run in users' browsers",
          "Servers are free",
        ],
        answer: [1],
        explain: "Servers still exist — you just never see, patch, or capacity-plan them. Lambda and Fargate are the flagship examples.",
      },
    ],
  },
});
