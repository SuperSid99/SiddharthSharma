
"use client";

import React, { useState, useEffect } from "react";

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
    <div className="flex flex-row items-center">

    <div className="mt-4 text-White-500 font-mono text-sm h-6">
      <h3 className="font-semibold">
      Encrypting Data:  
      </h3>
    </div>
    <div className="mt-4 text-green-500 font-mono text-sm h-6">
      <h3 className="font-semibold">{text}</h3>
    </div>
    </div>
  );
}

export function generateKey(key: string): Record<string, string> {
    const dic: Record<string, string> = {};
    const arr: number[] = [];
    let count = 0;
    let c1 = 0;
  
    for (const char of key) {
      const num = parseInt(char);
      if (!arr.includes(num)) {
        dic[count.toString()] = char;
        arr.push(num);
        count++;
      }
    }

    const loop = 10 - Object.keys(dic).length;

    for (let i = 0; i < loop; i++) {
      let found = false;
      while (!found) {
        
        if (!arr.includes(9 - c1)) {
          dic[count.toString()] = (9 - c1).toString();
          arr.push(9 - c1);
          count++;
          c1++;
          found = true;
        } else {
          c1++;
        }
      }
    }
    return dic;
  }



function encryptImageData(imageData: number[][][], key: string): string {
    const keyDict = generateKey(key);
    let encrypted = "";
  
    const rows = imageData.length.toString();
    const cols = imageData[0].length.toString();
  
    for (const ch of rows) encrypted += keyDict[ch];
    encrypted += "-";
    for (const ch of cols) encrypted += keyDict[ch];
    encrypted += "-";
    encrypted += keyDict["3"]; // assuming RGB
    encrypted += "-";
  
    for (const row of imageData) {
      for (const col of row) {
        for (const val of col) {
          const strVal = val.toString();
          for (const ch of strVal) {
            encrypted += keyDict[ch];
          }
          encrypted += "-";
        }
      }
    }
  
    return encrypted;
  }
  

function imageToPixelArray(image: HTMLImageElement): number[][][] {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = image.width;
    canvas.height = image.height;
  
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height).data;
  
    const pixelArray: number[][][] = [];
    for (let i = 0; i < image.height; i++) {
      const row: number[][] = [];
      for (let j = 0; j < image.width; j++) {
        const idx = (i * image.width + j) * 4;
        const r = imageData[idx];
        const g = imageData[idx + 1];
        const b = imageData[idx + 2];
        row.push([r, g, b]);
      }
      pixelArray.push(row);
    }
    return pixelArray;
  }
  

const ImageEncryptor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [hash, setHash] = useState(""); // 🔹 New state for hash

  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!file || !key) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        setLoading(true)
        const pixelArray = imageToPixelArray(img);
        const encrypted = encryptImageData(pixelArray, key);
        // console.log("Encrypted Image Data:", encrypted);


        // 👉 Send to backend
        try {
          const res = await fetch(`${apiUrl}/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              encrypted_image: encrypted,
              // key: key
            }),
          });
  


          const result = await res.json();
          console.log("Server response:", result);
    
          // 🔹 Update hash state from server response
          if (typeof result === "string") {
            setHash(result);
          } else {
            console.warn("No hash in response");
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }  finally {
          setLoading(false); // ✅ Stop loading animation
        }
      };
      if (typeof reader.result === "string") img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  

  return (

    <div className="space-y-6 bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700 max-w-xl mx-auto mt-12">
  {/* File Upload */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image (Max: 1MB)</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
          alert("Image size should be less than 1MB");
          e.target.value = ""; // Reset the input
          return;
        }

        setFile(file); // Proceed to store or use the file
      }}
      className="block w-full text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  </div>

  {/* Key Input */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Encryption Key</label>
    <input
      type="text"
      placeholder="Enter key"
      value={key}
      onChange={(e) => setKey(e.target.value)}
      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  </div>

  {/* Submit Button */}
  <div>
    <button
      onClick={handleEncrypt}
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
    >
      🔐 Encrypt & Send
    </button>
  </div>

  {/* Animation or Hash */}
  <div className="mt-4">
    {loading && <TypingAnimation />}
    {!loading && hash && (
      <div className="break-words bg-gray-800 text-gray-200 p-4 rounded-lg border border-cyan-600">
        <h3 className="font-semibold text-cyan-400">
          Hash Value:
        </h3>
        <p className="mt-2 text-sm text-gray-300">{hash}</p>
      </div>
    )}
  </div>
    </div>
  );


};




export default ImageEncryptor;
