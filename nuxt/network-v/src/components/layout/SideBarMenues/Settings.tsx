import React, { useRef, useState } from 'react'

import { InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast, } from 'primereact/toast'

import useAxiosStore from '../../../stores/axiosStore'

const Settings : React.FC = () => {
        const { BaseUrl, setBaseUrl } = useAxiosStore()
        const [value , setValue ] = useState<string>(BaseUrl.replace('http://' , ''))
        const toastRef = useRef<Toast>(null);

        const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value)
        }

        const handleSave = () => {
            setBaseUrl(`http://${value}`)
            toastRef.current?.show({severity:'success', summary: 'Settings Saved', detail:'Message Content', life: 1500})
        }

        return(
            <>
            <Toast ref={toastRef} />
            <h1 className='text-[color:var(--primary-color)] text-xl mb-8 font-bold' > Settings </h1>

            <h4>Controller Endpoint</h4>
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">http://</span>
                <InputText value={value} onChange={handleChange} placeholder="Website" />
            </div>
            <div className=" mt-4 flex w-full content-center justify-center">
                <Button onClick={handleSave}> Save </Button>
            </div>
            </>

        )
}

export default Settings