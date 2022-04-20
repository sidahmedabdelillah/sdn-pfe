import { BasicTooltip } from '@nivo/tooltip'
import { InputNode, NodeTooltipProps } from '@nivo/network/dist/types/types'
import { Card } from 'primereact/card'

const CustomTooltip=  <Node extends MyNode>({ node }: NodeTooltipProps<Node>) =>
 {  
     return( 
         <>
        { node.data.type == 'switch' &&
            <Card className="tooltip-card " title={`switch-id: ${node.data.id}`}>
                
            </Card>
        }
        {
            node.data.type == 'host' && 
            <Card className="tooltip-card" >
                <div className="">
                    mac-address: <span className="font-bold"> {node.data.macAddress}  </span>
                </div>
                {
                node.data.ipv4 && 
                <div className="">
                    IPV4-address: <span className="font-bold"> {node.data.ipv4}  </span>
                </div>
                }
                { node.data.ipv6 && 
                <div className="">
                    IPV6-address: <span className="font-bold"> {node.data.ipv6}  </span>
                </div>
                }
            </Card> 
        }
         </>
    )
}

export default CustomTooltip


type ExtraPropos = {
    type?: 'switch' | 'host',
    ipv4?: string,
    ipv6?: string,
    macAddress?: string,
}

export type MyNode = InputNode & ExtraPropos ;