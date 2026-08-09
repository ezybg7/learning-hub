/* ============================================================
   AWS CCP — Chapter 6: Databases
   Day 8 · RDS vs Aurora vs DynamoDB, Redshift, ElastiCache,
   the niche databases, and DMS.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch06",
  num: 6,
  title: "Databases",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "RDS — relational databases without the babysitting",
      minutes: 5,
      html: `
        <p>A <strong>relational database</strong> stores data in tables with rows and columns and speaks <strong>SQL</strong> — the classic choice for orders, customers, transactions. You COULD install one on an EC2 instance, but then you're back to patching, backups, and failover planning.</p>
        <p><strong>Amazon RDS (Relational Database Service)</strong> is the managed answer: AWS runs the database engine for you — <strong>provisioning, OS patching, automated backups, point-in-time restore</strong> — while you focus on your data. It supports the engines you already know: <strong>MySQL, PostgreSQL, MariaDB, Oracle, SQL Server</strong> (plus Aurora, next burst).</p>
        <p>Two features the exam adores:</p>
        <ul>
          <li><strong>Multi-AZ deployment</strong> — RDS keeps a <strong>standby copy in a second AZ</strong> and fails over to it automatically if the primary dies. Purpose: <strong>availability</strong>, not speed. The standby serves no traffic; it just waits.</li>
          <li><strong>Read replicas</strong> — extra read-only copies that <strong>offload read traffic</strong> from the primary (can even live in other Regions). Purpose: <strong>read performance/scaling</strong>, not failover.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Multi-AZ vs read replica is a guaranteed question. Availability/failover/disaster wording → <strong>Multi-AZ</strong>. "Heavy read traffic slowing the database" → <strong>read replicas</strong>. They are not interchangeable.</div>
      `,
      quiz: [
        {
          q: "What does Amazon RDS manage for you that running a database on EC2 would not?",
          options: [
            "Writing your application's SQL queries",
            "Provisioning, patching, backups, and failover automation",
            "Nothing — they're identical",
            "Designing your data model",
          ],
          answer: [1],
          explain: "RDS is the managed service: the undifferentiated heavy lifting (patching, backups, standby failover) becomes AWS's job. Your schema and queries are still yours.",
        },
        {
          q: "An RDS database must automatically fail over to a standby in another AZ if the primary fails. Which feature?",
          options: ["Read replicas", "Multi-AZ deployment", "ElastiCache", "S3 versioning"],
          answer: [1],
          explain: "Multi-AZ = synchronous standby + automatic failover = the availability feature. Read replicas are for scaling reads, not surviving failures.",
        },
        {
          q: "A reporting dashboard hammers the production database with SELECT queries, slowing the app. The RDS-native fix is…",
          options: ["Add read replicas and point reports at them", "Enable Multi-AZ", "Move the database to Glacier", "Add a NAT Gateway"],
          answer: [0],
          explain: "Read-heavy pressure → read replicas. Reports read from the replica; the primary keeps its capacity for the app's writes.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "Aurora — AWS's hot-rod relational engine",
      minutes: 4,
      html: `
        <p><strong>Amazon Aurora</strong> is AWS's own relational database engine, offered through RDS. It's <strong>compatible with MySQL and PostgreSQL</strong> — your apps talk to it the same way — but re-engineered for the cloud:</p>
        <ul>
          <li><strong>Up to 5× faster than standard MySQL</strong>, ~3× faster than standard PostgreSQL.</li>
          <li><strong>Six copies of your data across three AZs</strong>, automatically — resilience is built into its storage layer.</li>
          <li>Storage <strong>grows automatically</strong> as data grows.</li>
          <li><strong>Aurora Serverless</strong> — capacity that scales up and down on its own (even pausing when idle); great for unpredictable or intermittent workloads, pay per use.</li>
        </ul>
        <div class="callout"><b>Positioning</b>
        Think of the ladder: self-managed DB on EC2 (max control, max work) → RDS with a standard engine (managed) → Aurora (managed + cloud-native performance and resilience). Aurora costs more than standard RDS engines but delivers more.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers: "MySQL/PostgreSQL-<strong>compatible</strong>, enterprise performance" → <strong>Aurora</strong>. "Relational database with <strong>unpredictable/intermittent</strong> usage, pay only while it runs" → <strong>Aurora Serverless</strong>.</div>
      `,
      quiz: [
        {
          q: "Amazon Aurora is compatible with which database engines?",
          options: ["Oracle and SQL Server", "MySQL and PostgreSQL", "MongoDB and Cassandra", "Redis and Memcached"],
          answer: [1],
          explain: "Aurora speaks MySQL and PostgreSQL dialects with big performance gains — drop-in compatible for apps using those engines.",
        },
        {
          q: "A development database is used a few hours a day, unpredictably. Which option minimizes cost while staying relational?",
          options: ["A large provisioned RDS instance", "Aurora Serverless", "Amazon Redshift", "ElastiCache"],
          answer: [1],
          explain: "Aurora Serverless scales with actual usage and can pause when idle — a relational database billed like a utility.",
        },
        {
          q: "How does Aurora protect your data by default?",
          options: [
            "One copy on one disk",
            "Six copies of data across three Availability Zones",
            "A weekly tape backup",
            "It emails you the data",
          ],
          answer: [1],
          explain: "Aurora's storage layer keeps 6 copies across 3 AZs automatically — durability engineered in, no configuration required.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "DynamoDB — NoSQL at any scale",
      minutes: 5,
      html: `
        <p>Not all data fits neatly into related tables. <strong>NoSQL</strong> databases trade rigid schemas for flexibility and massive scale. AWS's flagship is <strong>Amazon DynamoDB</strong>:</p>
        <ul>
          <li>A <strong>key-value / document database</strong> — look items up by key, blazingly fast.</li>
          <li><strong>Serverless</strong> — no instances to size or patch; it just scales, to millions of requests per second.</li>
          <li><strong>Single-digit millisecond</strong> response times, at any size.</li>
          <li><strong>Global tables</strong> — replicate a table across multiple Regions with local read/write speed everywhere.</li>
          <li>Highly available by design — data replicated across multiple AZs automatically.</li>
        </ul>
        <p>Where it shines: shopping carts, user sessions, gaming leaderboards, IoT streams — huge volumes of simple lookups. Where it doesn't: complex multi-table JOINs and ad-hoc SQL analysis — that's relational territory.</p>
        <div class="callout"><b>SQL or NoSQL? The exam's decision rule</b>
        Complex queries, JOINs, transactions across tables, structured schema → <strong>RDS/Aurora</strong>. Key-value lookups, flexible schema, extreme scale, serverless → <strong>DynamoDB</strong>.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Triggers for DynamoDB: "<em>NoSQL</em>," "<em>key-value</em>," "<em>single-digit millisecond</em>," "<em>serverless database</em>," "<em>millions of requests per second</em>." Also pairs constantly with Lambda in serverless architectures.</div>
      `,
      quiz: [
        {
          q: "Which AWS database is a serverless NoSQL key-value store with single-digit-millisecond performance?",
          options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon Neptune"],
          answer: [1],
          explain: "That sentence is DynamoDB's product description almost verbatim — memorize those trigger words.",
        },
        {
          q: "A gaming app needs a leaderboard handling millions of simple reads/writes per second worldwide. Best fit?",
          options: ["RDS for Oracle", "DynamoDB with global tables", "ElastiCache alone", "S3 Standard"],
          answer: [1],
          explain: "Massive-scale key-value access + multi-Region = DynamoDB global tables. Relational engines would buckle or cost a fortune at this pattern.",
        },
        {
          q: "When is a relational database (RDS/Aurora) the BETTER choice over DynamoDB?",
          options: [
            "When you need complex SQL queries and JOINs across structured tables",
            "When you need key-value lookups at extreme scale",
            "When you want a serverless database",
            "Never — DynamoDB is always better",
          ],
          answer: [0],
          explain: "Complex relationships and SQL analytics are what relational engines are FOR. DynamoDB wins on scale and simplicity, not query richness.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "Redshift & ElastiCache — the specialists",
      minutes: 5,
      html: `
        <p>Two more databases with very specific jobs:</p>
        <ul>
          <li><strong>Amazon Redshift</strong> — the <strong>data warehouse</strong>. Built not for running your app but for <strong>analytics</strong>: pointing SQL at YEARS of accumulated data — petabytes — and asking big questions ("revenue by region by quarter, trended"). Loads data from many sources; business-intelligence tools plug into it. Keyword pair: <strong>OLAP/analytics</strong> (Redshift) vs OLTP/transactions (RDS).</li>
          <li><strong>Amazon ElastiCache</strong> — the <strong>in-memory cache</strong>, managed <strong>Redis or Memcached</strong>. It keeps hot data in RAM for <strong>microsecond</strong> reads, sitting in front of your database so repeated queries ("today's top products") never hit the disk-based DB at all. Result: faster app, cheaper database tier.</li>
        </ul>
        <div class="callout"><b>The restaurant analogy</b>
        RDS is the kitchen cooking each order; ElastiCache is the warming shelf holding the popular dishes ready to serve instantly; Redshift is the accountant's office analyzing five years of receipts. Different rooms, different jobs.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Data warehouse," "analyze historical data," "business intelligence at petabyte scale" → <strong>Redshift</strong>. "In-memory," "microsecond," "reduce database load," "Redis/Memcached" → <strong>ElastiCache</strong>.</div>
      `,
      quiz: [
        {
          q: "A company wants to run complex analytical SQL queries across five years of sales data (hundreds of TB) for BI dashboards. Which service?",
          options: ["Amazon RDS", "Amazon Redshift", "Amazon ElastiCache", "Amazon Neptune"],
          answer: [1],
          explain: "Petabyte-scale historical analytics = the data warehouse = Redshift. RDS handles live transactions, not warehouse-scale analysis.",
        },
        {
          q: "An app repeatedly queries the same product catalog data, straining its RDS instance. What's the classic fix?",
          options: [
            "Add ElastiCache to serve hot data from memory",
            "Move the catalog to Redshift",
            "Enable RDS Multi-AZ",
            "Use S3 Glacier",
          ],
          answer: [0],
          explain: "Caching frequently-read data in ElastiCache (Redis/Memcached) serves repeats at microsecond speed and takes the load off the database.",
        },
        {
          q: "ElastiCache supports which two engines?",
          options: ["MySQL and PostgreSQL", "Redis and Memcached", "Oracle and SQL Server", "MongoDB and Cassandra"],
          answer: [1],
          explain: "ElastiCache = managed Redis and Memcached, the two standard in-memory cache engines.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "The rest of the family + moving databases with DMS",
      minutes: 5,
      html: `
        <p>Name-recognition round — one line each is all the exam needs:</p>
        <table>
          <tr><th>Service</th><th>Type</th><th>Trigger phrase</th></tr>
          <tr><td><strong>Amazon Neptune</strong></td><td>Graph database</td><td>"relationships between data" — social networks, recommendations, fraud rings</td></tr>
          <tr><td><strong>Amazon DocumentDB</strong></td><td>Document database</td><td>"MongoDB-compatible"</td></tr>
          <tr><td><strong>Amazon Timestream</strong></td><td>Time-series database</td><td>"IoT sensor readings over time"</td></tr>
        </table>
        <p>And the mover: <strong>AWS DMS (Database Migration Service)</strong> migrates databases into AWS <strong>while the source stays live</strong> — minimal downtime. Two flavors:</p>
        <ul>
          <li><strong>Homogeneous</strong> — same engine to same engine (MySQL → MySQL on RDS). Straightforward.</li>
          <li><strong>Heterogeneous</strong> — different engines (Oracle → Aurora). The <strong>Schema Conversion Tool (SCT)</strong> converts the schema first, then DMS moves the data.</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Migrate our database to AWS <strong>with minimal downtime</strong>" → <strong>DMS</strong>. "Oracle to Aurora" (different engines) → <strong>SCT + DMS</strong>. Graph/relationships → <strong>Neptune</strong>. MongoDB → <strong>DocumentDB</strong>.</div>
      `,
      quiz: [
        {
          q: "A social app needs to store and query complex relationships — who follows whom, friend-of-friend suggestions. Which purpose-built database?",
          options: ["Amazon Neptune", "Amazon Redshift", "Amazon ElastiCache", "Amazon Timestream"],
          answer: [0],
          explain: "Relationship-shaped data = graph database = Neptune. It's built to traverse connections that would take painful JOINs elsewhere.",
        },
        {
          q: "A company must migrate its production MySQL database to RDS while the business keeps running. Which service minimizes downtime?",
          options: ["AWS Snowball", "AWS DMS", "Amazon Kinesis", "AWS Backup"],
          answer: [1],
          explain: "DMS replicates from the live source to the target, letting you cut over with minimal interruption — the database-migration answer.",
        },
        {
          q: "Migrating from Oracle to Aurora PostgreSQL requires converting the database schema first. Which tool does that?",
          options: ["AWS Schema Conversion Tool (SCT)", "AWS Config", "Amazon Inspector", "S3 lifecycle policies"],
          answer: [0],
          explain: "Different engines = heterogeneous migration = SCT converts schema/code, then DMS moves the data.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "<strong>RDS</strong> = managed relational (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server): AWS handles patching, backups, failover. <strong>Multi-AZ = availability</strong> (standby + auto-failover) · <strong>read replicas = read scaling</strong>. Never confuse the two.",
    "<strong>Aurora</strong> = AWS-built, MySQL/PostgreSQL-compatible, up to 5× faster, 6 copies across 3 AZs, auto-growing storage. <strong>Aurora Serverless</strong> for unpredictable workloads.",
    "<strong>DynamoDB</strong> = serverless NoSQL key-value: single-digit ms, effectively unlimited scale, multi-AZ by design, <strong>global tables</strong> for multi-Region. Pairs with Lambda.",
    "SQL vs NoSQL rule: JOINs/complex queries/structure → <strong>RDS/Aurora</strong> · key-value at scale/flexible schema/serverless → <strong>DynamoDB</strong>.",
    "<strong>Redshift</strong> = data warehouse for petabyte-scale ANALYTICS (OLAP). <strong>ElastiCache</strong> (Redis/Memcached) = in-memory microsecond cache that offloads your database.",
    "Niche: <strong>Neptune</strong> = graph (relationships) · <strong>DocumentDB</strong> = MongoDB-compatible · <strong>Timestream</strong> = time-series (IoT).",
    "<strong>DMS</strong> migrates live databases with minimal downtime; add <strong>SCT</strong> when the engines differ (heterogeneous).",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which tasks does Amazon RDS handle on your behalf? (Select TWO)",
        options: [
          "Database software patching",
          "Writing your application queries",
          "Automated backups",
          "Choosing your table names",
        ],
        answer: [0, 2],
        explain: "RDS automates the operational grind — patching, backups, failover plumbing. Schema design and queries remain your job.",
      },
      {
        q: "What is the PRIMARY purpose of an RDS Multi-AZ deployment?",
        options: [
          "Faster read performance",
          "High availability via automatic failover to a standby in another AZ",
          "Cheaper storage",
          "Cross-Region analytics",
        ],
        answer: [1],
        explain: "Multi-AZ = a synchronously-updated standby that takes over automatically. It serves zero traffic day-to-day — it's insurance, not speed.",
      },
      {
        q: "An e-commerce site's RDS primary is overwhelmed by read queries from its product pages. The standard remedy is…",
        options: ["Read replicas", "Multi-AZ", "A bigger NAT Gateway", "S3 Transfer Acceleration"],
        answer: [0],
        explain: "Read replicas absorb read traffic (and can sit in other Regions). Multi-AZ wouldn't help — its standby doesn't serve reads.",
      },
      {
        q: "Which database is MySQL- and PostgreSQL-compatible with up to 5× the throughput of standard MySQL?",
        options: ["Amazon DynamoDB", "Amazon Aurora", "Amazon Redshift", "Amazon DocumentDB"],
        answer: [1],
        explain: "Aurora is AWS's cloud-native relational engine: familiar dialects, re-engineered storage, 6 copies across 3 AZs.",
      },
      {
        q: "A serverless web app needs a database with no servers to manage, millisecond lookups by user ID, and automatic scaling to millions of requests. Which service?",
        options: ["Amazon DynamoDB", "RDS for MySQL", "Amazon Redshift", "Amazon Neptune"],
        answer: [0],
        explain: "Key-based access + serverless + extreme scale = DynamoDB, the default database of serverless architectures.",
      },
      {
        q: "Which workload belongs on Amazon Redshift?",
        options: [
          "Processing individual customer orders in real time",
          "Complex analytical queries across years of historical data for BI reports",
          "Caching session data in memory",
          "Storing user-uploaded images",
        ],
        answer: [1],
        explain: "Redshift is the OLAP warehouse — big retrospective analysis. Order processing is OLTP (RDS), caching is ElastiCache, images are S3.",
      },
      {
        q: "What is the purpose of Amazon ElastiCache?",
        options: [
          "Long-term archival storage",
          "In-memory caching (Redis/Memcached) for microsecond reads and reduced database load",
          "Graph relationship queries",
          "Database schema conversion",
        ],
        answer: [1],
        explain: "ElastiCache keeps hot data in RAM in front of your database — the standard 'make it faster AND cheaper' layer.",
      },
      {
        q: "A fraud-detection team needs to analyze networks of connected accounts and transactions. Which purpose-built database fits?",
        options: ["Amazon Neptune", "Amazon Timestream", "Amazon ElastiCache", "Amazon Redshift"],
        answer: [0],
        explain: "Fraud rings are relationship webs — graph territory — and Neptune is AWS's graph database.",
      },
      {
        q: "Which service would a company use for a MongoDB-compatible managed document database?",
        options: ["Amazon DocumentDB", "Amazon Aurora", "Amazon RDS for MariaDB", "AWS DMS"],
        answer: [0],
        explain: "DocumentDB = the MongoDB-compatible one. The word 'MongoDB' in a question is a direct pointer.",
      },
      {
        q: "A company migrates its on-premises PostgreSQL database to Amazon RDS with only minutes of cutover downtime. Which service enables this?",
        options: ["AWS Database Migration Service", "AWS Snowball Edge", "Amazon Kinesis", "AWS Batch"],
        answer: [0],
        explain: "DMS keeps the source live while replicating to the target — the minimal-downtime migration path (homogeneous here, so no SCT needed).",
      },
      {
        q: "Which TWO statements about DynamoDB are true? (Select TWO)",
        options: [
          "It requires you to provision and patch EC2 instances",
          "It delivers single-digit-millisecond performance",
          "Global tables replicate data across Regions",
          "It is ideal for complex multi-table JOIN queries",
        ],
        answer: [1, 2],
        explain: "DynamoDB is serverless (no instances), fast (single-digit ms), and multi-Region via global tables. JOINs are its weakness, not a feature.",
      },
      {
        q: "An IoT platform stores millions of timestamped sensor readings and queries trends over time windows. The purpose-built option is…",
        options: ["Amazon Timestream", "Amazon DocumentDB", "AWS DMS", "Amazon S3 Glacier"],
        answer: [0],
        explain: "Time-series data (readings over time) → Timestream. Purpose-built beats general-purpose for this shape of data.",
      },
    ],
  },
});
