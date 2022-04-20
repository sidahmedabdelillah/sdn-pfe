import { HostInterface, LinkInterface, SwitchInterface } from '../types/Topology';
import useAxios from './useAxios';

export default function useTopologyApi() {
    const { data: switchData }=  useAxios<SwitchInterface[]>('v1.0/topology/switches' , 10000);
    const { data : hostData } =  useAxios<HostInterface[]>('v1.0/topology/hosts', 10000);
    const { data : linksData } = useAxios<LinkInterface[]>('v1.0/topology/links', 10000);

    return { switchData , hostData , linksData}
}

