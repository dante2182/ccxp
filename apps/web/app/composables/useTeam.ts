import teamJson from '@/data/team.json'
import type { TeamMember } from '@/types/team.types'

export const useTeam = () => {
  return {
    teamMembers: teamJson as TeamMember[],
  }
}
