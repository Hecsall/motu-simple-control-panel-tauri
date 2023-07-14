import Link from 'next/link'
import { useRouter } from 'next/router'
import SettingsIcon from '/public/settings.svg'
import HomeIcon from '/public/home.svg'


export function Navigation() {
    const router = useRouter()

    return <>
        <nav id='app-nav'>
            <div className='left'>
                {router.asPath !== '/' && <Link href="/" title='Home'>
                    <HomeIcon />
                </Link>}
            </div>

            <div className='right'>
                {router.asPath !== '/settings' && <Link href="/settings" title='Settings'>
                    <SettingsIcon />
                </Link>}
            </div>
        </nav>
    </>
}