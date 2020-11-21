/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: postPage
// ====================================================

export interface postPage_Post {
  __typename: 'Post'
  id: string
  title: string
  createdAt: any
}

export interface postPage {
  Post: postPage_Post
}

export interface postPageVariables {
  postId: string
}
