import React, { useEffect, useState } from "react";
import { ResponsiveNetwork } from '@nivo/network'
import { getHostsApi, getLinksApi, getSwitchesApi, getTopologuApi } from "../../api/topologyApi";

import CustomLink from './CustomLink'
import CustomNode from "./CustomNode";
import CustomTooltip from './CustomTooltip'
import useTopologyStore  from "../../stores/TopologyStore";


const Topology : React.FC = () => {

  interface NodeInterface {
    id:string;
        height?: number;
        size?: number;
        color?: string
    }

    interface linkInterface {
        source: string;
        target: string;
    }

    interface NetworkTopology  {
        nodes: NodeInterface[],
        links :linkInterface[]
    }

    const [ data , setData ] = useState<NetworkTopology>({nodes:[] , links:[]})
    
    const { setSwitches, setHosts } = useTopologyStore()

    const populateTopologyStore = async () => {
      const switches = await getSwitchesApi()
      const hosts = await getHostsApi()
      setSwitches(switches)
      setHosts(hosts)
    }

    const getTopology = async () => {
      const {links , nodes} = await getTopologuApi()
      setData({links , nodes})
    }

    useEffect( () => {
      getTopology()
    },[])

    useEffect(() => {
      populateTopologyStore()
    },[])

    return (
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
    )
}

export default Topology