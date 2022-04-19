import create  from "zustand";


export enum SidBarTabsEnum {
  TopologyOverView = 'TopologyOverView',
  HostOverView = 'HostOverView',

}

interface SideBarState {
  activeTab: SidBarTabsEnum;
  selectedHost?: string
  setActiveTab: (tab: SidBarTabsEnum) => void;
  setSelectedHost: (host : string ) => void;
}

const useSideBarStore = create<SideBarState>((set) => ({
  // initial state
  activeTab: SidBarTabsEnum.TopologyOverView,
  // methods for manipulating state
  setActiveTab: (tab: SidBarTabsEnum) => {
    set((state) => ({
      ...state,
      activeTab: tab,
    }));
  },
  setSelectedHost: (host : string) => {
      set((state) => ({
          ...state,
          selectedHost: host
      }))

  }
}));

export default useSideBarStore

