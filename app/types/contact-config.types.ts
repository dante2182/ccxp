export type EmailConfig = {
  from: string
  to: string
  smtp: {
    host: string
    port: number
    secure: boolean
  }
  appPassword: string
}

export type ContactConfig = {
  email: EmailConfig
}




