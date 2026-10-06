export function dataUrlToFile(dataUrl: string, filename: string, mimeType: string): File {
  const parts = dataUrl.split(',');
  const b64 = parts[1] || '';
  const byteStr = atob(b64);
  const ab = new ArrayBuffer(byteStr.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteStr.length; i++) {
    ia[i] = byteStr.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}
