/*
 * @Description:
 * @Author: xiaoyu
 * @LastEditors: xiaoyu
 * @Date: 2022-08-19 21:30:37
 * @LastEditTime: 2022-08-19 21:32:07
 */
// var tf = window.tf; // 声明tf
import * as tf from '@tensorflow/tfjs';

// 设置多个Attrbute
export function setAttributes(element, attributes) {
  Object.keys(attributes).forEach((attr) => {
    element.setAttribute(attr, attributes[attr]);
  });
}

// ------------------YOLOv5配置------------------
const weights = location.origin + '/model/blood_web_model/model.json'; // 权重文件
const cls_names = ['血条'];

// 绘制边界框和标签
async function renderPredictions(res, callback) {
  let [boxes, scores, classes, valid_detections] = res; // 获取检测信息
  const result = [];

  for (let i = 0; i < valid_detections.dataSync()[0]; ++i) {
    // 坐标点
    let [x0, y0, x1, y1] = boxes.dataSync().slice(i * 4, (i + 1) * 4);

    // ------------------修复tf.js检测结果超出正常范围的bug------------------
    x0 = x0 < 0 || x0 > 1 ? parseInt(x0) : x0;
    x1 = x1 < 0 || x1 > 1 ? parseInt(x1) : x1;
    y0 = y0 < 0 || y0 > 1 ? parseInt(y0) : y0;
    y1 = y1 < 0 || y1 > 1 ? parseInt(y1) : y1;
    const position = [x0, y0, x1, y1];

    let cls = cls_names[classes.dataSync()[i]]; // 类别
    let score = scores.dataSync()[i].toFixed(2); // 置信度
    const dataItem = { cls, score, position };
    result.push(dataItem);
  }
  callback(result);

  // ------------------清除检测结果tensor------------------
  boxes.dispose();
  scores.dispose();
  classes.dispose();
  valid_detections.dispose();
}

// 检测帧
async function detectFrame(video, model, callback) {
  // 模型输入尺寸
  let [modelWeight, modelHeight] = model.inputs[0].shape.slice(1, 3);

  // 输入, tf.tidy()防止内存溢出
  let input = tf.tidy(() =>
    tf.image
      .resizeBilinear(tf.browser.fromPixels(video), [modelWeight, modelHeight])
      .div(255.0)
      .expandDims(0),
  );

  const startTime = new Date();

  // 执行异步函数
  await model.executeAsync(input).then((res) => {
    renderPredictions(res, callback); // 画框
    // 使用requestAnimationFrame进行递归的话，则会导致过度调用识别算法导致卡顿，这里使用setTimeout。
    setTimeout(() => {
      tf.dispose(res); // 清除预测tensor
      input.dispose(); // 清除输入tensor
      // 读取下一帧
      detectFrame(video, model, callback); // 递归
    });
  });

  const endTime = new Date();
  console.log(endTime.getTime() - startTime.getTime() + 'ms');
}

const startDetectFrame = async (model, dom, callback) => {
  detectFrame(dom, model, callback);
};

const loadModel = async () => {
  return await tf.loadGraphModel(weights);
};

export { startDetectFrame, loadModel };
