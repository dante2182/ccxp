import projectsJson from '@/data/projects.json'
import type { Project } from '@/types/project.types'

export const getAllProjects = (): Project[] => projectsJson

export const getProjectById = (id: string): Project | undefined =>
  projectsJson.find((p) => p.id === id)
