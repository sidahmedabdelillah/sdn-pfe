import { memo } from 'react'
import { animated, to } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'
import useSideBarStore, { SidBarTabsEnum } from '../../../stores/sideBarStore'

const switchImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwZ1FIaoo_uqikq8pSb2b6_20701AcmoCROA&usqp=CAU'

const CustomNode = <Node extends InputNode>({
    node,
    animated: animatedProps,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
}: NodeProps<Node>) => {
        const imgUrl = switchImageUrl
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
                href={imgUrl}
            />
            
        )
    
}

export default memo(CustomNode) as typeof CustomNode