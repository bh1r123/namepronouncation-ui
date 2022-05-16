import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Header from './../common/Header';
import NamePronouncation from './../common/NamePronouncation';
import ReactAudioPlayer from 'react-audio-player';
import { NAME_SEARCH_URL } from './../common/Common'
import NameSuggestions from './NameSuggestions';
import Typography from '@mui/material/Typography';
import { post, get, put } from '../Network/Network';
import PronouncationDetails from './PronouncationDetails';
import './Pronouncation.css'
import AudioRecordAndPlay from './AudioRecordAndPlay';

function Pronouncation() {
    const { country, name } = useParams();
    const [namePronouncations, setNamePronouncations] = useState([]);

    const [selectedName, setSelectedName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    const [selectedRecord, setSelectedRecord] = useState({});

    const [showLoader, setShowLoader] = useState(false);


    useEffect(() => {
        setShowLoader(true);
        let url = NAME_SEARCH_URL + "name=" + decodeURIComponent(name) + "&countrycd=" + decodeURIComponent(country);
        setSelectedName(decodeURIComponent(name));
        setSelectedCountry(decodeURIComponent(country));
        get(url, (response) => {
            let records = response.data.npsList;
            let pronouncations = [];
            records.map((record) => {
                let pronouncation = {
                    empid: record.empId,
                    firstName: record.first_name,
                    lastName: record.last_name,
                    preferred_name: record.pName,
                    country: record.country,
                    audioFormat: 'STANDARD',
                    showcustom: record.hasOverridenFile
                }
                pronouncations.push(pronouncation);
            });
            if (pronouncations.length > 0) {
                setSelectedRecord(pronouncations[0]);
            }
            setNamePronouncations(pronouncations);
            setShowLoader(false);
        }, (error) => {
            setShowLoader(false);
            if (error != undefined && error != null) {
                if (error.response != undefined && error.response != null) {
                    if (error.response.status == 404) {
                        setNamePronouncations([]);
                        setSelectedRecord({});
                    }
                }
            }
            console.log(error);
        })
    }, [name])


    const onSubmitName = (name, country) => {
        setSelectedName(name)
        setSelectedCountry(country);
    }

    const handleRecordClick = (record) => {
        setSelectedRecord(record);
    }

    const fetchSuggestions = () => {

    }

    const enableLoader = (enable) => {
        setShowLoader(enable)
    }

    return (
        <Header open={showLoader}>
            <h3>Name Pronouncation Tool</h3>
            <NamePronouncation name={selectedName} country={selectedCountry} onSubmitName={onSubmitName} />
            {/* <AudioRecordAndPlay /> */}
            <Typography variant="h6">Search Results for {selectedName}</Typography>
            <div className="resultwindow">
                <NameSuggestions records={namePronouncations} name={selectedName} recordCallback={handleRecordClick} />
                <PronouncationDetails name={selectedName} record={selectedRecord} enableLoader={enableLoader}/>
            </div>

        </Header>
    )
}

export default Pronouncation
