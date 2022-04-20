import React from "react"

interface TriangleIconProps  {
    color? : string,
    x?: number,
    y?: number,
    children? :React.ReactNode
}

const TriangleIcon: React.FC = ({ color = "red" , x=0 , y=0} :TriangleIconProps) => {
  return (
    <svg
      width='24px'
      height='24px'
      viewBox='0 0 24 24'
      x={x}
      y={y}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='Iconly/Curved/Danger Triangle'>
        <g id='Danger Triangle'>
          <path
            id='Stroke 3'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 21C5.50558 21 2.95666 20.5387 2.54353 18.2033C2.13039 15.8679 4.77383 11.4774 5.58842 10.0285C8.31257 5.18408 10.1637 3 12 3C13.8363 3 15.6874 5.18408 18.4116 10.0285C19.2262 11.4774 21.8696 15.8679 21.4565 18.2033C21.0444 20.5387 18.4944 21 12 21Z'
            stroke={color}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            id='Stroke 3_2'
            d='M12 8.5V12.395'
            stroke='#130F26'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            id='Stroke 15'
            d='M11.9957 15.895H12.0047'
            stroke={color}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </g>
    </svg>
  )
}

export default TriangleIcon
