import React,{useEffect,useState} from 'react'
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import './Pronouncation.css'

function NameSuggestions(props) {

    useEffect(()=>{
        console.log("information",props)
    },[props])


    const renderSuggestions = (data) => {
        if (data.length == 0) {
            return (<Typography variant="body1" color="text.secondary">No Search Results Found for {props.name}</Typography>);
        } else {
            return (<MenuList sx={{ minWidth: '100%', maxWidth: '100%', maxHeight: '100%', minHeight: '100%' }}>
                {
                    data.map((record, i) => {
                        return (<MenuItem onClick={(event)=>{props.recordCallback(record)}}> 
                            <ListItemText>{record.firstName + " " + record.lastName}</ListItemText>
                        </MenuItem>)
                    })
                }
            </MenuList>);
        }
    }

    return (
        <div className="suggestionswindow">
            {
                renderSuggestions(props.records)
            }
        </div>
    )
}

export default NameSuggestions
