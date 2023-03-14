import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as cocoModel from '@tensorflow-models/coco-ssd'
import './App.css'

function App() {
  const [model, setModel] = useState()
  const [objectName, setObjectName] = useState("")
  const [objectConfidence, setObjectConfidence] = useState(0)

  async function loadModel () {
    try {
      // coco model by cdn
      const dataset = await cocoModel.load()
      setModel(dataset)
      console.log('Model loaded')
    } catch (error) {
      console.log('Error loading model', error)
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel()
    })
  }, [])
  
  async function predict () {
    const predictions = await model.detect(document.getElementById("webcam"))
    if (predictions.length > 0) {
      setObjectName(predictions[0].class)
      setObjectConfidence(predictions[0].score)
    }
    console.log('Predictions: ', predictions)
   
  }

  const videoCapture =  {
    width: 720,
    height: 480,
    facingMode: "environment"
  }


  console.log('Model: ', model)

  return (
    <div className="App">
      <center><h1>Deteksi Object</h1>
        <h2>{objectName ? objectName.toString() : ""}</h2>
        <h2>{objectConfidence ? objectConfidence.toString() : ""}</h2>
        <button onClick={() => predict()}>Predict</button>
        <br />
        <Webcam id="webcam" audio={false} videoConstraints={videoCapture} />
      </center>
    </div>
  )
}

export default App
