import { getValueFormatter } from '@nivo/core'
import axios, { AxiosResponse } from 'axios'
import { useSwitchStore } from '../stores/TopologyStore'
import { HostInterface, LinkInterface, SwitchInterface } from '../types/Topology'

export const getSwitchesApi = async () => {
  const { data }: AxiosResponse<SwitchInterface[]> = await axios.get(
    'http://127.0.0.1:8080/v1.0/topology/switches'
  )

  return data
}

export const getHostsApi = async () => {
  const { data }: AxiosResponse<HostInterface[]> = await axios.get(
    'http://127.0.0.1:8080/v1.0/topology/hosts'
  )

  return data
}

export const getLinksApi = async () => {
  const { data }: AxiosResponse<LinkInterface[]> = await axios.get(
    'http://127.0.0.1:8080/v1.0/topology/links'
  )
  return data
}

export const getTopologuApi = async () => {

  const data = await getLinksApi()
  const d = Object.assign({}, data)
  console.log('before', d)

  const switchesData = await getSwitchesApi()
  const hostsData = await getHostsApi()

  const switchesDpids = switchesData.map(s => s.dpid)

  for (let i = 0; i < data.length; i++) {
    const ele = data[i]

    const dstDpid = ele.dst.dpid
    const srcDpid = ele.src.dpid

    const isDstInDpids = switchesDpids.includes(dstDpid)
    const isSrcInDpids = switchesDpids.includes(srcDpid)

    if (!isDstInDpids || !isSrcInDpids) {
      data.splice(i, 1)
      continue
    }

    let dup = data.findIndex(i => i.dst.name === ele.src.name)
    if (dup !== i) {
      data.splice(dup, 1)
    }

    dup = data.findIndex(i => i.dst.dpid === dstDpid)

    if (dup !== i) {
      data.splice(dup, 1)
    }

    dup = data.findIndex(i => i.src.dpid === srcDpid)
    if (dup !== i) {
      data.splice(dup, 1)
    }
  }

  const switchLinks = data.map(i => ({
    source: i.src.dpid,
    target: i.dst.dpid,
    distance: 250
  }))
    const switches = switchesData.map(i => ({ id: i.dpid, type: 'switch',size: 35 }))
  const hosts = hostsData.map(i => ({
    id: i.mac,
    type: 'host',
    ipv4: i.ipv4[0],
    ipv6: i.ipv6[1],
    macAddress: i.mac,
    size: 35
  }))

    
  const hostLinks = hostsData.map(i => ({ source: i.mac, target: i.port.dpid,distance: 150  }))

  console.log(hostLinks)
  return {
    links: [...switchLinks, ...hostLinks],
    nodes: [...switches, ...hosts] as { id: string; type: string }[],
  }
}

