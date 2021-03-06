import React, { useEffect, useState } from "react";
import "../Empnavbar/style.css";
// import styled from "styled-components";
// import { BrandLogo } from "../brandLogo";
// import { Marginer } from "../marginer";
import { useHistory } from "react-router-dom";
import EmpNavbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

//old styles commented at the bottom if you need it
export function EmpNavBar(props) {
  let history = useHistory();
  const [userType, setUserType]= useState("");
  //Get user type.
  useEffect(() => {
    axios.defaults.withCredentials = true;

    axios
      .post("https://ksu-tm.herokuapp.com/me", { withCredentials: true })
      .then((response) => {
        setUserType(checkUserType(response.data.user_type));
      })
      .catch((err) => {
        console.log("CHP/index.jsx- From EmpNavBar" + err);
      });
  }, []);

  //Check what type the user is
  function checkUserType(userType){
    if(userType === "patient"){
      console.log("Found patient when should not be patient")
      return "Customer";
    }
    else if(userType === "doctor"){
      return "Employee";
    }else{
      return "Nurse";
    }
  }

  return (
    <EmpNavbar bg="lightgreen" variant="light">
      <Container>
        <EmpNavbar.Brand>
          <img
            alt=""
            src={require("./newLogo.png")}
            width="40"
            height="40"
            className="d-inline-block align-top"
          />{" "}
          <strong style={{ color: "#122a8e", size: "33px", margin: "0 0 0 5px" }}>
            <Link style={{ textDecoration: "none" }} to={`/${userType}HomePage`}>
            Tele-Medic | {(userType === "Employee" ? "Doctor" : userType)}
            </Link>
          </strong>
        </EmpNavbar.Brand>
        <EmpNavbar.Collapse className="justify-content-end">
          <EmpNavbar.Text style={{ marginRight: "7px" }}>
            <a href="#profile" style={{ fontWeight: "bold" }}>
              {props.email}
            </a>
          </EmpNavbar.Text>
          {"|"}
          <EmpNavbar.Text style={{ marginLeft: "7px" }}>
            <button
              style={{ border: "none", background: "none" }}
              onClick={() => {
                axios
                  .post("https://ksu-tm.herokuapp.com/logout")
                  .then((response) => {
                    window.location.reload()
                  })
                  .catch((err) => {
                    console.log(err.response.data);
                  });
                window.location.reload()
              }}
            >
              Sign Out
            </button>
          </EmpNavbar.Text>
        </EmpNavbar.Collapse>
      </Container>
    </EmpNavbar>

    // <NavBarContainer>
    //     <BrandLogo />
    //         <AccessibilityContainer>
    //             <AnchorLink>My Account</AnchorLink>
    //             <Marginer direction="horizontal" margin={17}/>
    //             <AnchorLink><Link style={NavStyle} to = "/">Logout</Link></AnchorLink>
    //         </AccessibilityContainer>
    // </NavBarContainer>
  );
}
// const NavBarContainer = styled.div`
//     width: 100%;
//     height: 65px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 0 1.5em;
// `;

// const AccessibilityContainer = styled.div`
//     display:flex;
// `;

// const AnchorLink = styled.a`
//     font-size: 10px;
//     color: #fff;
//     cursor: pointer;
//     text-decoration: none;
//     outline: none;
//     transition: all 200ms ease-in-out;

//     &:hover{
//         filter: contrast(0.6);
//     }
// `;

// const NavStyle ={
//     color:"white"
// }
