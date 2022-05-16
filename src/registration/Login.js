import React, { useState, useEffect } from 'react'

import './Login.css'
import Header from './../common/Header';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router'
import { LOGIN_URL } from './../common/Common'
import { post } from './../Network/Network'

function Login() {

    const history = useNavigate();

    const [showLoader,setShowLoader]=useState(false);

    const [login, setLogin] = useState({
        "empid": '',
        'password': ''
    })

    const handleCloseSnackbar = () => {
        messageBar.open = false;
        setMessageBar(messageBar);
    }

    const [messageBar, setMessageBar] = useState({
        'open': false,
        'message': "",
        'handleClose': handleCloseSnackbar
    })

    

    const handleLoginClicked = (event) => {
        authenticate();
    }

    const authenticate = () => {
        setShowLoader(true);
        if(login.empid==''){
            showMessage("Employee Id can't be empty")
            return;
        }
        if(login.password==''){
            showMessage("Password can't be empty")
            return;
        }
        var loginRequest = {
            empId: login.empid,
            password: login.password
        }
        post(LOGIN_URL, loginRequest, (data) => {
            setShowLoader(false);
            sessionStorage.setItem("token",data.data.token);
            history("/dashboard", { replace: false });
        }, (error) => {
            setShowLoader(false);
        })
    }

    const showMessage=(message)=>{
        alert(message)
    }

    const handleOnChange =(event) =>{
        login[event.target.id]=event.target.value;
        setLogin(login);
    }

    const StyledLink = styled(Link)(({ theme }) => ({
        margin: "4px"
    }));

    return (
        <Header open={showLoader} bar={messageBar}>
            <Container maxWidth="sm" className="centerwindow">
                <Card >
                    <div className="loginwindow">
                        <center><h3>Login</h3></center>
                        <TextField id="empid" label="Employee ID" variant="standard" margin="normal" defaultValue={login.empid}  onChange={handleOnChange}/>
                        <TextField id="password" label="Password" variant="standard" type="password" margin="normal" defaultValue={login.password} onChange={handleOnChange} />
                        <div className="rightcontent">
                            <Button variant="outlined" size="medium" onClick={handleLoginClicked}>Login</Button>
                        </div>
                        <div className="rowwindow">
                            <p>Don't you have an account</p>
                            <StyledLink
                                className="linkgap"
                                component="button"
                                variant="h6"
                                onClick={() => {
                                    history("/register", { replace: false })
                                }}
                            >
                                Click Here
                            </StyledLink>
                        </div>
                    </div>
                </Card>
            </Container>
        </Header>
    )
}

export default Login
