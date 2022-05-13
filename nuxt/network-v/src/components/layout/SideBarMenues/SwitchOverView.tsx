import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

import useSideBarStore from "../../../stores/sideBarStore";
import useTopologyStore from "../../../stores/TopologyStore";
import { SwitchInterface } from "../../../types/Topology";
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

const emptyLoadBalancerToPost = {
  dpid: "",
  virtual_ip: "",
} as {
  dpid: string;
  virtual_ip: string;
};

const METHOD_OPTIONS = [
  { label: "Round Robin", value: 1 },
  { label: "Mac Hash", value: 2 },
];

const SwitchOverView: React.FC = () => {
  const toastRef = useRef<Toast>(null);

  const [selectedMethod, setSelectedMethod] = useState(METHOD_OPTIONS[0].value);

  const [isLoadBalancer, setIsLoadBalancer] = useState(false);
  const [switche, setSwitch] = useState<SwitchInterface | null>(null);

  const { selectedHost } = useSideBarStore();
  const { switches } = useTopologyStore();

  const [displayDialog, setDisplayDialog] = useState(false);
  const [inputIp, setInputIp] = useState("");

  const {
    loadBalancers,
    getIsLoadBalancer,
    setLoadBalancers: setStoreLoadBalancers,
  } = useLoadBalancersStore();
  const [loadBalancerToPost, setLoadBalancerToPost] = useState(
    emptyLoadBalancerToPost
  );
  const { postLoadBalancerApi, postLoadBalancerError } =
    usePostLoadBalancerApi(loadBalancerToPost);
  const { deletLoadBalancerApi, deleteLoadBalancerError } =
    useDeleteLoadBalancerApi(selectedHost);
  const { BaseUrl } = useAxiosStore();

  const showDialog = () => setDisplayDialog(true);
  const onHide = () => setDisplayDialog(false);

  useEffect(() => {
    setLoadBalancerToPost((loadBalancerToPost) => ({
      ...loadBalancerToPost,
      virtual_ip: inputIp,
      method: selectedMethod
    }));
  }, [inputIp, selectedMethod]);


  const handlePostClick = () => {
    if (!validateIpAddress(inputIp)) {
      toastRef.current?.show({
        severity: "error",
        summary: "invalid Ip Address",
      });
      return;
    }

    console.log(loadBalancerToPost);
    console.log(inputIp);
    postLoadBalancerApi();
    if (postLoadBalancerError) {
      console.log(postLoadBalancerError);
    }
    setDisplayDialog(false);
    setTimeout(async () => {
      const loadBalancers = await getLoadBalancers(BaseUrl);
      setStoreLoadBalancers(loadBalancers);
    });
  };

  const postLoadBalancer = async () => {
    if (loadBalancerToPost === emptyLoadBalancerToPost) return;
    postLoadBalancerApi();
    if (postLoadBalancerError) {
      console.log(postLoadBalancerError);
    }

    setTimeout(async () => {
      const loadBalancers = await getLoadBalancers(BaseUrl);
      setStoreLoadBalancers(loadBalancers);
    });
  };

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
    console.log(selectedHost);
    const foundSwitch = switches.find((s) => s.dpid === selectedHost);
    if (foundSwitch) {
      setSwitch(foundSwitch);
    }
  }, [selectedHost, switches]);

  useEffect(() => {
    if (selectedHost) {
      setLoadBalancerToPost({ dpid: selectedHost, virtual_ip: inputIp });
    }
  }, [selectedHost]);

  useEffect(() => {
    setIsLoadBalancer(getIsLoadBalancer(selectedHost));
  }, [getIsLoadBalancer, loadBalancers, selectedHost]);

  const footer = (
    <div>
      <Button label="Yes" icon="pi pi-check" onClick={handlePostClick} />
      <Button label="No" icon="pi pi-times" onClick={onHide} />
    </div>
  );

  if (!switche) {
    return <h1>Please Select a host</h1>;
  }

  return (
    <>
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <Dialog
        visible={displayDialog}
        header={"Add load balancer"}
        footer={footer}
        onHide={onHide}
      >
        <h1 className="mb-8">
          Enter the virtual ip for the cluster connected to this switch
        </h1>
        <div className="flex justify-center w-full">
          <span className="p-float-label w-80">
            <InputText
              id="inputtext"
              className="w-full"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
            />
            <label htmlFor="inputtext">Ip Address</label>
          </span>
        </div>

        <div className="flex justify-center w-full mt-2">
          <Dropdown
            value={selectedMethod}
            options={METHOD_OPTIONS}
            onChange={(e) => setSelectedMethod(e.value)}
            className="w-80"
          />
        </div>
      </Dialog>
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

      {isLoadBalancer && (
        <>
          <Chip label="Load balancer" />
          <p> {switche.dpid} </p>
        </>
      )}

      {!isLoadBalancer && (
        <>
          <Chip label="Ports" className="mt-4" />
          {switche.ports.map((port) => (
            <p key={port.hw_addr}>{port.name}</p>
          ))}
        </>
      )}

      {!isLoadBalancer && (
        <Button className="mt-4" onClick={showDialog}>
          {" "}
          Add as Load Balancer{" "}
        </Button>
      )}

      {isLoadBalancer && (
        <Button className="mt-4" onClick={handleDeleteClick}>
          {" "}
          Remove server from server cluster{" "}
        </Button>
      )}
    </>
  );
};

export default SwitchOverView;
