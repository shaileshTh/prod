import React, { useContext } from "react";
import { BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton } from "./common";
import { Marginer } from "../marginer"
import { AccountContext } from "./accountContext";

export function LoginForm(props){

    const { switchToSignup } = useContext(AccountContext);

    return <BoxContainer>
        <FormContainer>
            <Input type="email" name="email" placeholder="Email"/>
            <Input type ="password" name= "password" placeholder="Password"/>
        </FormContainer>
        <Marginer direction="vertical" margin={10} />
        <MutedLink href = "#">Forgot your password?</MutedLink>
        <Marginer direction="vertical" margin="1.6em" />
        <SubmitButton type="submit">Login</SubmitButton>
        <Marginer direction="vertical" margin="1em" />
        <MutedLink>Don't have an account?<BoldLink href="#" onClick={switchToSignup}>Sign Up</BoldLink></MutedLink>
    </BoxContainer>
}