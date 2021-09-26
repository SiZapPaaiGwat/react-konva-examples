import React from 'react'
import { Line, Circle, Group } from 'react-konva'
import { getRelativePointerPosition } from './utils'
import useStore from './store'

const RADIUS_NORMAL = 3
const RADIUS_BIG = 6
const HOVER_GAP = RADIUS_BIG + RADIUS_NORMAL + 1

export default props => {
  const points = useStore(s => s.points)
  const hoverIndex = useStore(s => s.hoverIndex)
  const dragIndex = useStore(s => s.dragIndex)
  const setDragIndex = useStore(s => s.setDragIndex)
  const replacePoint = useStore(s => s.replacePoint)
  const createBodyPoint = useStore(s => s.createBodyPoint)
  const setFloatPoint = useStore(s => s.setFloatPoint)
  const floatPoint = useStore(s => s.floatPoint)
  const scale = useStore(s => s.scale)
  const clearIndex = useStore(s => s.clearIndex)

  /**
   * 避免直接使用 Line 的 mouse 相关事件
   * 鼠标移动的时候会有一个距离误差，导致频繁出发 mousemove / mouseleave
   */
  const updateFloatPoint = e => {
    const point = getRelativePointerPosition(e.target.getStage())
    setFloatPoint(point, RADIUS_BIG / scale, HOVER_GAP / scale)
  }

  const hanleDragMove = e => {
    if (e.target.className !== 'Circle') {
      console.log('Not circle')
      return
    }

    const newPos = e.target.position()
    replacePoint(
      {
        x: newPos.x,
        y: newPos.y
      },
      dragIndex
    )
  }

  const createPoint = e => {
    const point = getRelativePointerPosition(e.target.getStage())
    createBodyPoint(point, RADIUS_BIG / scale)
  }

  return (
    <Group
      onMouseMove={updateFloatPoint}
      onDragMove={hanleDragMove}
      onMouseLeave={clearIndex}
      onClick={createPoint}
      {...props}
    >
      <Line
        points={points.flatMap(point => [point.x, point.y])}
        name='region'
        stroke='red'
        strokeWidth={2 / scale}
        hitStrokeWidth={8 / scale}
        lineCap='round'
      />
      {points.map((p, index) => (
        <Circle
          // key 不能随着 xy 属性变化，否则受控了移动困难
          key={index}
          x={p.x}
          y={p.y}
          radius={
            hoverIndex === index || dragIndex === index
              ? RADIUS_BIG / scale
              : RADIUS_NORMAL / scale
          }
          draggable
          onDragStart={e => setDragIndex(index)}
          onDragEnd={e => setDragIndex(-1)}
          fill='#fff'
          stroke='red'
          strokeWidth={2 / scale}
        />
      ))}
      <Circle
        key='float'
        x={floatPoint ? floatPoint.x : 0}
        y={floatPoint ? floatPoint.y : 0}
        radius={RADIUS_BIG / scale}
        opacity={floatPoint ? 1 : 0}
        fill='#fff'
        stroke='red'
        strokeWidth={2 / scale}
      />
    </Group>
  )
}
