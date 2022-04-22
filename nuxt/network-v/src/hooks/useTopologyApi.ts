import {
  HostInterface,
  LinkInterface,
  ServerInterface,
  SwitchInterface,
} from '../types/Topology'
import { useAxiosDelete, useAxiosGet, useAxiosPost } from './useAxios'

export default function useTopologyApi() {
  const { data: switchData } = useAxiosGet<SwitchInterface[]>(
    'v1.0/topology/switches',
    10000
  )
  const { data: hostData } = useAxiosGet<HostInterface[]>(
    'v1.0/topology/hosts',
    10000
  )
  const { data: linksData } = useAxiosGet<LinkInterface[]>(
    'v1.0/topology/links',
    10000
  )

  return { switchData, hostData, linksData }
}

export const useServersApi = () => {
  const { data: serversData, reload: reloadServers } = useAxiosGet<
    ServerInterface[]
  >('v1/loadbalancer/servers', 10000)
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