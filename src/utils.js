/**
 * 获取 Konva 画布相对坐标
 */
export function getRelativePointerPosition(node) {
  const transform = node.getAbsoluteTransform().copy()
  transform.invert()
  const pos = node.getStage().getPointerPosition()
  return transform.point(pos)
}

/**
 * 计算点在多段线数组中的索引位置
 * @param {*} point 目标点
 * @param {*} points 多段线对应的点集合
 * @param {Number} tolerance 误差范围
 */
export function calcNearestIndexToPolyline(point, points, tolerance = 5) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i]
    const end = points[i + 1]
    const dis = calcDistanceToLine(
      point.x,
      point.y,
      start.x,
      start.y,
      end.x,
      end.y
    )
    if (dis < tolerance) {
      return i + 1
    }
  }

  return -1
}

/**
 * 找到点与线段垂直相交的点
 */
export function calcNearestPointOnLine(a, b, p) {
  const atob = { x: b.x - a.x, y: b.y - a.y }
  const atop = { x: p.x - a.x, y: p.y - a.y }
  const len = atob.x * atob.x + atob.y * atob.y
  let dot = atop.x * atob.x + atop.y * atob.y
  const t = Math.min(1, Math.max(0, dot / len))
  dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
  return { x: a.x + atob.x * t, y: a.y + atob.y * t }
}

/**
 * 计算点与线段之间的距离
 */
export function calcDistanceToLine(x, y, x1, y1, x2, y2) {
  const A = x - x1
  const B = y - y1
  const C = x2 - x1
  const D = y2 - y1

  const dot = A * C + B * D
  const len_sq = C * C + D * D
  let param = -1
  //in case of 0 length line
  if (len_sq !== 0) param = dot / len_sq

  let xx, yy

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  const dx = x - xx
  const dy = y - yy
  return Math.sqrt(dx * dx + dy * dy)
}

export function calcDistanceToPoint(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}
