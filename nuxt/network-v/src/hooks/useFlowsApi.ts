import { FlowsResponse } from "../types/Flows"
import { useAxiosGet } from "./useAxios"

export function useFlowsApi (dpid: string ){

    const dpidInt = parseInt(dpid,16)

    const { data , error } = useAxiosGet<FlowsResponse>(`stats/flowdesc/${dpidInt}`)

    
    return {data}
} 