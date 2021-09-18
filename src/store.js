import create from 'zustand'

const [useStore] = create((set) => ({
  // 点击之后产生的点，可以移动改变位置，由这些点组成 Circle 和 Line
  points: [],
  setPoints: (points) => set({ points }),

  // 鼠标悬浮之后的移动指示点 { x, y}
  floatPoint: null,
  setFloatPoint: (floatPoint) => set({ floatPoint }),

  // points 中拖拽点索引，用于改变位置
  dragIndex: -1,
  setDragIndex: (dragIndex) => set({ dragIndex }),

  // points 中悬浮点索引，用于做一个吸附效果
  hoverIndex: -1,
  setHoverIndex: (hoverIndex) => set({ hoverIndex }),

  scale: 1,
  setScale: (scale) => set({ scale }),

  imageWidth: 1920,
  imageHeight: 1080,
  setImageSize: ({ imageWidth, imageHeight }) =>
    set({ imageWidth, imageHeight }),

  /**
   * stage metrics
   */
  width: 800,
  height: 600,
  setMetrics: ({ width, height }) => set({ width, height }),

  /**
   * Editor mode type
   * Line / Rect / Polygon
   */
  shapeType: 'Line',
  setShapeType: (shapeType) => set({ shapeType }),

  rects: [
    { x: 10, y: 10, width: 100, height: 100, fill: 'red' },
    { x: 200, y: 200, width: 100, height: 100, fill: 'green' },
    { x: 400, y: 400, width: 100, height: 100, fill: 'blue' }
  ],
  setRectangles: (rects) => set({ rects }),
  selectedRectIndex: -1,
  setSelectedRectIndex: (selectedRectIndex) => set({ selectedRectIndex })
}))

export default useStore
