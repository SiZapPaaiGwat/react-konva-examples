import React from 'react'
import { Stage, Layer } from 'react-konva'
import useStore from './store'
import Image from './Image'
import RectList from './RectList'
import LineList from './LineList'
import { getRelativePointerPosition } from './utils'

import './styles.css'

const IMAGE_URL =
  'https://www.bing.com/th?id=OHR.BirnbeckPier_ZH-CN0177628993_1920x1080.jpg&rf=LaDigue_1920x1080.jpg'

export default function App() {
  const points = useStore((s) => s.points)
  const setPoints = useStore((s) => s.setPoints)
  const setHoverIndex = useStore((s) => s.setHoverIndex)
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)
  const scale = useStore((s) => s.scale)
  const shapeType = useStore((s) => s.shapeType)
  const isLineEnabled = shapeType === 'Line'
  const isRectEnabled = shapeType === 'Rect'
  const creatPoint = (e) => {
    const point = getRelativePointerPosition(e.target.getStage())
    setHoverIndex(points.length)
    setPoints(points.concat(point))
  }

  return (
    <div className="App">
      <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
        <Layer onClick={creatPoint} listening={isLineEnabled}>
          <Image url={IMAGE_URL} />
        </Layer>

        <Layer>
          <LineList listening={isLineEnabled} />
          <RectList listening={isRectEnabled} />
        </Layer>
      </Stage>
    </div>
  )
}
