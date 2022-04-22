import { memo } from 'react'
import { animated } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'
import switchSvg from '@/assets/svg/blue/switch.svg'


const CustomNode = <Node extends InputNode>({
    node,
    animated: animatedProps,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
}: NodeProps<Node>) => {
        const size = node.data.size || animatedProps.size.get()        
        return (
            <animated.image
                data-testid={`node.${node.id}`}
                x={animatedProps.x.get() - animatedProps.size.get() / 2 }
                y={animatedProps.y.get() - animatedProps.size.get() / 2  }
                height={size}
                onClick={onClick ? event => onClick(node, event) : undefined}
                onMouseEnter={
                    onMouseEnter ? event => onMouseEnter(node, event) : undefined
                  }
                onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
                onMouseLeave={onMouseLeave ? event => onMouseLeave(node, event) : undefined}
                href={switchSvg}
            />
            
        )
    
}

export default memo(CustomNode) as typeof CustomNode