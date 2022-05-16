import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ReactAudioPlayer from 'react-audio-player';
import { get, put, upload } from './../Network/Network'
import { AUDIO_FILE, OVERRIDEN_URL, PHONETIC_URL } from './../common/Common'
import AudioRecordAndPlay from './AudioRecordAndPlay';
import './Pronouncation.css'
import jwt_decode from 'jwt-decode'
import { styled } from '@mui/material/styles';



import Link from '@mui/material/Link';
import { FormatColorResetRounded } from '@mui/icons-material';

function PronouncationDetails(props) {


    const [phonetics, setPhonetics] = useState([]);

    const [url, setUrl] = useState(undefined)

    const [registeredUserId, setRegisteredUserId] = useState('');

    const [showRecordWindow, setShowRecordWindow] = useState(false);

    const [blob, setBlob] = useState();
    const [savedFile, setSavedFile] = useState();
    const StyledLink = styled(Link)(({ theme }) => ({
        margin: "4px"
    }));

    useEffect(() => {
        if (blob != undefined) {
            console.log(blob);
            var convertedBlob = new Blob([blob], { type: 'audio/wave' });
            if (convertedBlob.size > 0) {
                var infoUrl = window.URL.createObjectURL(blob);
                var audio = document.getElementById('streamer');
                // audio.src=infoUrl;
                setUrl(infoUrl);
            } else {
                setUrl("")
            }
        }

    }, [blob])

    useEffect(() => {
        loadPhonetics();
        (async () => {
            if (props.record != undefined && Object.keys(props.record).length > 0) {
                fetchUserId()
                props.enableLoader(true)
                try {
                    if (url != undefined && url != '') {
                        window.URL.revokeObjectURL(url);
                    }
                    // A random doorbell audio sample I found on GitHub
                    const newurl = AUDIO_FILE + props.record.empid + "&audioFormat=" + props.record.audioFormat;
                    // setUrl(newurl);
                    const response = await fetch(newurl);
                    if (!response.ok) throw new Error(`Response not OK (${response.status})`);
                    console.log("Success")
                    setBlob(await response.blob());
                    // type="audio/wave"
                    props.enableLoader(false)
                }
                catch (ex) {
                    props.enableLoader(false)
                    // setError(ex instanceof Error ? ex : new Error(String(ex)));
                }
            }
        })();
    }, [props.record]);

    const loadPhonetics = () => {
        get(PHONETIC_URL + props.record.firstName, (data) => {
            let object = {
                name: data.data
            };
            setPhonetics([object])
        }, (error) => {

        })
    }

    const renderAudio = () => {
        if (url != '') {
            return (<ReactAudioPlayer id="streamer" src={url} controls={true}></ReactAudioPlayer>)
        } else if (url == '') {
            return (<Typography variant="body1" sx={{ minWidth: '50%', m: 0.5, p: 2 }}>No Audio file Found</Typography>);
        } else {
            return null
        }
    }

    const fetchUserId = () => {
        var token = sessionStorage.getItem('token');
        if (token != undefined && token != "") {
            var decodeToken = jwt_decode(token);
            setRegisteredUserId(decodeToken.empId);
        } else {
            setRegisteredUserId('');
        }
    }


    const showOverrideOption = () => {
        if (registeredUserId == props.record.empid) {
            return (
                <div className='resultwindow'>
                    <Typography variant="body1">Do you want to Override the Exisiting Pronouncation ?</Typography>
                    <StyledLink
                        className="linkgap"
                        component="button"
                        variant="body1"
                        onClick={() => {
                            setShowRecordWindow(true)
                        }}
                    >
                        Click Here
                    </StyledLink>
                </div>
            )
        } else {
            return null;
        }
    }


    const onAudioFileRecieve = (audioURL, blob) => {
        // setAudioUrl(url);
        console.log(blob);
        var wavefilefromblob = new File([blob], 'filename.wav');
        setSavedFile(wavefilefromblob);
    }

    const handleSubmit = (event) => {
        props.enableLoader(true)
        var formdata = new FormData();
        formdata.append('empId', props.record.empid);
        formdata.append('channel', 'WEB');
        formdata.append('multipartFile', savedFile);
        upload(OVERRIDEN_URL, formdata, (data) => {
            props.enableLoader(false)
            alert("Custom Pronouncation submitted for admin approval");
            setShowRecordWindow(false)
        }, (error) => {
            props.enableLoader(false)
            setShowRecordWindow(false)
            alert("Unable to upload the record");
        })
    }

    const renderRecordWindow = () => {
        if (showRecordWindow) {
            return (
                <AudioRecordAndPlay onAudioFileRecieve={onAudioFileRecieve} onSubmitData={handleSubmit} />);
        } else {
            return null;
        }
    }

    return (
        <div className="pronouncationwindow">
            {
                Object.keys(props.record).length > 0 ? (
                    <div >
                        <Typography variant="h5" sx={{ minWidth: '50%', m: 0.5, p: 2 }}>{props.record.firstName}</Typography>
                        {
                            renderAudio()
                        }
                        {
                            showOverrideOption()
                        }
                        {
                            renderRecordWindow()
                        }
                        <Paper elevation={2} sx={{ minWidth: '50%', m: 0.5, p: 2 }}>
                            <Typography variant="h6">Phonetic spellings</Typography>
                            <Divider />
                            {
                                phonetics.map((phonetic) => {
                                    return <Typography variant="body1" color="text.secondary">{phonetic.name}</Typography>
                                })
                            }
                        </Paper>
                    </div>) : null
            }

        </div>
    )
}

export default PronouncationDetails
