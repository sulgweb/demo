class Queue {
  _queue = [];
  constructor() {
    this._queue = [];
  }

  push(value) {
    this._queue.push(value);
  }

  shift() {
    return this._queue.shift();
  }

  getQueue() {
    return this._queue;
  }
}

class DelayedTask {
  resolve = null;
  fn = null;
  args = null;
  constructor(resolve, fn, args) {
    this.resolve = resolve;
    this.fn = fn;
    this.args = args;
  }
}

export default class TaskPool {
  size = null;
  queue = null;
  constructor(size) {
    this.size = size;
    this.queue = new Queue();
  }

  addTask(fn, args) {
    return new Promise((resolve) => {
      this.queue.push(new DelayedTask(resolve, fn, args));
      if (this.size) {
        this.size--;
        const { resolve: taskResolue, fn, args } = this.queue.shift();
        taskResolue(this.runTask(fn, args));
      }
    });
  }

  runTask(fn, args) {
    const res = Promise.resolve(fn(...args));
    res
      .then(() => {
        this.size--;
        this.pullTask();
      })
      .catch(() => {
        this.size--;
        this.pullTask();
      });
  }

  pullTask() {
    if (!this.queue.getQueue().length || this.size == 0) {
      return;
    }
    this.size++;
    const { resolve, fn, args } = this.queue.shift();
    resolve(this.runTask(fn, args));
  }
}
