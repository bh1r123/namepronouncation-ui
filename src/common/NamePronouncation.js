import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router'
import { get } from './../Network/Network'
import { COUNTRY_URL } from './../common/Common'

function NamePronouncation(props) {

    const [country, setCountry] = useState("Select Country");

    const navigate = useNavigate();

    const [countries, setCountries] = useState([]);

    const [name, setName] = useState("");

    useEffect(() => {


        get(COUNTRY_URL, (data) => {
            var response = data.data;
            setCountries(response);
            
            console.log(props.name)
            
        }, (error) => { });
    }, [])


    useEffect(() => {
        if (countries.length > 0) { 
            if (props.country != undefined) {
                setCountry(props.country);
            }
            if (props.name != undefined) {
                setName(props.name)
            }
        }
    }, [countries])


    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    }

    const handleNameChange = (event) => {
        console.log("Name setting")
        setName(event.target.value);
    }

    const handlePlayButtonSelected = (event) => {
        if (name.length == 0) {
            return;
        }
        if (country == 'Select Country') {
            return;
        }
        var encodedName = encodeURIComponent(name);
        var encodedCountry = encodeURIComponent(country);
        navigate("/pronouncation/" + encodedCountry + "/" + encodedName);
        if (props.onSubmitName) {
            props.onSubmitName(name, country);
        }
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <div>
            <TextField sx={{ m: 0.5, width: 250 }} id="name" variant="outlined" label="Name" onChange={handleNameChange}>{name}</TextField>
            <FormControl sx={{ m: 0.5, width: 250 }}>
                <InputLabel id="countryhint">Select Country</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="country"
                    value={country}
                    input={<OutlinedInput label="Select Country" />}
                    onChange={handleCountryChange}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="">
                        <em>Select Country</em>
                    </MenuItem>
                    {
                        countries.map((country) => {
                            return (<MenuItem value={country.code}>{country.name}</MenuItem>)
                        })
                    }
                </Select>
            </FormControl>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handlePlayButtonSelected}
                sx={{ mr: 2 }}
            >
                <PlayCircleOutlineRoundedIcon sx={{ width: 40, height: 40 }} />
            </IconButton>
        </div>
    )
}

export default NamePronouncation
