import { useState } from 'react'
//import { useQuery, useApolloClient } from '@apollo/client'
import { useApolloClient } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import Recommendations from "./components/Recommendations"
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

//import { ALL_AUTHORS } from './queries'
//import { ALL_BOOKS } from './queries'

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
  
//  const result = useQuery(ALL_AUTHORS)
//  const result2 = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()


//  if (result.loading || result2.loading )  {
//    console.log("...loading...")
//    return <div>loading authors and books ...</div>
//  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    setPage("authors")
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        { token && <button onClick={ logout}>Log out</button> }
      </div>
      <Authors show={page === 'authors'} setError={notify} />
      <Books show={page === 'books'} setError={notify} />
      <Recommendations show={page === "recommend"} setError={notify} />
      <NewBook show={page === 'add'} setError={notify} />
      <LoginForm
        setToken={setToken}
        setError={notify}
        show={page === "login"}
        setPage={setPage}
        />

    </div>
  )
}

export default App