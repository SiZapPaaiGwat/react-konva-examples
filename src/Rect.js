import React from 'react'
import { Rect, Transformer } from 'react-konva'

const MIN_SIZE = 5

export default ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef()
  const trRef = React.useRef()

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          })
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(MIN_SIZE, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorSize={5}
          borderStroke="#ddd"
          borderDash={[3, 3]}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < MIN_SIZE || newBox.height < MIN_SIZE) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </React.Fragment>
  )
}
