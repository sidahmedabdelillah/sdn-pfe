import { useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import useAxiosStore from "../stores/axiosStore"
import useTopologyStore from "../stores/TopologyStore"


export  function useAxiosGet<T>(url : string, interval : number = 0){

    const [data,setData] = useState<T>()
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const { BaseUrl } = useAxiosStore();
    const [ repeate , setRepeate ] = useState<NodeJS.Timer>();

    const { setIsTopologyError } = useTopologyStore()

    const fetchData = async () => {
        try{
            setLoading(true)
            const response : AxiosResponse<T> = await axios.get(`${BaseUrl}/${url}`)
            setData(response.data)
            setIsTopologyError(false)
        }catch(err : any){
            setError(err)
            setIsTopologyError(true)
        }finally{
            setLoading(false)
        }
    }

    const reload = () => {
        fetchData()
    }

    useEffect(() => {
        if(interval > 0 ){
            fetchData()
            const t = setInterval(fetchData , interval)
            if(repeate){
                clearInterval(repeate)
            }
            setRepeate(t)
            return () => {
                if(repeate){
                    clearInterval(repeate)
                }
            }
        }else{
            fetchData()
        }
    }, [BaseUrl, url])

    return { data, error, loading,reload }

}