import React, { useContext, useState } from "react";
import { WhiteBoldLink, BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton } from "./common";
import { Marginer } from "../components/marginer";
import { AccountContext } from "./accountContext";
import { useHistory } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import axios from "axios";
import styled from "styled-components";
import Spinner from 'react-bootstrap/Spinner'

// axios.defaults.withCredentials = true;

export function LoginForm(props){

    const { switchToSignup } = useContext(AccountContext);
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[err, setError] = useState(false);
    const[loading, setLoading] = useState(false);
    const [userType, setUserType] = useState("");
    const[message, setMessage] = useState('');
    const history = useHistory(); 
    
    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post('https://ksu-tm.herokuapp.com/login', {
            email : email,
            password: password
          },{
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
          .then(function (response) {
            setUserType(response.data)
            setTimeout(() => {
              setLoading(false)
              console.log("login page response is:", response.data)
              if (response.data === "doctor") {
                history.push("/EmployeeHomePage")
              } else if (response.data === "nurse" ) {
                history.push("/NurseHomePage") 
              } else {
                history.push("/CustomerHomePage")
              }
            }, 1000)
          })
          .catch(function (error) {
            setTimeout(() => {
              setLoading(false)
              setError(true);
              if(error.response) setMessage(error.response.data)
              else setMessage("Something went wrong.")
            }, 500)
          });
    }
 
    return <BoxContainer>
        <FormContainer onSubmit = { e => {handleSubmit(e)}}>
            <Input type="email" name="email" placeholder="Email"
                onChange = {e => setEmail(e.target.value)}/>
            <Input type ="password" name= "password" placeholder="Password" 
                onChange = {e => setPassword(e.target.value)}/>
            {err ? <Alert style = {{width:'220px'}} variant = "danger">{message}</Alert> : <></>}
            <Marginer direction="vertical" margin="1.6em" />
            {loading ? <Spinner style = {{margin:'0 auto'}} animation="border" /> : <SubmitButton type="submit">Login</SubmitButton>}
            <Marginer direction="vertical" margin="1em" />
        </FormContainer>
        <Marginer direction="vertical" margin={5} />
        {!loading ? <>
          <MutedLink href = "#">Forgot your password?</MutedLink>
          <Marginer direction="vertical" margin="0.8em" />
          <small>Don't have an account?<BoldLink href="#" onClick={switchToSignup}>Sign Up</BoldLink></small>
        </> :
        <h4 style = {{color: '#0d6efd', textAlign:'center'}}>Loading {userType} dashboard...</h4>}
        <Marginer direction="vertical" margin={5} />
        <AboutUsButton>
        <SubmitButton>
              {/* // style={{ border: "none", background: "none" }} */}

            <WhiteBoldLink href="https://linkedin-list.shaileshthapa.repl.co/" >About Us</WhiteBoldLink>

            </SubmitButton>
            </AboutUsButton>
    </BoxContainer>
}
const AboutUsButton = styled.div`
  display: flex;
  width: 350px;
  height: 50px;
`;