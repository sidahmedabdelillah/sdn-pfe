export interface FlowsResponse {
    "1": The1[];
    "2": The1[];
    "3": The1[];
    "4": The1[];
    "5": The1[];
    "6": The1[];
    "7": The1[];
    "8": The1[];
}

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