
   
import React from "react";
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { useState, useEffect } from "react";
import { EmpNavBar } from "../../components/Empnavbar";
// import { io } from "socket.io-client";
import ScrollableFeed from 'react-scrollable-feed'
import Collapse from 'react-bootstrap/Collapse'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import database from '../../Firebase'
import { ref, onValue, set } from "firebase/database";

import Alert from 'react-bootstrap/Alert'

let index
let messageArr = [];
let setS = new Set();
let activeUsers = [];
let nameMap = new Map();
const db = database;

// let socket = io();
// console.log(socket)

export function EmpChat(props){

    const [fetched, setFetched] = useState(false);
    const [email, setEmail] = useState("Not logged in");
    const [patients, setPatients] = useState([])
    const [userID, setUserID] = useState(-1);
    const [allMessages, setAllMessages] = useState([])
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState();
    const [isDoctor, setIsDoctor] = useState(false)
    const [mapDone, setMapDone] = useState(false);
    const [userList, setUserList] = useState([])
    const [show, setShow] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);
    const[composeTo, setComposeTo] = useState();
    const[composeToPatient, setComposeToPatient] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        onValue(ref(db, 'messages/'), (snapshot) => {
            setFetched(false)
            // console.log(snapshot)
        });
    },[fetched])
        
    // useEffect(() => {
    //     socket.once("new", (arg) => {
    //         socket.off()
    //         console.log(arg)
    //         setFetched(false)
    //         return false;
    //     })
    // },[fetched])
   
    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios
        .get("https://ksu-tm.herokuapp.com/all-users")
        .then((response) =>{
            let arr = [];
            response.data.forEach((element) => {
                if(!setS.has(element.user_id)){
                    arr.push({
                        user_id : element.user_id,
                        full_name: element.full_name,
                        email: element.email,
                        user_type: element.user_type
                    })
                }
            })
            setUserList(arr);
        })
    }, [])
    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios
        .post("https://ksu-tm.herokuapp.com/me", { withCredentials: true })
        .then((response) => {
            setEmail(response.data.email);
            setUserID(response.data.user_id);
            setFullName(response.data.full_name);
            if(response.data.user_type === 'doctor') setIsDoctor(true)
        }).catch((err) => {
            console.log("CHP/index.jsx" + err);
        });

        if(isDoctor){
            axios.post('https://ksu-tm.herokuapp.com/get-patients-by-docId', 
            {
              "doctor_id" : userID
            },{ 
              withCredentials: true 
            })
                .then((response) => {
                    setPatients(response.data)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [userID, isDoctor])
    useEffect(() => {
        axios
            .get("https://ksu-tm.herokuapp.com/messaging")
            .then((response) =>{
                messageArr = response.data.filter((item) => {
                    return item.recipient_id === userID || item.sender_id === userID
                })

            }).then(() => {
                messageArr.forEach((item) => {
                    if(!setS.has(item.sender_id) && item.sender_id !== userID){
                        activeUsers.push(item.sender_id)
                        setS.add(item.sender_id)
                    }
                    if(!setS.has(item.recipient_id) && item.recipient_id !== userID){
                        activeUsers.push(item.recipient_id)
                        setS.add(item.recipient_id)
                    }
                })
                setAllMessages(messageArr)
                activeUsers.forEach((id) => {
                    axios
                    .get(`https://ksu-tm.herokuapp.com/user/find/${id}`, { withCredentials: true },
                    { }).then((response) => {
                        nameMap.set(id, response.data[0].full_name)
                        if(nameMap.size === activeUsers.length) setMapDone(true)
                    }).catch(err => console.log(err))
                })
            })
            .catch((err) => console.log(err))
                setLoading(false)
                setFetched(true)
            
    }, [fetched, userID, mapDone]);

    useEffect(() => {
        document.title = "Chat";  
      }, []);

    const handleClick = (e) => {
        let targetIndex;
        if (e.target.id === "") targetIndex = e.target.parentElement.id;
        else targetIndex = e.target.id;
        setComposeTo(targetIndex)
        setTimeout(()=>{
            setShow(true);
        },100)
    }
    const handleClickPatients = (e) => {
        let index;
        if (e.target.id === "") index = e.target.parentElement.id;
        else index = e.target.id;
        if(activeUsers.includes(parseInt(index))){
            window.alert("Conversation with the selected user is already open. Please find it below.")
        }else{
            setComposeToPatient(index)
            setTimeout(()=>{
                setShowDocModal(true);
            },100)
        }
    }
    
    const handleClose = () => {
        setShow(false);
      };

    const handleCloseDocModal = () => {
        setShowDocModal(false);
    };


    const handleModalSubmit = (e) =>{
        e.preventDefault();
        set(ref(db, 'messages/'), {
            message: e.target[0].value
        });
      
       axios
        .post("https://ksu-tm.herokuapp.com/messaging", 
        { 
            sender_id: userID,
            recipient_id: userList[composeTo].user_id,
            message: e.target[0].value
         }).then(e.target[0].value = "").then(setShow(false))
         .catch(err => console.log(err))
         window.location.reload(true);
    }
    const handleModalSubmitPatient = (e) =>{
        e.preventDefault();
       axios
        .post("https://ksu-tm.herokuapp.com/messaging", 
        { 
            sender_id: userID,
            recipient_id: composeToPatient,
            message: e.target[0].value
         }).then(e.target[0].value = "").then(setShowDocModal(false))
         .catch(err => console.log(err))
         window.location.reload(true);
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        set(ref(db, 'messages/'), {
            message: e.target[0].value
        });
        // setFetched(false);
        axios
        .post("https://ksu-tm.herokuapp.com/messaging", 
        { 
            sender_id: userID,
            recipient_id: e.target.parentElement.id,
            message: e.target[0].value
         }).then(e.target[0].value = "")
         .catch(err => console.log(err))
         setTimeout(()=>setFetched(false), 100)

    }
    if(loading && !mapDone) return <h1>loading</h1>
    index = -1
    return (
        <>
        <EmpNavBar email={fullName} />
        <h1 className="text-center mb-3 mt-4">{fullName}'s Message Portal</h1>
        {(isDoctor) ? <ListGroup as="ol" numbered style = {{maxWidth: '500px', margin: '0 auto'}}>
        {(isDoctor && patients.length === 0) ? 
        <Alert variant="danger">
        <Alert.Heading>No patients found!</Alert.Heading>
            <p>
            Please contact your nurse to put your patients into the system.
            </p>
        </Alert>
        : <></>}
        {(isDoctor && patients.length !== 0) ? <small style = {{margin: '-15px auto 8px auto', fontSize: 'large', display:'block', width:'fit-content'}}>Start a conversation with your patients:</small> : <></>}
          {patients.map((user) => {
              return(
              <ListGroup.Item
                  key = {user.user_id}
                  id = {user.user_id}
                  action
                  as="li"
                  onClick = {(e)=>handleClickPatients(e)}
                  className="d-flex justify-content-between align-items-start"
              >
                  <div className="ms-2 me-auto">
                  <div className="fw-bold" id = {user.user_id}>{user.full_name}</div>
                  {user.email}
                  </div>
                  <Badge bg="primary" pill>
                  {user.user_type} #{user.user_id}
                  </Badge>
                  </ListGroup.Item>
                    )
                })}
            </ListGroup>
        :
        <>
        <Button 
            onClick={() => setOpen(!open)}
            aria-controls="collapse"
            aria-expanded={open}
            style = {{margin:'0 auto', display:'block'}}>
            {(open) ? 'Collapse List' : 'Compose new message' }</Button>
            <br/>
            {(open) ? <small style = {{margin: '-15px auto 8px auto', fontSize: 'large', display:'block', width:'fit-content'}}>
                Select a user to start a conversation:</small> : <></>}
        <Collapse in={open}>
            <div id="collapse">
            <ListGroup as="ol" numbered>
                {userList.map((user) => {
                    index++;
                    return(
                    <ListGroup.Item
                        key = {index}
                        id = {index}
                        action
                        as="li"
                        onClick = {(e)=>handleClick(e)}
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                        <div className="fw-bold" id = {user.user_id}>{user.full_name}</div>
                        {user.email}
                        </div>
                        <Badge bg="primary" pill>
                        {user.user_type} #{user.user_id}
                        </Badge>
                    </ListGroup.Item>
                    )
                })}

            </ListGroup>
            </div>
        </Collapse>
        </>
        }
        <br/>
        <hr style = {{width:'500px', margin:'0 auto'}}/>
        <br/>
        {/* {(isDoctor && patients.length === 0) */}
        {(activeUsers.length === 0) ? <h2 style = {{textAlign: 'center'}}>
        {(isDoctor && patients.length !== 0) ? <>Click above to start a conversation!</> : <></>}
            </h2>
        : 
        <small style = {{margin: '-15px auto 8px auto', fontSize: 'large', display:'block', width:'fit-content'}}>Open conversations:</small>
        }
        {activeUsers.map((id) => (
            <Card key = {id} id = {id} className = "message-box">
            <h3 style = {{'textAlign' : 'center'}}>{nameMap.get(id)}</h3>
            <div className = "message-containter">
                <ScrollableFeed>
                    
                {allMessages.map((item) => {
                    if(item.sender_id === id && item.recipient_id === userID) {
                        return (<div style = {{'display':'contents'}} key = {"d" + item.date_time}><p key = {"p" + item.date_time} className = "left-bubble">{item.message}</p>
                        <small key = {item.date_time}>{item.date_time.split("T")[0]+" " + item.date_time.split("T")[1].substring(0,5)}</small></div>)
                    }
                    if(item.sender_id === userID && item.recipient_id === id) {
                        return (<div style = {{'display':'contents'}} key = {"d" + item.date_time}><p key = { "p" + item.date_time} className = "right-bubble">{item.message}</p>
                        <small key = {item.date_time} className = "right">{item.date_time.split("T")[0]+" " + item.date_time.split("T")[1].substring(0,5)}</small></div>)
                    }
                    return null;
                })}
            </ScrollableFeed>
            </div>
            <form onSubmit = {(e) => handleSubmit(e)}>
            <InputGroup style = {{'bottom': '-17px', 'position':'absolute'}} className="mb-3">
                <FormControl
                placeholder={"Reply to " + nameMap.get(id)}
                />
                <Button type = "submit" variant="outline-secondary" id="button-addon2">
                Send
                </Button>
            </InputGroup>
            </form>
        </Card>
        ))}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(userList[composeTo] !== undefined) ? <h3>Say Hi to {userList[composeTo].full_name}</h3> : <></>}
                 <form onSubmit = {(e) => handleModalSubmit(e)}>
                <InputGroup style = {{'bottom': '-17px'}} className="mb-3">
                    <FormControl
                    placeholder="Type your message.."
                    />
                    <Button type = "submit" variant="outline-secondary" id="button-addon2">
                    Send
                    </Button>
                </InputGroup>
                </form>
            </Modal.Body>
        </Modal>
        <Modal show={showDocModal} onHide={handleCloseDocModal}>
            <Modal.Header closeButton>
                <Modal.Title>New Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(composeToPatient !== undefined) ? <h3>Say Hi to patient #{composeToPatient}</h3> : <></>}
                 <form onSubmit = {(e) => handleModalSubmitPatient(e)}>
                <InputGroup style = {{'bottom': '-17px'}} className="mb-3">
                    <FormControl
                    placeholder="Type your message.."
                    />
                    <Button type = "submit" variant="outline-secondary" id="button-addon2">
                    Send
                    </Button>
                </InputGroup>
                </form>
            </Modal.Body>
        </Modal>
        </>
    );
}