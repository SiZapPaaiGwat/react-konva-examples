export function integerify({ x, y }) {
  return { x, y }
}

export function isOnLine(x, y, endx, endy, px, py) {
  return (px - x) * (px - endx) <= 0 && (py - y) * (py - endy) <= 0
}

export function getRelativePointerPosition(node) {
  const transform = node.getAbsoluteTransform().copy()
  transform.invert()
  const pos = node.getStage().getPointerPosition()
  return transform.point(pos)
}

export function findPointPosition(point, points) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i]
    const end = points[i + 1]
    const dis = distance(point.x, point.y, start.x, start.y, end.x, end.y)
    if (dis < 5) {
      return i + 1
    }
  }

  return -1
}

/**
 * 找到点与线段垂直相交的点
 */
export function findNearest(a, b, p) {
  var atob = { x: b.x - a.x, y: b.y - a.y }
  var atop = { x: p.x - a.x, y: p.y - a.y }
  var len = atob.x * atob.x + atob.y * atob.y
  var dot = atop.x * atob.x + atop.y * atob.y
  var t = Math.min(1, Math.max(0, dot / len))
  dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
  return { x: a.x + atob.x * t, y: a.y + atob.y * t }
}

/**
 * 计算点与线段之间的距离
 */
export function distance(x, y, x1, y1, x2, y2) {
  var A = x - x1
  var B = y - y1
  var C = x2 - x1
  var D = y2 - y1

  var dot = A * C + B * D
  var len_sq = C * C + D * D
  var param = -1
  //in case of 0 length line
  if (len_sq !== 0) param = dot / len_sq

  var xx, yy

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

  var dx = x - xx
  var dy = y - yy
  return Math.sqrt(dx * dx + dy * dy)
}

export function distanceOfPoints(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}
