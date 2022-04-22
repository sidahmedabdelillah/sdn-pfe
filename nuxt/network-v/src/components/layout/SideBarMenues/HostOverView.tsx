import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Tooltip } from 'primereact/tooltip'

import React, { useEffect, useState } from 'react'
import { useDeleteServerApi, usePostServerApi } from '../../../hooks/useTopologyApi'
import useServersStore from '../../../stores/serverStore'
import useSideBarStore from '../../../stores/sideBarStore'
import useTopologyStore from '../../../stores/TopologyStore'
import { HostInterface } from '../../../types/Topology'

const HostOverView: React.FC = () => {
  const emptyServerToPost = {
    ip: '',
    mac: '',
    port: 0,
  } as {
    ip: string
    mac: string
    port: number
  }
  const [serverToPost, setServerToPost] = useState(emptyServerToPost)
  const { selectedHost } = useSideBarStore()
  const { hosts } = useTopologyStore()
  const { getIsServer, servers } = useServersStore()

  const [host, setHost] = useState<HostInterface>()
  const [isServer, setIsServer] = useState(false)

  const { postServerApi, postServerError } = usePostServerApi(serverToPost)
  const { deleteServerApi, deleteServerError } = useDeleteServerApi(host?.mac)

  const handlePostClick = () => {
    if (serverToPost !== emptyServerToPost) {
      postServerApi()
      if (postServerError) {
        console.log('error')
      }
    }
  }

  const handleDeleteClick = () => {
    deleteServerApi()
    if(deleteServerError){
        console.log('error')
    }
  }

  useEffect(() => {
    if (host) {
      setServerToPost({
        ip: host.ipv4[0],
        mac: host.mac,
        port: Number(host.port.port_no),
      })
    }
  }, [host])

  useEffect(() => {
    const foundHost = hosts.find(host => host.mac === selectedHost)

    setHost(foundHost)
  }, [selectedHost, hosts])

  useEffect(() => {
    setIsServer(getIsServer(host?.mac))
  }, [selectedHost, servers, host])

  if (!host) {
    return <h1>Please Select a host</h1>
  }

  return (
    <>
      <div className='mb-8'>
        <h1 className='text-[color:var(--primary-color)] text-xl '>
          {!isServer ? (
            <>
              <i className='pi pi-desktop'></i> Host Overview
            </>
          ) : (
            <>
              <i className='pi pi-server'></i> Server Overview
            </>
          )}
        </h1>

        {host.ipv4[0] === '0.0.0.0' && (
          <Button
            label='Error'
            icon='pi pi-exclamation-triangle'
            className=' !p-1 !pr-4  !bg-red-400'
            tooltip='There is something wrong with this host'
          />
        )}
      </div>

      <Chip label='Mac Address' />
      <p> {host.mac} </p>

      {host.ipv4.length > 0 && (
        <>
          <Chip label='IP-V4 Address' className='mt-4' />
          <p> {host.ipv4} </p>
        </>
      )}

      {host.ipv6.length > 0 && (host.ipv6[0] !== ':' || host.ipv6[1]) && (
        <>
          <Chip label='IP-V6 Address' className='mt-4' />
          <p> {host.ipv6[0] !== ':' ? host.ipv6[0] : host.ipv6[1]} </p>
        </>
      )}
      <Chip label={`Connection ${host.port.name}`} className='mt-4' />
      <p>
        Connected to switch{' '}
        {isNaN(Number(host.port.dpid))
          ? host.port.dpid
          : Number(host.port.dpid)}
      </p>
      <p>with port {Number(host.port.port_no)}</p>

      {!isServer && (
        <Button onClick={handlePostClick} className='mt-4'>
          {' '}
          Add host to server cluster{' '}
        </Button>
      )}
      {isServer && (
        <Button onClick={handleDeleteClick} className='mt-4'> Remove server from server cluster </Button>
      )}
    </>
  )
}

export default HostOverView
