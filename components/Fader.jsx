import { fetch, Body } from '@tauri-apps/api/http';
import { useAppContext } from "@/context/AppContext";
import { 
    faderMin,
    faderMax,
    dbToAmplitudeRatio,
    amplitudeRatioToDb,
    percentageInRange 
} from '@/lib/decibelUtils';
import { memo, useEffect, useState } from "react";
import styles from '@/styles/components/Fader.module.scss';


export const Fader = memo(function Fader({apiKeyValue}) {
    const { state, dispatch } = useAppContext();
    const [value, setValue] = useState(0);
    const endpoint = Object.keys(apiKeyValue)[0];

    state.debug && console.info(`Fader ${Object.keys(apiKeyValue)[0]} rerendered`);

    useEffect(() => {
        const datastoreKey = Object.keys(apiKeyValue)[0];
        if (datastoreKey && !isNaN(apiKeyValue[datastoreKey])) {
            setValue(amplitudeRatioToDb(apiKeyValue[datastoreKey]));
        }
    }, [apiKeyValue])


    async function onFaderChange(e) {
        setValue(e.currentTarget.value)
        const percentage = dbToAmplitudeRatio(e.currentTarget.value)
        const body = Body.form({ json: `{"value":${percentage}}` });
        await fetch(`${state.apiBaseUrl}/${endpoint}`, {
            method: 'PATCH',
            timeout: 16,
            body: body,
        }).catch((error) => {
            console.error(error)
        });
    }


    return <>
        <div className={`fader-wrapper ${styles['fader-wrapper']}`}>
            <span>Gain</span>

            <div className={`${styles['fill-bar']}`} style={{"height": `calc(${percentageInRange(value)}% - 8px)`}}></div>

            <input 
                className={styles['fader']}
                type="range"
                value={value}
                min={faderMin}
                max={faderMax}
                step="0.5"
                onChange={onFaderChange}
            />
        </div>

        <div className={`fader-value ${styles['fader-value']}`}>{Number(parseFloat(value)).toFixed(1)} dB</div>
    </>
});
