/**
 * All site copy lives here. Edit this file to change text, links, projects or
 * experience. Components only read from it, so you never need to touch them
 * for a content change. See README.md for the full guide.
 */
import type { StaticImageData } from "next/image";

import whaHome from "@/assets/work/wha-home.png";
import emsHome from "@/assets/work/ems-home.png";
import ssHome from "@/assets/work/ss-home.png";

export type ExternalLink = { label: string; href: string };

export type Shot = { src: StaticImageData; alt: string };

/** Plain-language engineering notes. No percentages, only what was used and why. */
export type Qualities = {
  faster?: string[];
  safer?: string[];
  reliable?: string[];
};

export type FeaturedProject = {
  slug: string;
  name: string;
  /** One line used in the work index and in metadata. */
  summary: string;
  client: string;
  role: string;
  period: string;
  year: string;
  problem: string;
  built: string[];
  qualities?: Qualities;
  stack: string[];
  outcome: string;
  links: ExternalLink[];
  shot: Shot;
  note?: string;
};

export type OtherProject = {
  name: string;
  description: string;
  role: string;
  year: string;
  stack: string[];
  link?: ExternalLink;
};

export type WalkthroughStep = {
  id: "booking" | "scheduling" | "ticketing" | "analytics" | "mobile";
  title: string;
  body: string;
  points: string[];
  status?: string;
  /** Optional real screenshot. When absent, a labelled diagram is shown. */
  shot?: Shot;
};

export type Role = {
  company: string;
  location?: string;
  title: string;
  type?: string;
  start: string;
  end: string;
  current: boolean;
  points: string[];
  link?: ExternalLink;
};

export const person = {
  name: "Aman Dhungel",
  firstName: "Aman",
  lastName: "Dhungel",
  role: "Full-Stack Developer",
  headline:
    "Full-stack developer building fast, secure web platforms with React, Next.js and Node.js, and leading the teams that ship them.",
  location: "Kathmandu, Nepal",
  availability: "Open to full-time roles",
  email: "dhungelaman2000@gmail.com",
  phone: { display: "+977 986-780-6220", href: "tel:+9779867806220" },
  resume: { href: "/Aman_Dhungel_Resume.pdf", fileName: "Aman_Dhungel_Resume.pdf" },
  github: "https://github.com/AmanDhungel",
  linkedin: "https://www.linkedin.com/in/aman-dhungel-1a4773187/",
  seo: {
    title: "Aman Dhungel | Full-Stack Developer (React, Next.js, Node.js)",
    description:
      "Aman Dhungel is a full-stack developer in Kathmandu with 4+ years of experience building booking, ticketing, e-commerce and business platforms with React, Next.js, Node.js, TypeScript and AWS.",
  },
};

export const about = {
  lead: "I build production web platforms end to end, and I lead the small teams that ship them.",
  paragraphs: [
    "Over four years I have taken products from an empty repository to live traffic: booking and ticketing for Australian businesses, an operations and accounting suite, and online stores for shops in Nepal. I design the API and the database, build the interface, and set up the pipeline that deploys it.",
    "At Gurukulhub I lead six developers. I plan the work, review the code, and take releases through staging into production. When a deployment breaks, I find out why and fix the process so it does not happen again.",
    "I care about software that stays up and stays fast once real people use it: rate limits before they are needed, data rules the database enforces, and documentation the next developer can follow.",
  ],
  education: {
    degree: "Bachelor of Information Technology (B.IT)",
    school: "University of Sunderland, taught at ISMT College",
    place: "Tinkune, Kathmandu",
    years: "2019 – 2023",
  },
  certifications: [
    {
      name: "The Complete JavaScript Course",
      issuer: "Udemy",
      year: "2023",
      href: "https://www.udemy.com/certificate/UC-18390ba4-d5bb-4060-b62a-5f8d2b057bdb/",
    },
    {
      name: "Responsive Web Design",
      issuer: "freeCodeCamp",
      year: "2023",
      href: "https://www.freecodecamp.org/certification/fcc1b45fb13-f5ad-4c52-ae63-f967bdde2b08/responsive-web-design",
    },
    {
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      year: "2024",
      href: "https://www.freecodecamp.org/certification/fcc1b45fb13-f5ad-4c52-ae63-f967bdde2b08/javascript-algorithms-and-data-structures-v8",
    },
  ],
};

export const featured: FeaturedProject[] = [
  {
    slug: "whats-happening-australia",
    name: "What's Happening Australia",
    summary:
      "A community platform where Australians find local businesses and events, book services and buy tickets.",
    client: "SunyaVerse",
    role: "Sole full-stack developer, design to deployment",
    period: "Jan 2026 – present",
    year: "2026",
    problem:
      "Local businesses needed one place to be found, take bookings for their staff, and sell tickets to their events. Customers needed to search by service, place and time, then book or pay without phoning anyone.",
    built: [
      "Business listings, deals and reviews, with search by service, map area and time.",
      "A booking system that knows each employee's weekly shifts, one-off changes and days off, and only offers times when someone is free.",
      "Event ticketing: ticket types and promo codes, Stripe payments, QR tickets, and a door scanner that checks tickets in.",
      "A business dashboard with today's and upcoming bookings, appointments and paid sales for the last seven days, and ticket redemptions.",
      "A versioned mobile API for the React Native and Expo app, which shares the same backend as the website.",
    ],
    qualities: {
      faster: [
        "Location search runs on a MongoDB geospatial index, so the database sorts results by distance.",
        "TanStack Query caches responses in the browser and avoids repeat requests.",
        "Images are stored in Amazon S3 and resized by next/image before they reach the visitor.",
      ],
      safer: [
        "Every API route is rate limited with Upstash Redis, keyed per signed-in user on mobile and per IP otherwise.",
        "Stripe webhooks are rejected unless their signature checks out.",
        "Mobile refresh tokens are stored hashed, rotate on every use and can be revoked. Passwords are hashed with bcrypt.",
        "Forms and APIs are protected against CSRF and XSS.",
      ],
      reliable: [
        "A booking takes a short-lived lock backed by a unique index, so two customers can never take the same staff member's slot.",
        "Tickets are held for five minutes during checkout, then released automatically if payment does not finish.",
        "Payment confirmation is safe to run twice: whichever of the webhook or the browser finishes first creates the purchase, and the other is ignored.",
        "Multi-step writes run in MongoDB transactions, and the server writes structured JSON logs with pino.",
      ],
    },
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "NextAuth",
      "Stripe",
      "AWS S3",
      "Upstash Redis",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS",
      "React Native",
      "Expo",
    ],
    outcome:
      "Live at whaustralia.com, built by me alone across frontend, backend and infrastructure. The mobile app is in progress on the same API.",
    links: [{ label: "whaustralia.com", href: "https://whaustralia.com" }],
    shot: {
      src: whaHome,
      alt: "What's Happening Australia home page, with a search bar for services, map area and time above a featured event banner.",
    },
  },
  {
    slug: "ems",
    name: "EMS",
    summary:
      "An all-in-one business system: employees, field work, products and stock, and accounting in one place.",
    client: "Own product",
    role: "Designer and full-stack developer",
    period: "Sep 2026 – present",
    year: "2026",
    problem:
      "Small businesses that send staff to sites run on phone calls, paper and three or four separate apps: one for attendance, one for stock, one for bills. Owners cannot see who is where, what was used, or what is owed.",
    built: [
      "Located tickets: the owner assigns a job, and the employee can only check in from within 100 metres of the site.",
      "A six-state job lifecycle from pending to completed, with reminders when nobody has checked in by the start time.",
      "Attendance, schedules and overtime for employees.",
      "Products, inventory and installations, with estimates and quotes the customer can review online.",
      "Accounting: bills, expenses, payments, a day book and customer ledgers, with reports.",
      "Separate workspaces for each business, each with its own public website on its own subdomain.",
    ],
    qualities: {
      faster: [
        "TanStack Query keeps lists in sync without reloading the page.",
        "Images are served through a CDN in front of a private S3 bucket.",
      ],
      safer: [
        "Every response carries a Content Security Policy with a fresh nonce.",
        "API changes are only accepted from the app's own origin, which blocks cross-site requests.",
        "Public pages and signed-in actions are rate limited.",
        "Each workspace's data is separated by tenant. A business's public site has no API at all.",
      ],
      reliable: [
        "The accounting core (ledgers, day book, estimates, settlements and allocations) has unit tests on Node's built-in test runner.",
        "Check-ins wait in an offline queue when the phone loses signal, and send when it comes back.",
      ],
    },
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "Auth.js",
      "AWS S3",
      "TanStack Query",
      "React Hook Form",
      "Zod",
      "Leaflet",
      "Three.js",
      "Tailwind CSS",
    ],
    outcome: "Live as a working product. The source is public on GitHub.",
    links: [
      { label: "Live site", href: "https://my-cms-ebon.vercel.app/" },
      { label: "Source on GitHub", href: "https://github.com/AmanDhungel/my-cms" },
    ],
    shot: {
      src: emsHome,
      alt: "EMS landing page headed 'Assign the work. Watch it land on site.', beside a 3D map pin inside geofence rings.",
    },
  },
  {
    slug: "ss-store-and-suppliers",
    name: "SS Store & Suppliers",
    summary:
      "An online presence for a CCTV and security camera business in Bardibas, first as an online store.",
    client: "SS Store & Suppliers, Bardibas, Mahottari",
    role: "Frontend developer (contract)",
    period: "Oct 2023 – Feb 2024",
    year: "2023",
    problem:
      "A local CCTV supplier was known only by word of mouth. It needed customers across Mahottari to find it online, see what it sells, and get in touch.",
    built: [
      "The first version: an e-commerce store in React with GSAP animation, responsive product components and a checkout flow built on third-party libraries.",
      "Technical, on-page and off-page SEO, so the store shows up when people nearby search for CCTV.",
      "The business has since moved to a simpler services site at the same address, for sales, installation and maintenance.",
    ],
    stack: ["React", "GSAP", "JavaScript", "CSS", "SEO"],
    outcome: "The business is easy to find online and gets enquiries through its website.",
    links: [{ label: "ssstoreandsuppliers.com", href: "https://www.ssstoreandsuppliers.com/" }],
    shot: {
      src: ssHome,
      alt: "SS Store and Suppliers home page headed 'Complete CCTV and Security Camera Solutions, Installed Right', with a four-camera surveillance mock-up.",
    },
  },
];

export const walkthrough = {
  title: "Inside What's Happening Australia",
  intro:
    "Five parts of the platform, each built by me. The panels on the right are diagrams of how each part works.",
  steps: [
    {
      id: "booking",
      title: "Booking",
      body: "Customers pick a service, a staff member and a time. Only times when that person is working and free are offered.",
      points: [
        "A slot is locked while the customer pays",
        "A unique index makes double booking impossible",
        "Locks expire on their own after 15 minutes",
      ],
    },
    {
      id: "scheduling",
      title: "Staff scheduling",
      body: "Owners set each employee's weekly shifts, then change single days or mark time off without touching the rest of the week.",
      points: ["Weekly shifts per employee", "One-off changes per date", "Days off and time off"],
    },
    {
      id: "ticketing",
      title: "Ticketing",
      body: "Organisers sell tickets on the platform. Seats are held during checkout, paid with Stripe, and checked in at the door from a QR code.",
      points: ["Ticket types and promo codes", "Five-minute hold during checkout", "QR check-in at the door"],
    },
    {
      id: "analytics",
      title: "Analytics",
      body: "Each business sees what is happening today and what is coming, plus a seven-day view of appointments and paid sales.",
      points: ["Today and upcoming bookings", "Appointments and sales per day", "Ticket redemptions per event"],
    },
    {
      id: "mobile",
      title: "Mobile app",
      body: "A React Native and Expo app for customers and businesses, running on the same backend as the website.",
      points: ["Versioned mobile API", "Short access tokens with rotating refresh tokens", "Rate limits per user, not per network"],
      status: "In progress",
    },
  ] satisfies WalkthroughStep[],
};

export const otherWork: OtherProject[] = [
  {
    name: "Maa Kali Hardware",
    description:
      "Online store and catalogue for a hardware shop in Bhaktapur, with cart, eSewa payments, a blog, and an admin panel for products, posts and messages.",
    role: "Full-stack (contract)",
    year: "2022",
    stack: ["Next.js", "Node.js", "TypeScript", "MongoDB", "GSAP"],
    link: { label: "nationalhomedecor.com.np", href: "https://nationalhomedecor.com.np/" },
  },
  {
    name: "Bamboo Home Support",
    description: "Website for a registered NDIS disability support provider in South Australia.",
    role: "Web developer",
    year: "2024",
    stack: ["WordPress"],
    link: { label: "bamboohomesupport.com.au", href: "https://bamboohomesupport.com.au/" },
  },
  {
    name: "Bamboo Nursing",
    description: "Website for a community and home nursing service in South Australia.",
    role: "Web developer",
    year: "2024",
    stack: ["WordPress"],
    link: { label: "bamboonursing.com.au", href: "https://bamboonursing.com.au/" },
  },
  {
    name: "Real-time Chat App",
    description:
      "Messaging app with live conversations, an emoji picker, image sharing and in-app notifications.",
    role: "Personal project",
    year: "2024",
    stack: ["React", "Firebase", "Zustand", "Vite"],
    link: { label: "Source on GitHub", href: "https://github.com/AmanDhungel/Real-time-Chat-App" },
  },
  {
    name: "Hotel Royal Sen",
    description: "Mobile-first booking website for a hotel in Bardibas.",
    role: "Frontend (contract)",
    year: "2022",
    stack: ["JavaScript", "Sass"],
  },
];

export const experience: Role[] = [
  {
    company: "SunyaVerse",
    location: "Remote, Australia",
    title: "Full-Stack Developer",
    type: "Freelance",
    start: "Jan 2026",
    end: "Present",
    current: true,
    points: [
      "Designed and built whaustralia.com on my own, frontend and backend, as a place to discover and promote local businesses, services and events.",
      "Built booking and scheduling that manages employee shifts, working days and days off, and matches staff or independent providers to customer bookings.",
      "Added event ticketing so organisers sell tickets on the platform, with built-in analytics.",
      "Hardened the platform with rate limiting and CSRF and XSS protection.",
      "Building a React Native and Expo app on the same backend APIs.",
    ],
    link: { label: "whaustralia.com", href: "https://whaustralia.com" },
  },
  {
    company: "Gurukulhub",
    location: "Maharajgunj, Kathmandu",
    title: "Full-Stack Developer",
    start: "Oct 2025",
    end: "Present",
    current: true,
    points: [
      "Lead a team of six developers across several projects, from development to production release.",
      "Set up CI/CD pipelines and manage deployments to separate staging and live environments.",
      "Containerised applications with Docker for repeatable deployments.",
      "Diagnose and fix deployment failures so the team keeps shipping.",
    ],
  },
  {
    company: "Suvaansh Group",
    title: "Web Developer and Marketing Manager",
    start: "May 2024",
    end: "Mar 2025",
    current: false,
    points: ["Built WordPress websites and web applications, including bamboohomesupport.com.au and bamboonursing.com.au."],
  },
  {
    company: "FatDog Labs Agency",
    location: "Guhyeshwori, Kathmandu",
    title: "Junior Frontend Developer",
    start: "Mar 2024",
    end: "Feb 2025",
    current: false,
    points: [
      "Built three or more client web applications with Next.js, TypeScript and GraphQL. Client names are confidential.",
      "Used Redux, Zustand and TanStack Query to cut load times and keep data in sync.",
      "Worked with designers and backend teams to integrate REST APIs.",
    ],
  },
  {
    company: "SS Store & Suppliers",
    location: "Bardibas, Mahottari",
    title: "Frontend Developer",
    type: "Contract",
    start: "Oct 2023",
    end: "Feb 2024",
    current: false,
    points: [
      "Built an e-commerce store with React and GSAP, and grew sales through technical, on-page and off-page SEO.",
      "Designed responsive UI components and integrated third-party libraries to simplify checkout.",
    ],
  },
  {
    company: "Maa Kali Hardware",
    location: "Bhaktapur",
    title: "Full-Stack Developer",
    type: "Contract",
    start: "2022",
    end: "2022",
    current: false,
    points: [
      "Built a full-stack store with Next.js, Node.js and TypeScript, and made server responses faster.",
      "Added GSAP interactions that kept visitors on the site longer.",
    ],
  },
  {
    company: "Hotel Royal Sen",
    location: "Bardibas, Mahottari",
    title: "Frontend Developer",
    type: "Contract",
    start: "2022",
    end: "2022",
    current: false,
    points: ["Built a mobile-first hotel booking site with Sass and JavaScript, which brought in more visitors on phones."],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Cloud and architecture",
    items: ["AWS Lambda", "S3", "API Gateway", "ECS", "IAM", "SNS", "Event-driven architecture", "System design", "Docker"],
  },
  {
    group: "Full-stack engineering",
    items: [
      "TypeScript",
      "JavaScript (ES6+)",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "Redux",
      "Zustand",
      "TanStack Query",
      "React Native",
      "Expo",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "GSAP",
      "WordPress",
    ],
  },
  {
    group: "Data and integrations",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma ORM", "GraphQL", "Firebase", "REST APIs", "JWT authentication", "Stripe"],
  },
  {
    group: "Delivery and quality",
    items: ["GitHub Actions", "GitLab CI", "CI/CD", "Git", "Staging and production deployments", "Code reviews", "Technical leadership"],
  },
];

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

