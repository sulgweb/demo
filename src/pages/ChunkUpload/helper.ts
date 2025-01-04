import SparkMD5 from 'spark-md5';
export const CHUNK_SIZE = 10 * 1024 * 1024; // 分片大小，10MB

const upload = async (data: FormData) => {
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: data,
  });
  return res;
};

export const chunkUpload = async ({
  file,
  chunkList,
  totalChunk,
  type = 'default',
}: {
  file: File;
  chunkList: { start: number; end: number; chunkIndex: number }[];
  totalChunk: number;
  type?: 'default' | 'wasm';
}) => {
  async function handleChunk(chunkData: {
    start: number;
    end: number;
    chunkIndex: number;
  }) {
    return new Promise((resolve, reject) => {
      const { start, end, chunkIndex } = chunkData;
      const chunk: Blob = file.slice(start, end);
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('fileName', file.name);
        formData.append('totalChunks', totalChunk.toString());
        formData.append('chunkIndex', chunkIndex.toString());
        if (type === 'wasm') {
          const wasmModule = await import('@/utils/wasm/md5/md5_wasm.js');
          const md5 = wasmModule.calculate_md5(new Uint8Array(arrayBuffer)); // 计算当前分片的 MD5
          formData.append('md5', md5); // 传递 MD5
        } else {
          const md5 = SparkMD5.ArrayBuffer.hash(arrayBuffer); // 计算当前分片的 MD5
          formData.append('md5', md5); // 传递 MD5
        }
        // console.log(formData);
        // 上传逻辑
        resolve({
          formData,
          chunkIndex,
        });
      };
      reader.readAsArrayBuffer(chunk); // 读取当前分片为 ArrayBuffer
    });
  }
  return new Promise(async (resolve, reject) => {
    const pList = [];
    for (const chunkData of chunkList) {
      pList.push(handleChunk(chunkData));
    }
    const res = await Promise.all(pList);
    for (const item of res) {
      await upload(item.formData);
    }
    resolve(true);
  });
};
