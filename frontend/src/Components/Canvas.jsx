import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Arrow,
  Line,
  Text,
  Transformer,
} from "react-konva";
import { CANVASACTIONS } from "../Actions";
import { RiCursorFill } from "react-icons/ri";
import { MdOutlineRectangle } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { CiText } from "react-icons/ci";
import { FaArrowRight, FaRegCircle } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";

function Canvas({
  socketRef,
  roomId,
  actionPerformed,
  newRectangles,
  newCircles,
  newArrows,
  newScribbles,
  newTexts,
  newLayerContent,
  shapeId,
}) {
  const canvasRef = useRef(null);
  const layerRef = useRef(null);
  const rectRef = useRef(null);
  const isDrawing = useRef(null);
  const currentShapeId = useRef(null);
  const eraseShapeId = useRef(null);
  const transformerRef = useRef(null);
  const [action, setAction] = useState(CANVASACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [canvasText, setCanvasText] = useState("");
  const [cursorType, setCursorType] = useState("cursor-default");

  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [texts, setTexts] = useState([]);

  const isDraggable = action === CANVASACTIONS.SELECT;

  useEffect(() => {
    switch (actionPerformed) {
      case CANVASACTIONS.RECTANGLE:
        setRectangles(newRectangles);
        break;
      case CANVASACTIONS.CIRCLE:
        setCircles(newCircles);
        break;
      case CANVASACTIONS.ARROW:
        setArrows(newArrows);
        break;
      case CANVASACTIONS.SCRIBBLE:
        setScribbles(newScribbles);
        break;
      case CANVASACTIONS.TEXT:
        setTexts(newTexts);
        break;
      case CANVASACTIONS.ERASE:
        layerRef.current.children.forEach((element) => {
          if (element._id === shapeId) {
            element.destroy();
          }
        });
    }
  }, [newRectangles, newCircles, newArrows, newScribbles, newTexts, shapeId]);

  function handlePointerDown() {
    if (action === CANVASACTIONS.SELECT) return;

    const canvas = canvasRef.current;
    const { x, y } = canvas.getPointerPosition();
    const id = uuid();
    currentShapeId.current = id;
    isDrawing.current = true;
    switch (action) {
      case CANVASACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            width: 20,
            height: 20,
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case CANVASACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case CANVASACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case CANVASACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
          },
        ]);
        break;
      case CANVASACTIONS.TEXT:
        canvasText.length > 0 &&
          setTexts((texts) => [
            ...texts,
            {
              id,
              x,
              y,
              text: canvasText,
              strokeColor,
            },
          ]);
        break;
    }
  }
  function handlePointerMove() {
    if (action === CANVASACTIONS.SELECT || !isDrawing.current) return;

    const canvas = canvasRef.current;
    const { x, y } = canvas.getPointerPosition();

    switch (action) {
      case CANVASACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: Math.abs(x - rectangle.x),
                height: Math.abs(y - rectangle.y),
              };
            }
            return rectangle;
          })
        );
        break;
      case CANVASACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case CANVASACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;

      case CANVASACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
    }
  }
  function handlePointerUp() {
    isDrawing.current = false;
    switch (action) {
      case CANVASACTIONS.RECTANGLE:
        socketRef.current.emit(CANVASACTIONS.RECTANGLE, {
          rectangles,
          roomId,
          action: CANVASACTIONS.RECTANGLE,
        });
        break;
      case CANVASACTIONS.CIRCLE:
        socketRef.current.emit(CANVASACTIONS.CIRCLE, {
          circles,
          roomId,
          action: CANVASACTIONS.CIRCLE,
        });
        break;
      case CANVASACTIONS.ARROW:
        socketRef.current.emit(CANVASACTIONS.ARROW, {
          arrows,
          roomId,
          action: CANVASACTIONS.ARROW,
        });
        break;
      case CANVASACTIONS.SCRIBBLE:
        socketRef.current.emit(CANVASACTIONS.SCRIBBLE, {
          scribbles,
          roomId,
          action: CANVASACTIONS.SCRIBBLE,
        });
        break;
      case CANVASACTIONS.TEXT:
        socketRef.current.emit(CANVASACTIONS.TEXT, {
          texts,
          roomId,
          action: CANVASACTIONS.TEXT,
        });
        break;
    }
  }

  function exportCanvasData() {
    const uri = canvasRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleShapeClick(e) {
    const layer = layerRef.current;
    if (action === CANVASACTIONS.SELECT) {
      const target = e.currentTarget;
      transformerRef.current.nodes([target]);
    }

    if (action === CANVASACTIONS.ERASE) {
      const clickedShape = e.target;
      clickedShape.destroy();
      socketRef.current.emit(CANVASACTIONS.ERASE, {
        layerContent: layer,
        shapeId: e.target._id,
        roomId,
        action: CANVASACTIONS.ERASE,
      });
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-0 z-10 w-full py-2 ">
        <div className="flex flex-col items-center justify-center gap-4 px-3 py-2 mx-auto border rounded-lg shadow-lg w-fit ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setCursorType("cursor-default");
                setAction(CANVASACTIONS.SELECT);
              }}
              className={
                action === CANVASACTIONS.SELECT
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <RiCursorFill className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-crosshair");
                setAction(CANVASACTIONS.RECTANGLE);
              }}
              className={
                action === CANVASACTIONS.RECTANGLE
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <MdOutlineRectangle className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-crosshair");
                setAction(CANVASACTIONS.CIRCLE);
              }}
              className={
                action === CANVASACTIONS.CIRCLE
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <FaRegCircle className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-crosshair");
                setAction(CANVASACTIONS.ARROW);
              }}
              className={
                action === CANVASACTIONS.ARROW
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <FaArrowRight className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-crosshair");
                setAction(CANVASACTIONS.SCRIBBLE);
              }}
              className={
                action === CANVASACTIONS.SCRIBBLE
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <GoPencil className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-text");
                setAction(CANVASACTIONS.TEXT);
              }}
              className={
                action === CANVASACTIONS.TEXT
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <CiText className="text-2xl" />
            </button>
            <button
              onClick={() => {
                setCursorType("cursor-cell");
                setAction(CANVASACTIONS.ERASE);
              }}
              className={
                action === CANVASACTIONS.ERASE
                  ? "bg-primary p-1 rounded"
                  : "p-1 hover:bg-secondary rounded"
              }
            >
              <LuEraser className="text-2xl" />
            </button>
            <button className="p-1 rounded hover:bg-secondary ">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-5 h-5 cursor-pointer"
                title="Stroke Color "
              />
            </button>
            <button
              onClick={exportCanvasData}
              className="rounded hover:bg-secondary"
            >
              <MdOutlineFileDownload className="text-[28px]" />
            </button>
          </div>
          {action === CANVASACTIONS.TEXT && (
            <input
              className="w-full p-2 bg-transparent border rounded-l outline-0 "
              type="text"
              value={canvasText}
              onChange={(e) => setCanvasText(e.target.value)}
              placeholder="Text you want to place on the Canvas."
            />
          )}
        </div>
      </div>
      <Stage
        className={`${cursorType} `}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer ref={layerRef}>
          <Rect
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight}
            fill="#1e1e1e"
            onClick={() => {
              transformerRef.current.nodes([]);
            }}
          />

          {rectangles.map((rectangle) => (
            <Rect
              key={rectangle.id}
              x={rectangle.x}
              y={rectangle.y}
              stroke={rectangle.strokeColor}
              strokeWidth={4}
              cornerRadius={10}
              fill={rectangle.fillColor}
              width={rectangle.width}
              height={rectangle.height}
              draggable={isDraggable}
              useRef={rectRef}
              onMouseEnter={(e) => {
                eraseShapeId.current = e.target._id;
                if (isDraggable) {
                  setCursorType("cursor-move");
                }
              }}
              onClick={handleShapeClick}
            />
          ))}
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              radius={circle.radius}
              x={circle.x}
              y={circle.y}
              stroke={circle.strokeColor}
              strokeWidth={4}
              fill={circle.fill}
              draggable={isDraggable}
              onMouseEnter={() => {
                if (isDraggable) {
                  setCursorType("cursor-move");
                }
              }}
              onClick={handleShapeClick}
            />
          ))}
          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              stroke={strokeColor}
              strokeWidth={4}
              fill={arrow.fillColor}
              draggable={isDraggable}
              onMouseEnter={() => {
                if (isDraggable) {
                  setCursorType("cursor-move");
                }
              }}
              onClick={handleShapeClick}
            />
          ))}
          {scribbles.map((scribble) => (
            <Line
              key={scribble.id}
              lineCap="round"
              lineJoin="round"
              points={scribble.points}
              stroke={strokeColor}
              strokeWidth={8}
              fill={scribble.fillColor}
              draggable={isDraggable}
              onMouseEnter={() => {
                if (isDraggable) {
                  setCursorType("cursor-move");
                }
              }}
              onClick={handleShapeClick}
            />
          ))}

          {texts.map((text) => (
            <Text
              key={text.id}
              text={text.text}
              x={text.x}
              y={text.y}
              fontSize={25}
              strokeWidth={4}
              fill={text.strokeColor}
              draggable={isDraggable}
              onMouseEnter={() => {
                if (isDraggable) {
                  setCursorType("cursor-move");
                }
              }}
              onClick={handleShapeClick}
            />
          ))}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;
