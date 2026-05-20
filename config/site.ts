export type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  trackingEvent?: string;
  /** When set, clicking the CTA opens the form modal with this id instead of navigating to href. */
  formId?: string;
};

export type SectionKey =
  | "hero"
  | "socialProof"
  | "problem"
  | "solution"
  | "features"
  | "testimonials"
  | "pricing"
  | "faq"
  | "finalCta"
  | "footer";

export type IconKey =
  | "spark"
  | "target"
  | "rocket"
  | "shield"
  | "clock"
  | "check"
  | "chart"
  | "compass"
  | "lock"
  | "zap";

export type FormQuestion =
  | {
      id: string;
      type: "text";
      label: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      id: string;
      type: "email";
      label: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      id: string;
      type: "textarea";
      label: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
    }
  | {
      id: string;
      type: "choice";
      label: string;
      required?: boolean;
      options: { value: string; label: string; disqualifies?: boolean }[];
    }
  | {
      id: string;
      type: "group";
      label?: string;
      fields: (
        | { id: string; type: "text" | "email"; label: string; placeholder?: string; required?: boolean }
        | { id: string; type: "textarea"; label: string; placeholder?: string; required?: boolean }
        | { id: string; type: "scale"; label: string; min: number; max: number; required?: boolean }
      )[];
    };

export type FormDefinition = {
  id: string;
  intro?: { headline: string; subheadline?: string };
  questions: FormQuestion[];
  unqualifiedScreen: { headline: string; description: string };
  successScreen:
    | {
        kind: "calcom";
        calcomLink: string;
        namespace: string;
        headline?: string;
        subheadline?: string;
      }
    | {
        kind: "confirmation";
        headline: string;
        subheadline?: string;
        cta?: CTA;
      };
  redirectAfterBooking?: string;
};

export type SiteConfig = {
  meta: {
    title: string;
    description: string;
    siteUrl: string;
    ogImage: string;
    locale: string;
    favicon: string;
    keywords: string[];
    jsonLd: Record<string, unknown> | null;
  };
  theme: {
    colors: {
      background: string;
      foreground: string;
      muted: string;
      border: string;
      card: string;
      primary: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
    };
    fonts: {
      display: string;
      body: string;
    };
    radius: "sm" | "md" | "lg" | "xl";
  };
  tracking: {
    fbPixelId: string;
    ga4Id: string;
    scrollDepths: number[];
    timeMilestones: number[];
    customEvents: { name: string; description: string }[];
  };
  links: {
    primaryCta: string;
    checkout: string;
  };
  forms: {
    qualification: FormDefinition;
    newsletter: FormDefinition;
  };
  marquee: {
    enabled: boolean;
    items: string[];
  };
  sections: {
    hero: HeroSection;
    socialProof: SocialProofSection;
    problem: ProblemSection;
    solution: SolutionSection;
    features: FeaturesSection;
    testimonials: TestimonialsSection;
    pricing: PricingSection;
    faq: FaqSection;
    finalCta: FinalCtaSection;
    footer: FooterSection;
  };
};

export type HeroSection = {
  enabled: boolean;
  badge?: string;
  liveIndicator?: string;
  headline: string;
  headlineHighlight?: string;
  subheadline: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
  visual?:
    | { kind: "none" }
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; poster?: string }
    | { kind: "embed"; html: string };
  trustLine?: string;
};

export type SocialProofSection = {
  enabled: boolean;
  caption: string;
  logos: { name: string; src?: string }[];
  stats: { value: string; label: string }[];
  shortQuotes: { quote: string; author: string }[];
};

export type ProblemSection = {
  enabled: boolean;
  dark?: boolean;
  eyebrow: string;
  headline: string;
  description: string;
  pains: { title: string; description: string }[];
};

export type SolutionSection = {
  enabled: boolean;
  dark?: boolean;
  eyebrow: string;
  headline: string;
  description: string;
  bullets: string[];
  image?: { src: string; alt: string };
};

export type FeaturesSection = {
  enabled: boolean;
  dark?: boolean;
  eyebrow: string;
  headline: string;
  description: string;
  features: { icon: IconKey; title: string; description: string }[];
};

export type TestimonialsSection = {
  enabled: boolean;
  eyebrow: string;
  headline: string;
  testimonials: {
    quote: string;
    name: string;
    role: string;
    photo?: string;
    photos?: { before: string; after: string };
    result?: string;
  }[];
};

export type PricingSection = {
  enabled: boolean;
  eyebrow: string;
  headline: string;
  description: string;
  plans: {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    cta: CTA;
    highlighted?: boolean;
    badge?: string;
  }[];
  guarantee?: string;
};

export type FaqSection = {
  enabled: boolean;
  dark?: boolean;
  eyebrow: string;
  headline: string;
  items: { question: string; answer: string }[];
};

export type FinalCtaSection = {
  enabled: boolean;
  dark?: boolean;
  headline: string;
  subheadline: string;
  cta: CTA;
  microTrust?: string;
};

export type FooterSection = {
  enabled: boolean;
  dark?: boolean;
  brand: string;
  tagline?: string;
  links: { label: string; href: string }[];
  socials: { platform: "x" | "instagram" | "youtube" | "linkedin" | "tiktok"; href: string }[];
  legal: string;
};

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/so-sptcoaching/30min";

const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK || "your-handle/discovery-call";
const CALCOM_NAMESPACE = "qualification";

export const siteConfig: SiteConfig = {
  meta: {
    title: "Anajar Coaching — Coaching musculation science-based pour hommes skinny",
    description:
      "Coaching 1:1 à distance pour hommes 25-40 ans qui n'arrivent pas à prendre du muscle. Protocole basé sur la science. 4 transformations documentées. Résultats garantis.",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/og.png",
    locale: "fr_FR",
    favicon: "/favicon.ico",
    keywords: [
      "coaching musculation",
      "skinny",
      "prise de masse",
      "ectomorphe",
      "coach sport en ligne",
      "programme musculation",
      "coaching en ligne",
    ],
    jsonLd: null,
  },
  theme: {
    colors: {
      background: "#000000",
      foreground: "#f5f5f5",
      muted: "#737373",
      border: "#1f1f1f",
      card: "#111111",
      primary: "#f5f5f5",
      primaryForeground: "#000000",
      accent: "#ff0000",
      accentForeground: "#ffffff",
    },
    fonts: {
      display: "Bebas Neue",
      body: "Inter",
    },
    radius: "sm",
  },
  tracking: {
    fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
    scrollDepths: [25, 50, 75, 100],
    timeMilestones: [15, 30, 60, 120],
    customEvents: [
      { name: "form_open", description: "Le visiteur ouvre le formulaire" },
      { name: "form_step", description: "Validation d'une étape du formulaire" },
      { name: "form_qualified", description: "Form complété avec un profil qualifié" },
      { name: "form_unqualified", description: "Form complété avec un profil non qualifié" },
      { name: "form_abandoned", description: "Form fermé en cours de saisie" },
      { name: "booking_success", description: "Booking confirmé" },
      { name: "newsletter_signup", description: "Inscription newsletter via Final CTA" },
    ],
  },
  links: {
    primaryCta: CALENDLY_URL,
    checkout: process.env.NEXT_PUBLIC_CHECKOUT_URL || "",
  },
  forms: {
    qualification: {
      id: "qualification",
      intro: {
        headline: "Quelques questions avant de réserver.",
        subheadline:
          "Pour qu'on parte sur l'appel avec du concret. 90 secondes, 4 questions.",
      },
      questions: [
        {
          id: "name",
          type: "text",
          label: "Comment tu t'appelles ?",
          placeholder: "Ton prénom",
          required: true,
        },
        {
          id: "context",
          type: "text",
          label: "Quelle est ta situation actuelle ?",
          placeholder: "Ex : ingénieur, 28 ans, salle 2x/semaine depuis 6 mois",
          required: true,
        },
        {
          id: "stage",
          type: "choice",
          label: "Où tu en es avec ta morphologie ?",
          required: true,
          options: [
            { value: "very_skinny", label: "Très mince, j'ai du mal à prendre quoi que ce soit" },
            { value: "skinny_fat", label: "Maigre mais avec un peu de gras (skinny fat)" },
            { value: "some_progress", label: "J'ai un peu progressé mais je stagne" },
            { value: "other", label: "Autre situation", disqualifies: true },
          ],
        },
        {
          id: "goal",
          type: "textarea",
          label: "C'est quoi ton objectif dans les 3 prochains mois ?",
          placeholder: "Ex : prendre 5 kg de muscle, remplir mes t-shirts, me sentir plus imposant...",
          required: true,
          maxLength: 400,
        },
        {
          id: "email",
          type: "email",
          label: "Ton email pour confirmer le rendez-vous",
          placeholder: "ton@email.com",
          required: true,
        },
      ],
      unqualifiedScreen: {
        headline: "On n'est pas alignés pour le moment.",
        description:
          "Mon coaching est calibré pour les hommes skinny ou skinny fat qui veulent prendre du muscle. Si ton objectif est différent, je ne suis pas la bonne personne — mais n'hésite pas à revenir si tu te retrouves dans ce profil.",
      },
      successScreen: {
        kind: "calcom",
        calcomLink: CALCOM_LINK,
        namespace: CALCOM_NAMESPACE,
        headline: "C'est bon. Choisis ton créneau.",
        subheadline: "30 minutes en visio. Pas de pitch — juste un échange honnête.",
      },
      redirectAfterBooking: "/merci",
    },
    newsletter: {
      id: "newsletter",
      questions: [
        {
          id: "contact",
          type: "group",
          fields: [
            { id: "firstName", type: "text", label: "Prénom", placeholder: "Prénom", required: true },
            { id: "lastName", type: "text", label: "Nom", placeholder: "Nom", required: true },
            { id: "email", type: "email", label: "Email", placeholder: "ton@email.com", required: true },
          ],
        },
        {
          id: "qualification",
          type: "group",
          fields: [
            {
              id: "situation",
              type: "textarea",
              label: "Quelle est ta situation actuelle (professionnelle et personnelle) ?",
              placeholder: "Décris ta situation en quelques lignes…",
              required: true,
            },
            {
              id: "aspiration",
              type: "textarea",
              label: "As-tu une idée précise de ce que tu souhaites devenir ?",
              placeholder: "Ton objectif physique, comment tu te vois dans 6 mois…",
              required: true,
            },
            {
              id: "tried",
              type: "textarea",
              label: "Qu'as-tu déjà essayé pour te transformer ?",
              placeholder: "Programmes, salles, régimes, compléments…",
              required: true,
            },
            {
              id: "commitment",
              type: "scale",
              label: "À quel point es-tu prêt à t'investir ? (1 = pas vraiment / 10 = à fond)",
              min: 1,
              max: 10,
              required: true,
            },
          ],
        },
      ],
      unqualifiedScreen: {
        headline: "",
        description: "",
      },
      successScreen: {
        kind: "confirmation",
        headline: "Bien reçu.",
        subheadline:
          "Tu recevras un message dès qu'une place se libère. En attendant, tu peux réserver ton appel découverte directement.",
        cta: {
          label: "Réserver mon appel maintenant",
          href: CALENDLY_URL,
          variant: "primary",
          trackingEvent: "Lead",
        },
      },
    },
  },
  marquee: {
    enabled: true,
    items: [
      "Science-based",
      "Coaching 1:1",
      "Résultats garantis",
      "Suivi WhatsApp",
      "Protocole personnalisé",
      "Des transformations documentées",
    ],
  },
  sections: {
    hero: {
      enabled: true,
      liveIndicator: "Pour les skinny qui veulent enfin être musclé",
      headline: "Le système skinny : remplis tes vêtements en moins de 120 jours.",
      headlineHighlight: "120 jours",
      subheadline:
        "Donne-moi 12 semaines pour que ton physique actuel ne soit plus qu'un mauvais souvenir. Sans gras inutile. Sans vivre à la salle. Sans en faire un échec de plus.",
      primaryCta: {
        label: "Je réserve mon bilan personnalisé offert",
        href: CALENDLY_URL,
        variant: "primary",
        trackingEvent: "Lead",
      },
      visual: { kind: "image", src: "/hero.jpg", alt: "Sofiane Anajar — Coach musculation" },
      trustLine: "",
    },
    socialProof: {
      enabled: true,
      caption: "Des transformations réelles, documentées",
      logos: [],
      stats: [
        { value: "+16 kg", label: "prise de masse en 20 mois" },
        { value: "+9 kg", label: "en 4 mois" },
        { value: "+6 kg", label: "en 1 mois" },
      ],
      shortQuotes: [
        {
          quote: "En 4 mois j'ai pris 9 kg. Je n'avais jamais réussi à autant progresser seul.",
          author: "Bilal, 29 ans",
        },
        {
          quote: "16 kg en moins de 2 ans. Je suis méconnaissable.",
          author: "Lucas, 30 ans",
        },
      ],
    },
    problem: {
      enabled: true,
      dark: false,
      eyebrow: "Le vrai problème",
      headline: "\"Je stagne depuis des années. Pourtant j'essaie.\"",
      description:
        "Si tu t'entraînes depuis des mois sans voir de changement, ce n'est pas un problème de génétique. C'est un problème de méthode. Les programmes génériques ne sont pas conçus pour les hommes skinny.",
      pains: [
        {
          title: "\"Je flotte dans mes vêtements\"",
          description:
            "Tu t'habilles pour cacher, pas pour montrer. Chaque miroir est une confrontation que tu évites. Tu portes des couches pour compenser une silhouette que tu n'assumes pas.",
        },
        {
          title: "\"On me donne 22 ans à 32\"",
          description:
            "Tu ne dégages pas l'autorité que tu mérites. Dans une pièce, tu passes inaperçu. Ça joue sur ta confiance, tes relations, ta façon d'occuper l'espace — au travail comme dans ta vie perso.",
        },
        {
          title: "\"Je veux pas vieillir comme ça\"",
          description:
            "Tu sais que sans changement maintenant, dans 10 ans ce sera encore pire. Mais tu ne sais pas comment casser ce cycle. Chaque tentative finit au même endroit : la stagnation.",
        },
        {
          title: "\"J'ai tout essayé, rien ne marche\"",
          description:
            "Les programmes YouTube, les plans Reddit, les conseils des potes en salle... Tu fais les choses à l'aveugle, sans comprendre pourquoi ton corps ne répond pas comme les autres.",
        },
      ],
    },
    solution: {
      enabled: true,
      dark: true,
      eyebrow: "La méthode",
      headline: "Un protocole conçu pour ceux qui n'arrivent jamais à grossir.",
      description:
        "Les skinny ont une physiologie différente. Métabolisme rapide, morphologie longiligne, leviers mécaniques atypiques — tout ça s'optimise différemment. Mon coaching est construit sur la science de la prise de masse pour ectomorphes, pas sur des programmes génériques qui fonctionnent pour tout le monde sauf toi.",
      bullets: [],
    },
    features: {
      enabled: false,
      dark: false,
      eyebrow: "Ce que tu obtiens",
      headline: "",
      description: "",
      features: [],
    },
    testimonials: {
      enabled: true,
      eyebrow: "Ils l'ont fait",
      headline: "Des transformations. Des vraies.",
      testimonials: [
        {
          quote:
            "En 4 mois j'ai pris 9 kg. Je n'avais jamais réussi à autant progresser seul en plusieurs années. Sofiane m'a expliqué pourquoi je stagnais — et comment tout changer.",
          name: "Bilal",
          role: "29 ans, ingénieur",
          photos: { before: "/testimonials/bilal-avant.jpg", after: "/testimonials/bilal-apres.jpg" },
          result: "+9 kg sec en 6 mois",
        },
        {
          quote:
            "6 kg en 1 mois. Il m'a tout expliqué — pourquoi je ne prenais pas, comment manger, comment m'entraîner. Je comprends ce que je fais maintenant.",
          name: "Benjamin",
          role: "32 ans",
          photos: { before: "/testimonials/benjamin-avant.jpg", after: "/testimonials/benjamin-apres.jpg" },
          result: "+6 kg sec en 1 mois",
        },
        {
          quote:
            "16 kg en moins de 2 ans. Je suis méconnaissable. C'est la première fois de ma vie que je me sens bien dans mon corps.",
          name: "Lucas",
          role: "30 ans",
          photos: { before: "/testimonials/lucas-avant.jpg", after: "/testimonials/lucas-apres.jpg" },
          result: "+16 kg sec en 20 mois",
        },
      ],
    },
    pricing: {
      enabled: false,
      eyebrow: "Investissement",
      headline: "",
      description: "",
      plans: [],
    },
    faq: {
      enabled: true,
      dark: false,
      eyebrow: "FAQ",
      headline: "Les questions qu'on me pose en vrai.",
      items: [
        {
          question: "J'ai pas le temps de suivre un programme compliqué.",
          answer:
            "Tu t'entraînes déjà. Ce que je change, c'est la direction et l'efficacité de ce que tu fais. Le suivi WhatsApp prend 5 minutes par semaine. Le programme s'adapte à ton emploi du temps et ton niveau — pas l'inverse.",
        },
        {
          question: "J'ai peur d'essayer encore une fois et d'échouer.",
          answer:
            "C'est exactement pour ça qu'il y a une garantie. Si tu appliques ce que je te donne — entraînement, nutrition, suivi — et que tu ne vois pas de résultats mesurables, on continue ensemble sans frais jusqu'à ce que tu les aies. Je m'engage sur tes résultats, pas sur des promesses.",
        },
        {
          question: "Est-ce que ça marche pour les débutants complets ?",
          answer:
            "Oui. La plupart de mes clients commençaient avec peu ou pas d'expérience. C'est même là où les résultats sont les plus spectaculaires — Benjamin a pris 6 kg sur le premier mois.",
        },
        {
          question: "Comment se passe le suivi à distance concrètement ?",
          answer:
            "Ton programme personnalisé est directement dans ton application, ce qui te permet de l'avoir partout avec toi et d'avoir un tracking sur chaque élément. Chaque semaine on fait un point par message : photos, poids, ressenti. J'analyse et ajuste si besoin. Chaque mois, on s'appelle pour faire le point plus en détail sur ton suivi.",
        },
      ],
    },
    finalCta: {
      enabled: true,
      dark: true,
      headline: "Prêt à ne plus flotter dans tes vêtements ?",
      subheadline:
        "Laisse-moi ton prénom, nom et email. Dès qu'une place de coaching se libère, tu es le premier à le savoir.",
      cta: {
        label: "Je veux être musclé",
        href: CALENDLY_URL,
        variant: "primary",
        trackingEvent: "newsletter_signup",
        formId: "newsletter",
      },
      microTrust: "",
    },
    footer: {
      enabled: true,
      dark: true,
      brand: "Anajar Coaching",
      tagline: "Bientôt musclé, sculpte ton potentiel.",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
      ],
      socials: [
        { platform: "instagram", href: "https://www.instagram.com/sofiane.anajar" },
        { platform: "tiktok", href: "https://www.tiktok.com/@sofianeanajar" },
      ],
      legal: `© ${new Date().getFullYear()} Anajar Coaching. Tous droits réservés.`,
    },
  },
};
