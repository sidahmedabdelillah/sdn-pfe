
export interface SwitchInterface {
  dpid: string
  ports: PortInterface[]
}

export interface PortInterface {
  dpid: string
  port_no: string
  hw_addr: string
  name: string
}

export interface LinkInterface {
  src: srcInterface
  dst: srcInterface
}

export interface srcInterface {
  dpid: string
  port_no: string
  hw_addr: string
  name: string
}

export interface HostInterface {
  mac: string
  ipv4: string[]
  ipv6: string[]
  port: PortInterface
}


export interface ServerInterface {
  ip: string,
  mac: string,
  port: number
}