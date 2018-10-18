import React, { PureComponent } from 'react';
import * as PT from 'prop-types'

const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

export default class Player3D extends PureComponent {
  constructor() {
    super()
    this.state = {
      direction: DIRECTION_LEFT,
      imagesList: [],
      frames: [],
      frameCurrent: 0,
      mouseHandling: true,
      mouseMoveStartTime: 0,
      mouseMoveStartX: 0,
      mouseX: 0,
      pauseOnClick: true,
      rotating: false,
    }
    this.timerID = null
    this.ctx = ''
    this.interval = 0
    this.preloadImages = this.preloadImages.bind(this)
    this.show = this.show.bind(this)
    this.setCanvasRect = this.setCanvasRect.bind(this)
    this.rotate = this.rotate.bind(this)
    this.setFrameNext = this.setFrameNext.bind(this)
    this.calcInterval = this.calcInterval.bind(this)
    this.rotateStop = this.rotateStop.bind(this)
    this.resizePlayer = this.resizePlayer.bind(this)
    this.mouseDownListener = this.mouseDownListener.bind(this)
    this.mousemoveListener = this.mousemoveListener.bind(this)
    this.mouseupListener = this.mouseupListener.bind(this)
    this.setRotateDirection = this.setRotateDirection.bind(this)
    this.calcMouseSpeed = this.calcMouseSpeed.bind(this)
  }

  componentDidMount() {
    const {props: {framesList, selectorStart, intervalDefault}} = this
    const frames = framesList.slice().reverse()
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d')
      this.interval =  intervalDefault
      this.setState({frames})
    }
    document.getElementById(selectorStart).addEventListener('click', this.show)
    window.addEventListener('resize', this.resizePlayer)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePlayer)
    const selectorStart = document.getElementById(this.state.selectorStart)
    if (selectorStart) {
      selectorStart.removeEventListener('click', this.show)
    }
  }

  show() {
    const {state: {imagesList}} = this
    if (!imagesList.length) {
      this.container.classList.add('loader')
      this.preloadImages()
    }
    else {
      if (this.timerID) {
        window.clearTimeout(this.timerID)
        this.setState({rotating: false})
      }
      this.setCanvasRect()
      this.rotate()
    }
  }

  rotate() {
    this.drawFrameCurrent()
    let frameCurrent = this.setFrameNext()
    this.interval = this.calcInterval()
    this.setState({frameCurrent})
    this.timerID = window.setTimeout(this.rotate, this.interval)
    this.setState({rotating: true})
  }

  drawFrameCurrent() {
    const image = this.state.imagesList[this.state.frameCurrent]
    if (image) {
      const baseHeight = image.height <= this.container.offsetHeight
        ? image.height
        : this.container.offsetHeight
      const coefficient = image.height / image.width
      const imageH = baseHeight
      const imageW = baseHeight / coefficient
      this.ctx.drawImage(image,
        (this.canvas.width / 2) - (imageW / 2),
        (this.canvas.height / 2) - (imageH / 2),
        imageW,
        imageH)
    }
  }

  setFrameNext() {
    const {state: {direction, frameCurrent, imagesList}} = this
    let frameNext

    if (direction === DIRECTION_RIGHT) {
      frameNext = frameCurrent === 0 ? imagesList.length - 1 : frameCurrent - 1
    }
    else {
      frameNext = frameCurrent === imagesList.length - 1 ? 0 : frameCurrent + 1
    }
    return frameNext
  }

  calcInterval() {
    const {props: {intervalDefault}} = this
    let intervalNext
    const coefficient = Math.round(this.interval < intervalDefault / 3 ? 5 : 10)
    intervalNext = intervalDefault > this.interval + coefficient
      ? this.interval + coefficient : intervalDefault
    return intervalNext
  }

  setCanvasRect() {
    if (this.container.offsetWidth && this.container.offsetHeight) {
      this.canvas.width = this.container.offsetWidth
      this.canvas.height = this.container.offsetHeight
    }
  }

  preloadImages() {
    if (!this.state.frames || !Array.isArray(this.state.frames)) return
    if (!this.state.frames.length) {
      this.container.classList.remove('loader')
      this.show()
      return
    }
    let imagesList = this.state.imagesList
    let frames = this.state.frames
    let img = new Image()
    imagesList.push(img)
    this.setState({imagesList})
    img.onload = () => {
      frames.pop()
      this.setState({frames})
      this.preloadImages()
    }
    img.src = frames[frames.length - 1]
  }

  rotateStop() {
    window.clearTimeout(this.timerID)
    this.setState({rotating: false})
  }

  setRotateDirection(pageX) {
    const {state: {mouseX, direction}} = this
    let directionNext
    if (pageX < mouseX) {
      directionNext = DIRECTION_LEFT
    }
    else if (pageX > mouseX) {
      directionNext = DIRECTION_RIGHT
    }
    else {
      directionNext = direction
    }
    return directionNext
  }

  calcMouseSpeed(pageX) {
    const {state: {mouseMoveStartX, mouseMoveStartTime}, props: {intervalDefault}} = this
    const mouseTravel = Math.abs(mouseMoveStartX - pageX)
    const timeNow = (new Date()).getTime()
    const timeDiff = (timeNow - mouseMoveStartTime) || 1
    let speed = Math.round((mouseTravel * 6.5 / timeDiff * 100) * 0.3)
    speed = speed > intervalDefault ? intervalDefault : speed
    speed = intervalDefault - speed
    speed = speed < 5 ? 5 : speed
    return speed
  }

  resizePlayer() {
    if (this.state.imagesList.length) {
      this.rotateStop()
      this.setCanvasRect()
      this.rotate()
    }
  }

  mouseDownListener(e) {
    const {state: {rotating, mouseHandling}} = this
    if (!rotating) {
      this.setState({pauseOnClick: false})
    }
    this.rotateStop()
    this.setState({mouseX: e.pageX, mouseMoveStartX: e.pageX, mouseMoveStartTime: (new Date()).getTime()})
    if (mouseHandling) {
      document.addEventListener('mousemove', this.mousemoveListener)
      document.addEventListener('mouseup', this.mouseupListener)
    }
  }

  mousemoveListener(e) {
    const direction = this.setRotateDirection(e.pageX)
    this.setState({direction})
    this.drawFrameCurrent()
    this.setState({frameCurrent: this.setFrameNext(), pauseOnClick: false, mouseX: e.pageX})
  }

  mouseupListener(e) {
    if (this.state.mouseHandling) {
      document.removeEventListener('mousemove', this.mousemoveListener)
      document.removeEventListener('mouseup', this.mouseupListener)
    }
    this.interval = this.calcMouseSpeed(e.pageX)
    this.setState({mouseMoveStartX: e.pageX})
    if (!this.state.pauseOnClick) {
      this.rotate()
      this.setState({pauseOnClick: true})
    }
  }

  render() {
    return (
      <div
        ref={ref => {this.container = ref}}
        onMouseDown={this.mouseDownListener}
        className='player'
      >
        <canvas ref={ref => {this.canvas = ref}} />
      </div>
    )
  }
}

Player3D.PT = {
  framesList: PT.array.isRequired,
  intervalDefault: PT.number.isRequired,
  selectorStart: PT.string.isRequired,
}