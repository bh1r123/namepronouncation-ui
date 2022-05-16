import React, { useState, useEffect } from 'react'
import Header from '../common/Header'
import './Settings.css'
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

import { Typography } from '@mui/material';

import Button from '@mui/material/Button';
import { AUDIO_FILE,OPT_IN,OPT_OUT } from './../common/Common'
import { get, post } from './../Network/Network'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router'
import jwt_decode from 'jwt-decode'
import Switch from '@mui/material/Switch';

function Settings() {

    const [empId, setEmpid] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();
    const [standeredUrl, setStanderedUrl] = useState("")
    const [standeredUrlBlob, setStanderedUrlBlob] = useState()
    const [overridenUrlBlob, setOverridenUrlBlob] = useState()
    const [overridenUrl, setOverridenUrl] = useState("")

    const [userInformation, setUserInformation] = useState({});

    useEffect(() => {
        var empInfoId = fetchUserId();
        setShowLoader(true);
        get("http://35.192.143.76:8080/api/v1/npsrecords/getEmpRecord/" + empInfoId, (data) => {
            var response = data.data;
            setUserInformation(response);
            if (userInformation.overridenStatus != 'NEW') {
                loadOverridenFile(response.empId);
            }
            loadFile(response.empId);
            setShowLoader(false);
        }, (error) => {
            setShowLoader(false);
        })
    }, [])

    const fetchUserId = () => {
        var token = sessionStorage.getItem('token');
        console.log(token)
        if (token != undefined && token != "") {
            var decodeToken = jwt_decode(token);
            console.log(decodeToken)
            console.log(decodeToken.empId)
            setEmpid(decodeToken.empId);
            return decodeToken.empId;
        } else {
            setEmpid('');
            return '';
        }
    }

    useEffect(() => {
        if (standeredUrlBlob != null) {
            console.log(standeredUrlBlob);
            var convertedBlob = new Blob([standeredUrlBlob], { type: 'audio/wave' });
            if (convertedBlob.size > 0) {
                var infoUrl = window.URL.createObjectURL(standeredUrlBlob);
                var audio = document.getElementById('streamer');
                // audio.src=infoUrl;
                setStanderedUrl(infoUrl);
            } else {
                setStanderedUrl("")
            }
        }
    }, [standeredUrlBlob])

    useEffect(() => {
        if (overridenUrlBlob != null) {
            console.log(overridenUrlBlob);
            var convertedBlob = new Blob([overridenUrlBlob], { type: 'audio/wave' });
            if (convertedBlob.size > 0) {
                var infoUrl = window.URL.createObjectURL(overridenUrlBlob);
                var audio = document.getElementById('streamer');
                // audio.src=infoUrl;
                setOverridenUrl(infoUrl);
            } else {
                setOverridenUrl("")
            }
        }
    }, [overridenUrlBlob])

    const loadFile = (empId) => {
        (async () => {
            try {
                if (standeredUrl != undefined && standeredUrl != '') {
                    window.URL.revokeObjectURL(standeredUrl);
                }
                // A random doorbell audio sample I found on GitHub
                const newurl = AUDIO_FILE + empId + "&audioFormat=STANDARD";
                // setUrl(newurl);
                const response = await fetch(newurl);
                if (!response.ok) throw new Error(`Response not OK (${response.status})`);
                console.log("Success")
                setStanderedUrlBlob(await response.blob());
                // type="audio/wave"
            }
            catch (ex) {
                // setError(ex instanceof Error ? ex : new Error(String(ex)));
            }
        })();
    }

    const loadOverridenFile = (empId) => {
        (async () => {
            try {
                if (overridenUrl != undefined && overridenUrl != '') {
                    window.URL.revokeObjectURL(overridenUrl);
                }
                // A random doorbell audio sample I found on GitHub
                const newurl = AUDIO_FILE + empId + "&audioFormat=CUSTOM";
                // setUrl(newurl);
                const response = await fetch(newurl);
                if (!response.ok) throw new Error(`Response not OK (${response.status})`);
                console.log("Success")
                setOverridenUrlBlob(await response.blob());
                // type="audio/wave"


            }
            catch (ex) {
                // setError(ex instanceof Error ? ex : new Error(String(ex)));
            }
        })();
    }

    const [checked, setChecked] = useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleSubmitClicked =(event)=>{
        var url =OPT_IN+userInformation.empId;
        if(checked){
            url =OPT_OUT+userInformation.empId;
        }
        setShowLoader(true)
        post(url,{},(data)=>{
            setShowLoader(false)
            alert("Changes Saved Successfully");
        },(error)=>{
            setShowLoader(false)
            alert("Unabled to update the changes");
        })
    }

    return (
        <Header open={showLoader}>
            <h3>Settings</h3>
            {
                Object.keys(userInformation).length > 0 ? (<Container maxWidth="sm" className="centerwindow">
                    <Card >
                        <div className='rowdiv'>
                            <Typography sx={{ m: 1 }} variant='body1'>Employee Id : {userInformation.empId}</Typography>
                            <Typography sx={{ m: 1 }} variant='body1'>Prefered Name : {userInformation.pName}</Typography>
                        </div>
                        <div className='rowdiv'>
                            <Typography sx={{ m: 1 }} variant='body1'>First Name : {userInformation.fName}</Typography>
                            <Typography sx={{ m: 1 }} variant='body1'>Last Name : {userInformation.lName}</Typography>
                        </div>
                        <div className='rowdiv'>
                            <Typography sx={{ m: 1 }} variant='body1'>Country : {userInformation.country_code}</Typography>

                        </div>
                        <div className='rowdiv'>
                            <Typography sx={{ m: 1 }} variant='body1'>Opt Audio</Typography>
                            <Switch checked={checked} onChange={handleChange} />
                        </div>
                        <div className='rowdiv'>
                            <Typography sx={{ m: 1 }} variant='body1'>Standered File</Typography>
                            <audio src={standeredUrl} controls />
                        </div>
                        {
                            userInformation.overridenStatus != 'NEW' ? (
                                <div className='rowdiv'>
                                    <Typography sx={{ m: 1 }} variant='body1'>Custom File</Typography>
                                    <audio src={overridenUrl} controls />
                                </div>) : null
                        }
                        <Button  sx={{m:1}}variant="outlined" size="medium" onClick={handleSubmitClicked}>Submit</Button>

                    </Card>
                </Container>) : null
            }
        </Header>
    )
}

export default Settings