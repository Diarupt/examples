/* eslint-env browser */
/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = 500;
var HEIGHT = 50;
var rafID = null;

var debuglog = false

window.onload = function () {

    // grab our canvas
    //canvasContext = document.getElementById( 'meter' ).getContext('2d');

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // debug log flag

    window.startVad = function (debug) {
        debuglog = debug
        audioContext.resume().then(() => {
            console.log('User interacted with the page. Playback resumed successfully')
        })

        // Attempt to get audio input
        try {
            // ask for an audio input
            navigator.mediaDevices.getUserMedia(
                {
                    'audio': {
                        'mandatory': {
                            'echoCancellation': 'true',
                            'googEchoCancellation': 'true',
                            'googAutoGainControl': 'false',
                            'googNoiseSuppression': 'false',
                            'googHighpassFilter': 'false'
                        },
                        'optional': []
                    },
                }).then(audioStream)
                .catch(didntGetStream);
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}


function drawLoop(time) {
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping())
        canvasContext.fillStyle = 'red';
    else
        canvasContext.fillStyle = 'green';

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame(drawLoop);
}


