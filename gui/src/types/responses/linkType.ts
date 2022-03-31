export interface LinkType {
  src: Dst;
  dst: Dst;
}

export interface Dst {
  dpid: string;
  port_no: string;
  hw_addr: string;
  name: string;
}
