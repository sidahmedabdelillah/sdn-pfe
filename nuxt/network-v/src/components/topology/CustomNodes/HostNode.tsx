import { memo, useEffect, useState } from 'react'
import { animated, to } from '@react-spring/web'
import { InputNode, NodeProps } from '@nivo/network/dist/types/types'
import useSideBarStore, { SidBarTabsEnum } from '../../../stores/sideBarStore'
import TriangleIcon from '../../icons/TriangleIcon'
import clientSvg from '../../../assets/svg/blue/client.svg';
import serverSvg from '../../../assets/svg/blue/server.svg';

const pcImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO0AAADVCAMAAACMuod9AAAAZlBMVEX///8AAABJSUnBwcGOjo4xMTHY2Nhzc3OhoaFra2vu7u6enp74+PjGxsZ5eXmFhYVTU1M5OTmXl5cNDQ1aWlrl5eWzs7M8PDysrKwVFRXo6Oje3t5iYmIuLi7Nzc3U1NQmJiYcHBwojS2dAAAClklEQVR4nO3d6W7iMBiFYVOYNAlhCXtbut3/TQ5L0dAmIzGa2kc9ft+fSBXfI0V2glwlhKvWm1k1v/NpXs0269BbU74NHHsvmy62VE8VsfKLtd6qJ4ratr7GFupxolfkhL3i1upJknS5mFv1IElqz9ixeo5EjU/7rHqKZB333YV6iGQtDlr1DAnLY/e5VGSzRh0rQ6UeIWFVJpvtuTYs1SMkbJnTknxYlLsfVSOPelakHu2k/7eNH9fkJu1QPeY3NUSL1iK0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPUKL1iO0aD1Ci9YjtGg9QovWI7RoPULb/Sivt/3m9SZn4zJ7A3urHiFhbei5um2rQqkeIWFlKNQjJKwIOS3Kh014oZ4hWYuDtlEPkazmeIc1Vk+RqPH5hjKPLbf9uH2u1YMkqb48LeSwCxV/Ho78uVfYw8W8VY8TtW0dPud8B1l2H/Wb8k09VZTee6yn1rvpqv0VsYfOLA8xv65dTXfrf/ht55ubdrRT3TDRu+9o79UjRQytb2h9Q+sbWt/Q+obWN7S+ofUNrW9ofUPrG9of1mNxa0/7jnb/dPNfP6qhIUxWHUC8VtrDxM08ofXYvBFi0x+AXeq4z8mxg8GzCqs5aDUWaSXY02lFQS8i7YtEqzqX8rdzFHGbibQziXYk0o4k2p1Iu5Fo1yKt6EyQ5rTgVoMNrxLtq0grWac0a9Sp9JuQZvv5aJj2KWip/t/gyWh/l6b96L8f5n8DCjxWUZCmHEIAAAAASUVORK5CYII='

const CustomNode = <Node extends InputNode>({
    node,
    animated: animatedProps,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
}: NodeProps<Node>) => {

        const [ imageUrl, setImageUrl ] = useState<string>(clientSvg);
        const size : number = node.data.size || animatedProps.size.get()
        const { setSelectedHost, setActiveTab , selectedHost , activeTab } = useSideBarStore()

        const handleClick = () => {
            setSelectedHost(node.data.id)
            setActiveTab(SidBarTabsEnum.HostOverView)
        }

        const [isSelected , setIsSelected ] = useState<boolean>(false);
        const [isProblem , setIsProblem] = useState<boolean>(false) ;
        
        useEffect(() => {
            setIsSelected(selectedHost === node.data.id)
        },[selectedHost , node.data.id])

        useEffect(() =>{
            setIsProblem(node.data.ipv4=== "0.0.0.0")
        },[node]);

        useEffect(() => {
            if(node.data.id === '00:00:00:00:00:01'){
                console.log('the wanted host ' , node.data)
            }
            if(node.data.type === 'server'){
                setImageUrl(serverSvg);
            }
            if(node.data.type === 'host'){
                setImageUrl(clientSvg);
            }
        },[node]);
        
        return (
            <>
            {isSelected && activeTab ===  SidBarTabsEnum.HostOverView && 
                <animated.circle
                    r={size * 0.75 }
                    transform={to(
                        [animatedProps.x, animatedProps.y],
                        (x, y, scale) => {
                          return `translate(${x   },${y}) scale(${1})`
                        }
                      )}
                      onMouseEnter={
                        undefined
                      }
                      strokeWidth={3}
                      stroke="red"
                      fill="none"
                />
            }
                <animated.image
                    data-testid={`node.${node.id}`}
                    x={animatedProps.x.get() - size / 2 }
                    y={animatedProps.y.get() - size / 2  }
                    height={size}
                    width={size}
                    onClick={handleClick}
                    onMouseEnter={
                        onMouseEnter ? event => onMouseEnter(node, event) : undefined
                    }
                    onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
                    onMouseLeave={onMouseLeave ? event => onMouseLeave(node, event) : undefined}
                    href={imageUrl}
                />
                
                {
                    isProblem && <TriangleIcon x={Number(animatedProps.x.get()) + size / 3 } y={animatedProps.y.get() - size  } />
                }
            </>

            
        )
    
}

export default memo(CustomNode) as typeof CustomNode