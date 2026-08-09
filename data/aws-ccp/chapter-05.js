/* ============================================================
   AWS CCP — Chapter 5: Networking & Content Delivery
   Days 6–7 · VPC, security groups vs NACLs, VPN/Direct Connect,
   Route 53, CloudFront, load balancer types.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch05",
  num: 5,
  title: "Networking & Content Delivery",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "VPC — your private slice of AWS",
      minutes: 5,
      html: `
        <p>An <strong>Amazon VPC (Virtual Private Cloud)</strong> is your own <strong>private, isolated network inside AWS</strong>. Everything you launch — EC2 instances, databases — lives inside a VPC, invisible to other AWS customers. Think of it as your own fenced-off plot of the AWS neighborhood, with an address range you choose.</p>
        <p>Inside a VPC you carve out <strong>subnets</strong> — smaller sections, each living in ONE Availability Zone:</p>
        <ul>
          <li><strong>Public subnet</strong> — has a route to the internet. For things that must be reachable: web servers, load balancers.</li>
          <li><strong>Private subnet</strong> — NO direct route to the internet. For things that should be hidden: databases, application servers. The web tier talks to them internally.</li>
        </ul>
        <div class="callout"><b>The classic layout</b>
        Load balancer in public subnets → app servers in private subnets → database in private subnets, duplicated across two AZs. Users touch only the front door; the valuables sit behind it. This one diagram answers a surprising number of exam questions.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Isolated private network in AWS" → <strong>VPC</strong>. "Where should the database go?" → <strong>private subnet</strong>. Subnets are AZ-scoped — a subnet never spans AZs.</div>
      `,
      quiz: [
        {
          q: "What is an Amazon VPC?",
          options: [
            "A logically isolated private network you define within AWS",
            "A type of EC2 instance",
            "AWS's public wifi",
            "A physical cable to AWS",
          ],
          answer: [0],
          explain: "VPC = your private, isolated network space in AWS, where your resources live behind boundaries you control.",
        },
        {
          q: "Where should a company place a database that must never be directly reachable from the internet?",
          options: ["A public subnet", "A private subnet", "An edge location", "Outside the VPC"],
          answer: [1],
          explain: "Private subnets have no internet route — the standard home for databases and internal services. Only the public-facing tier belongs in public subnets.",
        },
        {
          q: "A subnet exists within…",
          options: ["Multiple Regions", "A single Availability Zone", "All AZs at once", "An edge location"],
          answer: [1],
          explain: "Subnets are AZ-scoped slices of a VPC. Multi-AZ designs use multiple subnets, one (or more) per AZ.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "Doors and tunnels — gateways, peering, endpoints",
      minutes: 5,
      html: `
        <p>A VPC starts sealed. Traffic gets in and out through specific doors, each with a name the exam expects you to match:</p>
        <table>
          <tr><th>Component</th><th>What it does</th></tr>
          <tr><td><strong>Internet Gateway (IGW)</strong></td><td>The VPC's front door — lets PUBLIC subnets talk to the internet</td></tr>
          <tr><td><strong>NAT Gateway</strong></td><td>One-way door for PRIVATE subnets: instances can reach OUT (updates, downloads) but the internet cannot reach IN</td></tr>
          <tr><td><strong>VPC Peering</strong></td><td>Private connection between TWO VPCs, traffic never touches the internet</td></tr>
          <tr><td><strong>AWS Transit Gateway</strong></td><td>The hub: connects MANY VPCs and on-prem networks in a hub-and-spoke, instead of a mess of pairwise peerings</td></tr>
          <tr><td><strong>VPC Endpoints (PrivateLink)</strong></td><td>Reach AWS services (like S3) PRIVATELY from your VPC without crossing the public internet</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Private-subnet servers need to download OS updates but must stay unreachable from the internet" → <strong>NAT Gateway</strong>. "Connect two VPCs privately" → <strong>peering</strong>; "connect DOZENS of VPCs" → <strong>Transit Gateway</strong>. "Access S3 without traversing the public internet" → <strong>VPC endpoint</strong>.</div>
      `,
      quiz: [
        {
          q: "Instances in a private subnet need to download security patches from the internet but must remain unreachable FROM the internet. What enables this?",
          options: ["Internet Gateway attached directly", "NAT Gateway", "VPC Peering", "Making the subnet public"],
          answer: [1],
          explain: "NAT Gateway = outbound-only: private instances initiate connections out, and nothing outside can initiate connections in.",
        },
        {
          q: "What does an Internet Gateway do?",
          options: [
            "Connects a VPC's public subnets to the internet",
            "Blocks all traffic",
            "Connects two VPCs",
            "Provides DNS resolution",
          ],
          answer: [0],
          explain: "The IGW is the VPC's door to the public internet — public subnets route through it.",
        },
        {
          q: "A company has 40 VPCs and several on-premises networks to interconnect. Which service avoids managing hundreds of pairwise connections?",
          options: ["VPC Peering for every pair", "AWS Transit Gateway", "A bigger Internet Gateway", "Amazon CloudFront"],
          answer: [1],
          explain: "Transit Gateway is the central hub — every network connects once to it, replacing the n×n peering mesh.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "Security groups vs Network ACLs — the exam's favorite trap",
      minutes: 6,
      html: `
        <p>Two layers of traffic filtering guard your VPC, and the exam tests their differences relentlessly:</p>
        <table>
          <tr><th></th><th><strong>Security Group</strong></th><th><strong>Network ACL</strong></th></tr>
          <tr><td>Protects</td><td>The <strong>instance</strong> (its virtual firewall)</td><td>The <strong>subnet</strong> (its border checkpoint)</td></tr>
          <tr><td>Rules</td><td><strong>ALLOW rules only</strong></td><td>ALLOW <strong>and DENY</strong> rules</td></tr>
          <tr><td>State</td><td><strong>Stateful</strong> — reply traffic is automatically allowed back</td><td><strong>Stateless</strong> — replies must be explicitly allowed too</td></tr>
          <tr><td>Default</td><td>Denies all inbound until you allow it</td><td>Default NACL allows everything until changed</td></tr>
        </table>
        <p>Plain-English versions: a <strong>security group</strong> is a bouncer standing at each instance's door with a guest list (if you're not on it, you don't get in — and once you're in, your replies flow freely). A <strong>NACL</strong> is the neighborhood gate: it checks everyone entering AND leaving the subnet, has both a guest list and a ban list, and has no memory between directions.</p>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Instant answers: "instance-level firewall" → <strong>security group</strong> · "subnet-level" → <strong>NACL</strong> · "stateful" → <strong>SG</strong> · "stateless" → <strong>NACL</strong> · "needs an explicit DENY rule (e.g., block one IP address)" → <strong>NACL</strong> (SGs can't deny — they can only not-allow).</div>
      `,
      quiz: [
        {
          q: "Which acts as a virtual firewall at the EC2 INSTANCE level?",
          options: ["Network ACL", "Security group", "Internet Gateway", "Route table"],
          answer: [1],
          explain: "Security groups wrap instances; NACLs wrap subnets. Level-of-protection is the first differentiator to check.",
        },
        {
          q: "A company must explicitly BLOCK traffic from one specific malicious IP address at the subnet boundary. Which tool supports DENY rules?",
          options: ["Security group", "Network ACL", "NAT Gateway", "VPC Peering"],
          answer: [1],
          explain: "Only NACLs have deny rules. Security groups are allow-lists — they can decline to allow, but they can't write 'DENY 1.2.3.4.'",
        },
        {
          q: "'Stateful' — return traffic for an allowed connection is automatically permitted — describes which control?",
          options: ["Network ACL", "Security group", "Both", "Neither"],
          answer: [1],
          explain: "SG = stateful (remembers the conversation). NACL = stateless (inbound and outbound each need explicit rules).",
        },
        {
          q: "By default, a NEW security group…",
          options: [
            "Allows all inbound traffic",
            "Denies all inbound traffic until you add allow rules",
            "Blocks outbound traffic permanently",
            "Copies the NACL's rules",
          ],
          answer: [1],
          explain: "New SGs start closed to inbound traffic — you open only what's needed (e.g., port 443). Deny-by-default is the security posture.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Connecting the office — VPN vs Direct Connect",
      minutes: 4,
      html: `
        <p>Hybrid setups (Chapter 1!) need the corporate network linked to the VPC. Two ways:</p>
        <ul>
          <li><strong>AWS Site-to-Site VPN</strong> — an <strong>encrypted tunnel over the public internet</strong> between your office and your VPC. Quick to set up (hours), inexpensive. But it rides the internet: speed and latency fluctuate. (Related: <strong>AWS Client VPN</strong> connects individual laptops securely.)</li>
          <li><strong>AWS Direct Connect</strong> — a <strong>dedicated private physical line</strong> from your data center into AWS. Consistent high bandwidth, low steady latency, traffic never touches the public internet. Takes weeks-to-months to provision and costs real money. Note: it's private but <strong>not encrypted by itself</strong> (companies often run a VPN over it for encryption).</li>
        </ul>
        <div class="callout"><b>Choosing</b>
        Need it fast and cheap → VPN. Need consistent, private, high-throughput connectivity (or compliance says avoid the public internet) → Direct Connect. Many enterprises use Direct Connect primary + VPN backup.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Encrypted over the internet, quick to establish" → <strong>Site-to-Site VPN</strong>. "Dedicated private connection, consistent performance, bypasses the internet" → <strong>Direct Connect</strong>. Contrast with Chapter 2's names: those extend AWS TO you (Outposts); these connect you TO AWS.</div>
      `,
      quiz: [
        {
          q: "A hospital's compliance team requires connectivity to AWS that never traverses the public internet, with consistent throughput for daily bulk transfers. Which service?",
          options: ["Site-to-Site VPN", "AWS Direct Connect", "Amazon CloudFront", "A NAT Gateway"],
          answer: [1],
          explain: "Dedicated + private + consistent = Direct Connect, the physical line into AWS. VPN is encrypted but rides the unpredictable public internet.",
        },
        {
          q: "A startup needs its office connected to its VPC by tomorrow, cheaply, with encryption. Which option?",
          options: ["AWS Direct Connect", "Site-to-Site VPN", "AWS Outposts", "Transit Gateway alone"],
          answer: [1],
          explain: "VPN = fast setup, low cost, encrypted tunnel over the internet. Direct Connect takes weeks and costs far more.",
        },
        {
          q: "Which statement about Direct Connect is TRUE?",
          options: [
            "It's an encrypted tunnel over the public internet",
            "It's a dedicated private physical connection into AWS",
            "It's free with every VPC",
            "It only works for S3",
          ],
          answer: [1],
          explain: "Direct Connect = your own private on-ramp to AWS. (And a subtlety worth remembering: private ≠ encrypted — add a VPN over it if encryption is required.)",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Route 53 — AWS's phone book",
      minutes: 4,
      html: `
        <p><strong>Amazon Route 53</strong> is AWS's <strong>DNS service</strong>: it translates human names (<code>yoursite.com</code>) into machine addresses (IPs), answering from edge locations worldwide. It also <strong>registers domains</strong> — you can buy <code>yoursite.com</code> right in AWS.</p>
        <p>Its superpower is <strong>routing policies</strong> — HOW it answers can be smart:</p>
        <ul>
          <li><strong>Simple</strong> — one answer, every time.</li>
          <li><strong>Weighted</strong> — split traffic by percentages (90% to the current version, 10% to the new one — canary testing).</li>
          <li><strong>Latency-based</strong> — send each user to the Region that responds fastest for them.</li>
          <li><strong>Failover</strong> — health checks watch your primary site; if it dies, Route 53 automatically points everyone at the backup.</li>
          <li><strong>Geolocation</strong> — answer based on WHERE the user is (EU users → EU servers, for content rules or compliance).</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "DNS" or "domain registration" → <strong>Route 53</strong>. Scenario phrasing maps to policies: "percentage of traffic" → weighted · "lowest latency Region" → latency-based · "automatic failover to standby using health checks" → failover · "based on user's country" → geolocation.</div>
      `,
      quiz: [
        {
          q: "Which AWS service provides DNS resolution and domain registration?",
          options: ["Amazon CloudFront", "Amazon Route 53", "AWS Direct Connect", "Amazon VPC"],
          answer: [1],
          explain: "Route 53 is the DNS + domain service (the name is a nod to DNS port 53).",
        },
        {
          q: "A company wants to send 10% of users to a new app version and 90% to the old one. Which Route 53 routing policy?",
          options: ["Simple", "Weighted", "Failover", "Geolocation"],
          answer: [1],
          explain: "Percent-based traffic splitting = weighted routing — the standard canary/gradual-rollout tool.",
        },
        {
          q: "Route 53 should automatically redirect all traffic to a standby site if health checks show the primary is down. Which policy?",
          options: ["Failover", "Latency-based", "Simple", "Weighted"],
          answer: [0],
          explain: "Failover routing + health checks = automatic disaster switchover. 'Health check' in the question is the giveaway.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b6",
      title: "CloudFront, Global Accelerator, API Gateway & the ELB family",
      minutes: 5,
      html: `
        <p>Closing out networking — the delivery layer:</p>
        <ul>
          <li><strong>Amazon CloudFront</strong> — the <strong>CDN</strong> from Chapter 2: caches your content (images, video, whole sites) at hundreds of edge locations so it's served from near the user. Pairs beautifully with S3. Keywords: <em>cache, content, static/media, global delivery</em>.</li>
          <li><strong>AWS Global Accelerator</strong> — no caching. It gives your app <strong>two static anycast IPs</strong> and routes user traffic onto <strong>AWS's private backbone</strong> at the nearest edge, improving speed and failover for <strong>dynamic/non-HTTP apps</strong> (games, VoIP) and multi-Region setups. Keywords: <em>static IPs, TCP/UDP, instant regional failover</em>.</li>
          <li><strong>Amazon API Gateway</strong> — the managed <strong>front door for APIs</strong>: publish, secure, throttle, and monitor APIs at any scale; classically paired with Lambda for serverless backends.</li>
          <li><strong>The ELB family</strong>, now with details: <strong>ALB</strong> (Application LB, Layer 7) understands HTTP — routes by URL path, host, etc. <strong>NLB</strong> (Network LB, Layer 4) is the raw-speed TCP/UDP balancer for millions of requests/second with static IPs. <strong>GWLB</strong> (Gateway LB) is niche: inserting third-party security appliances into traffic. Web app → ALB; extreme TCP performance → NLB.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        CloudFront vs Global Accelerator is a favorite: <strong>caching CONTENT globally → CloudFront</strong>; <strong>accelerating an APP's traffic (TCP/UDP, static IPs, failover) → Global Accelerator</strong>. And "managed service to publish and secure APIs" → <strong>API Gateway</strong>.</div>
      `,
      quiz: [
        {
          q: "A media site wants its videos and images cached near users worldwide. Which service?",
          options: ["AWS Global Accelerator", "Amazon CloudFront", "Amazon Route 53", "AWS Direct Connect"],
          answer: [1],
          explain: "Caching content at edge locations = CloudFront, the CDN. Global Accelerator speeds up traffic but caches nothing.",
        },
        {
          q: "A multiplayer game using UDP needs static IP addresses and fast failover between Regions. Which service fits?",
          options: ["Amazon CloudFront", "AWS Global Accelerator", "Amazon S3", "AWS Batch"],
          answer: [1],
          explain: "Non-HTTP protocol + static anycast IPs + regional failover = Global Accelerator riding AWS's private backbone.",
        },
        {
          q: "Which load balancer type operates at Layer 7 and can route requests based on URL path?",
          options: ["Network Load Balancer", "Application Load Balancer", "Gateway Load Balancer", "Classic tape balancer"],
          answer: [1],
          explain: "ALB speaks HTTP — path-based, host-based routing for web apps. NLB is the Layer-4 speed machine.",
        },
        {
          q: "A serverless team needs to publish, throttle, and secure REST APIs that trigger Lambda functions. Which service?",
          options: ["Amazon API Gateway", "AWS Transit Gateway", "Internet Gateway", "NAT Gateway"],
          answer: [0],
          explain: "API Gateway is the managed API front door — of the many 'gateways' in AWS, it's the only one about APIs.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>VPC</strong> = your isolated private network. <strong>Public subnets</strong> face the internet (web tier, ELB); <strong>private subnets</strong> hide databases/app servers. Subnets are AZ-scoped.",
    "Doors: <strong>Internet Gateway</strong> (public subnets ↔ internet) · <strong>NAT Gateway</strong> (private subnets reach OUT only) · <strong>Peering</strong> (2 VPCs) · <strong>Transit Gateway</strong> (many networks, hub-and-spoke) · <strong>VPC endpoints</strong> (private path to AWS services like S3).",
    "<strong>Security group</strong>: instance-level, ALLOW-only, <strong>stateful</strong>. <strong>NACL</strong>: subnet-level, allow+<strong>DENY</strong>, <strong>stateless</strong>. The exam's favorite comparison — know it cold.",
    "<strong>Site-to-Site VPN</strong> = encrypted, over internet, quick, cheap. <strong>Direct Connect</strong> = dedicated private line, consistent performance, slow to provision, not inherently encrypted.",
    "<strong>Route 53</strong> = DNS + domains. Policies: weighted (traffic %), latency-based (fastest Region), failover (health-checked standby), geolocation (by user country).",
    "<strong>CloudFront</strong> caches CONTENT at edges (CDN). <strong>Global Accelerator</strong> speeds up APP traffic with static IPs on AWS's backbone — no caching.",
    "<strong>API Gateway</strong> = publish/secure/throttle APIs (Lambda's best friend). ELB types: <strong>ALB</strong> Layer 7 HTTP routing · <strong>NLB</strong> Layer 4 extreme TCP/UDP · GWLB for security appliances.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which service lets you define a logically isolated private network within AWS?",
        options: ["Amazon VPC", "Amazon Route 53", "AWS Direct Connect", "Amazon CloudFront"],
        answer: [0],
        explain: "The VPC is the foundational private network construct — everything else in this chapter lives in or connects to it.",
      },
      {
        q: "A three-tier app puts its load balancer, app servers, and database in a VPC. Which placement follows best practice?",
        options: [
          "Everything in public subnets",
          "Load balancer public; app servers and database in private subnets",
          "Database public; load balancer private",
          "Everything outside the VPC",
        ],
        answer: [1],
        explain: "Only the front door faces the internet. App and data tiers hide in private subnets, reachable only through internal routes.",
      },
      {
        q: "What allows instances in a PRIVATE subnet to download software updates while remaining unreachable from the internet?",
        options: ["Internet Gateway", "NAT Gateway", "VPC Peering", "AWS Artifact"],
        answer: [1],
        explain: "NAT Gateway = outbound-only internet access for private subnets. The IGW alone would make them reachable, which violates the requirement.",
      },
      {
        q: "Which TWO statements correctly describe security groups? (Select TWO)",
        options: [
          "They operate at the instance level",
          "They support explicit DENY rules",
          "They are stateful",
          "They operate at the subnet level",
        ],
        answer: [0, 2],
        explain: "SGs: instance-level + stateful + allow-rules-only. Deny rules and subnet scope describe NACLs.",
      },
      {
        q: "To BLOCK a specific IP address at the subnet level, you should use…",
        options: ["A security group", "A network ACL with a deny rule", "An Internet Gateway", "Route 53"],
        answer: [1],
        explain: "Explicit denies exist only in NACLs. Security groups can merely decline to allow — they can't blacklist.",
      },
      {
        q: "A firm requires consistent, high-bandwidth connectivity between its data center and AWS that bypasses the public internet entirely. Which service?",
        options: ["Site-to-Site VPN", "AWS Direct Connect", "Client VPN", "CloudFront"],
        answer: [1],
        explain: "Dedicated physical private line = Direct Connect. VPNs are encrypted but still travel the public internet.",
      },
      {
        q: "Which is an advantage of a Site-to-Site VPN over Direct Connect?",
        options: [
          "Traffic avoids the public internet",
          "It can be set up in hours at low cost",
          "It guarantees consistent bandwidth",
          "It includes free EC2 instances",
        ],
        answer: [1],
        explain: "VPN wins on speed-to-deploy and price; Direct Connect wins on consistency and privacy. Know both directions of this trade-off.",
      },
      {
        q: "Which Route 53 routing policy directs users to the Region that gives them the fastest response?",
        options: ["Simple", "Latency-based", "Failover", "Weighted"],
        answer: [1],
        explain: "Latency-based routing answers each user with the lowest-latency endpoint — the 'fastest Region for THEM' policy.",
      },
      {
        q: "An EU regulation requires European users to be served only from European servers. Which routing policy enforces this by user location?",
        options: ["Geolocation", "Weighted", "Simple", "Latency-based"],
        answer: [0],
        explain: "Geolocation routes by where the user IS — the compliance-flavored policy (latency-based optimizes speed, not jurisdiction).",
      },
      {
        q: "What is the key difference between CloudFront and Global Accelerator?",
        options: [
          "CloudFront caches content at edge locations; Global Accelerator routes app traffic over AWS's backbone with static IPs (no caching)",
          "They are identical",
          "Global Accelerator is only for S3",
          "CloudFront requires Direct Connect",
        ],
        answer: [0],
        explain: "CDN-vs-accelerator: CloudFront = content caching; Global Accelerator = network-path optimization + static anycast IPs + fast failover.",
      },
      {
        q: "Which load balancer should a company choose for ultra-high-performance TCP traffic requiring static IP addresses?",
        options: ["Application Load Balancer", "Network Load Balancer", "Gateway Load Balancer", "CloudFront"],
        answer: [1],
        explain: "NLB = Layer 4, millions of requests per second, static IPs. ALB is the Layer-7 HTTP brain, not the raw-speed choice.",
      },
      {
        q: "Which service would a team use to publish, secure, and throttle the REST API in front of its Lambda functions?",
        options: ["Amazon API Gateway", "AWS Transit Gateway", "NAT Gateway", "Storage Gateway"],
        answer: [0],
        explain: "Among AWS's many gateways, API Gateway is the one that manages APIs — the canonical serverless pairing with Lambda.",
      },
      {
        q: "A VPC's resources must access Amazon S3 without their traffic crossing the public internet. What should be used?",
        options: ["A VPC endpoint", "A bigger Internet Gateway", "A public subnet", "Spot Instances"],
        answer: [0],
        explain: "VPC endpoints (PrivateLink/gateway endpoints) create a private path from your VPC to AWS services — no internet transit.",
      },
    ],
  },
});
