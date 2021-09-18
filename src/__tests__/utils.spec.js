import * as utils from '../utils'

it('calc distance of two points', () => {
  expect(utils.calcDistanceToPoint(1, 1, 10, 1)).toEqual(9)
  expect(utils.calcDistanceToPoint(1, 1, 1, 10)).toEqual(9)
})
