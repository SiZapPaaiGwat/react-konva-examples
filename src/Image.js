import React, { useEffect } from 'react'
import { Image, Group } from 'react-konva'
import useImage from 'use-image'
import useStore from './store'

export default (props) => {
  const { url } = props
  const [image] = useImage(url, 'Anonymous')
  const setScale = useStore((s) => s.setScale)
  const setMetrics = useStore((s) => s.setMetrics)
  const setImageSize = useStore((s) => s.setImageSize)
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)

  useEffect(() => {
    if (!image) {
      return
    }

    const scale = Math.min(width / image.width, height / image.height)
    const ratio = image.width / image.height
    setScale(scale)
    setImageSize({ width: image.width, height: image.height })
    setMetrics({
      width: width,
      height: width / ratio
    })
  }, [image, width, height, setScale, setMetrics, setImageSize])

  return (
    <Group>
      <Image image={image} />
    </Group>
  )
}
