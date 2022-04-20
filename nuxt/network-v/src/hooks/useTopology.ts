import { useEffect,useState } from 'react'
import useTopologyApi from './useTopologyApi'


type  nodeType = {
    id: string ,
    type: string,
    height?: number;
    size?: number;
    color?: string
}

type linkType =  {
    source: string,
    target: string,
    distance : number
}

export default function useTopology() {
  const { linksData, switchData, hostData } = useTopologyApi()

  const [ links, setLinks ] = useState<linkType[]>([])
  const [ nodes, setNodes ] = useState<nodeType[]>([])

  useEffect(() => {
    if(!linksData || !switchData || !hostData ) {
        setLinks([]);
        setNodes([]);
        return;
    }

    const switchesDpids = switchData.map(s => s.dpid);

    for (let i = 0; i < linksData.length; i++) {
      const ele = linksData[i];
  
      const dstDpid = ele.dst.dpid;
      const srcDpid = ele.src.dpid;
  
      const isDstInDpids = switchesDpids.includes(dstDpid);
      const isSrcInDpids = switchesDpids.includes(srcDpid);
  
      if (!isDstInDpids || !isSrcInDpids) {
          linksData.splice(i, 1);
          continue;
      }
  
      let dup = linksData.findIndex(i => i.dst.name === ele.src.name);
      if (dup !== i) {
        linksData.splice(dup, 1);
      }
  
      dup = linksData.findIndex(i => i.dst.dpid === dstDpid);
  
      if (dup !== i) {
          linksData.splice(dup, 1);
      }
  
      dup = linksData.findIndex(i => i.src.dpid === srcDpid)
      if (dup !== i) {
          linksData.splice(dup, 1)
      }
    }
  
    const switchLinks:linkType[] = linksData.map(i => ({
      source: i.src.dpid,
      target: i.dst.dpid,
      distance: 250,
    }),)

    const switches = switchData.map(i => ({
      id: i.dpid,
      type: 'switch',
      size: 35,
    }))

    const hosts = hostData.map(i => ({
      id: i.mac,
      type: 'host',
      ipv4: i.ipv4[0],
      ipv6: i.ipv6[1],
      macAddress: i.mac,
      size: 35,
    }))
  
    const hostLinks : linkType[] = hostData.map(i => ({
      source: i.mac,
      target: i.port.dpid,
      distance: 150,
    }))

    setLinks([...switchLinks, ...hostLinks])
    setNodes([...switches, ...hosts] )
  

  },[linksData, switchData, hostData])
  
  return {links , nodes}
}
