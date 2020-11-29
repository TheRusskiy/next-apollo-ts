import { NextPageContext } from 'next'
import fetch from 'isomorphic-unfetch'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

function createCookieLink(context: NextPageContext | null) {
  const ssrCookie = context?.req?.headers?.cookie

  return setContext((_request, { headers }) => ({
    headers: {
      ...headers,
      cookie: ssrCookie ?? headers?.cookie
    }
  }))
}

export default function createApolloClient(
  initialState: object,
  ctx: NextPageContext | null
) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.

  const fetchOptions = {
    // credentials: 'include',
    redirect: 'manual'
  }

  const cookieLink = createCookieLink(ctx)

  const fetchWithCookies: typeof fetch = async (
    input: RequestInfo,
    init?: RequestInit
  ) => {
    const result = await fetch(input, init)
    if (ctx?.res) {
      const cookiesFromApi = result.headers.get('set-cookie')
      if (cookiesFromApi) {
        ctx?.res.setHeader('set-cookie', cookiesFromApi)
      }
    }
    return result
  }

  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}`,
    fetch: fetchWithCookies,
    fetchOptions
  })
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: cookieLink.concat(httpLink),
    cache: new InMemoryCache().restore(
      (initialState || {}) as NormalizedCacheObject
    )
  })
}
