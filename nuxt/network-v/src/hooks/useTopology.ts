import { ConnectedOverlayScrollHandler } from 'primereact/utils'
import { useEffect, useState } from 'react'
import useLoadBalancersStore from '../stores/loadBalancerStore'
import useServersStore from '../stores/serverStore'
import useTopologyStore from '../stores/TopologyStore'
import useTopologyApi, { useLoadBalancersApi, useServersApi } from './useTopologyApi'

type nodeType = {
  id: string
  type: string
  height?: number
  size?: number
  color?: string
}

type linkType = {
  source: string
  target: string
  distance: number
}

export default function useTopology() {
  const { linksData, switchData, hostData } = useTopologyApi()
  const { hosts:storeHosts, links:storeLinks , switches:storeSwitches
    ,setHosts : setStoreHosts,setLinks :setStoreLinks,setSwitches : setStoreSwitches
  } = useTopologyStore()
  
  const { servers : storeServers , setServers : setStoreServers }  = useServersStore();
  const { serversData } = useServersApi()

  const { loadBalancers: storeLoadBalancer , setLoadBalancers : setStoreLoadBalancers } = useLoadBalancersStore()
  const  { loadBalancersData } = useLoadBalancersApi()

  const [links, setLinks] = useState<linkType[]>([]);
  const [nodes, setNodes] = useState<nodeType[]>([]);

  useEffect(() =>{
    if(linksData){
      setStoreLinks(linksData);
    }
    if(switchData){
      setStoreSwitches(switchData);
    }
    if(hostData){
      setStoreHosts(hostData);
    }
  } ,[hostData, linksData, setStoreHosts, setStoreLinks, setStoreSwitches, switchData]);

  useEffect(() => {
    if(serversData){
      setStoreServers(serversData);
    }
  },[serversData, setStoreServers]);

  useEffect(() => {
    if(loadBalancersData){
      setStoreLoadBalancers(loadBalancersData)
    }
  },[loadBalancersData, setStoreLoadBalancers])


  useEffect(() => {

    const switchesDpids = storeSwitches.map(s => s.dpid)

    for (let i = 0; i < storeLinks.length; i++) {
      const ele = storeLinks[i]

      const dstDpid = ele.dst.dpid
      const srcDpid = ele.src.dpid

      const isDstInDpids = switchesDpids.includes(dstDpid)
      const isSrcInDpids = switchesDpids.includes(srcDpid)

      if (!isDstInDpids || !isSrcInDpids) {
        storeLinks.splice(i, 1)
        continue
      } 

      let dup = storeLinks.findIndex(i => i.dst.name === ele.src.name)
      if (dup !== i) {
        storeLinks.splice(dup, 1)
      }

      dup = storeLinks.findIndex(i => i.dst.dpid === dstDpid)

      if (dup !== i) {
        storeLinks.splice(dup, 1)
      }

      dup = storeLinks.findIndex(i => i.src.dpid === srcDpid)
      if (dup !== i) {
        storeLinks.splice(dup, 1)
      }
    }

    const switchLinks: linkType[] = storeLinks.map(i => ({
      source: i.src.dpid,
      target: i.dst.dpid,
      distance: 250,
    }))

    const switches = storeSwitches.map(i => ({
      id: i.dpid,
      type: 'switch',
      size: 35,
    }))

    const hosts = storeHosts.map(i => ({
      id: i.mac,
      type: 'host',
      ipv4: i.ipv4[0],
      ipv6: i.ipv6[1],
      macAddress: i.mac,
      size: 35,
    }))

    const hostLinks: linkType[] = storeHosts.filter(host =>
      switches.findIndex(s => {
        return s.id === host.port.dpid
      }) > -1
    ).map(i => ({
      source: i.mac,
      target: i.port.dpid,
      distance: 150,
    }))


    storeServers?.forEach(server => {
      const index = hosts.findIndex(h => h.id === server.mac)
      if (index > -1) {
        hosts[index].type = 'server'
      }
    })

    storeLoadBalancer?.forEach(loadbalancer => {
      const index = switches.findIndex(s => s.id === loadbalancer.datapath)
      if(index > -1){
        switches[index].type = 'loadbalancer'
      } 
    })


    setLinks([...switchLinks, ...hostLinks])
    setNodes([...switches, ...hosts])
  }, [storeHosts, storeLinks, storeLoadBalancer, storeServers, storeSwitches])

  return { links, nodes }
}
