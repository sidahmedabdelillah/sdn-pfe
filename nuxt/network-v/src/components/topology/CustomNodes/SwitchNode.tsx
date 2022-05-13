import { memo, useEffect, useState } from 'react'
import { animated } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'

import switchSvg from '@/assets/svg/blue/switch.svg'
import loadBalancerSvg from '@/assets/svg/blue/loadbalancer.svg'
import useSideBarStore, { SidBarTabsEnum } from '../../../stores/sideBarStore'

const CustomNode = <Node extends InputNode>({
    node,
    animated: animatedProps,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
}: NodeProps<Node>) => {
        const size = node.data.size || animatedProps.size.get()  
        
        const [ imgUrl , setImageUrl ] = useState(switchSvg)
        const [ isLoadbalancer, setIsLoadBalancer ] = useState(false)
    
        const { setSelectedHost , setActiveTab } = useSideBarStore()

        const handleClick = () => {
            setSelectedHost(node.data.id)
            if(!isLoadbalancer){
                setActiveTab(SidBarTabsEnum.SwitchView)
            }else{
                setActiveTab(SidBarTabsEnum.LoadBalancerView)
            }
        }
        
        useEffect(() => {
            
            if(node.data.type === 'switch'){
                setImageUrl(switchSvg)
                setIsLoadBalancer(false)
            }
            if(node.data.type === 'loadbalancer'){
                setImageUrl(loadBalancerSvg)
                setIsLoadBalancer(true)
            }
        },[node.data.type]);


        
        return (
            <animated.image
                data-testid={`node.${node.id}`}
                x={animatedProps.x.get() - animatedProps.size.get() / 2 }
                y={animatedProps.y.get() - animatedProps.size.get() / 2  }
                height={size}
                onClick={handleClick}
                onMouseEnter={
                    onMouseEnter ? event => onMouseEnter(node, event) : undefined
                  }
                onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
                onMouseLeave={onMouseLeave ? event => onMouseLeave(node, event) : undefined}
                href={imgUrl}
            />
            
        )
    
}

export default memo(CustomNode) as typeof CustomNode