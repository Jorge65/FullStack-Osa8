import { useState } from 'react'
import { useQuery } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { ALL_AUTHORS } from './queries'
import { ALL_BOOKS } from './queries'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  
  const result = useQuery(ALL_AUTHORS)
  const result2 = useQuery(ALL_BOOKS)
//  console.log("...result...", result)  
//  console.log("...result2...", result2)  
  if (result.loading || result2.loading )  {
    return <div>loading authors and books ...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} authors={result.data.allAuthors} setError={notify} />
      <Books show={page === 'books'} books={result2.data.allBooks} />
      <NewBook show={page === 'add'} setError={notify} />
    </div>
  )
}

export default App

