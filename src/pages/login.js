import React, { useState, useContext, useEffect } from "react"
import { navigate } from "gatsby"
import { FirebaseContext } from "../components/Firebase"
import { Form, Input, Button, ErrorMessage } from "../components/common"
import styled, { css } from 'styled-components'

const GoogleLoginButton = styled.button`
color: red;
cursor: pointer;
&:hover {
  text-decoration: underline;
}
`

const Login = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" })
  const { firebase } = useContext(FirebaseContext)
  const [errorMessage, setErrorMessage] = useState("")
  let isMounted = true


  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    firebase
      .login({ email: formValues.email, password: formValues.password })
      .then(() => {
        navigate("/page-2/")
      })
      .catch(error => {
        if (isMounted) {
          setErrorMessage(error.message)
        }
      })
  }

  async function handleGoogleLoginButtonClick(e) {
    e.preventDefault()

    await firebase.signInWithGoogle();

    navigate("/page-2/")
  }

  function handleInputChange(e) {
    e.persist()
    setErrorMessage("")
    setFormValues(currentValues => ({
      ...currentValues,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section>
      <Form onSubmit={handleSubmit}>
        <Input
          required
          value={formValues.email}
          name="email"
          onChange={handleInputChange}
          placeholder="email"
          type="email"
        />
        <Input
          required
          value={formValues.password}
          name="password"
          onChange={handleInputChange}
          placeholder="password"
          type="password"
        />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button type="submit" block>
          Login
        </Button>
        <GoogleLoginButton onClick={handleGoogleLoginButtonClick}>Login with Google</GoogleLoginButton>
      </Form>


    </section>
  )
}

export default Login
