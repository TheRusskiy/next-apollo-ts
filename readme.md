# next-apollo-ts starter kit

## Differences with the "official" next.js + apollo example:

* Typescript.
* Automatic type generation from graphql queries.
* Support for Apollo on pages with `getStaticProps` without a need to know and load all queries. Addresses https://github.com/vercel/next.js/discussions/11957.
* Prevent apollo queries running twice for `fetchPolicy: 'cache-and-network'`, once on SSR then on CSR. Apollo won't run network queries until a page is mounted. IMHO it's preferred solution to `ssrForceFetchDelay`.
* When doing a client side navigation to pages that were generated statically Apollo doesn't fire a new query to load data, instead it uses data that was pre-generated by merging it into apollo cache.
* Addresses shortcomings of `revalidate` (https://github.com/vercel/next.js/discussions/11552#discussioncomment-53779) by checking when the data was last fetched. If it was fetch longer than the `revalidate` period, we trigger a query from client-side to load up-to-date data on queries with `fetchPolicy: 'cache-and-network'`.
* Supports API server setting cookies during SSR phase.

Bonus:

* Eslint config.
* Styled-components integration.

## Usage

### SSR:
If you want to inject apollo client into your page and generate it on server wrap it in `withApollo({ ssr: true })(YourPage)`, e.g.:
```
export default withApollo({ ssr: true })(YourPage)
```

### CSR:
If you want to inject apollo client into your page and skip server-side generation then wrap it in `withApollo({ ssr: false })(YourPage)`, e.g.:
```
export default withApollo({ ssr: false })(YourPage)
```

### SSG (getStaticProps):
If you want to pre-generate your page, then do the following:

```
export default withApollo({ ssr: false })(YourPage)
export const getStaticProps = getStaticApolloProps<Props, Params>(YourPage)
```

### ISR (getStaticProps + revalidate):
If you want to pre-generate your page, but keep updating it every N seconds, then do the following:

```
export default withApollo({ ssr: false })(YourPage)

// Update every 60 seconds
export const getStaticProps = getStaticApolloProps<Props, Params>(YourPage, { revalidate: 60 })
```

#### Running the example

The example API server was taken from official Next.js repo, unfortunately it seems to be no longer running :-(
