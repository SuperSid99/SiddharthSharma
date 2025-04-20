"use client";

import { useState, useEffect } from "react";

import {decryptImage} from"./decrypt";

import ImageViewer from "./image_viewer";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;


function TypingAnimation() {
  const [text, setText] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94)); // ASCII 33-126
      setText(prev => (prev.length > 40 ? randomChar : prev + randomChar));
    }, 50);
  
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center">

    <div className="mt-4 text-White-500 font-mono text-sm h-6">
      <h3 className="font-semibold">
       Retrieving Data:
      </h3>
    </div>
    <div className="mt-4 text-green-500 font-mono text-sm h-6">
      <h3 className="font-semibold">{text}</h3>
    </div>
    </div>
  );
}


export default function RetrieveDecrypt() {
  const [hash, setHash] = useState("");
  const [key, setKey] = useState("");
  const [imageData, setImageData] = useState<number[][][] | null>(null);
  const [error, setError] = useState("");
  
  const [loading, setLoading] = useState(false);
  
  const handleRetrieve = async () => {
    setError("");
    try {

      setLoading(true)
      const response = await fetch(`${apiUrl}/retrieve/${hash}`);
      const data = await response.json();

      console.log(data)
      
      if(data=="no results found"){

        setLoading(false); // ✅ Stop loading animation
        setError("Wrong hash");
        return
      }

      if (data.error) {

        setLoading(false); // ✅ Stop loading animation
        setError(data.error);
        return;
      }
      
      setError("");
      const check_key= decryptImage(data,key)
      
      if (typeof(check_key)== "string"){
        
        console.log("wrong key")

        setLoading(false); // ✅ Stop loading animation
        setImageData([[[]]])
        setError("wrong key");
      }
      else{
        setLoading(false); // ✅ Stop loading animation
        setImageData(check_key)
      }


    } catch (error) {
      setError(`Error fetching image data. : ${error}`);
      // setEncryptedData(null);
    }  finally {
      setLoading(false); // ✅ Stop loading animation
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700 max-w-xl mx-auto mt-12">
  <h2 className="text-2xl font-bold text-cyan-400 text-center">
    🔍 Retrieve Encrypted Image
  </h2>

  {/* Hash Input */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Hash</label>
    <input
      type="text"
      placeholder="Enter hash"
      value={hash}
      onChange={(e) => setHash(e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  </div>

  {/* Key Input */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Decryption Key</label>
    <input
      type="text"
      placeholder="Enter key"
      value={key}
      onChange={(e) => setKey(e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  </div>

  {/* Retrieve Button */}
  <button
    onClick={handleRetrieve}
    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
  >
    🔓 Retrieve
  </button>

  {/* Error Message */}
  {error && (
    <p className="text-red-500 font-medium text-center">{error}</p>
  )}

  {/* Loading Animation */}
  {loading && <TypingAnimation />}

  {/* Image Viewer */}
  {!loading && imageData !== null && (
    <div className="mt-4 border border-gray-700 rounded-lg p-4 bg-gray-800">
      <ImageViewer pixelData={imageData} />
    </div>
  )}
</div>
  );
}
