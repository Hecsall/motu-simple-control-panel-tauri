import { memo } from "react";
import style from '@/styles/components/SendsSection.module.scss';


export const SendsSection = memo(function SendsSection({children}) {
    return <>
        <div className={style.sendsSection}>
            Send to
            <div className={style.buttons}>
                {children}
            </div>
        </div>
    </>
});