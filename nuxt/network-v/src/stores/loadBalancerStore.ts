import create from "zustand";
import { LoadBalancerInterface } from "../types/Topology";

interface loadBalancerStore {
  loadBalancers: LoadBalancerInterface[];
  setLoadBalancers: (loadBalancers: LoadBalancerInterface[]) => void;
  getIsLoadBalancer: (id: string | undefined) => boolean;
  getLoadBalancer: (id: string) => LoadBalancerInterface | undefined;
}

const useLoadBalancersStore = create<loadBalancerStore>((set, get) => ({
  loadBalancers: [],
  setLoadBalancers: (loadBalancers) =>
    set((state) => ({
      ...state,
      loadBalancers: loadBalancers,
    })),
  getIsLoadBalancer: (id) =>
    get().loadBalancers.findIndex((lb) => lb.datapath === id) > -1,
  getLoadBalancer: (id) => get().loadBalancers.find((lb) => lb.datapath === id),
}));

export default useLoadBalancersStore;
