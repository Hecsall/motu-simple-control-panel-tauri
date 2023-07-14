import Link from 'next/link'


export function HomeWarning({ type }) {
    if (type === 'missing_api_url') {
        return <>
            <div className='callout warning'>
                No <b>MOTU AVB API Datastore URL</b> found, set it inside the <Link href="/settings"><u>Settings</u></Link>
            </div>
        </>
    }
}