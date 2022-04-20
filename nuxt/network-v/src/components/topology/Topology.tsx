import React, { useEffect } from "react";
import { ResponsiveNetwork } from '@nivo/network'

import CustomLink from './CustomLink'
import CustomNode from "./CustomNode";
import CustomTooltip from './CustomTooltip'
import useTopologyStore  from "../../stores/TopologyStore";
import useTopologyApi from "../../hooks/useTopologyApi";
import useTopology from "../../hooks/useTopology";
import { Chip } from "primereact/chip";


const Topology : React.FC = () => {

    const data = useTopology()
    const { setSwitches, setHosts , isTopologyError } = useTopologyStore()
    const  { switchData , hostData}  = useTopologyApi()





    useEffect(() => {
      if(hostData){
        setHosts(hostData)
      }
      if(switchData){
        setSwitches(switchData)
      }
    },[hostData, switchData,setHosts,setSwitches])

    if(!data){
      return <h1>Error</h1>
    }

    return (
      <>
      
        <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
  
        centeringStrength={1.7}
        repulsivity={15}

        linkComponent={CustomLink}
        linkDistance={function(e){return e.distance}}

        nodeComponent={CustomNode}
        nodeTooltip={CustomTooltip}



        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}

        linkBlendMode='multiply'
        motionConfig='wobbly'
      />
      {isTopologyError && 
        <Chip className="!absolute top-14 left-2 !bg-red-500" icon="pi pi-exclamation-triangle" label="Network Error"
        />}
      </>
      
    )
}

export default Topology