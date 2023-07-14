import { fetch, Body } from '@tauri-apps/api/http';
import { useAppContext } from "@/context/AppContext";
import { memo, useEffect, useState } from "react";
import style from '@/styles/components/ToggleButton.module.scss';


export const ToggleButton = memo(function ToggleButton({apiKeyValue, label, icon, color}) {
    const { state, dispatch } = useAppContext();
    const [toggled, setToggled] = useState(false);
    const endpoint = Object.keys(apiKeyValue)[0];

    state.debug && console.info(`ToggleButton ${label} rerendered`);

    useEffect(() => {
        const datastoreKey = Object.keys(apiKeyValue)[0];
        if (datastoreKey !== null) {
            setToggled(Boolean(apiKeyValue[datastoreKey])); // 0 or 1
        }
    }, [apiKeyValue])


    async function onClickButton(e) {
        let newValue = 0.0;
        if (toggled === false) {
          newValue = 1.0;
        }

        setToggled(!toggled);
    
        const body = Body.form({ json: `{"value":"${newValue}"}` });
        await fetch(`${state.apiBaseUrl}/${endpoint}`, {
            method: 'PATCH',
            timeout: 16,
            body: body,
        }).catch((error) => {
            console.error(error)
        });
    }


    return <>
        <button 
            type='button'
            title={label}
            onClick={onClickButton}
            className={`${style.button} ${style['button-' + color]} ${style[toggled ? 'on' : 'off']}`}
        >
            {icon}
        </button>
    </>
});