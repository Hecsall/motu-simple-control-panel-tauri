import { useEffect, useState } from 'react'
import { useAppContext } from "@/context/AppContext";
import MinimizeIcon from '/public/minimize.svg'
import MaximizeIcon from '/public/maximize.svg'
import CloseIcon from '/public/close.svg'


export function WindowTitlebar() {
  const { state, dispatch } = useAppContext();
  const [appWindow, setAppWindow] = useState()

  // On first render, check os type and set it in the global state
  async function setOsType() {
    const type = (await import('@tauri-apps/api/os')).type
    dispatch({ type: 'set', key: 'osType', value: await type() })
  }

  async function setupAppWindow() {
    const appWindow = (await import('@tauri-apps/api/window')).appWindow
    setAppWindow(appWindow) 
  }

  useEffect(() => {
    if (state.osType === null) {
      setOsType()
    }
    setupAppWindow()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  function windowMinimize() {
    appWindow?.minimize()
  }
  function windowToggleMaximize() {
    appWindow?.toggleMaximize()
  }
  function windowClose() {
    appWindow?.close()
  }

  return (
    <>
      <div data-tauri-drag-region className={`titlebar ostype-${state.osType}`}>

        <div className="titlebar-title">MOTU Simple Control Panel</div>

        <button className="titlebar-button min" onClick={windowMinimize}>
          {state.osType !== "Darwin" && <MinimizeIcon className="icon"></MinimizeIcon>}
        </button>
        <button className="titlebar-button max" onClick={windowToggleMaximize}>
          {state.osType !== "Darwin" && <MaximizeIcon className="icon"></MaximizeIcon>}
        </button>
        <button className="titlebar-button close" onClick={windowClose}>
          {state.osType !== "Darwin" && <CloseIcon className="icon"></CloseIcon>}
        </button>
      </div>
    </>
  )
}
