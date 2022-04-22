import { memo } from 'react'
import { animated, to } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'
import SwitchNode from './CustomNodes/SwitchNode'
import HostNode from './CustomNodes/HostNode'


const CustomNode = <Node extends InputNode>({
  node,
  animated: animatedProps,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}: NodeProps<Node>) => {
  if (node.data.type === 'switch') {
    return (
      <SwitchNode
        node={node}
        animated={animatedProps}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      />
    )
  }

  if(node.data.type === 'host'|| node.data.type === 'server'){
      return (
          <HostNode 
            node={node}
            animated={animatedProps}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
          />
      )
  }
  return (
    <animated.circle
      data-testid={`node.${node.id}`}
      transform={to(
        [animatedProps.x, animatedProps.y, animatedProps.scale],
        (x, y, scale) => {
          return `translate(${x},${y}) scale(${scale})`
        }
      )}
      r={to([animatedProps.size], size => size / 2)}
      fill={animatedProps.color}
      strokeWidth={animatedProps.borderWidth}
      stroke={animatedProps.borderColor}
      opacity={animatedProps.opacity}
      onClick={onClick ? event => onClick(node, event) : undefined}
      onMouseEnter={
        onMouseEnter ? event => onMouseEnter(node, event) : undefined
      }
      onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
      onMouseLeave={
        onMouseLeave ? event => onMouseLeave(node, event) : undefined
      }
    />
  )
}

export default memo(CustomNode) as typeof CustomNode
