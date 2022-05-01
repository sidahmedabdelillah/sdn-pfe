import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

import { ConfirmDialog } from "primereact/confirmdialog";

import useSideBarStore from "../../../stores/sideBarStore";
import useTopologyStore from "../../../stores/TopologyStore";
import { SwitchInterface } from "../../../types/Topology";
import useLoadBalancersStore from "../../../stores/loadBalancerStore";

const SwitchOverView: React.FC = () => {
  const [isLoadBalancer , setIsLoadBalancer] = useState(false);
  const [switche, setSwitch] = useState<SwitchInterface>(null);

  const { selectedHost } = useSideBarStore();
  const { switches } = useTopologyStore();
  
  const { loadBalancers, getIsLoadBalancer } = useLoadBalancersStore()

  useEffect(() => {
    console.log(selectedHost);
    const foundSwitch = switches.find((s) => s.dpid === selectedHost);
    if (foundSwitch) {
      setSwitch(foundSwitch);
    }
  }, [selectedHost, switches]);

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
        <Button className="mt-4"> Add as Load Balancer </Button>
      )}
      
      {isLoadBalancer && (
        <Button className="mt-4"> Remove server from server cluster </Button>
      )}
    </>
  );
};

export default SwitchOverView;
