import { GetStaticPathsResult, NextPage } from 'next'
import { gql, useQuery } from '@apollo/client'
import { withApollo } from 'components/withApollo'
import getStaticApolloProps from 'lib/getStaticApolloProps'
import { useRouter } from 'next/router'
import apolloStatic from 'components/withApollo/apolloStatic'
import Link from 'next/link'

import { postPage, postPageVariables } from './types/postPage'
import { postPagePaths } from './types/postPagePaths'

type Params = {
  postId: string
}

type Props = {}

const QUERY = gql`
  query postPage($postId: String!) {
    Post(id: $postId) {
      id
      title
      createdAt
    }
  }
`

function PostPage() {
  const router = useRouter()
  const { postId } = router.query as Params
  const { data } = useQuery<postPage, postPageVariables>(QUERY, {
    variables: { postId },
    fetchPolicy: 'cache-and-network'
  })
  const post = data?.Post
  if (!post) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>Post {post.id}</h1>
      <p>
        {post.title} {post.createdAt}
      </p>
      <Link href="/posts">All Posts</Link>
    </div>
  )
}

export default withApollo({ ssr: false })(PostPage as NextPage)

const STATIC_PATHS_QUERY = gql`
  query postPagePaths {
    allPosts(first: 3) {
      id
    }
  }
`
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const client = apolloStatic()
  const result = await client.query<postPagePaths>({
    query: STATIC_PATHS_QUERY
  })
  return {
    paths: result.data.allPosts.map((p) => ({ params: { postId: p.id } })),
    fallback: 'blocking'
  }
}

export const getStaticProps = getStaticApolloProps<Props, Params>(PostPage, {
  revalidate: 10
})
