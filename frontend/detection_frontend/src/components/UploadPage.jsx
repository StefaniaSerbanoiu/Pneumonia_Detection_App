import React, { useState, useEffect } from 'react';
import "./StylesForUpload.css";
import Profile from './Profile';


function UploadPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [emailContent, setEmailContent] = useState(`The result of the detection is: ${result} (${new Date().toLocaleString()})`);
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false); // loading state


  const handleImageUpload = async (event) => {
    setLoading(true); // loading state set to true
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = async () => {
      setImage(reader.result); // shows the uploaded image on screen
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const result = await response.json();
          setResult(result.result); //  prediction result
          setEmailContent(`The result of the detection is: ${result.result} (${new Date().toLocaleString()})`);
        } else {
          console.error('Error!!! Failed to receive prediction response from server!');
        }
      } catch (error) {
        console.error('Error during detection operation: ', error);
      } finally {
        setLoading(false); // loading state set to false
      }
    };
  
    
    if (file) {
      reader.readAsDataURL(file);
      setEmailContent(`The result of the detection is: ${generatedResult} (${new Date().toLocaleString()})`);
    }
    
  };
  
  
  



  // export functions

  const exportToTxt = () => {
    const data = `The result of the detection is: ${result} (${new Date().toLocaleString()})`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); // download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detection_result.txt';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  };


  const exportToCsv = () => {
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const csvData = `Result,Date,Time\n${result},${date},${time}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); // download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detection_result.csv';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };




  const sendToEmail = () => {
    //  mailto opens the user's email client with predefined content
    window.location.href = `mailto:${emailAddress}?subject=Detection Result&body=${encodeURIComponent(emailContent)}`;
  };



  return (
    <div className="container">

      <div className="upload-box">
        <h1>Upload Image</h1>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div className="image-preview">
        {image && (
          <div>
            <h2>Uploaded Image:</h2>
            <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>

      <div className="result">
        {result && (
          <div>
            <h2>Result:</h2>
            <p>{result}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="email-content">
          <label htmlFor="emailContent">Email Content:</label>
          <br></br>
          <textarea id="emailContent" value={emailContent} onChange={(e) => setEmailContent(e.target.value)} />
        </div>
      )}

      {result && (
        <div className="email-address">
          <label htmlFor="emailAddress">Send to Email Address:</label>
          <br></br>
          <input type="email" id="emailAddress" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
        </div>
      )}


      {image && result && (
        <div className="buttons">
          <button type="button" className="btn btn-secondary btn-lg" onClick={exportToTxt}>Export to .txt</button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={exportToCsv}>Export to .csv</button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={sendToEmail}>Send to Email</button>
        </div>
      )}
      
    </div>
  );
}


export default UploadPage;
