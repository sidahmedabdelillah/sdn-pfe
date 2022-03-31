export interface HostType {
	mac: string;
	ipv4: string[];
	ipv6: string[];
	port: Port;
}

export interface Port {
	dpid: string;
	port_no: string;
	hw_addr: string;
	name: string;
}
