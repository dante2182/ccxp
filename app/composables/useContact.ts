import contactJson from '@/data/contact.json'
import type { ContactData } from '@/types/contact.types'

export const useContact = () => {
  return {
    contactInfo: contactJson.contactInfo,
    contactMap: contactJson.contactMap,
    whatsappPhone: contactJson.whatsappPhone
  } as ContactData
}
