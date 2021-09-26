import React from 'react'
import { Group } from 'react-konva'
import useStore from './store'
import Rectangle from './Rect'

export default props => {
  const rects = useStore(s => s.rects)
  const setRectangles = useStore(s => s.setRectangles)
  const selectedRectIndex = useStore(s => s.selectedRectIndex)
  const setSelectedRectIndex = useStore(s => s.setSelectedRectIndex)

  return (
    <Group onClick={e => (e.cancelBubble = true)} {...props}>
      {rects.map((rect, i) => {
        return (
          <Rectangle
            key={i}
            shapeProps={rect}
            isSelected={i === selectedRectIndex}
            onSelect={() => {
              setSelectedRectIndex(i)
            }}
            onChange={newAttrs => {
              const copy = rects.slice()
              copy[i] = newAttrs
              console.log(copy)
              setRectangles(rects)
            }}
          />
        )
      })}
    </Group>
  )
}
