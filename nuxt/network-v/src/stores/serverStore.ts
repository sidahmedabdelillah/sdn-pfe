import create  from "zustand";
import { ServerInterface } from "../types/Topology";


interface ServerStore {
  servers: ServerInterface[];
  setServers: (servers:ServerInterface[]) => void,
  getIsServer: (mac:string) => boolean,
  getServer: (mac:string) => ServerInterface | undefined
}

const useSideBarStore = create<ServerStore>((set ,get) => ({
    servers:[],
    setServers: (servers) => (set((state) => ({
      ...state,
      servers: servers
    }))),
    getIsServer: (mac) => get().servers.findIndex(server => server.mac === mac) > -1,
    getServer: (mac) => get().servers.find(server => server.mac === mac)

}));

export default useSideBarStore

