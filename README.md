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
const director = new Director({
  // 实例配置
});
```

3. 装载 actions 并执行

```js
director.loadAction([
  {
    action: () => {
      console.log(`Do somthing 1/3`)
    },
  },
  {
    action: () => {
      console.log(`Do somthing 2/3`)
    },
    {
    action: () => {
      console.log(`Do somthing 3/3`)
    }
]);

director.play()
```

## 实例配置

- autoPlay

类型: `Boolean`

是否自动播放

默认: `false`

- loop

类型: `Boolean`

是否循环播放（开启`autoPlay`时有效）

默认: `false`

- delay

类型: `Number`

自动播放间隔时间，单位 ms（开启`autoPlay`时有效）

默认: `4000`

## 实例属性

- activated

类型: `Boolean`

是否正在自动播放

- stepIndex

类型: `Number`

当前动作序号

## 实例方法

- load(actions)

`{Array} actions`：Action 数组

批量装载动作，可用于初始化实例，重复执行数据会覆盖。

- push(action)

`{Object} action`：Action

添加一个动作，可用于初始化实例

- insert(actions)

`{Array} actions`：Action 数组

在当前步骤后批量添加动作，实例初始化之后有效。

- next()

播放下一个动作

- prev()

播放上一个动作

- go(index)

`{Number} index`：动作序号

执行指定序号的动作

- play()

开始播放

- pause()

暂停播放

- stop()

停止播放，`stepIndex`将归零。

- destroy()

销毁实例

- on(eventName, eventHandle)

`{String} eventName`：事件名称

`{Function} eventHandle`：回调方法

监听事件

- off([eventName, [eventHandle]])

`{String} eventName`：取消监听的事件名称

`{Function} eventHandle`: 取消监听的回调方法，若不传将取消该事件的所有监听

取消监听事件

## Action 对象属性

- `{Function} action`: 动作函数，非必要

- `{Boolean} autoPlay`: 是否自动播放下一个，优先级高于实例配置，非必要

- `{Number} delay`: 自动播放间隔，开启自动播放有效，优先级高于实例配置，非必要

## 事件

- change(activated, stepIndex)

播放位置(`stepIndex`)改变事件

- ended()

播放结束事件

## License

MIT
