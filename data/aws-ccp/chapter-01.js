/* ============================================================
   AWS CCP — Chapter 1: Cloud Concepts
   Day 1 · Covers: what the cloud is, the six advantages,
   cloud economics, IaaS/PaaS/SaaS, deployment models.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch01",
  num: 1,
  title: "Cloud Concepts",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "What the cloud actually is",
      minutes: 4,
      html: `
        <p>Before the cloud, if a company wanted to run a website or app, it had to <strong>buy physical servers</strong> — real, humming computers — put them in a room (or rent space in a data center), keep them cool, keep them powered, fix them when they broke, and guess how many it would need years in advance.</p>
        <p>The cloud flips that model. Companies like AWS (Amazon Web Services) built <strong>enormous data centers all over the world</strong>, filled them with millions of servers, and rent out slices of that computing power to anyone. You click a button, and seconds later you have a server. You stop using it, and you stop paying.</p>
        <div class="callout"><b>The official definition (memorize the flavor of it)</b>
        Cloud computing is the <strong>on-demand delivery</strong> of IT resources over the internet with <strong>pay-as-you-go</strong> pricing.</div>
        <p>A useful analogy: <strong>electricity</strong>. You don't build a power plant behind your house — you plug into the grid and pay for exactly what you use. The cloud is a power grid for computing.</p>
        <p>Three phrases from that definition show up on the exam constantly:</p>
        <ul>
          <li><strong>On-demand</strong> — you get resources the moment you ask, no waiting, no purchase orders.</li>
          <li><strong>Over the internet</strong> — no physical access needed; it's all remote.</li>
          <li><strong>Pay-as-you-go</strong> — no upfront commitment; pay only for what you consume, and stop paying when you stop.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        If a question asks "which option best describes cloud computing?" — look for the answer with <strong>on-demand</strong> and <strong>pay-as-you-go</strong> in it. Wrong answers usually sneak in words like "upfront contracts" or "owning hardware."</div>
      `,
      quiz: [
        {
          q: "Which statement best describes cloud computing?",
          options: [
            "Buying servers upfront and hosting them in your own building",
            "On-demand delivery of IT resources over the internet with pay-as-you-go pricing",
            "A long-term hardware lease with fixed monthly payments",
            "Free computing resources provided by the government",
          ],
          answer: [1],
          explain: "That's the textbook AWS definition — on-demand, over the internet, pay-as-you-go. The other options all involve owning hardware or fixed commitments, which is the old model.",
        },
        {
          q: "Your startup's app suddenly goes viral and needs 10× more servers TODAY. Which cloud characteristic makes this possible?",
          options: [
            "Pay-as-you-go pricing",
            "On-demand availability of resources",
            "Data center ownership",
            "Fixed capacity planning",
          ],
          answer: [1],
          explain: "On-demand means resources are available the moment you need them — no purchase orders, no waiting weeks for hardware. Pay-as-you-go is about billing, not speed of access.",
        },
        {
          q: "With pay-as-you-go pricing, what happens when you stop using a cloud resource?",
          options: [
            "You keep paying until your contract ends",
            "You pay a cancellation fee",
            "You stop paying for it",
            "You must return the hardware to AWS",
          ],
          answer: [2],
          explain: "Simple but powerful: no usage, no bill. There's no contract to run out and no hardware to return — that's the whole point of renting slices of AWS's computers.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "The six advantages of cloud computing",
      minutes: 6,
      html: `
        <p>AWS has an official list of <strong>six advantages of cloud computing</strong>, and the exam loves testing whether you can recognize them from their descriptions. Here they are in plain English:</p>
        <ul>
          <li><strong>1. Trade fixed expense for variable expense.</strong> Instead of a huge upfront hardware purchase (fixed), you pay small amounts as you go (variable). You only pay when you consume.</li>
          <li><strong>2. Benefit from massive economies of scale.</strong> AWS buys servers by the hundreds of thousands, so they get prices you never could — and those savings get passed down as lower prices for you.</li>
          <li><strong>3. Stop guessing capacity.</strong> No more "will we need 10 servers or 100 next year?" Scale up when busy, scale down when quiet. No more paying for idle machines, or turning away customers because you're maxed out.</li>
          <li><strong>4. Increase speed and agility.</strong> New resources are a click away, so teams can experiment, fail fast, and launch in minutes instead of waiting weeks for hardware.</li>
          <li><strong>5. Stop spending money running and maintaining data centers.</strong> Racking servers, fixing power, cooling the room — that's AWS's problem now. You focus on your customers.</li>
          <li><strong>6. Go global in minutes.</strong> Deploy your app to data centers in Europe, Asia, or South America with a few clicks, giving users everywhere low latency.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        The exam won't ask "list the six advantages." It describes a scenario and asks which advantage it matches. Learn the <strong>keyword pairs</strong>: upfront cost → <em>variable expense</em> · cheap because AWS is huge → <em>economies of scale</em> · no more forecasting → <em>stop guessing capacity</em> · experiment faster → <em>agility</em> · no server rooms → <em>stop maintaining data centers</em> · low latency worldwide → <em>go global in minutes</em>.</div>
      `,
      quiz: [
        {
          q: "A company no longer needs to forecast how many servers it will need next year. Which cloud advantage is this?",
          options: [
            "Go global in minutes",
            "Massive economies of scale",
            "Stop guessing capacity",
            "Trade fixed expense for variable expense",
          ],
          answer: [2],
          explain: "Forecasting = guessing capacity. The cloud lets you scale to actual demand in real time, so the guessing game (and the cost of guessing wrong) disappears.",
        },
        {
          q: "AWS can offer low prices because it buys hardware in gigantic quantities. Which advantage does this describe?",
          options: [
            "Massive economies of scale",
            "Increased speed and agility",
            "Pay-as-you-go pricing",
            "Stop guessing capacity",
          ],
          answer: [0],
          explain: "Buying in bulk = economies of scale. Hundreds of thousands of customers share AWS's infrastructure, so the per-unit cost drops for everyone.",
        },
        {
          q: "A gaming company wants players in Japan, Brazil, and Germany to all get fast response times. Which advantage applies?",
          options: [
            "Trade fixed expense for variable expense",
            "Go global in minutes",
            "Stop maintaining data centers",
            "Massive economies of scale",
          ],
          answer: [1],
          explain: "Deploying close to users around the world with a few clicks is 'go global in minutes.' Distance = latency, so putting servers near players makes games feel fast.",
        },
        {
          q: "Instead of buying $2M of servers upfront, a company pays a monthly bill based on usage. Which advantage is this?",
          options: [
            "Increase speed and agility",
            "Stop guessing capacity",
            "Go global in minutes",
            "Trade fixed expense for variable expense",
          ],
          answer: [3],
          explain: "A big upfront purchase is a fixed (capital) expense. A usage-based monthly bill is a variable expense. Swapping one for the other is advantage #1.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "Cloud economics: CapEx, OpEx, and TCO",
      minutes: 5,
      html: `
        <p>The exam expects you to speak a little finance. Two terms:</p>
        <ul>
          <li><strong>CapEx (Capital Expenditure)</strong> — big upfront spending on physical things you'll own for years: servers, buildings, cooling systems. You pay before you know if you'll even use it all.</li>
          <li><strong>OpEx (Operational Expenditure)</strong> — ongoing, pay-as-you-use costs: utility bills, subscriptions… and cloud bills.</li>
        </ul>
        <p>Moving to the cloud means <strong>shifting from CapEx to OpEx</strong>. That's attractive because there's no giant upfront bet, costs track actual usage, and money isn't locked up in depreciating hardware.</p>
        <div class="callout"><b>TCO — Total Cost of Ownership</b>
        When comparing "our own data center vs AWS," companies calculate TCO: the <strong>full</strong> cost of running IT, not just the server price tag. On-premises TCO includes hardware, software licenses, electricity, cooling, physical space, networking, and the <strong>staff who maintain it all</strong>. People forget the "hidden" costs — the exam checks that you don't.</div>
        <p>One more idea worth knowing: in the cloud you can <strong>right-size</strong> — pick resources that match your actual needs and adjust them anytime, instead of over-buying "just in case." Over-provisioning on-premises is money burned; in the cloud, you just scale down.</p>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Which costs are REDUCED by moving to AWS?" → physical data center costs: hardware purchases, facility power/cooling, and the staff dedicated to racking and maintaining servers. Your application still needs people — but babysitting hardware doesn't.</div>
      `,
      quiz: [
        {
          q: "Buying $500K of servers for a company-owned data center is an example of…",
          options: [
            "OpEx (operational expenditure)",
            "CapEx (capital expenditure)",
            "Variable expense",
            "Pay-as-you-go pricing",
          ],
          answer: [1],
          explain: "A large upfront purchase of physical assets is capital expenditure — CapEx. The cloud's monthly usage-based bills are the OpEx alternative.",
        },
        {
          q: "A company is calculating the TRUE cost of its on-premises data center to compare against AWS. Which cost is most commonly forgotten but should be included?",
          options: [
            "The price of the servers",
            "Software license fees",
            "Salaries of staff who physically maintain the servers, plus power and cooling",
            "The cost of the AWS Free Tier",
          ],
          answer: [2],
          explain: "That's the heart of TCO — the total includes labor, electricity, cooling, and space, not just the sticker price of hardware. These 'hidden' costs are exactly what the exam probes.",
        },
        {
          q: "Moving from on-premises infrastructure to AWS primarily shifts IT spending from…",
          options: [
            "OpEx to CapEx",
            "Variable to fixed costs",
            "CapEx to OpEx",
            "Monthly billing to annual billing",
          ],
          answer: [2],
          explain: "Cloud kills the big upfront hardware purchase (CapEx) and replaces it with ongoing usage-based costs (OpEx). If you remember one finance fact, make it this one.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "IaaS vs PaaS vs SaaS — the service models",
      minutes: 6,
      html: `
        <p>Cloud services come in three flavors, defined by <strong>how much AWS manages for you</strong> vs how much you manage yourself.</p>
        <table>
          <tr><th>Model</th><th>What it means</th><th>You manage</th><th>Example</th></tr>
          <tr><td><strong>IaaS</strong><br>Infrastructure as a Service</td><td>Rent the raw building blocks — virtual servers, storage, networks</td><td>Operating system, apps, data</td><td><code>Amazon EC2</code></td></tr>
          <tr><td><strong>PaaS</strong><br>Platform as a Service</td><td>You bring code; the platform handles servers, patching, capacity</td><td>Just your app and data</td><td><code>Elastic Beanstalk</code></td></tr>
          <tr><td><strong>SaaS</strong><br>Software as a Service</td><td>A finished product you simply use</td><td>Nothing but your login</td><td>Gmail, Dropbox, Slack</td></tr>
        </table>
        <p>Think of it as a spectrum of control vs convenience: <strong>IaaS gives maximum control</strong> (and maximum responsibility), <strong>SaaS gives zero maintenance</strong> (and minimal control), and PaaS sits in the middle — perfect for developers who "just want to deploy code without managing servers."</p>
        <p>A classic analogy — getting pizza:</p>
        <ul>
          <li><strong>On-premises</strong> = making pizza at home from scratch. Your kitchen, your ingredients, your dishes.</li>
          <li><strong>IaaS</strong> = a rented kitchen. Professional equipment provided; you still cook.</li>
          <li><strong>PaaS</strong> = take-and-bake. Pizza's assembled; you just handle the final step.</li>
          <li><strong>SaaS</strong> = dining at a restaurant. Sit down, eat, leave.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Match the trigger phrases: "<em>most control over the operating system</em>" → IaaS · "<em>developers only want to focus on code</em>" → PaaS · "<em>complete application managed by the provider</em>" → SaaS. And know the AWS examples: EC2 = IaaS, Elastic Beanstalk = PaaS.</div>
      `,
      quiz: [
        {
          q: "A team wants full control over the operating system and installed software on their virtual servers. Which service model fits?",
          options: ["SaaS", "PaaS", "IaaS", "FaaS"],
          answer: [2],
          explain: "Control over the OS is the signature of IaaS — you rent the infrastructure (like EC2) and everything above the hypervisor is yours to configure.",
        },
        {
          q: "Developers want to deploy their web app without worrying about servers, patching, or capacity. Which model should they choose?",
          options: ["IaaS", "PaaS", "SaaS", "On-premises"],
          answer: [1],
          explain: "'Just let me push code' is the PaaS pitch — the platform (like Elastic Beanstalk) handles the infrastructure underneath.",
        },
        {
          q: "Your company pays per-user for a web-based email product it accesses in a browser and never maintains. This is…",
          options: ["IaaS", "PaaS", "SaaS", "Hybrid cloud"],
          answer: [2],
          explain: "A complete, ready-to-use application managed entirely by the provider is Software as a Service. You bring nothing but your login.",
        },
        {
          q: "Which AWS service is the classic example of IaaS?",
          options: ["Elastic Beanstalk", "Amazon EC2", "Gmail", "AWS Lambda"],
          answer: [1],
          explain: "EC2 rents you virtual servers — raw infrastructure. Beanstalk is the PaaS example, Gmail is SaaS, and Lambda is 'serverless' (we'll meet it in the Compute chapter).",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Deployment models: public, private, hybrid",
      minutes: 4,
      html: `
        <p>Last piece of Chapter 1: <strong>where</strong> your stuff runs. Three deployment models:</p>
        <ul>
          <li><strong>Cloud (public cloud)</strong> — everything runs on a provider like AWS. No hardware to own. This is the default modern choice.</li>
          <li><strong>On-premises (private cloud)</strong> — everything runs in your own data center, on hardware you own. Sometimes companies use cloud-style virtualization tools on-prem, which is why it's also called "private cloud." Maximum control, maximum cost.</li>
          <li><strong>Hybrid</strong> — a mix: some workloads on AWS, some kept on-premises, <strong>connected together</strong> (typically via AWS Direct Connect or a VPN — names to recognize, details later).</li>
        </ul>
        <p>Why would anyone choose hybrid instead of going all-in on cloud? The exam's favorite reasons:</p>
        <ul>
          <li><strong>Legacy systems</strong> that are too old or fragile to move.</li>
          <li><strong>Compliance or regulatory rules</strong> requiring certain data to stay in-house.</li>
          <li><strong>Gradual migration</strong> — moving piece by piece instead of all at once.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Any scenario where a company "keeps some servers in its own data center while also using AWS" = <strong>hybrid</strong>. It's one of the most reliably-asked definitions on the whole exam.</div>
      `,
      quiz: [
        {
          q: "A hospital keeps patient records on servers in its own building (for compliance) but runs its public website on AWS. Which deployment model is this?",
          options: ["Public cloud", "Private cloud", "Hybrid", "Multi-cloud"],
          answer: [2],
          explain: "Own data center + AWS, working together = hybrid. Compliance requirements are the classic reason companies keep one foot on-premises.",
        },
        {
          q: "Which deployment model means running ALL infrastructure in your own data center on hardware you own?",
          options: ["Public cloud", "On-premises (private cloud)", "Hybrid", "SaaS"],
          answer: [1],
          explain: "All-your-own-hardware is on-premises, also called private cloud when it uses cloud-style virtualization tools. It offers the most control at the highest cost.",
        },
        {
          q: "Which of these is a common reason to choose a HYBRID approach rather than moving 100% to the cloud?",
          options: [
            "Cloud providers refuse small customers",
            "Legacy applications that are difficult to migrate",
            "The cloud can't run websites",
            "Hybrid is always cheaper than full cloud",
          ],
          answer: [1],
          explain: "Old, fragile, or deeply customized systems often stay on-prem while everything else moves — that plus compliance rules are the standard hybrid justifications. The other options are simply false.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>Cloud computing</strong> = on-demand IT resources, over the internet, pay-as-you-go. No hardware ownership, no upfront commitment.",
    "The <strong>six advantages</strong>: variable instead of fixed expense · economies of scale · stop guessing capacity · speed & agility · stop running data centers · go global in minutes.",
    "Cloud shifts spending from <strong>CapEx</strong> (big upfront hardware buys) to <strong>OpEx</strong> (ongoing usage-based costs).",
    "<strong>TCO</strong> comparisons must include the hidden on-prem costs: power, cooling, space, and the humans maintaining hardware.",
    "<strong>IaaS</strong> (EC2) = raw infrastructure, you control the OS · <strong>PaaS</strong> (Elastic Beanstalk) = just bring code · <strong>SaaS</strong> (Gmail) = just use the app.",
    "More control = more responsibility: IaaS → PaaS → SaaS is a slider from control toward convenience.",
    "Deployment models: <strong>cloud</strong> (all on AWS) · <strong>on-premises/private</strong> (all yours) · <strong>hybrid</strong> (both, connected — think Direct Connect/VPN).",
    "Hybrid exists because of <strong>legacy systems, compliance rules, and gradual migrations</strong>.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which TWO characteristics are part of the definition of cloud computing? (Select TWO)",
        options: [
          "On-demand resource delivery",
          "Mandatory long-term contracts",
          "Pay-as-you-go pricing",
          "Customer-owned hardware",
        ],
        answer: [0, 2],
        explain: "Cloud computing = on-demand delivery of IT resources over the internet with pay-as-you-go pricing. Contracts and owned hardware belong to the old on-premises world.",
      },
      {
        q: "An e-commerce site scales from 5 servers to 50 during holiday sales, then back to 5 in January — paying only for what it used. Which advantage of cloud computing does this BEST demonstrate?",
        options: [
          "Go global in minutes",
          "Stop guessing about capacity",
          "Massive economies of scale",
          "Stop maintaining data centers",
        ],
        answer: [1],
        explain: "Scaling with real demand instead of pre-buying for a worst-case forecast is 'stop guessing capacity.' The pay-for-use detail supports it, but the scaling behavior is the tell.",
      },
      {
        q: "A CFO wants to eliminate large upfront hardware purchases in favor of monthly costs that track usage. What is she asking for?",
        options: [
          "A shift from OpEx to CapEx",
          "A shift from CapEx to OpEx",
          "An increase in TCO",
          "A fixed-expense model",
        ],
        answer: [1],
        explain: "Upfront hardware = CapEx; usage-based monthly billing = OpEx. Cloud migration trades the first for the second.",
      },
      {
        q: "Which cost would a company ELIMINATE by moving entirely from its own data center to AWS?",
        options: [
          "Application developer salaries",
          "Software subscription fees",
          "Physical server maintenance, power, and cooling costs",
          "All IT spending",
        ],
        answer: [2],
        explain: "The physical burden — hardware upkeep, electricity, cooling, floor space — becomes AWS's problem. You still pay for developers, subscriptions, and of course the AWS bill itself.",
      },
      {
        q: "A startup deploys copies of its app to AWS data centers in Tokyo, Frankfurt, and São Paulo in one afternoon. Which advantage is demonstrated?",
        options: [
          "Go global in minutes",
          "Trade fixed expense for variable expense",
          "Stop guessing capacity",
          "Economies of scale",
        ],
        answer: [0],
        explain: "Deploying worldwide with a few clicks — giving every region low latency — is the textbook 'go global in minutes.'",
      },
      {
        q: "Which service model gives you the MOST control over the underlying operating system?",
        options: ["SaaS", "PaaS", "IaaS", "They all give equal control"],
        answer: [2],
        explain: "IaaS hands you the virtual machine; the OS and everything above it is yours. PaaS abstracts the OS away, and SaaS abstracts away everything.",
      },
      {
        q: "A company uses a subscription CRM tool entirely through a web browser. The vendor handles all updates, servers, and security patches. Which service model is this?",
        options: ["IaaS", "PaaS", "SaaS", "Hybrid"],
        answer: [2],
        explain: "A complete application consumed as-is, with zero infrastructure or maintenance responsibility, is Software as a Service.",
      },
      {
        q: "Which AWS service is the best example of Platform as a Service (PaaS)?",
        options: ["Amazon EC2", "AWS Elastic Beanstalk", "Amazon S3", "Amazon Route 53"],
        answer: [1],
        explain: "Beanstalk: upload your code, and it provisions and manages the infrastructure for you — the PaaS signature. EC2 is IaaS; S3 and Route 53 are storage and DNS services.",
      },
      {
        q: "A bank runs its core transaction system in its own data center due to regulations, but hosts its mobile-app backend on AWS, with the two connected via AWS Direct Connect. What deployment model is this?",
        options: ["Public cloud", "Private cloud", "Community cloud", "Hybrid cloud"],
        answer: [3],
        explain: "On-premises + AWS, linked together = hybrid. Regulatory constraints are the most common exam justification, and Direct Connect is the connective tissue to recognize.",
      },
      {
        q: "What does 'economies of scale' mean in the context of AWS?",
        options: [
          "Customers must buy in bulk to use AWS",
          "AWS's enormous purchasing volume lowers costs, and savings are passed to customers as lower prices",
          "Bigger companies get faster servers",
          "Prices increase as AWS grows",
        ],
        answer: [1],
        explain: "Hundreds of thousands of customers aggregated on shared infrastructure let AWS buy hardware at rock-bottom unit costs — which shows up as lower prices for everyone.",
      },
      {
        q: "Which spending pattern describes OpEx?",
        options: [
          "A $1M upfront purchase of servers expected to last five years",
          "Buying a building for a data center",
          "Ongoing monthly costs that vary with actual usage",
          "Pre-paying three years of hardware leases",
        ],
        answer: [2],
        explain: "OpEx is ongoing, usage-driven operational spending — like a utility bill or an AWS invoice. The other three are upfront capital commitments (CapEx).",
      },
      {
        q: "A company wants to migrate to AWS gradually over three years, keeping some workloads on-premises during the transition. Which TWO statements are true? (Select TWO)",
        options: [
          "This is a hybrid deployment during the transition",
          "This approach is impossible on AWS",
          "Legacy systems can remain on-premises while other workloads move",
          "They must move everything at once or nothing at all",
        ],
        answer: [0, 2],
        explain: "Gradual migration is a textbook hybrid scenario — cloud and on-premises coexisting and connected — and keeping stubborn legacy systems in place while everything else moves is exactly why hybrid exists.",
      },
    ],
  },
});
