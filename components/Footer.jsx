import { useAppContext } from '@/context/AppContext'


export function Footer() {  
    const { state } = useAppContext();

    return <>
        <footer>
            <div className='status'>
                <span className={`${state.datastoreReady && 'green'}`}></span>
                {state.datastoreReady ? 'Connected' : 'Not responding'}
            </div>

            {state.debug && <>
                <div className='debug'>Debug Enabled</div>
            </>}
        </footer>
    </>
}