import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [text, setText] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [career, setCareer] = useState('');
  const [topic, setTopic] = useState('');
  const imageRef = useRef(null);

  const handleExportImage = () => {
    const element = imageRef.current;
  
    // Get the current scroll position of the element
    const scrollY = element.scrollTop;
    const scrollX = element.scrollLeft;
  
    // Scroll the element to the top-left corner
    element.scrollTo(0, 0);
  
    // Calculate the number of sections to capture based on the height of the element
    const numSections = Math.ceil(element.scrollHeight / 1189);
  
    // Capture each section of the element and stitch them together
    Promise.all(
      Array.from({ length: numSections }, (_, i) =>
        html2canvas(element, {
          scrollY: i * 1189,
          scrollX,
          height: 1189,
        })
      )
    ).then((canvasArray) => {
      const totalHeight = numSections * 1189;
      const canvas = document.createElement('canvas');
      canvas.width = canvasArray[0].width;
      canvas.height = totalHeight;
      const context = canvas.getContext('2d');
      canvasArray.forEach((sectionCanvas, i) => {
        context.drawImage(sectionCanvas, 0, i * 1189);
      });
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  
  

  return (
    <div className="container">
      <div className="column">
        <h2>Input Text</h2>
        <p>標題內容</p>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <p>講者名稱</p>
        <input type="text" value={speakerName} onChange={(e) => setSpeakerName(e.target.value)} />
        <p>講者職銜</p>
        <input type="text" value={career} onChange={(e) => setCareer(e.target.value)} />
        <p>演講內容</p>
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} />
        <br />
        <button className="export" onClick={handleExportImage}>Export Image</button>
      </div>
      <div className="column">
        <h2>Preview</h2>
        <div className="image-container" ref={imageRef}>
          <img src="background.png" alt="background" />
          <div className="text title" style={{ fontFamily: "'Taipei Sans TC Beta', sans-serif", fontSize: "30px", fontWeight: "bold", color: "#000", textAlign: "center" }}>{text}</div>
          <div className="text speaker_name">{speakerName}</div>
          <div className="text career">{career}</div>
          <div className="text topic">{topic}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
