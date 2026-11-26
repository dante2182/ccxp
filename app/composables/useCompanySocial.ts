import companySocialJson from '@/data/company-social.json'
import type { Social } from '@/types/company-social.types'

export const useCompanySocial = () => {
  return {
    companySocial: companySocialJson as Social
  }
}
