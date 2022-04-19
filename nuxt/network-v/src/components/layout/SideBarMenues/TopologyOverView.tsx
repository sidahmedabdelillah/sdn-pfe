import React from 'react'
import useSwitchStore from '../../../stores/TopologyStore'

import { Chip } from 'primereact/chip';
import useSideBarStore, { SidBarTabsEnum } from '../../../stores/sideBarStore';

const TopologyOverView : React.FC = () => {
    const { switches , hosts} = useSwitchStore()

    const { setSelectedHost, setActiveTab } = useSideBarStore()

    const handleHostClick = (mac : string) => {
        setSelectedHost(mac);
        setActiveTab(SidBarTabsEnum.HostOverView)
    }
    
    return (
        <>
            <h1  className="text-[color:var(--primary-color)] font-bold text-xl">Topology OverView</h1>
            <h2 className="font-semibold text-lg">
                Switches
            </h2>
            <ul > 
                {switches.map( (switche , index) => (
                    <li key={switche.dpid}>
                        <div className="mt-1">
                            <Chip  label={`Switch-${index+1}`}  className="mr-2 mb-2" />
                        </div>
                        <h4>
                            switch-id:  <span className="font-bold">{ switche.dpid }</span>
                        </h4>
                        <h4>
                            number-of-ports:  <span className="font-bold">{ switche.ports.length }</span>
                        </h4>
                        
                    </li>
                ))}
            </ul>

            <h2 className="font-semibold text-lg">
                Hosts
            </h2>
            <ul > 
                {hosts.map( (host , index) => (
                    <li key={host.mac}>
                        <div className="mt-1">
                            <Chip onClick={() => handleHostClick(host.mac)}  label={`Host-${index+1}`}  className="mr-2 mb-2 cursor-pointer" />
                        </div>
                        <h4>
                            address-mac:  <span className="font-bold">{ host.mac }</span>
                        </h4>
                        { (host.ipv4.length > 0 )&& 
                        <h4>
                            address-ipv4:  <span className="font-bold">{ host.ipv4[0] }</span>
                        </h4>
                        }
                        { host.ipv6.length && 
                        <h4>
                            address-ipv6:  <span className="font-bold">{ host.ipv6[1] }</span>
                        </h4>
                        }
                        
                    </li>
                ))}
            </ul>
        </>
    )
} 

export default TopologyOverView