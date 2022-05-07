/**
 * Director
 * */
// 调试开关
const DEBUG = process.env.NODE_ENV === "development";

export default class Director {
  constructor(options) {
    this.options = Object.assign(
      {
        autoPlay: false,
        loop: false,
        delay: 4000,
      },
      options || {}
    );

    this.activated = false;

    this.EventCenter = {
      change: [],
      ended: [],
    };
  }

  __Trigger(eventName, payload = []) {
    if (Array.isArray(this.EventCenter[eventName])) {
      this.EventCenter[eventName].forEach((handler) => {
        handler(...payload);
      });
    }
  }

  on(eventName, eventHandle) {
    if (Object.keys(this.EventCenter).indexOf(eventName) !== -1) {
      if (typeof eventHandle === "function") {
        const targetIndex = this.EventCenter[eventName].indexOf(eventHandle);
        if (targetIndex === -1) {
          this.EventCenter[eventName].push(eventHandle);
        }
        DEBUG &&
          console.log(`注册${eventName}监听事件${eventHandle.toString()}`);
      }
    }
  }

  off(eventName, eventHandle) {
    if (eventName) {
      if (Object.keys(this.EventCenter).indexOf(eventName) !== -1) {
        if (typeof eventHandle === "function") {
          // 取消事件的某个监听
          const targetIndex = this.EventCenter[eventName].indexOf(eventHandle);
          if (targetIndex !== -1) {
            this.EventCenter[eventName].splice(targetIndex, 1);
          }
          DEBUG && console.log(`取消${eventName}监听${eventHandle.toString()}`);
        } else {
          // 取消事件的所有监听
          this.EventCenter[eventName] = [];
          DEBUG && console.log(`取消${eventName}所有监听`);
        }
      }
    } else {
      // 清除所有事件监听
      Object.keys(this.EventCenter).forEach((event) => {
        this.EventCenter[event] = [];
        DEBUG && console.log(`清除所有事件监听`);
      });
    }
  }

  load(actions) {
    if (Array.isArray(actions)) {
      this.pause();
      this.actions = actions;
      this.stepIndex = -1;
    } else {
      console.warn(`load(): 参数格式不正确`);
    }
  }

  insert(actions) {
    if (Array.isArray(actions)) {
      if (Array.isArray(this.actions)) {
        if (this.activated) {
          this.pause(true);
        }
        this.actions.splice(this.stepIndex, 0, ...actions);
        this.play();
      } else {
        console.warn(`Director实例未初始化`);
      }
    } else {
      console.warn(`insert(): 参数格式不正确`);
    }
  }

  push(action) {
    if (Object.prototype.toString.call(action) === "[object Object]") {
      if (Array.isArray(this.actions)) {
        this.actions.push(action);
      } else {
        this.load([action]);
      }
    } else {
      console.warn(`push(): 参数格式不正确`);
    }
  }

  next() {
    this.pause();
    if (this.stepIndex < this.actions.length - 1) {
      this.stepIndex++;
    } else {
      if (this.options.loop) {
        this.stepIndex = 0;
      } else {
        DEBUG && console.warn(`没有下一条记录`);
      }
    }
    this.play();
  }

  prev() {
    this.pause();
    if (this.stepIndex > 0) {
      this.stepIndex--;
    } else {
      if (this.options.loop) {
        this.stepIndex = this.actions.length - 1;
      } else {
        DEBUG && console.warn(`没有上一条记录`);
      }
    }
    this.play();
  }

  go(targetIndex) {
    if (isNaN(parseInt(targetIndex))) {
      return null;
    }
    this.pause();
    if (targetIndex > -1 && targetIndex < this.actions.length) {
      this.stepIndex = targetIndex;
    } else {
      console.warn(`go(): targetIndex不合法`);
    }
    this.play();
  }

  play() {
    if (this.activated) {
      return console.warn(`play(): 实例正在播放中`);
    }
    this.activated = true;

    const applyFunction = () => {
      if (!Array.isArray(this.actions) || isNaN(parseInt(this.stepIndex))) {
        DEBUG && console.warn(`实例未初始化或已销毁`);
        return null;
      }
      if (!(this.stepIndex >= 0) || this.stepIndex > this.actions.length - 1) {
        this.stepIndex = 0;
      }
      const currentAction = this.actions[this.stepIndex];
      if (typeof currentAction.action === "function") {
        currentAction.action();
      }

      // 判断是否自动播放
      const autoPlay =
        currentAction.autoPlay === undefined
          ? this.options.autoPlay
          : !!currentAction.autoPlay;
      const delayTime = parseInt(
        currentAction.delay === undefined
          ? this.options.delay
          : currentAction.delay
      );
      this.activated = autoPlay && !isNaN(delayTime);
      const goNext = () => {
        this.__Trigger("change", [this.activated, this.stepIndex]);
        if (this.activated) {
          this.stepIndex++;
          this.timer = setTimeout(() => {
            applyFunction();
          }, delayTime);
        } else {
          this.timer = clearTimeout(this.timer);
        }
      };
      if (this.stepIndex < this.actions.length - 1) {
        goNext();
      } else {
        if (this.options.loop) {
          // 循环模式
          this.stepIndex = -1;
          goNext();
        } else {
          DEBUG && console.log("actions 执行完毕");
          this.stop();
          this.__Trigger("ended");
        }
      }
    };
    applyFunction();
  }

  pause(SLIENT) {
    if (this.activated) {
      this.activated = false;
      this.timer = clearTimeout(this.timer);
      !SLIENT && this.__Trigger("change", [this.activated, this.stepIndex]);
    }
  }

  stop() {
    this.pause();
    this.stepIndex = -1;
  }

  destroy() {
    this.pause();
    this.stepIndex = null;
    this.actions = null;
  }
}
