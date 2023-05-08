import { useQuery } from '@apollo/client'
import AuthorForm from "./AuthorForm"
import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  //console.log("...Authors - props...", props)

  const result = useQuery(ALL_AUTHORS, { skip: !props.show })
  //const result = useQuery(ALL_AUTHORS)
  
  if (!props.show) {
    return null
  }
  if (result.loading) return <>loading authors...</>
  //console.log("...Authors - result...", result)

  const authors = result.data.allAuthors
  //console.log("...authors...", authors)
 
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorForm
        authors={authors}
        setError={props.setError}
      />


    </div>
  )
}

export default Authors
