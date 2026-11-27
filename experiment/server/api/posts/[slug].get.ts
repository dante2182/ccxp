import { createError, getRouterParam } from 'h3'
import posts from '../../data/posts.json'
import type { Post } from '~/types/content.types'

/** Resource individual: un artículo por su slug. */
export default defineEventHandler((event): Post => {
  const slug = getRouterParam(event, 'slug')
  const post = (posts as Post[]).find((item) => item.slug === slug || item.id === slug)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
  }
  return post
})
