import axios, { AxiosResponse } from 'axios'
import { LoadBalancerInterface } from '../types/Topology'

export const getLoadBalancers = async (baseUrl : string) => {

  const { data }: AxiosResponse<LoadBalancerInterface[]> = await axios.get(
    `${baseUrl}/v1/loadbalancer/loadbalancers`
  
  )
  return data 
}
