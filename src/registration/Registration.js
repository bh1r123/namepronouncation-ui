import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import './Login.css'
import Header from './../common/Header';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { post } from './../Network/Network';
import { REGISTRATION } from './../common/Common'
import { useNavigate } from 'react-router'
function Registration() {

    const navigate = useNavigate();

    const [registration, setRegistration] = useState({
        "empId": '',
        "firstname": '',
        "lastname": '',
        "emailId": '',
        "password": ''
    })
    const [showAlert,setShowAlert]=useState(false);


    const handleCloseSnackbar = (event) => {
        messageBar.open = false;
        setMessageBar(messageBar);
    }

    const [messageBar, setMessageBar] = useState({
        open: false,
        message: "",
        handleClose: handleCloseSnackbar
    })


    const [showLoader, setShowLoader] = useState(false);

    const onHandleChange = (event) => {
        registration[event.target.id] = event.target.value;
        setRegistration(registration);
    }

    const handleRegistrationClicked = (event) => {
        if (registration.empId == '') {
            showMessage("Employee Id Cannot be Empty");
            return;
        }
        if (registration.firstname == '') {
            showMessage("First Name Cannot be Empty");
            return;
        }
        if (registration.lastname == '') {
            showMessage("Last Name Cannot be Empty");
            return;
        }
        if (registration.emailId == '') {
            showMessage("Email Id Cannot be Empty");
            return;
        }
        if (registration.password == '') {
            showMessage("Password Cannot be Empty");
            return;
        }
        setShowLoader(true);
        post(REGISTRATION, registration, (data) => {
            setShowLoader(false);
            sessionStorage.setItem("token", data.data.token);
            navigate("/dashboard", { replace: false });
        }, (error) => {
            setShowLoader(false);
        })
        console.log("Registration Clicked..!")
    }

    const showMessage = (message) => {
        // messageBar.open = true;
        // setShowAlert(true);
        // messageBar.message = message;
        // setMessageBar(messageBar);
        alert(message);
    }

    return (
        <Header open={showLoader} bar={messageBar} handleClose={handleCloseSnackbar}>
            <Container maxWidth="sm" className="centerwindow">
                <Card >
                    <div className="loginwindow">
                        <center><h3>Registration</h3></center>
                        <TextField id="empId" label="Employee ID" variant="standard" defaultValue={registration.empId} margin="normal" onChange={onHandleChange} />
                        <TextField id="firstname" label="First Name" variant="standard" defaultValue={registration.firstname} margin="normal" onChange={onHandleChange} />
                        <TextField id="lastname" label="Last name" variant="standard" defaultValue={registration.lastname} margin="normal" onChange={onHandleChange} />
                        <TextField id="emailId" label="Email Id" variant="standard" defaultValue={registration.emailId} margin="normal" onChange={onHandleChange} />
                        <TextField id="password" label="Password" variant="standard" defaultValue={registration.password} type="password" margin="normal" onChange={onHandleChange} />
                        <div className="rightcontent">
                            <Button variant="outlined" size="small" onClick={handleRegistrationClicked}>Register</Button>
                        </div>
                    </div>
                </Card>
            </Container>
        </Header>
    )
}
export default Registration
