import {
  HostInterface,
  LinkInterface,
  ServerInterface,
  SwitchInterface,
} from '../types/Topology'
import { useAxiosDelete, useAxiosGet, useAxiosPost } from './useAxios'

export default function useTopologyApi(longPooling:boolean = false) {
  const interval = longPooling ? 10000 : 0 ;
  const { data: switchData } = useAxiosGet<SwitchInterface[]>(
    'v1.0/topology/switches',
    interval
  )
  const { data: hostData } = useAxiosGet<HostInterface[]>(
    'v1.0/topology/hosts',
    interval
  )
  const { data: linksData } = useAxiosGet<LinkInterface[]>(
    'v1.0/topology/links',
    interval
  )

  return { switchData, hostData, linksData }
}

export const useServersApi = (longPooling:boolean = false) => {
  const interval = longPooling ? 10000 : 0 ;

  const { data: serversData, reload: reloadServers } = useAxiosGet<
    ServerInterface[]
  >('v1/loadbalancer/servers', interval)
  return { serversData, reloadServers }
}

export const usePostServerApi = (body: any) => {
  const { postData: postServerApi, error: postServerError } = useAxiosPost(
    'v1/loadbalancer/servers',
    body
  )

  return { postServerApi ,postServerError
  }
}

export const useDeleteServerApi = (mac : string | undefined) => {
    const {deleteData : deleteServerApi ,error: deleteServerError } = useAxiosDelete(`v1/loadbalancer/servers/${mac}`);
    return {deleteServerApi,deleteServerError
    }
}