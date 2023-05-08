import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { GET_ME } from '../queries'
import { useState } from "react"

const Recommendations = (props) => {
  //console.log("...Recommendations - props...", props)

  const resultMe = useQuery(GET_ME, {
    skip: !props.show,
  })

  const result = useQuery(ALL_BOOKS, {
    skip: !props.show,
    fetchPolicy: "no-cache"
  })

  if (!props.show) {
    return null
  }
  if (resultMe.loading ) 
    return <>Loading me...</>

  if (result.loading ) 
    return <>Loading books...</>

  //console.log("...allBooks...", result.data.allBooks)
  const favoriteGenre = resultMe.data.me.favoriteGenre
  const books = result.data.allBooks.filter( book => book.genres.includes(favoriteGenre))
  //console.log("...favoriteBooks...", books)

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite patterns</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Recommendations
