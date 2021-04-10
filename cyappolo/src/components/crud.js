import React from "react"

import styled from "styled-components"

import { gql, useQuery, useMutation } from "@apollo/client"
const GET_TODOS = gql`
  {
    allCrud {
      text
      id
    }
  }
`

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) {
      text
    }
  }
`
const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`
export const TodoItem = () => {
  const [text, setText] = React.useState("")
  const [addTodo] = useMutation(ADD_TODO)
  const [deleteItem] = useMutation(DELETE_ITEM)

  let input
  const addTask = () => {
    addTodo({
      variables: {
        text: input.value,
      },
      refetchQueries: [{ query: GET_TODOS }],
    })
    input.value = ""
  }
  const deleteTask = id => {
    deleteItem({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }

  const { loading, error, data } = useQuery(GET_TODOS)

  if (loading)
    return (
      <h2
        style={{
          marginTop: "60px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        Loading...
      </h2>
    )

  if (error) {
    console.log(error, "ELOLO")
    return <h2>Error</h2>
  }
  if (data) {
    console.log(data, "all-0--0-")
  }
  const Container = styled.div`
    width: 250px;
    margin: 10px auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    height: 80px;
    padding: 30px 20px;
    display: flex;
  `

  return (
    <>
      <Container>
        <form>
          <input
            style={{
              padding: "8px",
              width: "240px",
              backgroundColor: "#fff98",
            }}
            ref={node => {
              input = node
            }}
          />
          <button
            type="submit"
            onClick={addTask}
            style={{
              padding: "4px 5px",
              marginTop: "10px",
              justifyContent: "flex-end",
              background: "#332331",
              display: "flex",
              color: "#ffff",
            }}
          >
            Add Todo
          </button>
        </form>
      </Container>
      <div
        style={{
          justifyContent: "center",
          // display: "flex",
          textAlign: "center",
        }}
      >
        <h2>My TODO LIST</h2>
        <br />
        {
          <ul
            style={{
              listStyle: "none",
            }}
          >
            {data.allCrud.map(crud => {
              return (
                <li key={crud.id}>
                  {crud.text}

                  <button
                    onClick={() => deleteTask(crud.id)}
                    // onClick={e => {
                    //   e.preventDefault()
                    //   deleteItem({ variables: { id: crud.id } })
                    // }}
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ul>
        }
      </div>
    </>
  )
}
