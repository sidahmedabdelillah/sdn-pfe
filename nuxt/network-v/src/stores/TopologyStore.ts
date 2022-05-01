import create  from "zustand";
import { HostInterface, LinkInterface, SwitchInterface } from "../types/Topology";


interface TopologyState {
  switches: SwitchInterface[];
  hosts: HostInterface[];
  links:LinkInterface[],
  isTopologyError: boolean,
  setSwitches: (switchesToSet: SwitchInterface[]) => void;
  setHosts: (hostsToSet : HostInterface[])=> void,
  setLinks: (links: LinkInterface[]) => void,
  setIsTopologyError : (s : boolean ) => void ,

}

const useTopologyStore = create<TopologyState>((set) => ({
  // initial state
  switches: [],
  hosts:[],
  links:[],
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
  setLinks: (links: LinkInterface[])=> {
    set((state) => ({
      ...state,
      links:links
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

