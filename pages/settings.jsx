import { fetch } from '@tauri-apps/api/http';
import { useAppContext } from '@/context/AppContext'


export default function Settings() {
  const { state, dispatch } = useAppContext();

  async function testUrl(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        timeout: 30,
        headers: {
          'If-None-Match': '0',
        }
      });
      // If response is 200 the url is valid and working
      if (response.status === 200) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  // TODO: On errors the UI doesn't show any hints
  async function saveSettings(e) {
    e.preventDefault()
    const form_apiBaseUrl = e.target.apiBaseUrl.value;
    const urlIsWorking = await testUrl(form_apiBaseUrl);

    const form_debugMode = e.target.debugMode.checked;

    // If url is not working prevent saving to state
    if (!urlIsWorking) {
      alert('Provided URL is not working')
      return
    }

    // Save to store
    dispatch({ type: 'set', key: 'apiBaseUrlValid', value: urlIsWorking })
    dispatch({ type: 'set', key: 'apiBaseUrl', value: form_apiBaseUrl })
    dispatch({ type: 'set', key: 'debug', value: form_debugMode })
    dispatch({ type: 'set', key: 'datastoreReady', value: true })
  }


  async function resetSettings() {
    dispatch({ type: 'reset_settings' })
  }


  return (
    <>
      <div className='settings-page'>
        <form onSubmit={saveSettings}>

          <div>
            <label htmlFor='apiBaseUrl'>
              MOTU AVB API Datastore URL:
            </label>
            <input id="apiBaseUrl" name="apiBaseUrl" type="url" required defaultValue={state.apiBaseUrl} />
            <small>Example: http://localhost:1280/abcdef123456/datastore</small>
          </div>

          <div className="inline-checkbox">
            <label htmlFor='debugMode'>
              Debug mode:
            </label>
            <input id="debugMode" name="debugMode" type="checkbox" defaultChecked={state.debug} />
          </div>

          <div className="form-actions">
            <button className='button' type="submit">Save</button>
            <button  className="button text" type='button' onClick={resetSettings}>Reset settings</button>
          </div>

        </form>

      </div>
    </>
  )
}
