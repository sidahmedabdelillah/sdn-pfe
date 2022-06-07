
export type FlowsResponse = Record< number , The1[] >

export interface The1 {
    priority:      number;
    cookie:        number;
    idle_timeout:  number;
    hard_timeout:  number;
    byte_count:    number;
    duration_sec:  number;
    duration_nsec: number;
    packet_count:  number;
    length:        number;
    flags:         number;
    actions:       string[];
    match:         Match;
    table_id:      number;
}

export interface Match {
    dl_dst?:  string;
    dl_type?: number;
}