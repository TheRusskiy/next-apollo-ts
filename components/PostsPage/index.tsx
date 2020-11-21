import { NextPage } from 'next'
import { gql, useQuery } from '@apollo/client'
import { withApollo } from 'components/withApollo'
import getStaticApolloProps from 'lib/getStaticApolloProps'
import Link from 'next/link'

import { postsPage } from './types/postsPage'

type Params = {
  seoName: string
}

type Props = {}

const QUERY = gql`
  query postsPage {
    allPosts(first: 10) {
      id
      title
    }
  }
`

function PostsPage() {
  const { data } = useQuery<postsPage>(QUERY, {
    fetchPolicy: 'cache-and-network'
  })
  const allPosts = data?.allPosts
  if (!allPosts) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>Posts</h1>
      {allPosts.map((p) => (
        <div key={p.id}>
          <Link href={`/posts/${p.id}`}>{p.title}</Link>
        </div>
      ))}
    </div>
  )
}

export default withApollo({ ssr: false })(PostsPage as NextPage)

export const getStaticProps = getStaticApolloProps<Props, Params>(PostsPage, {
  revalidate: 10
})
