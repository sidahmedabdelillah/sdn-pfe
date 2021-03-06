import { animated } from '@react-spring/web'
import { InputLink, InputNode, LinkProps } from '@nivo/network/dist/types/types'
import { memo } from 'react'

const CustomNetworkLink = <Node extends InputNode, Link extends InputLink>({
    link,
    animated: animatedProps,
    blendMode,
}: LinkProps<Node, Link>) => {
    return (
    <animated.line
        data-testid={`link.${link.id}`}
        stroke={animatedProps.color}
        style={{ mixBlendMode: blendMode }}
        strokeWidth={link.thickness}
        strokeLinecap="round"
        opacity={animatedProps.opacity}
        x1={animatedProps.x1}
        y1={animatedProps.y1}
        x2={animatedProps.x2}
        y2={animatedProps.y2}
    />
)}

export default (CustomNetworkLink) as typeof CustomNetworkLink