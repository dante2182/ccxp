export type { ContactRequest, ContactResponse } from '@ccxp/contracts'

export type ContactInfoItem = {
  icon: string
  label: string
}

export type ContactMap = {
  iframeUrl: string
}

export type ContactData = {
  contactInfo: ContactInfoItem[]
  contactMap: ContactMap
  whatsappPhone: string
}
