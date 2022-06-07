import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast, } from 'primereact/toast'



import useSideBarStore from "../../../stores/sideBarStore";
import useTopologyStore from "../../../stores/TopologyStore";
import { LoadBalancerInterface, SwitchInterface } from "../../../types/Topology";
import useLoadBalancersStore from "../../../stores/loadBalancerStore";
import {
  useDeleteLoadBalancerApi,
  usePostLoadBalancerApi,
} from "../../../hooks/useTopologyApi";
import { getLoadBalancers } from "../../../api/loadBalancerApi";
import useAxiosStore from "../../../stores/axiosStore";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { validateIpAddress } from "../../../utils/validators/validateIp";
import snakeToPascal from "../../../utils/snakeToCamel";
import { useNavigate } from "react-router-dom";

const emptyLoadBalancerToPost = {
  dpid: "",
  virtual_ip: ''
} as {
  dpid: string;
  virtual_ip: string
};

const LoadBalancerView: React.FC = () => {
  const toastRef = useRef<Toast>(null)
  const { BaseUrl } = useAxiosStore();
  const navigate = useNavigate()

  const [switche, setSwitch] = useState<SwitchInterface | null>(null);
  const [loadBalancer, setLoadBalancer] = useState<LoadBalancerInterface | null>(null)
  
  const { selectedHost } = useSideBarStore();
  const { switches } = useTopologyStore();

  const navigateToFlows = () => {
    const path = `/flows/${switche?.dpid}`
    navigate(path)
  }

  const {
    getLoadBalancer,
    setLoadBalancers: setStoreLoadBalancers,
  } = useLoadBalancersStore();

  const { deletLoadBalancerApi, deleteLoadBalancerError } =
    useDeleteLoadBalancerApi(selectedHost);

  const deleteServer = () => {
    deletLoadBalancerApi();
    if (deleteLoadBalancerError) {
      console.log(deleteLoadBalancerError);
    }
    setTimeout(async () => {
      const loadBalancers = await getLoadBalancers(BaseUrl);
      setStoreLoadBalancers(loadBalancers);
    });
  };

  const handleDeleteClick = () => {
    confirmDialog({
      message:
        "Are you Sure you want remove loadBalancer functionality from this switch ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteServer(),
      reject: () => null,
    });
  };

  useEffect(() => {
    const foundSwitch = switches.find((s) => s.dpid === selectedHost);
    if(selectedHost){
      const foundLoadBalancer = getLoadBalancer(selectedHost)
      if(foundLoadBalancer){
        setLoadBalancer(foundLoadBalancer)
      }
      console.log(foundLoadBalancer)
    }
    if (foundSwitch) {
      setSwitch(foundSwitch);
    }
  }, [selectedHost, switches]);

  if (!switche) {
    return <h1>Please Select a host</h1>;
  }

  return (
    <>  
      <Toast ref={toastRef}/>
      <ConfirmDialog />

      <div className="mb-8">
        <h1 className="text-[color:var(--primary-color)] text-xl ">
          <i className="pi pi-desktop"></i> Switch With Loadbalancer Overview
        </h1>

        {!switche.dpid && (
          <Button
            label="Error"
            icon="pi pi-exclamation-triangle"
            className=" !p-1 !pr-4  !bg-red-400"
            tooltip="There is something wrong with this Switch"
          />
        )}

        <div className="flex justify-between">
          <Button onClick={navigateToFlows}>
            View Flows
          </Button>
        </div>
      </div>

      <Chip label="Switch DPID" />
      <p> { loadBalancer?.datapath } </p>

      <Chip label="Load balancer VIP" />
      <p> {loadBalancer?.virtual_ip} </p>

      <Chip label="Load Balancer Method" />
      <p> { loadBalancer?.method_name && snakeToPascal(loadBalancer?.method_name)} </p>

      <Chip label="Number Of Ports" className="mt-4" />
      <p>{ switche.ports.length }</p>


      
      <Button className="mt-4" onClick={handleDeleteClick}>
        Remove server from server cluster{" "}
      </Button>
      
    </>
  );
};

export default LoadBalancerView;
