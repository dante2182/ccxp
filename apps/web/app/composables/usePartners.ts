import partnersJson from '@/data/partners.json'
import type { PartnerGroup } from '@/types/partner.types'

export const usePartners = () => {
  return {
    partnerGroups: partnersJson as PartnerGroup[],
  }
}
