import { memo } from 'react'
import { animated, to } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'
import SwitchNode from './CustomNodes/SwitchNode'
import HostNode from './CustomNodes/HostNode'

const switchImageUrl =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwZ1FIaoo_uqikq8pSb2b6_20701AcmoCROA&usqp=CAU'
const pcImageUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO0AAADVCAMAAACMuod9AAAAZlBMVEX///8AAABJSUnBwcGOjo4xMTHY2Nhzc3OhoaFra2vu7u6enp74+PjGxsZ5eXmFhYVTU1M5OTmXl5cNDQ1aWlrl5eWzs7M8PDysrKwVFRXo6Oje3t5iYmIuLi7Nzc3U1NQmJiYcHBwojS2dAAAClklEQVR4nO3d6W7iMBiFYVOYNAlhCXtbut3/TQ5L0dAmIzGa2kc9ft+fSBXfI0V2glwlhKvWm1k1v/NpXs0269BbU74NHHsvmy62VE8VsfKLtd6qJ4ratr7GFupxolfkhL3i1upJknS5mFv1IElqz9ixeo5EjU/7rHqKZB333YV6iGQtDlr1DAnLY/e5VGSzRh0rQ6UeIWFVJpvtuTYs1SMkbJnTknxYlLsfVSOPelakHu2k/7eNH9fkJu1QPeY3NUSL1iK0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPULb/Sivt/3m9SZn4zJ7A3urHiFhbei5um2rQqkeIWFlKNQjJKwIOS3Kh014oZ4hWYuDtlEPkazmeIc1Vk+RqPH5hjKPLbf9uH2u1YMkqb48LeSwCxV/Ho78uVfYw8W8VY8TtW0dPud8B1l2H/Wb8k09VZTee6yn1rvpqv0VsYfOLA8xv65dTXfrf/ht55ubdrRT3TDRu+9o79UjRQytb2h9Q+sbWt/Q+obWN7S+ofUNrW9ofUPrG9of1mNxa0/7jnb/dPNfP6qhIUxWHUC8VtrDxM08ofXYvBFi0x+AXeq4z8mxg8GzCqs5aDUWaSXY02lFQS8i7YtEqzqX8rdzFHGbibQziXYk0o4k2p1Iu5Fo1yKt6EyQ5rTgVoMNrxLtq0grWac0a9Sp9JuQZvv5aJj2KWip/t/gyWh/l6b96L8f5n8DCjxWUZCmHEIAAAAASUVORK5CYII='

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

  if(node.data.type === 'host'){
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
