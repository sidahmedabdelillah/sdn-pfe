import create from 'zustand';

interface AxiosState {
    BaseUrl : string,
    WsUrl:string,
    setBaseUrl: (Url : string) => void,
};

const useAxiosStore = create<AxiosState>((set) => ({
    BaseUrl: 'http://127.0.0.1:8080',
    WsUrl:'ws://127.0.0.1:8080',
    setBaseUrl: (Url :string) => {
        set((state) => ({
            ...state,
            BaseUrl: Url ,
            WsUrl : Url.replace('http' , 'ws')
        }))
    }
}));

export default useAxiosStore;