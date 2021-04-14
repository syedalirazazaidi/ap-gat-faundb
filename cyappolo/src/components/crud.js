import React from "react"

import styled from "styled-components"

import { gql, useQuery, useMutation } from "@apollo/client"
const GET_TODOS = gql`
  {
    allCrud {
      text
      id
      isCompleted
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

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    ToggleTodo(id: $id) {
      text
      isCompleted
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
  const [addTodo] = useMutation(ADD_TODO)
  const [deleteItem] = useMutation(DELETE_ITEM)
  const [ToggleTodo] = useMutation(TOGGLE_TODO)
  let input
  const addTask = () => {
    if (input.value === "") {
      alert("PLZ  Fill The field")
    } else {
      addTodo({
        variables: {
          text: input.value,
        },
        refetchQueries: [{ query: GET_TODOS }],
      })
    }

    input.value = ""
  }
  const deleteTask = id => {
    deleteItem({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }
  const toggleTodo = id => {
    ToggleTodo({
      variables: {
        id,
      },
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
    console.log(data, "alllpp-0--0-")
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
            placeholder="What needs to be done?"
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
                  <p
                    style={{
                      textDecoration: crud.isCompleted
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {crud.text}
                  </p>
                  <div>
                    <button
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        margin: "0.6rem",
                      }}
                      onClick={() => toggleTodo(crud.id)}
                    >
                      Complete
                    </button>
                    <button
                      style={{
                        backgroundColor: "red",
                        color: "white",
                      }}
                      onClick={() => deleteTask(crud.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        }
      </div>
    </>
  )
}
