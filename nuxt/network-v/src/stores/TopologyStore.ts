import create  from "zustand";
import { HostInterface, SwitchInterface } from "../types/Topology";


interface TopologyState {
  switches: SwitchInterface[];
  hosts: HostInterface[];
  isTopologyError: boolean,
  setSwitches: (switchesToSet: SwitchInterface[]) => void;
  setHosts: (hostsToSet : HostInterface[])=> void,
  setIsTopologyError : (s : boolean ) => void ,
}

const useTopologyStore = create<TopologyState>((set) => ({
  // initial state
  switches: [],
  hosts:[],
  isTopologyError: false,
  // methods for manipulating state
  setSwitches: (switchesToSet: SwitchInterface[]) => {
    set((state) => ({
      ...state,
      switches: switchesToSet,
    }));
  },
  setHosts: (hostsToSet : HostInterface[]) =>{
      set( (state) => ({
        ...state,
        hosts: hostsToSet
      }))
  },
  setIsTopologyError: (s:boolean) => {
    set((state) =>( {
      ...state,
      isTopologyError:s
    }))
  }
}));

export default useTopologyStore

