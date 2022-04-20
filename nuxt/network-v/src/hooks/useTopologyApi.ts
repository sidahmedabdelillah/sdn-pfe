import { HostInterface, LinkInterface, SwitchInterface } from '../types/Topology';
import { useAxiosGet } from './useAxios';

export default function useTopologyApi() {
    const { data: switchData }=  useAxiosGet<SwitchInterface[]>('v1.0/topology/switches' , 10000);
    const { data : hostData } =  useAxiosGet<HostInterface[]>('v1.0/topology/hosts', 10000);
    const { data : linksData } = useAxiosGet<LinkInterface[]>('v1.0/topology/links', 10000);

    return { switchData , hostData , linksData}
}

