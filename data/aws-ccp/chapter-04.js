/* ============================================================
   AWS CCP — Chapter 4: Storage
   Day 5 · S3 + storage classes, EBS vs EFS vs FSx,
   Snow family, Storage Gateway, AWS Backup.
   ============================================================ */
window.LEARN.registerChapter({
  examId: "aws-ccp",
  id: "ch04",
  num: 4,
  title: "Storage",

  bursts: [
    /* ---------------------------------------------------------- */
    {
      id: "b1",
      title: "Amazon S3 — the internet's filing cabinet",
      minutes: 5,
      html: `
        <p><strong>Amazon S3 (Simple Storage Service)</strong> is <strong>object storage</strong>: you store files — called <strong>objects</strong> — inside <strong>buckets</strong>. Any file type, from a 1-byte note to a 5 TB video. Websites serve images from it, apps park backups in it, data lakes are built on it.</p>
        <p>The facts the exam cares about:</p>
        <ul>
          <li><strong>Durability: 99.999999999% — "eleven nines."</strong> S3 automatically stores copies of every object across <strong>multiple Availability Zones</strong>. Statistically, store 10 million files and expect to lose one every 10,000 years. When you hear "durability," think "will my data still exist?"</li>
          <li><strong>Virtually unlimited</strong> — no capacity planning, ever. Buckets grow as you add objects.</li>
          <li><strong>Pay for what you store</strong> (per GB-month) plus requests and data transfer out.</li>
          <li><strong>Versioning</strong> — optional: keep every version of an object, so overwrites and deletes are recoverable.</li>
          <li>Objects are addressed by <strong>keys</strong> (names), not folders on a disk — S3 is not a hard drive you attach; you talk to it over the network/API.</li>
        </ul>
        <div class="callout"><b>Object vs block vs file — the chapter's spine</b>
        <strong>Object storage (S3)</strong>: whole files via API — backups, media, static websites. <strong>Block storage (EBS)</strong>: a virtual hard drive for ONE server. <strong>File storage (EFS/FSx)</strong>: a shared network drive MANY servers mount at once. Every storage question is secretly asking which of these three you need.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Static website hosting," "data lake," "store backups/media," "11 nines of durability" → <strong>S3</strong>. It's the default answer for storing <em>files the cloud way</em>.</div>
      `,
      quiz: [
        {
          q: "In S3, files are stored as ______ inside ______.",
          options: ["blocks / volumes", "objects / buckets", "rows / tables", "files / folders on a virtual disk"],
          answer: [1],
          explain: "S3 is object storage: objects (files + metadata) live in buckets and are accessed by key over an API — not mounted like a disk.",
        },
        {
          q: "S3's famous '11 nines' (99.999999999%) refers to its…",
          options: ["Availability", "Durability — the chance your data is never lost", "Network speed", "Discount rate"],
          answer: [1],
          explain: "Durability = data survival. S3 achieves it by replicating objects across multiple AZs automatically. (Availability — can I reach it right now — is a separate, lower number.)",
        },
        {
          q: "Which is a classic use case for S3?",
          options: [
            "The boot disk for an EC2 instance",
            "Hosting a static website's files and storing backups",
            "A shared POSIX file system for 50 Linux servers",
            "Running a relational database engine directly",
          ],
          answer: [1],
          explain: "Static sites, backups, media, data lakes = S3. Boot disks are EBS (block); shared Linux mounts are EFS (file).",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b2",
      title: "S3 storage classes — same bucket, different price tags",
      minutes: 6,
      html: `
        <p>Not all data deserves the same storage price. S3 offers <strong>storage classes</strong> — cheaper rates for data you touch less often, in exchange for retrieval costs or delays:</p>
        <table>
          <tr><th>Class</th><th>For data that's…</th><th>Catch</th></tr>
          <tr><td><strong>S3 Standard</strong></td><td>Accessed frequently</td><td>Highest storage price, no retrieval fee</td></tr>
          <tr><td><strong>S3 Standard-IA</strong></td><td>Infrequently accessed but needed instantly when asked</td><td>Cheaper storage, pay per retrieval</td></tr>
          <tr><td><strong>S3 One Zone-IA</strong></td><td>Infrequent AND re-creatable</td><td>Single AZ only — cheaper, less resilient</td></tr>
          <tr><td><strong>S3 Glacier Instant Retrieval</strong></td><td>Archives needing millisecond access (~quarterly)</td><td>Higher retrieval cost</td></tr>
          <tr><td><strong>S3 Glacier Flexible Retrieval</strong></td><td>Archives that can wait <strong>minutes–hours</strong></td><td>Retrieval takes time</td></tr>
          <tr><td><strong>S3 Glacier Deep Archive</strong></td><td>Almost never touched (7–10 yr retention)</td><td><strong>Cheapest of all; retrieval ~12+ hours</strong></td></tr>
          <tr><td><strong>S3 Intelligent-Tiering</strong></td><td><strong>Unknown/changing</strong> access patterns</td><td>Small monitoring fee; moves objects between tiers automatically</td></tr>
        </table>
        <p>And you don't have to move data by hand: <strong>lifecycle policies</strong> automate it — e.g., "after 30 days move to Standard-IA, after 90 to Glacier, delete after 7 years."</p>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Keyword mapping: "access patterns unknown/unpredictable" → <strong>Intelligent-Tiering</strong> · "compliance archive, kept 10 years, rarely retrieved, lowest cost" → <strong>Glacier Deep Archive</strong> · "infrequent but must be instant" → <strong>Standard-IA</strong> · "automate moving objects as they age" → <strong>lifecycle policy</strong>.</div>
      `,
      quiz: [
        {
          q: "Financial records must be retained for 10 years, are almost never accessed, and cost must be as low as possible. Which class?",
          options: ["S3 Standard", "S3 Intelligent-Tiering", "S3 Glacier Deep Archive", "S3 One Zone-IA"],
          answer: [2],
          explain: "Deep Archive is the bargain basement — pennies per TB — with ~12-hour retrieval, perfect for keep-just-in-case compliance data.",
        },
        {
          q: "A dataset's access pattern is completely unpredictable — hot some months, cold others. Which class optimizes cost automatically?",
          options: ["S3 Standard-IA", "S3 Intelligent-Tiering", "S3 Glacier Flexible Retrieval", "S3 Standard"],
          answer: [1],
          explain: "Intelligent-Tiering watches each object's usage and shuffles it between tiers for you — the 'I don't know my pattern' answer.",
        },
        {
          q: "What does an S3 lifecycle policy do?",
          options: [
            "Encrypts objects at upload",
            "Automatically transitions objects between storage classes (and/or expires them) as they age",
            "Backs up S3 to EBS",
            "Controls who can read a bucket",
          ],
          answer: [1],
          explain: "Lifecycle rules = automated aging: Standard → IA → Glacier → delete, on your schedule, no manual moves.",
        },
        {
          q: "Old marketing photos are rarely needed, but when someone asks, they need them immediately. They could NOT be recreated if lost. Best class?",
          options: ["S3 Standard-IA", "S3 One Zone-IA", "S3 Glacier Deep Archive", "Delete them"],
          answer: [0],
          explain: "Infrequent + instant access + must survive an AZ loss = Standard-IA. One Zone-IA would be cheaper but risks the single-AZ failure for irreplaceable data.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b3",
      title: "EBS — hard drives for your instances",
      minutes: 5,
      html: `
        <p><strong>Amazon EBS (Elastic Block Store)</strong> is <strong>block storage</strong>: virtual hard drives — <strong>volumes</strong> — that attach to EC2 instances. Your instance's operating system, databases, and applications live on EBS just like they'd live on a laptop's SSD.</p>
        <ul>
          <li><strong>One instance at a time</strong> — an EBS volume attaches to a single instance (contrast with EFS, next burst).</li>
          <li><strong>AZ-bound</strong> — a volume lives in ONE Availability Zone and can only attach to instances in that same AZ.</li>
          <li><strong>Persistent</strong> — data survives stopping/restarting the instance, and a volume can outlive its instance entirely.</li>
          <li><strong>Snapshots</strong> — point-in-time backups of a volume, stored (behind the scenes) in S3. Snapshots are also how you move data across AZs or Regions: snapshot → restore elsewhere.</li>
        </ul>
        <div class="callout"><b>The other kind: instance store</b>
        Some instance types include <strong>instance store</strong> — disk physically attached to the host. It's blazing fast but <strong>ephemeral: data vanishes when the instance stops</strong>. Use it for caches and scratch space only. Exam contrast: EBS = persistent, instance store = temporary.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Boot volume / database disk for ONE EC2 instance" → <strong>EBS</strong>. "Back up a volume" → <strong>snapshot</strong>. "Temporary high-speed scratch data, lost on stop" → <strong>instance store</strong>. "Volume and instance must be in the same ___" → <strong>Availability Zone</strong>.</div>
      `,
      quiz: [
        {
          q: "Amazon EBS provides…",
          options: [
            "Object storage for media files",
            "Block-level storage volumes that attach to EC2 instances",
            "A shared file system for hundreds of instances",
            "A content delivery network",
          ],
          answer: [1],
          explain: "EBS = the virtual hard drive of the EC2 world: block storage, one instance at a time, persistent, AZ-bound.",
        },
        {
          q: "How do you create a point-in-time backup of an EBS volume?",
          options: ["A lifecycle policy", "An EBS snapshot", "An AMI only", "Copying files to instance store"],
          answer: [1],
          explain: "Snapshots capture the volume at a moment in time (stored durably via S3) and can be restored into new volumes — even in other AZs or Regions.",
        },
        {
          q: "Which statement about instance store is TRUE?",
          options: [
            "Its data persists forever",
            "It's slower than EBS",
            "Its data is lost when the instance stops — it's ephemeral",
            "It can be attached to 100 instances at once",
          ],
          answer: [2],
          explain: "Instance store is physically-attached, very fast, and temporary. Anything you can't afford to lose belongs on EBS (or S3/EFS).",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b4",
      title: "EFS & FSx — the shared drives",
      minutes: 5,
      html: `
        <p>When MANY servers need the SAME files at the same time, block storage won't do — you need <strong>file storage</strong>, a network drive everyone mounts:</p>
        <ul>
          <li><strong>Amazon EFS (Elastic File System)</strong> — a shared file system for <strong>Linux</strong> workloads. <strong>Thousands of instances can mount it simultaneously</strong>, across <strong>multiple AZs</strong> in a Region. It grows and shrinks automatically — no capacity to provision. Pay for what you use.</li>
          <li><strong>Amazon FSx</strong> — managed versions of specialized file systems. Two names to know:
            <ul>
              <li><strong>FSx for Windows File Server</strong> — a native <strong>Windows</strong> share (SMB protocol, integrates with Active Directory). The answer for Windows shared drives.</li>
              <li><strong>FSx for Lustre</strong> — extreme-speed file system for <strong>high-performance computing (HPC)</strong> and machine learning.</li>
            </ul></li>
        </ul>
        <div class="callout"><b>EBS vs EFS in one breath</b>
        EBS: one instance, one AZ, you pick the size. EFS: many instances, many AZs, elastic size. If the question says "multiple instances need shared access" — EBS is the trap, EFS is the answer.</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Shared storage for many <strong>Linux</strong> instances" → <strong>EFS</strong> · "<strong>Windows</strong> file share / SMB / Active Directory" → <strong>FSx for Windows</strong> · "<strong>HPC</strong> / ML training file system" → <strong>FSx for Lustre</strong>.</div>
      `,
      quiz: [
        {
          q: "Twenty Linux EC2 instances across three AZs must read and write the same set of files concurrently. Which service?",
          options: ["Amazon EBS", "Amazon EFS", "Instance store", "S3 Glacier"],
          answer: [1],
          explain: "Shared + Linux + multi-AZ + concurrent = EFS. EBS can't do it (one instance, one AZ) — that's the classic trap pairing.",
        },
        {
          q: "A company migrating Windows applications needs a shared file system that works with SMB and Active Directory. Which service?",
          options: ["Amazon EFS", "FSx for Windows File Server", "FSx for Lustre", "Amazon S3"],
          answer: [1],
          explain: "Windows-native shares = FSx for Windows. EFS is the Linux answer; Lustre is the HPC answer.",
        },
        {
          q: "Which FSx flavor is built for high-performance computing and ML training workloads?",
          options: ["FSx for Windows File Server", "FSx for Lustre", "FSx for WordPress", "FSx for Glacier"],
          answer: [1],
          explain: "Lustre = the speed demon for HPC/ML. Hear 'high-performance computing,' say 'Lustre.'",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b5",
      title: "Moving mountains of data — the Snow family",
      minutes: 4,
      html: `
        <p>How do you move 500 TB to AWS when your office internet would take <strong>months</strong> and cost a fortune? You ship it. The <strong>AWS Snow family</strong> are rugged physical devices AWS mails to you:</p>
        <ul>
          <li>AWS ships the device → you copy data onto it locally → ship it back → AWS loads it into S3. Data is <strong>encrypted</strong> the whole way.</li>
          <li><strong>AWS Snowball Edge</strong> is the flagship: dozens-of-terabytes capacity per device (order several for petabytes), plus onboard compute so it can run processing <strong>at remote/disconnected sites</strong> — ships, mines, field research — places with little or no connectivity.</li>
        </ul>
        <div class="callout"><b>When Snow beats the network</b>
        Rule of thumb: if uploading would take more than about a week, or the site has poor/no connectivity, physical transfer wins. (For ongoing ONLINE transfers over a good connection, services like <strong>AWS DataSync</strong> handle it — a name we'll meet again in Chapter 11.)</div>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        Trigger: "<em>transfer X hundred TB with limited bandwidth / from a remote location</em>" → <strong>Snow family (Snowball Edge)</strong>. The absurd-sounding "truck full of hard drives" answer is genuinely correct on this exam.</div>
      `,
      quiz: [
        {
          q: "A research station with a weak satellite link needs to move 300 TB of sensor data to AWS. Best option?",
          options: [
            "Upload over the satellite link",
            "AWS Snowball Edge devices",
            "Amazon CloudFront",
            "An EBS snapshot",
          ],
          answer: [1],
          explain: "Huge data + bad connectivity = ship it. Snowball Edge devices are couriered, loaded locally, and returned to AWS for import into S3.",
        },
        {
          q: "Besides transferring data, what extra ability does Snowball Edge have?",
          options: [
            "It can host a public website",
            "Onboard compute — it can run processing at disconnected edge locations",
            "It provides free internet",
            "It replaces Direct Connect",
          ],
          answer: [1],
          explain: "'Edge' is the hint: Snowball Edge carries compute, so remote sites can process data locally before (or instead of) shipping it back.",
        },
        {
          q: "Data on a Snow device in transit is protected how?",
          options: ["It isn't", "Encryption", "A padlock only", "By shipping it twice"],
          answer: [1],
          explain: "Snow devices encrypt everything; a lost or stolen box yields nothing readable. Security travels with the data.",
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      id: "b6",
      title: "Hybrid storage & backups — Storage Gateway, AWS Backup",
      minutes: 4,
      html: `
        <p>Two closers for the storage chapter:</p>
        <ul>
          <li><strong>AWS Storage Gateway</strong> — the <strong>hybrid storage bridge</strong>: software running in your own data center that connects your on-premises apps to AWS storage. Local apps keep working as if the storage were local (with a cache for speed), while data actually flows to S3/AWS. Three modes to recognize by name: <strong>File Gateway</strong> (files → S3), <strong>Volume Gateway</strong> (disk volumes backed to AWS), <strong>Tape Gateway</strong> (replaces physical backup tapes with virtual ones).</li>
          <li><strong>AWS Backup</strong> — <strong>one service to schedule and manage backups across many AWS services</strong> (EBS, EFS, RDS, DynamoDB…) with central policies: "back up nightly, retain 35 days," applied everywhere. The answer to "centralize/automate backups across AWS services."</li>
        </ul>
        <div class="callout exam-tip"><b>🎯 Exam radar</b>
        "Connect ON-PREMISES applications to cloud storage" → <strong>Storage Gateway</strong>. "Replace physical tape backups" → <strong>Tape Gateway</strong>. "Centrally manage/automate backups across multiple AWS services" → <strong>AWS Backup</strong>. Don't confuse Storage Gateway (live hybrid bridge) with Snow (one-time physical shipment).</div>
      `,
      quiz: [
        {
          q: "A company keeps its applications on-premises but wants them to seamlessly store data in AWS with local caching. Which service?",
          options: ["AWS Snowball Edge", "AWS Storage Gateway", "Amazon Lightsail", "AWS Batch"],
          answer: [1],
          explain: "Storage Gateway is the always-on hybrid bridge: on-prem apps talk to it like local storage while data lives in AWS. Snow is for one-time bulk shipments.",
        },
        {
          q: "Which Storage Gateway mode replaces physical backup tapes?",
          options: ["File Gateway", "Volume Gateway", "Tape Gateway", "Snow Gateway"],
          answer: [2],
          explain: "Tape Gateway emulates a tape library, so existing backup software writes 'tapes' that actually land in cheap S3/Glacier storage.",
        },
        {
          q: "A company wants ONE place to define backup schedules and retention for its EBS volumes, RDS databases, and EFS file systems. Which service?",
          options: ["AWS Backup", "EBS snapshots configured separately", "Amazon S3 versioning", "AWS Artifact"],
          answer: [0],
          explain: "AWS Backup centralizes backup policy across services — set the plan once, apply it everywhere, prove compliance.",
        },
      ],
    },
  ],

  /* ---------------- chapter overview ---------------- */
  overview: [
    "Three storage shapes: <strong>object (S3)</strong> = files via API · <strong>block (EBS)</strong> = one instance's virtual disk · <strong>file (EFS/FSx)</strong> = shared network drive. Most questions are secretly this choice.",
    "<strong>S3</strong>: buckets + objects, virtually unlimited, <strong>11 nines durability</strong> via multi-AZ replication, versioning, static website hosting, data lakes.",
    "Storage classes by access pattern: Standard → <strong>Standard-IA</strong> (infrequent, instant) → <strong>One Zone-IA</strong> (re-creatable) → <strong>Glacier Instant/Flexible</strong> → <strong>Deep Archive</strong> (cheapest, ~12 hr) · <strong>Intelligent-Tiering</strong> when patterns are unknown · <strong>lifecycle policies</strong> automate transitions.",
    "<strong>EBS</strong>: persistent, single-instance, <strong>AZ-bound</strong>; back up with <strong>snapshots</strong>. <strong>Instance store</strong>: fast but ephemeral — gone on stop.",
    "<strong>EFS</strong> = elastic shared file system for <strong>Linux</strong>, thousands of instances, multi-AZ. <strong>FSx for Windows</strong> = SMB/Active Directory shares. <strong>FSx for Lustre</strong> = HPC/ML speed.",
    "<strong>Snow family (Snowball Edge)</strong>: physically ship huge datasets (or compute at disconnected sites) when networks are too slow.",
    "<strong>Storage Gateway</strong> = live on-prem↔AWS bridge (File/Volume/<strong>Tape</strong> modes). <strong>AWS Backup</strong> = central, automated backup policies across AWS services.",
  ],

  /* ---------------- chapter exam ---------------- */
  exam: {
    passPct: 70,
    questions: [
      {
        q: "Which AWS service provides object storage with 99.999999999% (11 nines) durability?",
        options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Instance store"],
        answer: [1],
        explain: "S3 is the object store, and 11 nines durability (via automatic multi-AZ replication) is its signature stat.",
      },
      {
        q: "A startup wants to host the images, CSS, and HTML of a static website. The most appropriate service is…",
        options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "AWS Storage Gateway"],
        answer: [1],
        explain: "Static website assets are S3's bread and butter (often fronted by CloudFront for global speed).",
      },
      {
        q: "Compliance data must be kept for 8 years at the absolute lowest storage cost; retrieval within 24 hours is acceptable. Choose the storage class.",
        options: ["S3 Standard", "S3 Standard-IA", "S3 Glacier Deep Archive", "S3 Intelligent-Tiering"],
        answer: [2],
        explain: "Cheapest + rarely-if-ever accessed + can wait ~12 hours = Deep Archive, the coldest tier.",
      },
      {
        q: "Which TWO statements about EBS are true? (Select TWO)",
        options: [
          "A volume attaches to one instance at a time",
          "A volume can be mounted by thousands of instances simultaneously",
          "Volumes exist within a single Availability Zone",
          "Data is always lost when an instance stops",
        ],
        answer: [0, 2],
        explain: "EBS = single-attach, AZ-bound, persistent block storage. Simultaneous multi-instance mounting is EFS; losing data on stop is instance store.",
      },
      {
        q: "What is the purpose of an EBS snapshot?",
        options: [
          "To speed up the volume",
          "A point-in-time backup that can restore the volume (even in another AZ or Region)",
          "To convert the volume to object storage permanently",
          "To share the volume with another AWS customer",
        ],
        answer: [1],
        explain: "Snapshots are the backup/migration mechanism for EBS — captured incrementally and restorable wherever you need a copy.",
      },
      {
        q: "A fleet of Linux web servers in three AZs needs one shared, elastic file system. Which service?",
        options: ["Amazon EBS", "Amazon EFS", "Instance store", "S3 One Zone-IA"],
        answer: [1],
        explain: "Multi-instance + multi-AZ + Linux + grows automatically = EFS, the shared network file system.",
      },
      {
        q: "Which service provides a fully managed Windows-native file share supporting SMB and Active Directory?",
        options: ["Amazon EFS", "Amazon FSx for Windows File Server", "Amazon FSx for Lustre", "AWS Backup"],
        answer: [1],
        explain: "Windows/SMB/AD keywords point to FSx for Windows every time. EFS serves Linux; Lustre serves HPC.",
      },
      {
        q: "A film studio must move 800 TB of footage to AWS within two weeks over a slow connection. What should it use?",
        options: ["Multipart upload over the internet", "AWS Snowball Edge devices", "AWS Storage Gateway", "Amazon CloudFront"],
        answer: [1],
        explain: "Petabyte-ish data + inadequate bandwidth + deadline = ship Snowball Edge devices. The network simply can't carry it in time.",
      },
      {
        q: "An on-premises backup system writes to tape libraries. The company wants to eliminate physical tapes without changing its backup software. Which service/mode?",
        options: ["Storage Gateway — Tape Gateway", "Storage Gateway — File Gateway", "AWS Snowcone", "Amazon EFS"],
        answer: [0],
        explain: "Tape Gateway presents virtual tapes to existing backup software while storing the data in AWS — tapes gone, workflow unchanged.",
      },
      {
        q: "Which service centrally automates and manages backups across EBS, RDS, EFS, and DynamoDB?",
        options: ["AWS Backup", "S3 lifecycle policies", "EC2 Auto Scaling", "AWS Artifact"],
        answer: [0],
        explain: "AWS Backup is the single control panel for backup plans, schedules, and retention across many AWS services.",
      },
      {
        q: "Temporary scratch files for a video-processing job need the fastest possible disk and can be lost without consequence. Cheapest suitable option on a supported instance?",
        options: ["Instance store", "S3 Standard", "EBS with snapshots", "EFS"],
        answer: [0],
        explain: "Ephemeral + speed + disposable = instance store, the physically-attached scratch disk that vanishes on stop (which is fine here).",
      },
      {
        q: "Which S3 feature protects against accidental overwrites and deletions by keeping prior copies of objects?",
        options: ["Lifecycle policies", "Versioning", "Intelligent-Tiering", "Transfer Acceleration"],
        answer: [1],
        explain: "Versioning retains every version of an object, making 'oops' recoverable. Lifecycle moves data between classes; it doesn't preserve history.",
      },
    ],
  },
});
