import { useEffect, useRef, useState } from "react";
// import Image from 'next/image';

interface Props {
  pixelData: number[][][]; // Your decrypted RGB data
}

export default function ImageViewer({ pixelData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgURL, setImgURL] = useState<string | null>(null);

  useEffect(() => {
    if (!pixelData || pixelData.length === 0) return;

    const height = pixelData.length;
    const width = pixelData[0].length;
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);

    let idx = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const [r, g, b] = pixelData[i][j];
        imageData.data[idx++] = r;
        imageData.data[idx++] = g;
        imageData.data[idx++] = b;
        imageData.data[idx++] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
//     setImgURL(canvas.toDataURL()); // get base64 image
//   }, [pixelData]);

//   return (
//     <div>
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//       {imgURL && <Image src={imgURL} alt="Decrypted" />}
//     </div>
//   );
// }

    // Convert to Blob and create object URL
    canvas.toBlob((blob) => {
      if (blob) {
        const objectURL = URL.createObjectURL(blob);
        setImgURL((prevURL) => {
          if (prevURL) URL.revokeObjectURL(prevURL); // clean up old URL
          return objectURL;
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (imgURL) {
        URL.revokeObjectURL(imgURL);
      }
    };
  }, [pixelData]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {imgURL && (
        <img
          src={imgURL}
          alt="Decrypted"
          // style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
}