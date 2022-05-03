import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import useSideBarStore from "../../../stores/sideBarStore";
import useTopologyStore from "../../../stores/TopologyStore";
import { SwitchInterface } from "../../../types/Topology";
import useLoadBalancersStore from "../../../stores/loadBalancerStore";
import { useDeleteLoadBalancerApi, usePostLoadBalancerApi } from "../../../hooks/useTopologyApi";
import { getLoadBalancers } from "../../../api/loadBalancerApi";
import useAxiosStore from "../../../stores/axiosStore";

const emptyLoadBalancerToPost = {
  dpid: ''
} as {
  dpid: string
}

const SwitchOverView: React.FC = () => {
  const [isLoadBalancer , setIsLoadBalancer] = useState(false);
  const [switche, setSwitch] = useState<SwitchInterface | null>(null);

  const { selectedHost } = useSideBarStore();
  const { switches } = useTopologyStore();
  
  const { loadBalancers, getIsLoadBalancer, setLoadBalancers : setStoreLoadBalancers } = useLoadBalancersStore()
  const [ loadBalancerToPost, setLoadBalancerToPost ] = useState(emptyLoadBalancerToPost)
  const { postLoadBalancerApi , postLoadBalancerError} = usePostLoadBalancerApi(loadBalancerToPost)
  const { deletLoadBalancerApi , deleteLoadBalancerError} = useDeleteLoadBalancerApi(selectedHost)
  const { BaseUrl } = useAxiosStore();


  const handlePostClick =  () => {
    confirmDialog({
      message: 'Are you Sure you want to add load balancing functionality to this switch ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => postLoadBalancer(),
      reject: () => null
  });
  }

  const postLoadBalancer = async () => {
    if(loadBalancerToPost === emptyLoadBalancerToPost ) return
    postLoadBalancerApi()
    if(postLoadBalancerError){
      console.log(postLoadBalancerError)
    }

    setTimeout(async () => {
      const loadBalancers = await getLoadBalancers(BaseUrl)
      setStoreLoadBalancers(loadBalancers)
    })
    
  }

  const deleteServer = () => {
    deletLoadBalancerApi()
    if(deleteLoadBalancerError){
      console.log(deleteLoadBalancerError)
    }
    setTimeout(async () => {
      const loadBalancers = await getLoadBalancers(BaseUrl)
      setStoreLoadBalancers(loadBalancers)
    })
  }
  const handleDeleteClick =  () => {
    confirmDialog({
      message: 'Are you Sure you want remove loadBalancer functionality from this switch ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteServer(),
      reject: () => null
  });
  }

  useEffect(() => {
    console.log(selectedHost);
    const foundSwitch = switches.find((s) => s.dpid === selectedHost);
    if (foundSwitch) {
      setSwitch(foundSwitch);
    }

  }, [selectedHost, switches]);

  useEffect(() => {
    if(selectedHost){
      setLoadBalancerToPost({dpid: selectedHost})
    }
  } ,[selectedHost])

  useEffect(() => {
    setIsLoadBalancer(getIsLoadBalancer(selectedHost))
  },[getIsLoadBalancer, loadBalancers, selectedHost])

  if (!switche) {
    return <h1>Please Select a host</h1>;
  }

  return (
    <>
      <ConfirmDialog />
      <div className="mb-8">
        <h1 className="text-[color:var(--primary-color)] text-xl ">
          {!isLoadBalancer ? (
            <>
              <i className="pi pi-desktop"></i> Switch Overview
            </>
          ) : (
            <>
              <i className="pi pi-server"></i> Switch With Loadbalancer Overview
            </>
          )}
        </h1>

        {!switche.dpid && (
          <Button
            label="Error"
            icon="pi pi-exclamation-triangle"
            className=" !p-1 !pr-4  !bg-red-400"
            tooltip="There is something wrong with this Switch"
          />
        )}
      </div>

      <Chip label="Switch DPID" />
      <p> {switche.dpid} </p>

      <Chip label="Ports" className="mt-4" />
      {switche.ports.map((port) => (
        <>
          <p>{port.name}</p>
        </>
      ))}

      {!isLoadBalancer && (
        <Button className="mt-4" onClick={handlePostClick}> Add as Load Balancer </Button>
      )}

      {isLoadBalancer && (
        <Button className="mt-4" onClick={handleDeleteClick}> Remove server from server cluster </Button>
      )}
    </>
  );
};

export default SwitchOverView;
