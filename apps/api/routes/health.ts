import { defineEventHandler } from 'h3'
import { API_VERSION } from '../src/config/version'

export default defineEventHandler(() => ({
  status: 'ok',
  uptime: process.uptime(),
  version: API_VERSION,
}))
