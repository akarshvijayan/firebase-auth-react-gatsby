import React, { useState, useContext, useEffect } from "react"
import { navigate } from "gatsby"
import { Form, Input, Button, ErrorMessage } from "../components/common"
import { FirebaseContext } from "../components/Firebase"

const Register = () => {
  const { firebase } = useContext(FirebaseContext)
  const [errorMessage, setErrorMessage] = useState("")

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  })

  let isMounted = true

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false
    }
  }, [])

  function handleInputChange(e) {
    e.persist()
    setErrorMessage("")
    setFormValues(currentValues => ({
      ...currentValues,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (formValues.password === formValues.confirmPassword) {
      debugger;

      await firebase.registerWithEmailAndPassword( formValues.username, formValues.email, formValues.password );
        // .then(() => {
        //   navigate("/")
        // })
        // .catch(error => {
        //   if (isMounted) {
        //     setErrorMessage(error.message)
        //   }
        // })

        navigate("/");
        
    } else {
      setErrorMessage("Password and Confirm Password fields must match")
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        onChange={handleInputChange}
        value={formValues.username}
        placeholder="username"
        type="text"
        required
        name="username"
      />
      <Input
        onChange={handleInputChange}
        value={formValues.email}
        placeholder="email"
        type="email"
        required
        name="email"
      />
      <Input
        onChange={handleInputChange}
        value={formValues.password}
        placeholder="password"
        type="password"
        required
        minLength={6}
        name="password"
      />
      <Input
        onChange={handleInputChange}
        value={formValues.confirmPassword}
        placeholder="confirm password"
        type="password"
        required
        minLength={6}
        name="confirmPassword"
      />
      {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button type="submit" block>
        Register
      </Button>
    </Form>
  )
}

export default Register
