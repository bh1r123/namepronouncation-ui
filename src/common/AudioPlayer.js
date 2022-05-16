import React from 'react'
import ReactAudioPlayer from 'react-audio-player';
function AudioPlayer(props) {
    return (
        <div>
            <ReactAudioPlayer src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_1MG.mp3" controls={props.controlEnabled} autoPlay={props.autoplayEnabled}></ReactAudioPlayer>
        </div>
    )
}

export default AudioPlayer
