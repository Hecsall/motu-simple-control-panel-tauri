import { useEffect, useRef, useState } from 'react'
import { fetch } from '@tauri-apps/api/http';
import { useAppContext } from "@/context/AppContext";
import { HomeWarning } from '@/components/HomeWarning';
import { Fader } from '@/components/Fader';
import { ToggleButton } from '@/components/ToggleButton';
import { SendsSection } from '@/components/SendsSection';
import MuteIcon from '/public/mute-microphone.svg'
import MuteHeadphoneIcon from '/public/mute-headphone.svg'
import ReverbIcon from '/public/reverb.svg'
import HeadphoneIcon from '/public/headphone.svg'
import SpeakerIcon from '/public/speaker.svg'
import ToCommsIcon from '/public/to-comms.svg'


export default function Home() {
  const { state, dispatch } = useAppContext();
  const apiETag = useRef("0"); // useRef to not trigger re-renders
  const [datastoreState, setDatastoreState] = useState({});

  async function fetchApi() {
    state.debug && console.log('Fetching new data...');
    
    const response = await fetch(state.apiBaseUrl, {
      method: 'GET',
      timeout: 16, // MOTU might respond after 15s
      headers: {
        'If-None-Match': apiETag.current,
      }
    });

    if (response.status === 404 && state.datastoreReady === true) {
      dispatch({ type: 'set', key: 'datastoreReady', value: false });
      return;
    } else if (response.status !== 404 && state.datastoreReady === false) {
      dispatch({ type: 'set', key: 'datastoreReady', value: true });
    }

    // 304 means no updates since last time you checked, so return the data we already have
    if (response.status === 304) {
      state.debug && console.info('No updates');
      return;
    }

    // Update stored ETag with current request ETag
    apiETag.current = response.headers.etag;

    const newData = response.data;
    state.debug && console.log('New data:', newData);
    setDatastoreState((prevDatastore) => { 
      return { ...prevDatastore, ...newData };
    });
  }


  useEffect(() => {
    if(state.apiBaseUrl && state.apiBaseUrlValid) {
      // Instant API fetch to get current status
      fetchApi()
    
      // Start polling the API every 15s to fetch updated data
      const pollingInterval = setInterval(() => {
        fetchApi()
      }, 15000);

      // Stop the interval if component re-mounts
      return () => {
        clearInterval(pollingInterval);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.apiBaseUrl, state.apiBaseUrlValid]);


  // If apiBaseUrl is not available, something is wrong with the API url,
  // so display a warning message.
  if (!state.apiBaseUrl) {
    return <HomeWarning type={'missing_api_url'} />
  }


  return (
    <>
      <div className="strip">
        <label>Mic 1</label>
        <Fader 
          apiKeyValue={{"mix/chan/0/matrix/fader": datastoreState['mix/chan/0/matrix/fader']}}
        />
        <ToggleButton
          apiKeyValue={{"mix/chan/0/matrix/mute": datastoreState['mix/chan/0/matrix/mute']}}
          label="Mute"
          icon={<MuteIcon/>}
          color={"red"}
        />
      </div>

      <div className="strip">
        <label>Mic 2</label>
        <Fader 
          apiKeyValue={{"mix/chan/1/matrix/fader": datastoreState['mix/chan/1/matrix/fader']}}
        />
        <ToggleButton
          apiKeyValue={{"mix/chan/1/matrix/mute": datastoreState['mix/chan/1/matrix/mute']}}
          label="Mute"
          icon={<MuteIcon/>}
          color={"red"}
        />
        <SendsSection>
          <ToggleButton
            apiKeyValue={{"mix/reverb/0/reverb/enable": datastoreState['mix/reverb/0/reverb/enable']}}
            label="Reverb"
            icon={<ReverbIcon/>}
            color={"white"}
          />
        </SendsSection>
      </div>
      
      <div className="strip">
        <label>PC Audio</label>
        <Fader 
          apiKeyValue={{"mix/chan/4/matrix/fader": datastoreState['mix/chan/4/matrix/fader']}}
        />
        <ToggleButton
          apiKeyValue={{"mix/chan/4/matrix/mute": datastoreState['mix/chan/4/matrix/mute']}}
          label="Mute"
          icon={<MuteHeadphoneIcon/>}
          color={"red"}
        />
        <SendsSection>
          <ToggleButton
            apiKeyValue={{"mix/chan/4/matrix/main/0/send": datastoreState['mix/chan/4/matrix/main/0/send']}}
            label="Headphones"
            icon={<HeadphoneIcon/>}
            color={"white"}
          />
          <ToggleButton
            apiKeyValue={{"mix/chan/4/matrix/group/0/send": datastoreState['mix/chan/4/matrix/group/0/send']}}
            label="Speakers"
            icon={<SpeakerIcon/>}
            color={"white"}
          />
          <ToggleButton
            apiKeyValue={{"mix/chan/4/matrix/aux/0/send": datastoreState['mix/chan/4/matrix/aux/0/send']}}
            label="Comms"
            icon={<ToCommsIcon/>}
            color={"white"}
          />
        </SendsSection>
      </div>
      
      <div className="strip">
        <label>Chat</label>
        <Fader 
          apiKeyValue={{"mix/chan/10/matrix/fader": datastoreState['mix/chan/10/matrix/fader']}}
        />
        <ToggleButton
          apiKeyValue={{"mix/chan/10/matrix/mute": datastoreState['mix/chan/10/matrix/mute']}}
          label="Mute"
          icon={<MuteHeadphoneIcon/>}
          color={"red"}
        />
        <SendsSection>
          <ToggleButton
            apiKeyValue={{"mix/chan/10/matrix/main/0/send": datastoreState['mix/chan/10/matrix/main/0/send']}}
            label="Headphones"
            icon={<HeadphoneIcon/>}
            color={"white"}
          />
          <ToggleButton
            apiKeyValue={{"mix/chan/10/matrix/group/0/send": datastoreState['mix/chan/10/matrix/group/0/send']}}
            label="Speakers"
            icon={<SpeakerIcon/>}
            color={"white"}
          />
        </SendsSection>
      </div>
      
    </>
  )
}
