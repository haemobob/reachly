export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  url: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  accent: string;
};

/** Confirmed client attribution; summaries describe website subjects, not outcomes. */
export const projects: Project[] = [
  {
    slug: "sellaku",
    name: "Sellaku",
    category: "Furniture storefront",
    summary:
      "A furniture storefront centered on product discovery: a place to browse pieces and explore what belongs in a space.",
    url: "https://sellaku.vercel.app/toko",
    image: "/images/sellaku.webp",
    imageWidth: 1440,
    imageHeight: 845,
    accent: "#D7C6AE",
  },
  {
    slug: "mac-one-indonesia",
    name: "Mac One Indonesia",
    category: "Engineering & industrial services",
    summary:
      "A business website presenting HVACR, engineering, industrial automation, and maintenance services.",
    url: "https://www.mac1ndonesia.com/",
    image: "/images/mac-one-indonesia.webp",
    imageWidth: 1440,
    imageHeight: 960,
    accent: "#BAC9CE",
  },
  {
    slug: "crypto-radius",
    name: "Crypto Radius",
    category: "Crypto community",
    summary:
      "A website introducing a crypto community, signals, and market context to people exploring its offer.",
    url: "https://www.cryptoradius.id/",
    image: "/images/crypto-radius.webp",
    imageWidth: 1440,
    imageHeight: 960,
    accent: "#CBD0EA",
  },
  {
    slug: "crypto-galaxy",
    name: "Crypto Galaxy",
    category: "Trading community & membership",
    summary:
      "A crypto trading community website bringing together programs, research, and membership information.",
    url: "https://www.cgcryptogalaxy.id/",
    image: "/images/crypto-galaxy.webp",
    imageWidth: 1440,
    imageHeight: 960,
    accent: "#D5D4E4",
  },
];

export type Service = {
  slug: string;
  name: string;
  number: string;
  intro: string;
  description: string;
  outputs: string[];
  questions: string[];
};

/** Possible outputs, not standard packages or contractual promises. */
export const services: Service[] = [
  {
    slug: "website-design-development",
    name: "Website Design & Development",
    number: "01",
    intro:
      "A clear home for your business. A useful next step for your customer.",
    description:
      "Your website should make the essentials easy to understand: what you do, who it is for, and how to take the next step. We shape business websites, landing pages, and redesigns around that journey, with responsive layouts and an intentional content structure. The work starts with the business, not a template or a list of effects.",
    outputs: [
      "A page and content structure shaped around your audience",
      "Responsive website design and development",
      "Clear inquiry paths and agreed forms",
      "Testing and an agreed handover",
    ],
    questions: [
      "What should a visitor understand before getting in touch?",
      "Which pages or parts of your current website get in the way?",
      "Who will supply and maintain the content?",
    ],
  },
  {
    slug: "digital-presence",
    name: "Digital Presence",
    number: "02",
    intro:
      "Make the different places customers find you feel like the same business.",
    description:
      "A good website is one part of a larger picture. Business details, visual choices, profile information, and links between channels all affect how clearly you show up. We review the relevant touchpoints and agree practical improvements, so people can recognize your business and find consistent information without following a trail of disconnected pages.",
    outputs: [
      "A review of agreed online touchpoints",
      "Recommendations for consistent business information",
      "Visual and messaging alignment across selected channels",
      "Clearer links between your website and relevant profiles",
    ],
    questions: [
      "Where do people first encounter your business?",
      "Are your service details and contact paths consistent?",
      "Which profiles or channels can you actually maintain?",
    ],
  },
  {
    slug: "digital-strategy",
    name: "Digital Strategy",
    number: "03",
    intro: "Choose what matters next, before choosing another tool.",
    description:
      "When everything looks urgent, a roadmap helps separate the important work from the noise. We clarify business goals, map the customer journey, look at the tools already in use, and identify dependencies. The aim is an actionable sequence of decisions that fits the business, rather than a technology shopping list with no reason behind it.",
    outputs: [
      "A shared definition of goals and constraints",
      "A map of the relevant customer journey",
      "Prioritized recommendations and an actionable roadmap",
      "Criteria for choosing suitable digital tools",
    ],
    questions: [
      "What business change are you trying to make?",
      "Where does the customer journey become unclear?",
      "What time, resources, and tools are already available?",
    ],
  },
  {
    slug: "business-automation",
    name: "Business Automation",
    number: "04",
    intro: "Less repetition. More deliberate handoffs.",
    description:
      "Repeated copy-and-paste work can hide the moment when an inquiry, record, or notification needs attention. We map a specific workflow, identify what can safely be connected, and implement the agreed steps. Inquiry capture, form routing, customer record updates, and routine notifications are possible starting points; every integration depends on the tools, access, and requirements involved.",
    outputs: [
      "A map of one agreed workflow and its exceptions",
      "Scoped connections between compatible tools",
      "Inquiry routing, record updates, or routine notifications as agreed",
      "Testing, documentation, and defined manual fallback steps",
    ],
    questions: [
      "Which task gets repeated, and what triggers it?",
      "Where should a person review or approve the result?",
      "What should happen when a tool is unavailable?",
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    number: "05",
    intro: "Give useful content a stronger foundation to be found.",
    description:
      "Search visibility begins with pages that are understandable to people and accessible to search engines. We focus on foundational technical and on-page SEO: structure, metadata, relevant content planning, and the issues that make a website harder to discover. Local search support can be included where agreed. Priorities follow the business and the website, not a promise of a particular ranking.",
    outputs: [
      "A prioritized foundational SEO review",
      "Page structure and metadata improvements",
      "Relevant search and content recommendations",
      "Local search support and reporting where agreed",
    ],
    questions: [
      "What should customers be searching for when they find you?",
      "Which pages explain your most important services?",
      "How will you maintain useful, accurate content over time?",
    ],
  },
];

export const process = [
  {
    name: "Discover",
    text: "Understand your business, your audience, the change you want to make, and the tools and constraints already in place.",
  },
  {
    name: "Plan",
    text: "Agree priorities, scope, deliverables, dependencies, and what a useful result would look like before making it.",
  },
  {
    name: "Create",
    text: "Design, build, or configure the agreed solution, keeping the customer journey and everyday use at the center.",
  },
  {
    name: "Launch",
    text: "Validate the solution, resolve the issues found, and complete the agreed handover so the next step is clear.",
  },
  {
    name: "Improve",
    text: "Review the outcome and identify sensible next steps, with further support delivered where agreed and contracted.",
  },
];
