/* ============================================================
   AWS CCP — Chapter 2: AWS Global Infrastructure
   Day 2 · Regions, AZs, edge locations, Local Zones/Outposts,
   and the resilience vocabulary the exam loves.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch02",
  num: 2,
  title: "AWS Global Infrastructure",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "Regions — AWS's cities around the world",
      minutes: 5,
      html: `
        <p>AWS doesn't run from one giant building. Its hardware is spread across the planet in <strong>Regions</strong> — separate geographic areas like Northern Virginia (<code>us-east-1</code>), Ohio, Ireland, Tokyo, and São Paulo. There are dozens of them worldwide.</p>
        <p>Each Region is <strong>completely independent</strong> of the others: its own power, its own networking, its own copy of AWS services. When you launch something, you pick which Region it lives in. Your data <strong>stays in the Region you chose</strong> unless you deliberately move it — AWS never migrates it for you. That's a big deal for privacy laws.</p>
        <div class="callout"><b>How do you choose a Region?</b>
        The exam LOVES this question. Four factors, in the order they usually decide it:
        <ul>
          <li><strong>Compliance</strong> — laws may require data to stay in a country (e.g., German data in Frankfurt). This one overrides everything else.</li>
          <li><strong>Proximity/latency</strong> — closer to your users = faster experience.</li>
          <li><strong>Feature availability</strong> — brand-new services don't launch in every Region at once.</li>
          <li><strong>Pricing</strong> — the same service costs different amounts in different Regions.</li>
        </ul></div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        A scenario mentioning "data must remain in a specific country by law" → the answer involves <strong>choosing the Region in that country (compliance)</strong>. Mentioning "users complain the app is slow overseas" → <strong>latency/proximity</strong> (or CloudFront, coming in a later burst).</div>
      `,
      quiz: [
        {
          q: "A French healthcare company is legally required to keep patient data inside France. What should drive its Region choice?",
          options: ["Pricing", "Compliance and data residency requirements", "Which Region has the newest services", "Alphabetical order"],
          answer: [1],
          explain: "When law dictates where data lives, compliance beats every other factor — pick the Region in the required country (e.g., the Paris Region). Price and features come second.",
        },
        {
          q: "True or false, effectively: data you store in the Tokyo Region is automatically copied by AWS to other Regions.",
          options: [
            "True — AWS replicates everywhere for safety",
            "False — data stays in its Region unless YOU move or replicate it",
            "True, but only for S3",
            "False — data is actually stored in every Region simultaneously",
          ],
          answer: [1],
          explain: "Regions are independent, and data residency is your call. AWS won't move your data across Regions on its own — which is exactly why compliance-driven Region choice works.",
        },
        {
          q: "Which of these is NOT one of the standard factors for choosing an AWS Region?",
          options: ["Latency to your users", "Compliance requirements", "The Region's weather", "Service/feature availability"],
          answer: [2],
          explain: "The four classic factors: compliance, proximity/latency, feature availability, and pricing. Weather is AWS's problem, not yours — that's the whole point of the cloud.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "Availability Zones — the secret to not going down",
      minutes: 5,
      html: `
        <p>Zoom into a Region and you find <strong>Availability Zones (AZs)</strong> — clusters of one or more physical data centers with independent power, cooling, and networking. Every Region has <strong>multiple AZs</strong> (new Regions launch with at least three), named like <code>us-east-1a</code>, <code>us-east-1b</code>…</p>
        <p>AZs sit <strong>miles apart</strong> — far enough that a fire, flood, or power failure in one shouldn't touch another, but close enough to be connected by ultra-fast private fiber. That combination is the magic: you can run copies of your app in two or three AZs and they behave like one system.</p>
        <div class="callout"><b>Why this matters</b>
        Run everything in ONE AZ and a single data-center outage takes you offline. Spread across MULTIPLE AZs and users never notice — traffic just shifts to the surviving copies. This is called a <strong>Multi-AZ</strong> architecture, and it's AWS's #1 recommendation for <strong>high availability</strong>.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "How should the company improve availability / survive a data center failure?" → <strong>deploy across multiple Availability Zones</strong>. If the question asks about surviving an entire REGION failure or serving global users → deploy to <strong>multiple Regions</strong>. Read carefully which one they're asking.</div>
      `,
      quiz: [
        {
          q: "An Availability Zone is best described as…",
          options: [
            "A country where AWS operates",
            "One or more discrete data centers with independent power and networking, within a Region",
            "A single rack of servers",
            "AWS's name for a customer's VPC",
          ],
          answer: [1],
          explain: "AZ = one or more physical data centers, isolated from sibling AZs but linked by low-latency private fiber, all inside one Region.",
        },
        {
          q: "A company runs its app on servers in a single AZ. What's the standard AWS advice to make it survive a data-center-level failure?",
          options: [
            "Buy bigger servers",
            "Deploy the app across multiple Availability Zones in the Region",
            "Move everything to a different single AZ",
            "Take daily backups only",
          ],
          answer: [1],
          explain: "Multi-AZ is THE high-availability answer: copies in 2+ AZs mean one facility can fail without downtime. Bigger servers or a different single AZ still leave a single point of failure.",
        },
        {
          q: "A media company wants users in Asia, Europe, and the US to each have low latency AND wants to survive a full regional outage. What does it need?",
          options: [
            "Multiple Availability Zones in one Region",
            "Multiple Regions",
            "One very large EC2 instance",
            "A second AWS account",
          ],
          answer: [1],
          explain: "Multi-AZ protects against data-center failure inside one Region; only multi-Region protects against a whole-Region event and puts infrastructure near users on different continents.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "Edge locations — AWS's corner stores",
      minutes: 4,
      html: `
        <p>Regions are like AWS's big-city warehouses — there are dozens. But AWS also runs <strong>hundreds of edge locations</strong>: small sites tucked into cities all over the world, far more numerous than Regions.</p>
        <p>Edge locations don't run your servers. Their job is <strong>getting content close to users</strong>:</p>
        <ul>
          <li><strong>Amazon CloudFront</strong> — AWS's CDN (content delivery network) — <strong>caches copies</strong> of your files (images, videos, web pages) at edge locations. A user in Sydney gets your content from Sydney's edge cache instead of crossing the ocean to your server in Virginia. Less distance = less latency.</li>
          <li><strong>Amazon Route 53</strong> — AWS's DNS service — also answers queries from edge locations, so looking up your site's address is fast everywhere.</li>
          <li><strong>AWS Global Accelerator</strong> — a name to recognize: it routes user traffic onto AWS's private global network at the nearest edge, improving speed for apps (details in Chapter 5).</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Trigger phrase: "<em>deliver content to global users with low latency</em>" → <strong>CloudFront + edge locations</strong>. And remember the count hierarchy: <strong>edge locations ≫ Availability Zones &gt; Regions</strong>.</div>
      `,
      quiz: [
        {
          q: "What is the primary purpose of AWS edge locations?",
          options: [
            "Running EC2 instances closer to users",
            "Caching and delivering content close to users (e.g., via CloudFront)",
            "Storing backups of every Region",
            "Hosting AWS's corporate offices",
          ],
          answer: [1],
          explain: "Edge locations are content-delivery outposts — CloudFront caches there and Route 53 answers DNS there. Your servers still live in Regions/AZs.",
        },
        {
          q: "A news site's videos load slowly for users far from its home Region. Which service most directly fixes this?",
          options: ["Amazon EC2", "Amazon CloudFront", "AWS Organizations", "Amazon RDS"],
          answer: [1],
          explain: "CloudFront caches the videos at hundreds of edge locations worldwide, so every user pulls from a nearby cache. This is the canonical CDN question.",
        },
        {
          q: "Rank these from MOST numerous to least: Regions, edge locations, Availability Zones.",
          options: [
            "Regions > AZs > edge locations",
            "AZs > Regions > edge locations",
            "Edge locations > AZs > Regions",
            "They're all roughly equal",
          ],
          answer: [2],
          explain: "Hundreds of edge locations > (a few AZs per Region × dozens of Regions) > dozens of Regions. The exam occasionally checks this hierarchy directly.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Bringing AWS closer: Local Zones, Wavelength, Outposts",
      minutes: 4,
      html: `
        <p>Sometimes even the nearest Region isn't close enough. Three name-recognition services extend AWS's reach — you just need to know <strong>what each is for</strong>:</p>
        <table>
          <tr><th>Service</th><th>One-liner</th><th>Trigger phrase</th></tr>
          <tr><td><strong>AWS Local Zones</strong></td><td>Mini-extensions of a Region placed in big metro areas, so compute/storage sit in that city</td><td>"single-digit millisecond latency for users in a specific city"</td></tr>
          <tr><td><strong>AWS Wavelength</strong></td><td>AWS compute embedded inside <strong>5G telecom networks</strong></td><td>"ultra-low latency for 5G mobile devices"</td></tr>
          <tr><td><strong>AWS Outposts</strong></td><td>An actual <strong>rack of AWS hardware installed in YOUR building</strong>, managed by AWS, running AWS services on-premises</td><td>"run AWS services in our own data center" / hybrid</td></tr>
        </table>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Outposts is the star of this trio on the exam: it's the answer whenever a company wants <strong>AWS APIs/services physically on-premises</strong> (usually for latency or data-must-stay-here reasons). It's also a hybrid-cloud enabler — connect it to Chapter 1's hybrid model.</div>
      `,
      quiz: [
        {
          q: "A factory needs AWS services running physically inside its own facility due to strict latency and data requirements. Which offering fits?",
          options: ["AWS Local Zones", "AWS Outposts", "Amazon CloudFront", "AWS Wavelength"],
          answer: [1],
          explain: "Outposts = AWS-managed racks installed on your premises, running AWS services locally. Local Zones are AWS-run city sites; Wavelength lives inside 5G networks.",
        },
        {
          q: "A game studio wants single-digit-millisecond latency for players' 5G phones. Which service is purpose-built for that?",
          options: ["AWS Wavelength", "AWS Outposts", "Amazon S3", "AWS Direct Connect"],
          answer: [0],
          explain: "Wavelength embeds AWS compute at the edge of telecom 5G networks so mobile traffic doesn't leave the carrier network — the '5G' keyword is the giveaway.",
        },
        {
          q: "What is an AWS Local Zone?",
          options: [
            "A private section of an Availability Zone",
            "An extension of a Region that places AWS compute/storage in a specific metro area",
            "A free tier for local businesses",
            "A Region with only one AZ",
          ],
          answer: [1],
          explain: "Local Zones push a slice of a Region's services into big cities (LA, Boston, etc.) for very low latency to users there — without being a full Region.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "The resilience vocabulary — five words the exam tests relentlessly",
      minutes: 6,
      html: `
        <p>Chapter 2 ends with five concepts that show up all over the exam. In plain English:</p>
        <ul>
          <li><strong>High availability (HA)</strong> — the system stays usable even when pieces fail, because there's no single point of failure. Achieved with Multi-AZ. Think: "minimal downtime."</li>
          <li><strong>Fault tolerance</strong> — a stronger promise: the system keeps operating <em>without any interruption at all</em> while a component fails. HA might allow seconds of blip; fault tolerance allows none (and costs more).</li>
          <li><strong>Scalability</strong> — the ability to grow to handle more load. Two flavors: <strong>vertical</strong> (scale UP: a bigger server) and <strong>horizontal</strong> (scale OUT: MORE servers). Cloud favors horizontal.</li>
          <li><strong>Elasticity</strong> — scalability on autopilot, in BOTH directions: automatically add capacity when busy, automatically remove it when quiet, so you pay only for what's needed. The keyword is <em>automatic</em>.</li>
          <li><strong>Agility</strong> — a business word: how FAST you can try ideas, provision resources, and ship features. Minutes instead of months.</li>
        </ul>
        <div class="callout"><b>Disaster recovery, briefly</b>
        Backups and recovery plans for when things go very wrong — often by replicating to another Region. Just recognize that <strong>multi-Region = disaster recovery / surviving regional failure</strong>.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Keyword mapping: "automatically scales up AND down with demand" → <strong>elasticity</strong> · "no single point of failure / minimal downtime" → <strong>high availability</strong> · "zero interruption during failure" → <strong>fault tolerance</strong> · "add more instances" → <strong>horizontal scaling</strong> · "provision in minutes, experiment quickly" → <strong>agility</strong>.</div>
      `,
      quiz: [
        {
          q: "A retail app automatically adds EC2 instances during flash sales and removes them afterward. This is the definition of…",
          options: ["High availability", "Elasticity", "Fault tolerance", "Vertical scaling"],
          answer: [1],
          explain: "Automatic scaling in BOTH directions to match demand = elasticity. It's the cloud's signature trick — capacity that breathes with your traffic.",
        },
        {
          q: "Replacing one medium server with one giant server is called…",
          options: ["Horizontal scaling (scaling out)", "Vertical scaling (scaling up)", "Elasticity", "Fault tolerance"],
          answer: [1],
          explain: "Bigger machine = vertical / scale UP. More machines = horizontal / scale OUT. The cloud generally prefers horizontal because there's no ceiling and no single point of failure.",
        },
        {
          q: "Which term describes a system designed to keep running with ZERO interruption even while a component fails?",
          options: ["Fault tolerance", "High availability", "Agility", "Durability"],
          answer: [0],
          explain: "Fault tolerance is the no-interruption-ever guarantee (and the pricier one). High availability aims for minimal downtime but tolerates brief blips.",
        },
        {
          q: "A startup says AWS lets it 'go from idea to running experiment in an afternoon.' Which cloud benefit is that?",
          options: ["Durability", "Elasticity", "Agility", "Fault tolerance"],
          answer: [2],
          explain: "Speed of experimentation and provisioning is agility — the business-velocity benefit, distinct from the capacity mechanics of scalability/elasticity.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>Regions</strong> are independent geographic areas; data stays in its Region unless you move it. Choose by <strong>compliance → latency → features → price</strong>.",
    "<strong>Availability Zones</strong> = isolated data-center clusters within a Region, linked by fast private fiber. Every Region has multiple.",
    "<strong>Multi-AZ = high availability</strong> (survive a data-center failure). <strong>Multi-Region = disaster recovery + global reach</strong> (survive a Region failure).",
    "<strong>Edge locations</strong> (hundreds) cache content near users — that's <strong>CloudFront</strong>, AWS's CDN. Count: edge locations ≫ AZs > Regions.",
    "Extending AWS: <strong>Local Zones</strong> (metro-area latency), <strong>Wavelength</strong> (5G networks), <strong>Outposts</strong> (AWS racks in YOUR building — the hybrid/on-prem answer).",
    "<strong>Scalability</strong> = can grow (vertical UP vs horizontal OUT) · <strong>elasticity</strong> = grows AND shrinks automatically · <strong>agility</strong> = speed of experimenting.",
    "<strong>High availability</strong> = minimal downtime, no single point of failure · <strong>fault tolerance</strong> = zero interruption, higher cost.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "A company must ensure its customer data never leaves Germany due to national regulations. What is the FIRST factor in its Region selection?",
        options: ["Pricing", "Compliance / data residency", "Service availability", "Distance to headquarters"],
        answer: [1],
        explain: "Legal data-residency requirements trump everything: pick the Region in the required jurisdiction (Frankfurt), then worry about price and features.",
      },
      {
        q: "What is the relationship between Regions and Availability Zones?",
        options: [
          "A Region contains multiple isolated Availability Zones",
          "An Availability Zone contains multiple Regions",
          "They are two names for the same thing",
          "Regions are only for storage; AZs are only for compute",
        ],
        answer: [0],
        explain: "Region = geographic area; inside it sit multiple AZs (isolated data-center clusters). Never the reverse.",
      },
      {
        q: "An application runs on EC2 instances in us-east-1a only. Which change gives it high availability within the Region?",
        options: [
          "Add instances in us-east-1b and us-east-1c behind a load balancer",
          "Move all instances to a larger instance type",
          "Copy the data to another AWS account",
          "Enable detailed monitoring",
        ],
        answer: [0],
        explain: "Spreading instances across multiple AZs removes the single point of failure — the definition of Multi-AZ high availability. Bigger instances don't help if the facility goes dark.",
      },
      {
        q: "Which statement about edge locations is TRUE?",
        options: [
          "There are fewer edge locations than Regions",
          "Edge locations are where CloudFront caches content close to users",
          "Edge locations are only available in the United States",
          "Customers can rent office space at edge locations",
        ],
        answer: [1],
        explain: "Hundreds of edge locations worldwide exist to cache and deliver content (CloudFront) and answer DNS (Route 53) near users.",
      },
      {
        q: "A logistics firm wants to run AWS compute and storage services on hardware inside its own warehouse, managed by AWS. Which service?",
        options: ["AWS Local Zones", "AWS Wavelength", "AWS Outposts", "Amazon Lightsail"],
        answer: [2],
        explain: "Outposts delivers AWS-managed racks to your premises — AWS services, your building. The on-prem/hybrid keyword is the tell.",
      },
      {
        q: "Which scenario calls for a multi-REGION architecture rather than just multi-AZ? (Select TWO)",
        options: [
          "Surviving the failure of an entire AWS Region",
          "Surviving the failure of one data center",
          "Serving users on multiple continents with low latency from full application stacks",
          "Reducing the number of EC2 instances needed",
        ],
        answer: [0, 2],
        explain: "Multi-Region exists for regional-disaster recovery and for running full stacks near users worldwide. A single data-center failure is already handled by multi-AZ, and multi-Region certainly doesn't reduce instance count.",
      },
      {
        q: "An online store's traffic doubles every evening and drops overnight, and AWS adjusts its capacity automatically so it only pays for what it needs. This demonstrates…",
        options: ["Fault tolerance", "Elasticity", "Vertical scaling", "Data residency"],
        answer: [1],
        explain: "Automatic up-AND-down capacity matching demand is elasticity — the exam's favorite vocabulary question.",
      },
      {
        q: "Scaling OUT means…",
        options: [
          "Adding more instances to share the load",
          "Upgrading to a bigger instance",
          "Moving out of the cloud",
          "Reducing storage size",
        ],
        answer: [0],
        explain: "Out = more machines (horizontal). Up = bigger machine (vertical). Cloud architectures favor scaling out — no ceiling, no single point of failure.",
      },
      {
        q: "Which service is specifically designed to bring AWS compute to the edge of 5G mobile networks?",
        options: ["AWS Outposts", "AWS Wavelength", "Amazon CloudFront", "AWS Snowball"],
        answer: [1],
        explain: "Wavelength = AWS inside telecom 5G infrastructure, for ultra-low-latency mobile apps. If the question says '5G,' the answer says Wavelength.",
      },
      {
        q: "A trading platform must continue operating with ZERO interruption even if servers fail mid-transaction. This requirement is called…",
        options: ["High availability", "Fault tolerance", "Elasticity", "Agility"],
        answer: [1],
        explain: "Zero-interruption operation through failures = fault tolerance — stricter and more expensive than high availability's 'minimal downtime.'",
      },
      {
        q: "Why might the same AWS service cost different amounts in different Regions?",
        options: [
          "AWS randomizes prices daily",
          "Regional operating costs differ, so AWS prices vary by Region",
          "Older Regions are always more expensive",
          "Prices only differ for storage services",
        ],
        answer: [1],
        explain: "Each Region has different infrastructure and energy costs, so pricing varies — which is why price is one of the four Region-selection factors.",
      },
      {
        q: "A company wants single-digit-millisecond latency for users concentrated in Los Angeles, where there is no full AWS Region. The best fit is…",
        options: ["An AWS Local Zone in Los Angeles", "A second AWS account", "AWS Artifact", "Amazon Route 53 alone"],
        answer: [0],
        explain: "Local Zones extend a parent Region into specific metros exactly for this 'my users are all in one city' latency case.",
      },
    ],
  },
});
