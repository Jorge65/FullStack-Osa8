import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import Select from "react-select"

const AuthorForm = (props) => {
//  console.log("...AuthorForm-props...", props)
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [authorYear, setAuthorYear] = useState("")

  const [changeYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }], 
    onError: (error) => {
      let message = error.graphQLErrors[0].message
      console.log("...message..", message)
      props.setError(message)
    },
  })

  const authorOptions = props.authors.map((a) => ({
    value: a.name,
    label: a.name
  }))

  const submit = (event) => {
    event.preventDefault()
//    console.log("..selectedAuthor.value..authorYear...", selectedAuthor.value, authorYear)
    changeYear({ variables: { 
      name: selectedAuthor.value, 
      setBornTo: +authorYear 
    } })
    setAuthorYear("")
  }

  const handleAuthorChange = (selectedAuthor) => {
    setSelectedAuthor(selectedAuthor)
  }

  return (
    <>
      <h1>Set birth year</h1>
      <Select
        options={authorOptions}
        value={selectedAuthor}
        onChange={handleAuthorChange}
      />
      <form onSubmit={submit}>
        <div>
          Born:
          <input
            value={authorYear}
            onChange={({ target }) => setAuthorYear(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </>
  )
}

export default AuthorForm
