import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Tooltip } from "primereact/tooltip";

import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import { getServer } from "../../../api/serversApi";
import {
  useDeleteServerApi,
  usePostServerApi,
} from "../../../hooks/useTopologyApi";
import useAxiosStore from "../../../stores/axiosStore";
import useServersStore from "../../../stores/serverStore";
import useSideBarStore from "../../../stores/sideBarStore";
import useTopologyStore from "../../../stores/TopologyStore";
import { HostInterface } from "../../../types/Topology";
import useLoadBalancersStore from "../../../stores/loadBalancerStore";

const emptyServerToPost = {
  ip: "",
  mac: "",
  port: 0,
  dpid: "",
} as {
  ip: string;
  mac: string;
  port: number;
  dpid: string;
};

const HostOverView: React.FC = () => {
  const toastRef = useRef<Toast>(null);

  const [serverToPost, setServerToPost] = useState(emptyServerToPost);

  const { selectedHost } = useSideBarStore();
  const { hosts } = useTopologyStore();
  const {
    getIsServer,
    servers,
    setServers: setStoreServers,
  } = useServersStore();

  const [host, setHost] = useState<HostInterface>();
  const [isServer, setIsServer] = useState(false);
  const [isConnectedServerLoadBalancer, setIsConnectedServerLoadBalancer] =
    useState(false);

  const { postServerApi, postServerError } = usePostServerApi(serverToPost);
  const { deleteServerApi, deleteServerError } = useDeleteServerApi(host?.mac);

  const { BaseUrl } = useAxiosStore();
  const { getIsLoadBalancer } = useLoadBalancersStore();

  const handlePostClick = () => {
    confirmDialog({
      message: "Are you Sure you want to add this node to the server cluster ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => postServer(),
      reject: () => null,
    });
  };

  const postServer = async () => {
    if (serverToPost !== emptyServerToPost) {
      if (!isConnectedServerLoadBalancer) {
        toastRef.current?.show({
          severity: "error",
          summary: "Server is not connected to a LoadBalancer",
        });
        return
      }
      postServerApi();
      if (postServerError) {
        console.log("error");
      }
      setTimeout(async () => {
        const servers = await getServer(BaseUrl);
        setStoreServers(servers);
      }, 100);
    }
  };

  const handleDeleteClick = () => {
    confirmDialog({
      message:
        "Are you Sure you want to delete this node from the server cluster?",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteServer(),
      reject: () => null,
    });
  };

  const deleteServer = async () => {
    deleteServerApi();
    if (deleteServerError) {
      console.log("error");
    }
    setTimeout(async () => {
      const servers = await getServer(BaseUrl);
      setStoreServers(servers);
    }, 100);
  };

  useEffect(() => {
    if (host) {
      const isLoadBalancer = getIsLoadBalancer(host.port.dpid);
      setIsConnectedServerLoadBalancer(isLoadBalancer);
      setServerToPost({
        ip: host.ipv4[0],
        mac: host.mac,
        port: Number(host.port.port_no),
        dpid: host.port.dpid,
      });
    }
  }, [host]);

  useEffect(() => {
    const foundHost = hosts.find((host) => host.mac === selectedHost);

    setHost(foundHost);
  }, [selectedHost, hosts]);

  useEffect(() => {
    setIsServer(getIsServer(host?.mac));
  }, [selectedHost, servers, host, getIsServer]);

  if (!host) {
    return <h1>Please Select a host</h1>;
  }

  return (
    <>
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <div className="mb-8">
        <h1 className="text-[color:var(--primary-color)] text-xl ">
          {!isServer ? (
            <>
              <i className="pi pi-desktop"></i> Host Overview
            </>
          ) : (
            <>
              <i className="pi pi-server"></i> Server Overview
            </>
          )}
        </h1>

        {host.ipv4[0] === "0.0.0.0" && (
          <Button
            label="Error"
            icon="pi pi-exclamation-triangle"
            className=" !p-1 !pr-4  !bg-red-400"
            tooltip="There is something wrong with this host"
          />
        )}
      </div>

      <Chip label="Mac Address" />
      <p> {host.mac} </p>

      {host.ipv4.length > 0 && (
        <>
          <Chip label="IP-V4 Address" className="mt-4" />
          <p> {host.ipv4} </p>
        </>
      )}

      {host.ipv6.length > 0 && (host.ipv6[0] !== ":" || host.ipv6[1]) && (
        <>
          <Chip label="IP-V6 Address" className="mt-4" />
          <p> {host.ipv6[0] !== ":" ? host.ipv6[0] : host.ipv6[1]} </p>
        </>
      )}
      <Chip label={`Connection ${host.port.name}`} className="mt-4" />
      <p>
        Connected to switch{" "}
        {isNaN(Number(host.port.dpid))
          ? host.port.dpid
          : Number(host.port.dpid)}
      </p>
      <p>with port {Number(host.port.port_no)}</p>

      {!isServer && (
        <Button onClick={handlePostClick} className="mt-4">
          {" "}
          Add host to server cluster{" "}
        </Button>
      )}
      {isServer && (
        <Button onClick={handleDeleteClick} className="mt-4">
          {" "}
          Remove server from server cluster{" "}
        </Button>
      )}
    </>
  );
};

export default HostOverView;
