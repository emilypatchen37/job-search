import { RoleType, Scores, Sector } from './types'

const ROLE_BASELINES: Record<RoleType, Scores> = {
  'Forward Deployed Engineer':   { technical_fit: 8, comm_fit: 8, growth: 9 },
  'Solutions Engineer':          { technical_fit: 7, comm_fit: 9, growth: 8 },
  'Technical Account Manager':   { technical_fit: 7, comm_fit: 9, growth: 7 },
  'Solutions Consultant':        { technical_fit: 6, comm_fit: 9, growth: 7 },
  'Customer Success Engineer':   { technical_fit: 7, comm_fit: 9, growth: 7 },
  'Technical Program Manager':   { technical_fit: 8, comm_fit: 8, growth: 8 },
  'Associate Product Manager':   { technical_fit: 7, comm_fit: 7, growth: 9 },
  'Product Manager':             { technical_fit: 7, comm_fit: 7, growth: 8 },
  'Implementation Manager':      { technical_fit: 6, comm_fit: 8, growth: 7 },
  'Product Operations':          { technical_fit: 6, comm_fit: 8, growth: 7 },
  'Other':                       { technical_fit: 5, comm_fit: 5, growth: 5 },
}

const COMM_SIGNALS = [
  'stakeholder', 'cross-functional', 'cross functional', 'customer-facing',
  'client-facing', 'relationship', 'communicate', 'presentation', 'executive',
  'collaboration', 'partnership', 'account management', 'voice of the customer',
]

export function scoreJob(title: string, description: string, roleType: RoleType): Scores {
  const d = description.toLowerCase()
  const base = { ...ROLE_BASELINES[roleType] }

  if (/sql|api integration|technical background|data analysis/.test(d)) {
    base.technical_fit = Math.min(10, base.technical_fit + 1)
  }
  if (/leetcode|coding challenge|take-home assignment|algorithm/.test(d)) {
    base.technical_fit = Math.max(1, base.technical_fit - 2)
  }

  const commHits = COMM_SIGNALS.filter(s => d.includes(s)).length
  base.comm_fit = Math.min(10, base.comm_fit + Math.floor(commHits / 2))

  if (/series [ab]/i.test(d)) base.growth = Math.min(10, base.growth + 1)
  if (/series [de]/i.test(d)) base.growth = Math.max(1, base.growth - 1)
  if (/equity|stock options|early employee/.test(d)) {
    base.growth = Math.min(10, base.growth + 1)
  }
  if (/fortune 500|large enterprise|global corporation/.test(d)) {
    base.growth = Math.max(1, base.growth - 2)
  }

  return {
    technical_fit: Math.round(Math.min(10, Math.max(1, base.technical_fit))),
    comm_fit: Math.round(Math.min(10, Math.max(1, base.comm_fit))),
    growth: Math.round(Math.min(10, Math.max(1, base.growth))),
  }
}

export function whyItFits(roleType: RoleType, sector: Sector): string {
  const roleReasons: Partial<Record<RoleType, string>> = {
    'Technical Program Manager': 'Your Mastercard experience leading cross-functional programs from ambiguous briefs to execution is exactly what TPMs do. CS background gives you credibility with engineers without needing to code.',
    'Solutions Engineer': 'SEs live at the technical/business boundary — you demo product, answer technical questions, and shape deals. Communication is the competitive advantage here.',
    'Associate Product Manager': 'CS degree + cross-functional coordination experience is the APM profile. Startups reward speed of learning over years of PM experience.',
    'Customer Success Engineer': 'Your stakeholder management and ability to translate between technical and non-technical is exactly how CSEs retain and grow accounts.',
    'Technical Account Manager': 'TAMs own the post-sale technical relationship. Your ability to build trust with stakeholders and navigate ambiguity makes this a strong fit.',
    'Forward Deployed Engineer': 'FDEs solve customer problems onsite, coordinating between the product team and client. Heavy relationship-building, light on deep coding.',
    'Implementation Manager': 'Onboarding complex software at enterprise accounts — requires the same skills as your Mastercard platform work: coordination, communication, execution.',
    'Product Operations': 'Product Ops bridges product, engineering, and GTM teams. Your Mastercard experience identifying gaps and driving execution maps directly here.',
    'Solutions Consultant': 'Like Solutions Engineer but more business-forward. Your ability to quickly learn new domains and translate business needs into product answers is core.',
    'Other': 'Cross-functional communication and project ownership are valued here.',
  }
  const sectorBonus: Partial<Record<Sector, string>> = {
    'AI': ' AI companies especially need people who can translate what the model does into business value — a rare skill.',
    'Fintech': ' Fintech moves fast and cross-functional coordination is critical at regulated startups.',
    'HealthTech': ' HealthTech requires translating complex clinical/technical concepts to non-technical stakeholders — your strength.',
  }
  return (roleReasons[roleType] || roleReasons['Other']!) + (sectorBonus[sector] || '')
}
