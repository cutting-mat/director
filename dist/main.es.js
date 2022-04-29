class Director {
  constructor(options) {
    this.options = Object.assign({
      loop: false,
      delay: null
    }, options || {});
    this.activated = false;
    this.EventCenter = {
      change: [],
      ended: []
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
      }
    }
  }
  off(eventName, eventHandle) {
    if (eventName) {
      if (Object.keys(this.EventCenter).indexOf(eventName) !== -1) {
        if (typeof eventHandle === "function") {
          const targetIndex = this.EventCenter[eventName].indexOf(eventHandle);
          if (targetIndex !== -1) {
            this.EventCenter[eventName].splice(targetIndex, 1);
          }
        } else {
          this.EventCenter[eventName] = [];
        }
      }
    } else {
      Object.keys(this.EventCenter).forEach((event) => {
        this.EventCenter[event] = [];
      });
    }
  }
  loadAction(actions) {
    if (Array.isArray(actions)) {
      this.pause();
      this.actions = actions;
      this.stepIndex = -1;
    } else {
      console.warn(`loadAction(): \u53C2\u6570\u683C\u5F0F\u4E0D\u6B63\u786E`);
    }
  }
  inertAction(actions) {
    if (Array.isArray(actions)) {
      if (Array.isArray(this.actions)) {
        if (this.activated) {
          this.pause(true);
        }
        this.actions.splice(this.stepIndex, 0, ...actions);
        this.play();
      } else {
        console.warn(`Director\u5B9E\u4F8B\u672A\u521D\u59CB\u5316`);
      }
    } else {
      console.warn(`inertAction(): \u53C2\u6570\u683C\u5F0F\u4E0D\u6B63\u786E`);
    }
  }
  moveNext() {
    this.pause();
    if (this.stepIndex < this.actions.length - 1) {
      this.stepIndex++;
    } else {
      if (this.options.loop) {
        this.stepIndex = 0;
      }
    }
    this.play();
  }
  movePrev() {
    this.pause();
    if (this.stepIndex > 0) {
      this.stepIndex--;
    } else {
      if (this.options.loop) {
        this.stepIndex = this.actions.length - 1;
      }
    }
    this.play();
  }
  moveTo(targetIndex) {
    if (isNaN(parseInt(targetIndex))) {
      return null;
    }
    this.pause();
    if (targetIndex > -1 && targetIndex < this.actions.length) {
      this.stepIndex = targetIndex;
    }
    this.play();
  }
  play() {
    if (this.activated) {
      return null;
    }
    this.activated = true;
    const applyFunction = () => {
      if (!Array.isArray(this.actions) || isNaN(parseInt(this.stepIndex))) {
        return null;
      }
      if (!(this.stepIndex >= 0) || this.stepIndex > this.actions.length - 1) {
        this.stepIndex = 0;
      }
      const currentAction = this.actions[this.stepIndex];
      if (typeof currentAction.action === "function") {
        currentAction.action();
      }
      const delayTime = parseInt(currentAction.delay === void 0 ? this.options.delay : currentAction.delay);
      this.activated = !isNaN(delayTime);
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
          this.stepIndex = -1;
          goNext();
        } else {
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
export { Director as default };
