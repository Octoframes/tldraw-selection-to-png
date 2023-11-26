import {
  Tldraw,
  useEditor,
  createShapeId,
  getSvgAsImage,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useState } from "react";


function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
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
        <Tldraw onMount={handleMount}>
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
          {snapshotData && (
            <div dangerouslySetInnerHTML={{ __html: snapshotData }} />
          )}
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
        backgroundColor: "lightblue",
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

        const dataUrl = await blobToBase64(blob)

        console.log(dataUrl);
        console.log(stringified);

        onSave(stringified);
      }}
    >
      Export SVG
    </button>
  );
}

function DownloadButton({ data }) {
  const fileName = "exported.svg";

  // Create a Blob from the SVG data
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });

  // Generate a URL for the Blob
  const url = URL.createObjectURL(svgBlob);

  return (
    <a
      href={url}
      download={fileName}
      style={{
        position: "absolute",
        zIndex: 1000,
        right: 10,
        top: 10,
        backgroundColor: "lightblue",
        padding: "5px 10px",
        textDecoration: "none",
        color: "black",
      }}
    >
      Download SVG
    </a>
  );
}
