import { FC, useState, useCallback, ReactEventHandler } from "react";
import { Mic, MicOff } from "react-feather";
import axios from "axios";

import { ReactComponent as HangUp } from "./assets/hangup.svg";
import { IconButton, Card, Loader, DevicePicker } from "./components";
import { connect, disconnect } from "diarupt";
import { useDevice } from "./utils/useDevice";
import { media } from "./utils/media_stream";

// see API docs at https://docs.diarupt.ai/api-reference
const DIARUPT_API = 'https://engine.diarupt.ai'

const availableParams = {
  /**
   * full list of available profiles can be retrieve 
   * from /faces endpoint.
   * see https://docs.diarupt.ai/api-reference/resources/get-profiles
   *  */
  profiles: [{
    id: 'default',
    description: 'Default - can talk about anything',
  },
  {
    id: 'interviewer',
    description: 'Interviewer - can ask conduct an interview',
  },
  {
    id: 'sales_agent',
    description: 'Sales Agent - can sell you something',
  },
  {
    id: 'customer_support_agent',
    description: 'Customer Support Agent - can help you with a problem',
  }

  ],
  /**
   * full list of available faces can be retrieve 
   * from /faces endpoint.
   * see https://docs.diarupt.ai/api-reference/resources/get-faces
   *  */

  // TODO: Replace with your available faces
  faces: [{
    id: 'obama',
    name: 'Barack Obama',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg'
  }],
}

type SessionParams = {
  profile: string;
  face: string;
  context: string;
}

const Playground: FC = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const { selectedDevices, availableDevices, selectDevice } = useDevice()
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [interactionParams, setInteractionParams] = useState<SessionParams>({
    profile: 'default',
    face: 'obama',
    context: ''
  })

  const startInteraction = useCallback(async () => {
    try {
      setLoading(true);
      // Get the video element to render the AI video
      const video = document.getElementById('ai-video') as HTMLVideoElement;
      // if only audio is needed, use an audio element instead
      // const audio = document.getElementById('ai-audio') as HTMLAudioElement;


      // Set the audio output device
      if ((video as any)?.setSinkId) {
        await (video as any).setSinkId(selectedDevices.audiooutput?.deviceId || '')
      }

      // Get the media stream
      const stream: MediaStream = await media.init({
        devices: {
          audio: selectedDevices.audioinput,
          video: selectedDevices.videoinput,
        }
      });

      //  set media stream in state to be used later
      setStream(stream);

      if (video) {
        // Initiate an AI intreaction session
        /**
         * WARNING: This request should be made from your backend
         * to avoid exposing your API key
         */
        const url = DIARUPT_API + '/create-session'
        const res = await axios.post(url, interactionParams, {
          headers: {
            'Content-Type': 'application/json',
            // TODO: Replace with your API key
            "x-api-key": 'dev-test'
          }
        })
        const sid = res.data.session_id


        /**
         * connect to the AI interaction session created,
         * to start the interaction
         *  */

        await connect(
          sid,
          {
            stream,
            player: video, // output video to the video element
          }, (event, data) => {
            // handle events
            switch (event) {
              case 'open':
                setStarted(true)
                setLoading(false)
                break;
              case 'error':
                setStarted(false)
                setLoading(false)
                setError((data as Error).message)
                break;
              case 'close':
                // TODO: Handle close
                break;
              default:
                // console.log(event, data)
                break;
            }
          }
        )
      } else {
        throw Error("Video element not found");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  }, [selectedDevices, interactionParams]);

  const stopInteraction = useCallback(async () => {
    try {
      await disconnect();
      setStream(null);
      setStarted(false);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  }, [])

  const handleOnChange: ReactEventHandler = (e) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setInteractionParams((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const toggleMuteUserAudio = (stream: MediaStream | null) => {
    if (stream) {
      stream?.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setMuted((muted) => !muted)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-10 gap-4">

        <div className="flex flex-row justify-between gap-10 ">
          <div className="flex flex-col gap-4 w-[350px]">
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold">Diarupt Playground 🛝</h2>
              <p className="text-sm font-semibold text-slate-500">
                Try out our Conversation Engine
              </p>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Change the options below to see how the conversation engine works.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Select an AI profile</label>
              <select name="profile" onChange={handleOnChange} value={interactionParams.profile} disabled={started} className="w-full px-4 py-3 text-sm font-semibold text-slate-500 bg-slate-200 rounded-lg appearance-none">
                <option disabled>Select an AI profile</option>
                {
                  availableParams.profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>{profile.description}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Select an AI Face</label>
              <select name="face" onChange={handleOnChange} value={interactionParams.face} disabled={started} className="w-full px-4 py-3 text-sm font-semibold text-slate-500 bg-slate-200 rounded-lg appearance-none">
                <option disabled>Select an AI Face</option>
                {
                  availableParams.faces.map((face) => (
                    <option key={face.id} value={face.id}>{face.name}</option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Enter Context</label>
              <textarea name="context" onChange={handleOnChange} value={interactionParams.context} disabled={started} rows={10} className="w-full px-4 py-3 text-sm font-semibold text-slate-500 bg-slate-200 rounded-lg appearance-none" placeholder="Give the AI some more context for the conversation"></textarea>
            </div>


            <div className="flex flex-row justify-between pt-5">
              <div className="flex flex-row justify-center items-center gap-2">
                <svg
                  className="w-4 h-4 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-sm font-semibold text-slate-500">
                  5mins max
                </span>
              </div>
              <button
                disabled={started}
                onClick={startInteraction}
                className={`px-6 py-3 text-sm font-semibold text-white ${started ? 'bg-black/50' : 'bg-black'} rounded-full w-fit`}>
                Start Interaction
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* Video / Image */}
            <div className="relative h-[350px] aspect-square">
              <video id="ai-video" autoPlay playsInline className={`absolute flex bg-transparent h-[350px] aspect-square border-slate-200 border-[1px] flex-col rounded-3xl`}>
              </video>
              <img
                alt="hello"
                src="https://t4.ftcdn.net/jpg/02/90/27/39/360_F_290273933_ukYZjDv8nqgpOBcBUo5CQyFcxAzYlZRW.jpg"
                className={`${started ? 'hidden' : 'flex'} absolute bg-transparent h-[350px] aspect-square border-slate-200 border-[1px]  flex-col rounded-3xl object-cover`} />
              {loading && <div className="w-full h-full flex justify-center items-center">
                <Loader />
              </div>
              }
            </div>
            <div className="flex justify-center gap-3 left-5 bottom-5">
              <DevicePicker
                selectedDevices={selectedDevices}
                availableDevices={availableDevices}
                selectDevice={selectDevice}
              />
              {
                started &&
                <>
                  <IconButton
                    onClick={() => toggleMuteUserAudio(stream)}
                    className="p-5 text-sm font-semibold text-white bg-black/50 rounded-full w-fit">
                    {
                      muted ?
                        <MicOff className="h-5 w-5" />
                        :
                        <Mic className="h-5 w-5" />
                    }
                  </IconButton>
                  <IconButton onClick={stopInteraction} className="py-3 px-6 bg-rose-500/90 hover:bg-rose-500/80">
                    <HangUp className="w-7 h-7 text-white" />
                  </IconButton>
                </>

              }
            </div>
            {/* Error Info */}
            {error && <span className="text-sm rounded-lg p-4 font-semibold text-rose-600 bg-rose-200">{error}</span>}
          </div>
        </div>
      </Card >
    </div>
  );
};

export default Playground;
