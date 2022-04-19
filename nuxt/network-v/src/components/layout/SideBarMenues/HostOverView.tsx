import { Chip } from 'primereact/chip';
import React, { useEffect, useState } from 'react'
import useSideBarStore from '../../../stores/sideBarStore'
import useTopologyStore from '../../../stores/TopologyStore';
import { HostInterface } from '../../../types/Topology';

const HostOverView : React.FC = () => {
    const { selectedHost } = useSideBarStore();
    const { hosts } = useTopologyStore();

    const [ host , setHost ] = useState<HostInterface>()

    useEffect(() => {
        const foundHost = hosts.find((host) => host.mac == selectedHost)

        setHost(foundHost) 
    },[selectedHost, hosts])

    if(!host){
        return (
            <h1  >Please Select a host</h1>
        )
    }

    return (
        <>
            <h1  className="text-[color:var(--primary-color)] text-xl mb-8">
                <i className="pi pi-desktop" ></i> Host Overview
            </h1>

            <Chip label='Mac Address' />
            <p> { host.mac } </p>

            {
                (host.ipv4.length > 0) &&
                <>
                    <Chip label='IP-V4 Address' className='mt-4' />
                    <p> { host.ipv4 } </p>
                </>
                
            }

            {
            (host.ipv6.length > 1) &&
            <>
                <Chip label='IP-V6 Address' className="mt-4"/>
                <p> { host.ipv6[1] || '' } </p>
            </>
            }
            <Chip label={`Connection ${host.port.name}`} className="mt-4" />
            <p>
                Connected to switch { Number(host.port.dpid) } 
            </p>
            <p>
                with port { Number(host.port.port_no) }
            </p>
        </>
    )

    
}

export default HostOverView