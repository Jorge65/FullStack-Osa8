import { gql } from '@apollo/client'

export const GET_ME = gql`
  query me {
    me  {
      username
      favoriteGenre
      id
    }
  }
`

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors  {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks (
      $author: String, 
      $genre: String
    ) {
    allBooks (
      author: $author, 
      genre: $genre
    ) {
      title
      author {
        name
        id
        born
        bookCount
      }
      published
      genres
      id
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
      $title: String!, 
      $author: String!, 
      $published: Int!, 
      $genres: [String] 
    ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
        bookCount
        id
      }
      genres
      id
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor(
      $name: String!, 
      $setBornTo: Int!
    ) {
    editAuthor(
      name: $name, 
      setBornTo: $setBornTo
    ) {
      name
      id
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`