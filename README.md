中文 | [English](README.md)

# @cutting-mat/director

[![npm](https://img.shields.io/npm/v/@cutting-mat/director.svg)](https://www.npmjs.com/package/@cutting-mat/director) [![license](https://img.shields.io/github/license/cutting-mat/director.svg)]()

前端自动化脚本执行，灵活实现各种自动播放、演示场景

## 快速开始

1. 安装:

```bash
npm i @cutting-mat/director --save
```

2. 创建实例

```js
import Director from "@cutting-mat/director";
const options = {}; // 配置选项
const director = new Director(options);
```

3. 装载 actions 并执行

```js
director.loadAction([
  {
    action: () => {
      // Do somthing 3-1
    },
  },
  {
    action: () => {
      // Do somthing 3-2
    },
    {
    action: () => {
      // Do somthing 3-3
    }
]);

director.play()
```

## API

### 配置选项

- loop

类型: Object | Function

如果你传入返回一个对象的函数，其返回的对象会被用作 state。

- delay

类型: { [type: string]: Function }

在 store 上注册 action。处理函数总是接受 context 作为第一个参数，payload 作为第二个参数（可选）。

`context` 对象包含以下属性：

```js
{
  set, // 等同于 `store.set`
    get; // 等同于 `store.get`
}
```

同时如果有第二个参数 payload 的话也能够接收。payload 是分发 action 时携带的参数。

### 属性

- activated

### 方法

- loadAction(actions)

- inertAction(actions)

- moveNext()

- movePrev()

- moveTo(targetIndex)

- play()

- pause()

- stop()

- destroy()

- on(eventName, eventHandle)

- off([eventName, [eventHandle]])

## License

MIT
