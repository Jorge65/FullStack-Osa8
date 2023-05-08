const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first own has been implemented 
*/

const typeDefs = `
  type Author {
    name: String!,
    born: Int,
    bookCount: Int,
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const count = Book.collection.countDocuments()
      console.log("..countB..",count, typeof count)
      return count
    },
    authorCount: async () => {
      const count = Author.collection.countDocuments()
      console.log("..countA..",count, typeof count)
      return count
    },

    allBooks: async (root, args) => { 
//      console.log("...Query-allBooks-args...", args)
      let books2 = await Book.find().populate("author")
//      console.log("...books2...", books2)

      if (!args.author && !args.genre) {
//        console.log("...books2...", books2)
        return books2
      }
      if (args.author && !args.genre) {
        const booksByAuthor = books2.filter( (b) => b.author.name === args.author) 
//        console.log("...booksByAuthor...", booksByAuthor)
        return booksByAuthor
      }
      if (args.genre && !args.author) {
        const booksByGenre = books2.filter( (b) => b.genres.includes ( args.genre) ) 
//        console.log("...booksByGenre...", booksByGenre)
        return booksByGenre
      }
      if (args.genre && args.author) {
        const booksByAuthor = books2.filter( (b) => b.author.name === args.author) 
//        console.log("...booksByAuthor...", booksByAuthor)
        const booksByGenreAndAuthor = booksByAuthor.filter( (b) => b.genres.includes ( args.genre) ) 
//        console.log("...booksByGenreAndAuthor...", booksByGenreAndAuthor)
        return booksByGenreAndAuthor
      }
//      return books 
    },
    allAuthors: async () => {
      console.log("...allAuthors...")
      const authors2 = await Author.find()
      return authors2
//      return authors 
    },
    me: (root, args, context) => {
      console.log("...args...context...", args, context)
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books2 = await Book.find().populate("author")
//      console.log("...books2...", books2)
      const booksByAuthor = books2.filter( (b) => b.author.name === root.name) 
//    const booksByAuthor = books.filter( (b) => b.author === root.name) 
//    console.log("...booksByAuthor...", booksByAuthor)
//    console.log("...booksByAuthor.length...", booksByAuthor.length)
      return booksByAuthor.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
//      console.log("...Mutation-addBook-args...", args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }


      const foundAuthor = await Author.findOne({ 
        name: args.author 
      })
//      console.log("...foundAuthor", foundAuthor)

      const newBook = new Book ( {...args,})

      if (!foundAuthor ) {
        const newAuthor = new Author ({
          name: args.author,
          born: null,
        })
        try {
          await newAuthor.save()
          newBook.author = newAuthor._id        
        } catch (error) {
          throw new GraphQLError('Saving new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      } else {
        newBook.author = foundAuthor._id
      }
//        console.log("...newAuthor...", newAuthor)
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }


//      console.log("...newBook... ", await newBook.populate("author"))
      return newBook.populate("author")
    },

    editAuthor: async (root, args, context) => {
//      console.log("...Mutation-editAuthor-args...", args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const foundAuthor = await Author.findOne({ 
        name: args.name 
      })
      if (!foundAuthor) {
        return null
      }  
      foundAuthor.born = args.setBornTo 
//      console.log("...2b-foundAuthor", foundAuthor)

      try {
        await foundAuthor.save()
      } catch (error) {
        throw new GraphQLError('Updating author birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return foundAuthor
    },
    createUser: async (root, args) => {
      console.log("...args...", args, args.username, args.favoriteGenre)
      const user = new User({ 
        username: args.username, 
        favoriteGenre: args.favoriteGenre
      })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    console.log("...auth1..", auth)
//    console.log("...jore0,auth.substring(0)",auth.substring(0))
//    console.log("...jore0,auth.substring(7)", auth.substring(7))
//    console.log("...jore0,process.env.JWT_SECRET... ",process.env.JWT_SECRET)
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      console.log("...jore2... ")
      console.log("...decodedToken... ", decodedToken)
      console.log("...jore3... ")
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

//jorma secret
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvcm1hIiwiaWQiOiI2NDU1ZTM3NjZmNTYwODJiYzI1YWIwNDQiLCJpYXQiOjE2ODMzNTA2MDZ9.ah56m22iijCKoDxQZChxec5R06iXjHHi884CtSWdUlE

// jorma2 secret
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvcm1hMiIsImlkIjoiNjQ1NWUzN2M2ZjU2MDgyYmMyNWFiMDQ2IiwiaWF0IjoxNjgzMzUxMzE3fQ.ETJ4VCFFdKax-AHirE0Uq57BZcxIybkOBY9bR4gBsec
