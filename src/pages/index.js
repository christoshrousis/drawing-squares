import React, { useState, useEffect, useCallback, useRef } from "react"
import { Link } from "gatsby"

import ReactRough, { Rectangle } from "react-rough"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

// Original Reference:
// Simple line draw example: http://jsfiddle.net/j3xDg/
// https://codetheory.in/html5-canvas-drawing-lines-with-smooth-edges/
const seed = 123456

const Result = ({ rectangles }) => {
  // if (
  //   rectangles.length == 0 ||
  //   isNaN(rectangles[0].x) ||
  //   isNaN(rectangles[0].y) ||
  //   isNaN(rectangles[0].width) ||
  //   isNaN(rectangles[0].height)
  // )
  //   return null

  console.log(rectangles)
  return (
    <ReactRough width={500} height={500}>
      {rectangles.map(rectangle => (
        <Rectangle
          key={rectangle.key}
          x={rectangle.x}
          y={rectangle.y}
          seed={seed}
          height={rectangle.height}
          fill="red"
          width={rectangle.width}
        />
      ))}
    </ReactRough>
  )
}

const DrawArea = ({ rectangles, updateRectangles }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [mouseLast, setMouseLast] = useState({
    x: 0,
    y: 0,
  })
  const [mouseDown, setMouseDown] = useState(false)

  const [rectangleStart, setRectangleStart] = useState({ x: 0, y: 0 })
  const [rectangleEnd, setRectangleEnd] = useState({ x: 0, y: 0 })
  const updateMousePosition = (e, drawZone) => {
    setMouse({
      x: e.pageX - drawZone.offsetLeft,
      y: e.pageY - drawZone.offsetTop,
      mouse: {
        pageX: e.pageX,
        pageY: e.pageY,
      },
      drawZone: {
        offset: drawZone.offsetLeft,
        offsetY: drawZone.offsetTop,
      },
    })
  }

  const triggerMouseDown = (e, drawZone) => {
    setRectangleStart({
      x: e.pageX - drawZone.offsetLeft,
      y: e.pageY - drawZone.offsetTop,
    })
  }

  const triggerMouseUp = (e, drawZone) => {
    setRectangleEnd({
      x: e.pageX - drawZone.offsetLeft,
      y: e.pageY - drawZone.offsetTop,
    })
  }

  const useHookedReferenceForDrawZone = () => {
    const ref = useRef(null)

    const setRef = useCallback(node => {
      if (ref.current) {
        // Make sure to cleanup any events/references added to the last instance
        ref.current.removeEventListener("mousemove", updateMousePosition)
        ref.current.removeEventListener("mousedown", triggerMouseDown)
      }

      if (node) {
        // Check if a node is actually passed. Otherwise node would be null.
        // You can now do what you need to, addEventListeners, measure, etc.
        node.addEventListener(
          "mousemove",
          e => updateMousePosition(e, node),
          false
        )
        node.addEventListener(
          "mousedown",
          e => triggerMouseDown(e, node),
          false
        )
        node.addEventListener("mouseup", e => triggerMouseUp(e, node), false)
      }

      // Save a reference to the node
      ref.current = node
    }, [])

    return [setRef]
  }

  const [drawZone] = useHookedReferenceForDrawZone()

  useEffect(() => {
    const mouseEndedToTop = rectangleStart.x >= rectangleEnd.x
    const mouseEndedToLeft = rectangleStart.y >= rectangleEnd.y

    const x = mouseEndedToLeft ? rectangleEnd.x : rectangleStart.x

    const y = mouseEndedToTop ? rectangleEnd.y : rectangleStart.y

    const height = mouseEndedToTop
      ? rectangleStart.y - rectangleEnd.y
      : rectangleEnd.y - rectangleStart.y

    const width = mouseEndedToLeft
      ? rectangleStart.x - rectangleEnd.x
      : rectangleEnd.x - rectangleStart.x

    updateRectangles([
      ...rectangles,
      {
        key: Math.random(),
        x,
        y,
        width,
        height,
      },
    ])
  }, [rectangleEnd])

  return (
    <>
      <div
        ref={drawZone}
        className="drawZone"
        style={{
          display: "block",
          height: "500px",
          outline: "1px solid red",
          position: "absolute",
          width: "500px",
          zIndex: 2,
        }}
      ></div>
      <table
        style={{
          height: "500px",
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "500px",
          top: "500px",
        }}
      >
        <tbody>
          <tr>
            <td>Mouse: </td>
            <td>{JSON.stringify(mouse)}</td>
          </tr>
          <tr>
            <td>MouseLast: </td>
            <td>{JSON.stringify(mouseLast)}</td>
          </tr>
          <tr>
            <td>rectangleStart: </td>
            <td>{JSON.stringify(rectangleStart)}</td>
          </tr>
          <tr>
            <td>rectangleEnd: </td>
            <td>{JSON.stringify(rectangleEnd)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
const IndexPage = () => {
  const [rectangles, setRectangles] = useState([
    { key: Math.random(), x: 15, y: 15, width: 30, height: 30 },
  ])

  return (
    <Layout>
      <SEO title="Home" />
      <DrawArea rectangles={rectangles} updateRectangles={setRectangles} />
      <div
        style={{
          height: "500px",
          outline: "2px solid blue",
          position: "absolute",
          width: "500px",
          zIndex: 1,
        }}
      >
        <Result rectangles={rectangles} />
      </div>
    </Layout>
  )
}

export default IndexPage
