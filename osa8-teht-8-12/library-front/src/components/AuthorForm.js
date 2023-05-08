import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import Select from "react-select"

const AuthorForm = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [authorYear, setAuthorYear] = useState("")

  const [changeYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }], 
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
      props.setError(messages)
    },
  })

  const authorOptions = props.authors.map((a) => ({
    value: a.name,
    label: a.name
  }))

  const submit = (event) => {
    event.preventDefault()
    changeYear({ variables: { name: selectedAuthor.value, setBornTo: +authorYear } })
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
