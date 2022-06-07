import { FlowsResponse } from "../types/Flows"
import { useAxiosGet } from "./useAxios"

export function useFlowsApi (dpid: string ){

    const dpidInt = parseInt(dpid)

    const { data , error } = useAxiosGet<FlowsResponse>(`stats/flowdesc/${dpidInt}`)


    return {data}
} 