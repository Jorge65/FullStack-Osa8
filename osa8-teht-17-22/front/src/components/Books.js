import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from "react"

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  // console.log("...Books - props...", props)

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  let books = []

  const result = useQuery(ALL_BOOKS, {
    skip: !props.show,
    fetchPolicy: "no-cache",
    variables: { genre: null }
  })
  // console.log("...Books - result...", result)

  const result2 = useQuery(ALL_BOOKS, {
    skip: !props.show,
        fetchPolicy: "no-cache",
    variables: { genre: selectedGenre }
  })
  // console.log("...Books - result2...", result2)

  if (!props.show) {
    return null
  }

  if (result.loading || result2.loading) 
    return <>Loading books...</>

  // console.log("...Books - 2result...", result)
  // console.log("...Books - 2result2...", result2)

  let allGenres = []
  // console.log("...allGenres...", allGenres)

  result.data.allBooks.map( (book) => {
    book.genres.forEach((genre) => {
      allGenres.push(genre)
    })
  })

  var genreButtons = allGenres.filter(onlyUnique)
  // console.log("...allGenres2...", allGenres)
  //console.log("...genreButtons...", genreButtons)


  const genreClick = (event) => {
    // console.log(event.target.value)
    let tempSelectedGenre = event.target.value 
    setSelectedGenre(tempSelectedGenre)
    // console.log("...selected genre...", tempSelectedGenre)
  }

  books = selectedGenre ? result2.data.allBooks : result.data.allBooks

  return (
    <div>
      <h2>books</h2>

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
      {genreButtons.map( (genre, id ) => (
        <button key={ id } onClick={genreClick} value={genre}>
          {genre}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>All genres</button>
    </div>
  )
}
export default Books
