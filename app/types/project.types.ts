export interface Project {
  id: string
  title: string
  image: string
  description?: string
  details?: ProjectDetails
}

export interface ProjectDetails {
  scope?: string
  technologies?: string[]
  benefits?: string[]
  duration?: string
}


