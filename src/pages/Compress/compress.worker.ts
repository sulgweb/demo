// compress.worker.ts

// onmessage事件
onmessage = async function (e) {
  const {
    data: { imageList },
  } = e;

  const resList = [];

  for (let img of imageList) {
    // @ts-ignore
    const offscreen: any = new OffscreenCanvas(100, 100);
    const ctx = offscreen.getContext('2d');
    const imgData = await createImageBitmap(img);
    offscreen.width = imgData.width;
    offscreen.height = imgData.height;
    ctx.drawImage(imgData, 0, 0, offscreen.width, offscreen.height);
    const res = await offscreen
      .convertToBlob({ type: 'image/jpeg', quality: 0.75 })
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      });
    resList.push(res);
  }

  self.postMessage({
    data: resList,
    name: 'worker test',
  });
  self.close();
};
