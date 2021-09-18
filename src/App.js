import React from 'react'
import {
  Stage,
  Layer,
  Line,
  Circle,
  Group,
  Rect,
  Transformer
} from 'react-konva'
import useStore from './store'
import Image from './Image'
import {
  getRelativePointerPosition,
  findPointPosition,
  findNearest,
  distanceOfPoints
} from './utils'

import './styles.css'

const IMAGE_URL =
  'https://www.bing.com/th?id=OHR.BirnbeckPier_ZH-CN0177628993_1920x1080.jpg&rf=LaDigue_1920x1080.jpg'
const RADIUS_NORMAL = 3
const RADIUS_BIG = 6
const HOVER_GAP = RADIUS_BIG + RADIUS_NORMAL

export default function App() {
  const points = useStore((s) => s.points)
  const setPoints = useStore((s) => s.setPoints)
  const dragIndex = useStore((s) => s.dragIndex)
  const setDragIndex = useStore((s) => s.setDragIndex)
  const hoverIndex = useStore((s) => s.hoverIndex)
  const setHoverIndex = useStore((s) => s.setHoverIndex)
  const floatPoint = useStore((s) => s.floatPoint)
  const setFloatPoint = useStore((s) => s.setFloatPoint)
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)
  const scale = useStore((s) => s.scale)
  const rects = useStore((s) => s.rects)
  const setRectangles = useStore((s) => s.setRectangles)

  const handleClick = (e) => {
    const point = getRelativePointerPosition(e.target.getStage())
    console.log(point)
    setPoints(points.concat(point))
    // TODO setHoverIndex
  }
  const disableBubble = (e) => {
    e.cancelBubble = true
  }
  /**
   * 避免直接使用 Line 的 mouse 相关事件
   * 鼠标移动的时候会有一个距离误差，导致频繁出发 mousemove / mouseleave
   */
  const updateFloatPoint = (e) => {
    const point = getRelativePointerPosition(e.target.getStage())
    const index = findPointPosition(point, points)
    if (index === -1) {
      console.log('Can not find index')
      setHoverIndex(-1)
      setFloatPoint(null)
      return
    }

    const prev = points[index - 1]
    const next = points[index]
    const pos = findNearest(prev, next, point)
    const dis1 = distanceOfPoints(prev.x, prev.y, pos.x, pos.y)
    if (dis1 < HOVER_GAP) {
      setHoverIndex(index - 1)
      setFloatPoint(null)
      return
    }

    const dis2 = distanceOfPoints(next.x, next.y, pos.x, pos.y)
    if (dis2 < HOVER_GAP) {
      setHoverIndex(index)
      setFloatPoint(null)
      return
    }

    setHoverIndex(-1)
    setFloatPoint(pos)
  }
  /**
   * 离开 Line 和 Circle 时清除状态
   */
  const clearLayerStatus = (e) => {
    setDragIndex(-1)
    setHoverIndex(-1)
    setFloatPoint(null)
  }

  const hanleDragMove = (e) => {
    if (e.target.className !== 'Circle') {
      console.log('Not circle')
      return
    }

    const newPos = e.target.position()
    points.splice(dragIndex, 1, {
      x: newPos.x,
      y: newPos.y
    })
    setPoints([...points])
  }

  return (
    <div className="App">
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        onClick={handleClick}
      >
        <Layer>
          <Image url={IMAGE_URL} />
          <Group
            onMouseMove={updateFloatPoint}
            onDragMove={hanleDragMove}
            onMouseLeave={clearLayerStatus}
          >
            <Line
              points={points.flatMap((point) => [point.x, point.y])}
              name="region"
              stroke="red"
              strokeWidth={2 / scale}
              hitStrokeWidth={8 / scale}
              lineCap="round"
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
                onDragStart={(e) => setDragIndex(index)}
                onDragEnd={(e) => setDragIndex(-1)}
                onClick={disableBubble}
                fill="#fff"
                stroke="red"
                strokeWidth={2 / scale}
              />
            ))}
            <Circle
              key="float"
              x={floatPoint ? floatPoint.x : 0}
              y={floatPoint ? floatPoint.y : 0}
              radius={RADIUS_BIG / scale}
              opacity={floatPoint ? 1 : 0}
              onClick={disableBubble}
              fill="#fff"
              stroke="red"
              strokeWidth={2 / scale}
            />
          </Group>
          <Group>
            <Transformer>
              {rects.map((rect, index) => {
                return (
                  <Rect
                    key={index}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill="green"
                    stroke="black"
                    draggable
                    strokeWidth={2 / scale}
                  />
                )
              })}
            </Transformer>
          </Group>
        </Layer>
      </Stage>
    </div>
  )
}
