中文 | [English](README.md)

# @cutting-mat/director

[![npm](https://img.shields.io/npm/v/@cutting-mat/director.svg)](https://www.npmjs.com/package/@cutting-mat/director) [![license](https://img.shields.io/github/license/cutting-mat/director.svg)]()

更简单的 Vue3.x 状态管理插件。如果你也觉得 Vuex 有点复杂，那么你需要 `director`。

[Vue2 版](https://github.com/cutting-mat/director/tree/vue2.x)

## 快速开始

1. 安装:

```bash
npm i @cutting-mat/director --save
```

2. 配置 Store

```js
import { plugin as store } from "@cutting-mat/director";

Vue.use(store, {
  state: {
    // 注册状态数据
    testValue: 0,
  },
  actions: {
    // 注册自定义操作
    testAction: function (context) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let newValue = parseInt(context.get("testValue") + 1);
          context.set("testValue", newValue);
          resolve(newValue);
        }, 500);
      });
    },
  },
});
```

实际项目中数据项可能会很多，可以将配置放在独立文件中：

```js
// 推荐
import { plugin as store } from "@cutting-mat/director";
import storeConfig from "@/store.config";
Vue.use(store, storeConfig);
```

3. 使用

插件将注册 `$store` 实例方法。现在，你可以通过 `this.$store.state` 或 `this.$store.get()` 来获取状态对象。

以下语句等效：

```js
this.$store.state.testValue; // 0
this.$store.get("testValue"); // 0
```

用 `$store.set()` 为状态赋值。

```js
this.$store.set("testValue", parseInt(Math.random() * 1e8)); // 0.5405537846956767
```

你也可以直接对状态赋值，但要确保 key 要预先注册，否则数据不具备响应性。

```js
this.$store.state.testValue = 123; // 123

this.$store.state.testValue++; // 124

this.$store.state.unRegisteredKey = 456; // 未注册的数据不具备响应性
```

`$store.set()` 会拦截并提示未注册的赋值操作，因此建议始终用 `$store.set()` 赋值。

通过 `$store.action()` 执行自定义操作。

```js
this.$store.action('testAction').then(newValue = {
    console.log(newValue)       // 2
})

```

## API

### 配置选项

- state

类型: Object | Function

如果你传入返回一个对象的函数，其返回的对象会被用作 state。

- actions

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

### Store 属性

- state

类型: Object

状态对象。所有状态要预先注册。

### Store 方法

- set(key[String], value[Any])

更新状态，对未注册的 key 赋值将抛出错误。

返回 Promise 。

- get(key[String])

获取状态，与 $store.state[key] 等效，对未注册的 key 取值将抛出错误。

返回 状态值 。

- action(type[String], payload[Any])

分发 action 。即执行自定义操作，action 需要预先在 config.actions 中注册。payload 是向操作方法传递的参数。

返回 Promise 。如果 action 处理函数返回的是 Promise，`store.action()` 会直接返回处理函数的 Promise 。

## 自动模式

action 最常被用来获取异步数据并存入 state，对于这种场景`director`支持一种更简单的自动模式。

当 action 的 type 在 state 中有同名状态，且处理函数返回一个 Promise 时，Promise 的返回值将自动赋值给 state 中的同名状态。

示例：

```js
export default {
  state: {
    AsynData: [],
  },
  actions: {
    AsynData: function (context, payload) {
      return getAsynData(payload).then((res) => {
        // 这里可以对返回数据做格式化操作，返回值将自动存入 state.AsynData
        return res.data;
      });
    },
  },
};
```

## 请求缓存

当使用 action 请求的是某些公共数据并存入 state 时，这意味着该数据会在应用内被频繁的调用并发起请求，这时可以配合[@cutting-mat/axios](https://github.com/cutting-mat/axios/blob/main/README_CN.md)轻松实现请求缓存。

实例：

```js
export default {
    state: {
        AsynData: [
            userInfo: {}
        ]
    },
    actions: {
        userInfo: function (context, payload) {
            return getUserInfo(null, {cache: true}).then(res => {
                return res.data
            })
        }
    }
}

```

## 响应式应用

`$store.state` 中的数据是响应式的。

```html
<template>
  <div>
    <div>响应式数据：testValue = {{ $store.state.testValue }}</div>
    <button @click.native="$store.state.testValue++">改变数据</button>
  </div> </template
>>
```

## 插件式使用

可以脱离 Vue 应用环境独立使用，比如在开发插件时。

```js
import Store from "@cutting-mat/director";
const $store = Store({
  someKey: 123,
});

$store.get("someKey"); // 123
```

## License

MIT
