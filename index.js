import { RemoveHandler } from './lib/removeHandler'
import { RemoveLink } from './lib/removeLink'

const DOMAIN_HOST = 'www.gatsbyjs.com'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleDocument(res, searchParams) {
  const rewriter = new HTMLRewriter()

  if (searchParams.has('remove-inline-scripts')) {
    rewriter.on(
      'script:not([src])',
      new RemoveHandler(searchParams.get('remove-inline-scripts').split(',')),
    )
  }

  if (searchParams.has('remove-external-scripts')) {
    rewriter.on('script[src]', new RemoveHandler())
  }

  if (searchParams.has('remove-preload')) {
    rewriter.on(
      'link',
      new RemoveLink({
        rel: 'preload',
      }),
    )
  }

  if (searchParams.has('remove-selectors')) {
    rewriter.on(
      searchParams.get('remove-selectors'),
      new RemoveLink(RemoveHandler),
    )
  }

  const transformedResponse = await rewriter.transform(res)
  const newResponse = new Response(transformedResponse.body, res)

  if (searchParams.has('remove-preload')) {
    newResponse.headers.delete('link')
  }

  return newResponse
}

/**
 * Respond with hello worker text
 */
async function handleRequest(event) {
  /**
   * @type {Request} request
   */
  const request = event.request
  const parsedUrl = new URL(request.url)

  parsedUrl.host = DOMAIN_HOST

  const fetchUrl = `${parsedUrl.origin}${parsedUrl.pathname}`

  const cache = caches.default
  const cacheKey = parsedUrl.toString()

  let res = await cache.match(cacheKey)

  if (!res) {
    res = await fetch(fetchUrl, {
      cf: {
        cacheEverything: true,
        cacheTtl: 3600,
      },
    })

    // handle navigate
    if (res.headers.get('Content-Type').includes('text/html')) {
      res = await handleDocument(res, parsedUrl.searchParams)

      res.headers.set('Cache-Control', 'max-age=300')

      res.headers.set('Cache-Control', 'max-age=3600')
    }

    event.waitUntil(cache.put(cacheKey, res.clone()))
  }

  return res
}
