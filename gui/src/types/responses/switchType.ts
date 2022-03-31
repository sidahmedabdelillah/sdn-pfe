export interface SwitchType {
  dpid: string;
  ports: Port[];
}

export interface Port {
  dpid: string;
  port_no: string;
  hw_addr: string;
  name: string;
}
