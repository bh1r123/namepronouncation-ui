import React, { useEffect, useState } from 'react'
import Header from './../common/Header';
import NamePronouncation from './../common/NamePronouncation';

function Dashboard() {

const[messageBar,setMessageBar] = useState({
    'open':false,
    'message':""
})

const [showLoader, setShowLoader] = useState(false);
    return (
        <Header open = {showLoader} bar={messageBar}>
            <h3>Name Pronouncation Tool</h3>
            <center>
               <NamePronouncation/>
            </center>
        </Header>
    )
}

export default Dashboard
