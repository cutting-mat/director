/**
 * Director
 * */
// 调试开关
const DEBUG = process.env.NODE_ENV === "development";

const EventCenter = {
    update: [],
}
const Trigger = function (eventName, payload = []) {
    if (Array.isArray(EventCenter[eventName])) {
        EventCenter[eventName].forEach(handler => {
            handler(...payload)
        })
    }
}

export default class Director {
    constructor(options) {
        this.options = Object.assign({
            loop: false,
            delay: null
        }, options || {});

        if (this.options.loop && !this.options.delay) {
            console.warn(`开启了 loop 但未设置 dealy，请务必确保每一个 action 都单独设置了 delay，否则循环无法进行`)
        }

        this.activated = false;
    }


    on(eventName, eventHandle) {
        if (Object.keys(EventCenter).indexOf(eventName) !== -1) {
            if (typeof eventHandle === 'function') {
                const targetIndex = EventCenter[eventName].indexOf(eventHandle)
                if (targetIndex === -1) {
                    EventCenter[eventName].push(eventHandle)
                }
                DEBUG && console.log(`注册${eventName}监听事件${eventHandle.toString()}`)
            }
        }
    }

    off(eventName, eventHandle) {
        if (eventName) {
            if (Object.keys(EventCenter).indexOf(eventName) !== -1) {
                if (typeof eventHandle === 'function') {
                    // 取消事件的某个监听
                    const targetIndex = EventCenter[eventName].indexOf(eventHandle)
                    if (targetIndex !== -1) {
                        EventCenter[eventName].splice(targetIndex, 1)
                    }
                    DEBUG && console.log(`取消${eventName}监听${eventHandle.toString()}`)
                } else {
                    // 取消事件的所有监听
                    EventCenter[eventName] = []
                    DEBUG && console.log(`取消${eventName}所有监听`)
                }
            }
        } else {
            // 清除所有事件监听
            Object.keys(EventCenter).forEach(event => {
                EventCenter[event] = []
                DEBUG && console.log(`清除所有事件监听`)
            })
        }
    }

    loadAction(actions) {
        if (Array.isArray(actions)) {
            this.pause()
            this.actions = actions;
            this.stepIndex = 0;
        } else {
            console.warn(`loadAction(): 参数格式不正确`)
        }
    }

    inertAction(actions) {
        if (Array.isArray(actions)) {
            if (Array.isArray(this.actions)) {
                if (this.activated) {
                    this.pause(true)
                }
                this.actions.splice(this.stepIndex, 0, ...actions)
                this.play()
            } else {
                console.warn(`Director实例未初始化`)
            }
        } else {
            console.warn(`inertAction(): 参数格式不正确`)
        }
    }

    moveNext() {
        this.pause()
        if (this.stepIndex < this.actions.length - 1) {
            this.stepIndex++
        } else {
            if (this.options.loop) {
                this.stepIndex = 0
            } else {
                DEBUG && console.warn(`没有下一条记录`)
            }
        }
        this.play()
    }

    movePrev() {
        this.pause()
        if (this.stepIndex > 0) {
            this.stepIndex--
        } else {
            if (this.options.loop) {
                this.stepIndex = this.actions.length - 1
            } else {
                DEBUG && console.warn(`没有上一条记录`)
            }
        }
        this.play()
    }

    moveTo(targetIndex) {
        this.pause()
        if (isNaN(parseInt(targetIndex))) {
            return null
        }
        if (targetIndex > -1 && (targetIndex < this.actions.length)) {
            this.stepIndex = targetIndex
        }
        this.play()
    }

    play() {
        if (this.activated) {
            return null;
        }
        this.activated = true;

        const applyFunction = () => {
            if (!Array.isArray(this.actions) || isNaN(parseInt(this.stepIndex))) {
                DEBUG && console.warn(`实例未初始化或已销毁`)
                return null
            }
            if (this.stepIndex > this.actions.length - 1) {
                this.stepIndex = 0
            }
            const currentAction = this.actions[this.stepIndex];
            if (typeof currentAction.action === "function") {
                currentAction.action();
            }

            // 判断是否自动播放
            const delayTime = parseInt(currentAction.delay === undefined ? this.options.delay : currentAction.delay);
            this.activated = !isNaN(delayTime);
            const goNext = () => {
                Trigger('update', [this.activated, this.stepIndex, this.actions.length])
                if (this.activated) {
                    this.stepIndex++;
                    this.timer = setTimeout(() => {
                        applyFunction();
                    }, delayTime);
                } else {
                    this.timer = clearTimeout(this.timer)
                }
            }
            if (this.stepIndex < this.actions.length - 1) {
                goNext()
            } else {
                if (this.options.loop) {
                    // 循环模式
                    this.stepIndex = -1;
                    goNext()
                } else {
                    DEBUG && console.log("actions 执行完毕");
                    this.stop()
                }
            }

        };
        applyFunction();
    }

    pause(SLIENT) {
        if (this.activated) {
            this.activated = false;
            this.timer = clearTimeout(this.timer)
            !SLIENT && Trigger('update', [this.activated, this.stepIndex, this.actions.length])
        }
    }

    stop() {
        this.pause()
        this.stepIndex = 0;
    }

    destroy() {
        this.pause()
        this.stepIndex = null;
        this.actions = null;
    }
}
