import create from 'zustand'
import produce from 'immer'
import {
  calcNearestIndexToPolyline,
  calcNearestPointOnLine,
  calcDistanceToPoint
} from './utils'

const useStore = create(set => ({
  /**
   * In line mode, a click will generate a point
   * multiple clicks will generate a polyline
   * A stage includes mutiple polylines
   */
  points: [],
  // Add a new point out of polyline is simple
  createTailPoint: point =>
    set(
      produce(draft => {
        draft.hoverIndex = draft.points.length
        draft.points.push(point)
      })
    ),
  // Add a new point on the polyline need more calculation
  createBodyPoint: (point, tolerance) =>
    set(
      produce(draft => {
        const index = calcNearestIndexToPolyline(point, draft.points, tolerance)
        if (index <= 0 || index > draft.points.length - 1) {
          console.log('Out of polyline')
          return
        }

        const prev = draft.points[index - 1]
        const next = draft.points[index]
        const pos = calcNearestPointOnLine(prev, next, point)

        draft.hoverIndex = index
        draft.points[index] = pos
      })
    ),
  setPoints: points =>
    set(
      produce(draft => {
        draft.points = points
      })
    ),
  replacePoint: (point, index) =>
    set(
      produce(draft => {
        draft.points[index] = point
      })
    ),

  /**
   * Hover on polyline will create a new point
   * This float point will move accoirding to pointer position
   */
  floatPoint: null,
  /**
   * the index when hover on polyline's point
   * the float point will disappear
   */
  hoverIndex: -1,
  setFloatPoint: (point, tolerance, floatTolerance) =>
    set(
      produce(draft => {
        const index = calcNearestIndexToPolyline(point, draft.points, tolerance)
        if (index === -1) {
          console.log('Out of polyline')
          return
        }

        const prev = draft.points[index - 1]
        const next = draft.points[index]
        const pos = calcNearestPointOnLine(prev, next, point)
        const dis1 = calcDistanceToPoint(prev.x, prev.y, pos.x, pos.y)
        if (dis1 < floatTolerance) {
          draft.hoverIndex = index - 1
          draft.floatPoint = null
          return
        }

        const dis2 = calcDistanceToPoint(next.x, next.y, pos.x, pos.y)
        if (dis2 < floatTolerance) {
          draft.hoverIndex = index
          draft.floatPoint = null
          return
        }

        draft.hoverIndex = -1
        draft.floatPoint = pos
      })
    ),

  /**
   * polyline's point is draggable
   */
  dragIndex: -1,
  setDragIndex: dragIndex =>
    set(
      produce(draft => {
        draft.dragIndex = dragIndex
      })
    ),

  clearIndex: () =>
    set(
      produce(draft => {
        draft.hoverIndex = -1
        draft.dragIndex = -1
        draft.floatPoint = null
      })
    ),

  /**
   * the scale value to fit the entire image
   * many number values in components depend on this
   */
  scale: 1,
  setScale: scale =>
    set(
      produce(draft => {
        draft.scale = scale
      })
    ),

  imageWidth: 1920,
  imageHeight: 1080,
  setImageSize: ({ imageWidth, imageHeight }) =>
    set(
      produce(draft => {
        draft.imageWidth = imageWidth
        draft.imageHeight = imageHeight
      })
    ),

  /**
   * stage metrics
   */
  width: 800,
  height: 600,
  setMetrics: ({ width, height }) =>
    set(
      produce(draft => {
        draft.width = width
        draft.height = height
      })
    ),

  /**
   * Editor mode type
   * Line / Rect / Polygon
   */
  shapeType: 'Line',
  setShapeType: shapeType =>
    set(
      produce(draft => {
        draft.shapeType = shapeType
      })
    ),

  rects: [
    { x: 10, y: 10, width: 100, height: 100, fill: 'red' },
    { x: 200, y: 200, width: 100, height: 100, fill: 'green' },
    { x: 400, y: 400, width: 100, height: 100, fill: 'blue' }
  ],
  setRectangles: rects =>
    set(
      produce(draft => {
        draft.rects = rects
      })
    ),
  selectedRectIndex: -1,
  setSelectedRectIndex: selectedRectIndex =>
    set(
      produce(draft => {
        draft.selectedRectIndex = selectedRectIndex
      })
    )
}))

export default useStore
