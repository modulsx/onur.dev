import { cache } from 'react'
import 'server-only'

import { isDevelopment } from '@/lib/utils'

const fetchGraphQL = cache(async (query, preview = isDevelopment) => {
  try {
    const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
        }`
      },
      body: JSON.stringify({ query })
    })

    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllPosts = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        postCollection(preview: ${preview}) {
          items {
            title
            slug
            date
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?.postCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getPost = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        postCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            title
            slug
            date
            seo {
              title
              description
            }
            content {
              json
              links {
                assets {
                  block {
                    sys {
                      id
                    }
                    url
                    title
                    width
                    height
                    description
                  }
                }
                entries {
                  inline {
                    sys {
                      id
                    }
                    __typename
                    ... on ContentEmbed {
                      title
                      embedUrl
                      type
                    }
                    ... on CodeBlock {
                      title
                      code
                    }
                    ... on Tweet {
                      id
                    }
                  }
                }
              }
            }
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.postCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getWritingSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        postCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            date
            seo {
              title
              description
              ogImageTitle
              ogImageSubtitle
            }
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.postCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getPageSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        pageCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            seo {
              title
              description
              ogImageTitle
              ogImageSubtitle
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.pageCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllPageSlugs = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        pageCollection(preview: ${preview}) {
          items {
            slug
            hasCustomPage
            sys {
              id
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?.pageCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getAllPostSlugs = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        postCollection(preview: ${preview}) {
          items {
            slug
          }
        }
      }`,
      preview
    )

    return entries?.data?.postCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getPage = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        pageCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            title
            slug
            content {
              json
              links {
                assets {
                  block {
                    sys {
                      id
                    }
                    url
                    title
                    width
                    height
                    description
                  }
                }
              }
            }
            sys {
              id
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.pageCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllLogbook = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        logbookCollection(order: date_DESC, preview: ${preview}) {
          items {
            title
            date
            description
            image {
              url
              title
              description
              width
              height
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?.logbookCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})
