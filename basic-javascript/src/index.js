const { connect, disconnect } = require('diarupt');
const axios = require('axios').default;

video = document.getElementById('ai-video');
status_node = document.getElementById('status');
btn = document.getElementById('start');

DIARUPT_API = 'https://engine.diarupt.ai';

get_media_stream = async () => {
    if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined) {
        throw new Error('navigator.mediaDevices is undefined');
    } else {
        const mediaDevices = navigator.mediaDevices;
        stream = await mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false,
            },
        });

        if (!stream) {
            throw new Error('No stream');
        }

        return stream;
    }
};

const start = async () => {
    try {
        status_node.innerHTML = 'Connecting...';
        stream = await get_media_stream();
        /**
       * WARNING: This request should be made from your backend
       * to avoid exposing your API key
       */

        options = {
            /**
             * full list of available profiles can be retrieve 
             * from /faces endpoint.
             * see https://docs.diarupt.ai/api-reference/resources/get-profiles
             *  */
            profile: 'default',
            /**
             * full list of available faces can be retrieve 
             * from /faces endpoint.
             * see https://docs.diarupt.ai/api-reference/resources/get-faces
             *  */
            face: 'obama',
            context: 'Teach user everything you know about programmable matter',
        }

        // see API docs at https://docs.diarupt.ai/api-reference
        const res = await axios.post(
            DIARUPT_API + '/create-session',
            options,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Replace with your API key
                    "x-api-key": 'dev-test'
                }
            })

        sid = res.data.session_id;

        await connect(
            sid,
            {
                stream,
                player: video, // output video to the video element
            }, (event, data) => {
                // handle events
                switch (event) {
                    case 'open':
                        status_node.innerHTML = 'Connected';
                        // change button to stop interaction
                        btn.removeEventListener('click', start);
                        btn.addEventListener('click', stop);
                        btn.innerHTML = 'Stop Interaction';
                        break;
                    case 'error':
                        status_node.innerHTML = 'Error';
                        break;
                    case 'close':
                        status_node.innerHTML = 'Connection closed';
                        break;
                    default:
                        // console.log(event, data)
                        break;
                }
            }
        )
    } catch (error) {
        console.error(error);
        status_node.innerHTML = 'Error: ' + error.message;
    }
}

const stop = () => {
    disconnect()
    btn.removeEventListener('click', stop);
    btn.addEventListener('click', start);
    btn.innerHTML = 'Start Interaction';
}

btn.addEventListener('click', start);