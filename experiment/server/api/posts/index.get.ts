import posts from '../../data/posts.json'
import type { Post } from '~/types/content.types'

/** Resource: artículos del blog, ordenados por fecha descendente. */
export default defineEventHandler((): Post[] => posts as Post[])
