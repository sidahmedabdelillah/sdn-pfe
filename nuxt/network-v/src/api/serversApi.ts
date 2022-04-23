import axios, { AxiosResponse } from 'axios'
import { ServerInterface } from '../types/Topology'

export const getServer = async (baseUrl : string) => {

  const { data }: AxiosResponse<ServerInterface[]> = await axios.get(
    `${baseUrl}/v1/loadbalancer/servers`
  
  )
  return data 
}
