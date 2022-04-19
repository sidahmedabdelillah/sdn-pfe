import create  from "zustand";
import { HostInterface, SwitchInterface } from "../types/Topology";


interface TopologyState {
  switches: SwitchInterface[];
  setSwitches: (switchesToSet: SwitchInterface[]) => void;
  hosts: HostInterface[];
  setHosts: (hostsToSet : HostInterface[])=> void
}

const useTopologyStore = create<TopologyState>((set) => ({
  // initial state
  switches: [],
  hosts:[],
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
  }
}));

export default useTopologyStore

