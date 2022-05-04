// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const [objects, setObjects] = useState([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // useEffect(() => {}, [objects]);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      console.log("calling detect");
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    console.log("Detecting objects...");
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      setObjects(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    console.log("App loaded.");
    runCoco();
  }, []);

  return (
    <div className="App">
      {console.log("re rendering...")}
      <h1>Objects are: </h1>
      {objects.map((object) => {
        return <p>{object.class}</p>;
      })}
      <Webcam
        ref={webcamRef}
        muted={true}
        style={{
          position: "absolute",
          // marginLeft: "auto",
          // marginRight: "auto",
          left: 0,
          bottom: 0,
          textAlign: "center",
          zindex: 9,
          width: 300,
          height: 300,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          // marginLeft: "auto",
          // marginRight: "auto",
          left: 0,
          bottom: 0,
          textAlign: "center",
          zindex: 8,
          width: 300,
          height: 300,
        }}
      />
    </div>
  );
}

export default App;
