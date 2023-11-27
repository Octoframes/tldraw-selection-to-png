import {
  Tldraw,
  useEditor,
  createShapeId,
  stopEventPropagation,
  getSvgAsImage,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useState } from "react";



function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function MyComponent() {
  const [state, setState] = useState(0)

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          width: "fit-content",
          padding: 12,
          borderRadius: 8,
          backgroundColor: "goldenrod",
          zIndex: 0,
          pointerEvents: "all",
          userSelect: "unset"
        }}
        onPointerDown={stopEventPropagation}
        onPointerMove={stopEventPropagation}
      >
        The count is {state}!{" "}
        <button onClick={() => setState(s => s - 1)}>+1</button>
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 150,
          width: 128,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "pink",
          zIndex: 99999999,
          pointerEvents: "all",
          userSelect: "unset"
        }}
        onPointerDown={stopEventPropagation}
        onPointerMove={stopEventPropagation}
      >
        The count is {state}!{" "}
        <button onClick={() => setState(s => s + 1)}>+1</button>
      </div>
    </>
  )
}


const components = {
  OnTheCanvas: MyComponent,
  // InFrontOfTheCanvas: MyComponentInFront,
  SnapLine: null
}

export default function App() {
  const [snapshotData, setSnapshotData] = useState("");
  const handleMount = (editor) => {
    const id = createShapeId("hello");

    editor.createShapes([
      {
        id,
        type: "geo",
        x: 128,
        y: 128,
        props: {
          geo: "rectangle",
          w: 100,
          h: 100,
          dash: "draw",
          color: "blue",
          size: "m",
        },
      },
    ]);
  };
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* First Column */}
      <div style={{ width: 500, height: 500 }}>
        <Tldraw onMount={handleMount} components={components}>
          <SaveButton onSave={setSnapshotData} />
        </Tldraw>
      </div>

      {/* Second Column */}
      <div style={{ width: 500, height: 500, marginLeft: 20 }}>
        <textarea
          style={{ width: "100%", height: "100%" }}
          value={snapshotData}
          readOnly
        />
      </div>

      {/* Third Column with Black Border and Download Button */}
      <div
        style={{
          width: 500,
          height: 500,
          marginLeft: 20,
          border: "2px solid black",
        }}
      >
        <DownloadButton data={snapshotData} />
        <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
          <img src={snapshotData} alt="Base64" />
        </div>
      </div>
    </div>
  );
}

function SaveButton({ onSave }) {
  const editor = useEditor();

  return (
    <button
      style={{
        position: "absolute",
        zIndex: 1000,
        right: 10,
        top: 10,
        backgroundColor: "lightyellow",
      }}
      onClick={async () => {
        const svg = await editor.getSvg(editor.selectedShapeIds);
        const stringified = svg.outerHTML;
        // console.log("Export SVG!");
        const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );

        const blob = await getSvgAsImage(svg, IS_SAFARI, {
          type: "png",
          quality: 1,
          scale: 1,
        });

        const base64img = await blobToBase64(blob);

        console.log(base64img);
        console.log(stringified);

        onSave(base64img);
      }}
    >
      Export PNG
    </button>
  );
}

function DownloadButton({ data }) {
  const downloadImage = () => {
    // Create a temporary download link and trigger the download
    const link = document.createElement("a");
    link.href = data; // Base64 string as the href
    link.download = "image.png"; // Setting the file name for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadImage}
      style={{ margin: "10px", backgroundColor: "lightyellow" }}
    >
      Download Image
    </button>
  );
}
