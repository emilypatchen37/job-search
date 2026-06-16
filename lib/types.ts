export type RoleType =
  | 'Technical Program Manager'
  | 'Solutions Engineer'
  | 'Associate Product Manager'
  | 'Product Manager'
  | 'Customer Success Engineer'
  | 'Implementation Manager'
  | 'Product Operations'
  | 'Technical Account Manager'
  | 'Forward Deployed Engineer'
  | 'Solutions Consultant'
  | 'Other'

export type Sector = 'AI' | 'Fintech' | 'HealthTech' | 'B2B SaaS' | 'EdTech' | 'HRTech' | 'Other'

export type JobStatus = 'new' | 'saved' | 'applied' | 'hidden'

export interface Scores {
  technical_fit: number
  comm_fit: number
  growth: number
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary_min?: number
  salary_max?: number
  url: string
  posted_at: string
  role_type: RoleType
  sector: Sector
  scores: Scores
  is_new: boolean
}
