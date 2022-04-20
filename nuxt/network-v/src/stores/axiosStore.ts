import create from 'zustand';
import { configurePersist } from 'zustand-persist'

const { persist, purge } = configurePersist({
  storage: localStorage
})

interface AxiosState {
    BaseUrl : string,
    WsUrl:string,
    setBaseUrl: (Url : string) => void,
};

const useAxiosStore = create<AxiosState>(persist(
    {
      key: 'AxiosState',
    },
    (set) => ({
    BaseUrl: 'http://127.0.0.1:8080',
    WsUrl:'ws://127.0.0.1:8080',
    setBaseUrl: (Url :string) => {
        set((state) => ({
            ...state,
            BaseUrl: Url ,
            WsUrl : Url.replace('http' , 'ws')
        }))
    }
})));

export default useAxiosStore;