// Make sure this is imported correctly
import {generateKey} from "./encrypt"; // Adjust path as necessary

export function decryptImage(imData: string, key: string): number[][][] | string {
  const imArr = imData.split("-");

  const keyDic = generateKey(key);

  // Reverse the key dictionary
  const reverseKeyDic: { [char: string]: string } = {};
  for (const k in keyDic) {
    reverseKeyDic[keyDic[k]] = k;
  }

  // Decrypt each chunk
  const decryptedArr: string[] = imArr.map(chunk => {
    return Array.from(chunk).map(ch => reverseKeyDic[ch]).join("");
  });

  const row = parseInt(decryptedArr[0]);
  const col = parseInt(decryptedArr[1]);
  const rgb = parseInt(decryptedArr[2]);

  const result: number[][][] = [];
  let idx = 3;

  if ((row*col*rgb)==((decryptedArr.length)-4)){
      for (let i = 0; i < row; i++) {
        const rowPixels: number[][] = [];
        for (let j = 0; j < col; j++) {
          const pixel: number[] = [];
          for (let k = 0; k < rgb; k++) {
            pixel.push(parseInt(decryptedArr[idx]));
            idx++;
          }
          rowPixels.push(pixel);
        }
        result.push(rowPixels);
      }
      return result;
  }

  else{
    return("Wrong Key");
  }

}
