import { chunkUpload } from './helper';

onmessage = async function (e) {
  const {
    data: { file, chunkList, totalChunk, type },
  } = e;
  await chunkUpload({ file, chunkList, totalChunk, type });
  postMessage({
    message: 'chunkUploadDone',
  });
};
