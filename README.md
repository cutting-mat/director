English | [中文](README_CN.md)

# @cutting-mat/director

[![npm](https://img.shields.io/npm/v/@cutting-mat/director.svg)](https://www.npmjs.com/package/@cutting-mat/director) [![license](https://img.shields.io/github/license/cutting-mat/director.svg)]()

Simpler Vue3.x state management plugin. If you also find Vuex a bit complicated, then you need `director`.

[Vue2 version](https://github.com/cutting-mat/director/tree/vue2.x)

## Quick start

1. Install:

```bash
npm i @cutting-mat/director --save
```

2. Configure Store

```js
import { plugin as store } from "@cutting-mat/director";

Vue.use(store, {
  state: {
    // Data in store
    testValue: null,
  },
  actions: {
    // Asynchronous operation
    testAction: function (context) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.set("testValue", parseInt(context.get("testValue") + 1));
          resolve();
        }, 500);
      });
    },
  },
});
```

There may be many data items in the actual project. You can put the configuration in a separate file:

```js
// recommend
import { plugin as store } from "@cutting-mat/director";
import storeConfig from "@/store.config";
Vue.use(store, storeConfig);
```

3. Use

The plug-in will automatically register the global `$store` object. Now, you can use `$store.state` or `$store.get()` to get the status object.

The following statements are equivalent:

```js
this.$store.state.testValue; // 0
this.$store.get("testValue"); // 0
```

Use `$store.set()` assign value to status.

```js
this.$store.set("testValue", parseInt(Math.random() * 1e8)); // 0.5405537846956767
```

You can also assign a value to the state directly, but make sure the key is registered in advance, otherwise the data is not responsive.

```js
this.$store.state.testValue = 123; // 123

this.$store.state.testValue++; // 124

this.$store.state.unRegisteredKey = 456; // Unregistered status is not responsive
```

`$store.set()` will intercept and prompt unregistered assignment operations, so it is recommended to always use `$store.set()` assignment.

Use `$store.action()` execute custom operation.

```js
this.$store.action('testAction').then(newValue = {
    console.log(newValue)       // 2
})

```

## API

### Configuration

- state

Type: Object | Function

If you pass in a function that returns an object, the object returned will be used as state.

- actions

Type: { [type: string]: Function }

Register on the action store. The handler function always accepts context as the first parameter and payload as the second parameter (optional).

`context` Object contains the following properties：

```js
{
  set, // Equivalent to `store.set`
    get; // Equivalent to `store.get`
}
```

At the same time, if there is the second parameter payload, it can also be received. Payload is a parameter carried when distributing actions.

### Store attribute

- state

Type: Object

Status object. All statuses need to be pre registered.

### Store method

- set(key[String], value[Any])

Updating the status and assigning a value to an unregistered key will throw an error.

Return Promise 。

- get(key[String])

Get status. And $store.state[key] is equivalent, and an error will be thrown for the value of unregistered key.

Return status value。

- action(type[String], payload[Any])

Distribute action. Action needs to be pre-registered in config.actions. Payload is the parameter passed to the operation method.

Return Promise 。If the action handler returns a Promise, `store.action()` will return the Promise of the handler directly.

## Automatic mode

Action is most often used to obtain asynchronous data and store it in state. For this scenario, `director` supports a simpler automatic mode。

When the type of action has a state with the same name in state and the processing function returns a promise, the return value of promise will be automatically assigned to the state with the same name in state.

Examples：

```js
export default {
  state: {
    AsynData: [],
  },
  actions: {
    AsynData: function (context, payload) {
      return getAsynData(payload).then((res) => {
        // You can format the returned data here, and the returned value will be automatically stored in state.AsynData
        return res.data;
      });
    },
  },
};
```

## Request cache

When some public data is requested using action and stored in state, which means that the data will be called and requested frequently within the application, request caching can be easily implemented with [@cutting-mat/axios](https://github.com/cutting-mat/axios/blob/main/README_CN.md).

Examples：

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

## Responsive

The state data in $store.state is responsive。

```html
<template>
  <div>
    <div>
      Responsive Data：testValue = {{ tes$store.state.testValuetValue }}
    </div>
    <button @click.native="$store.state.testValue++">Change data</button>
  </div> </template
>>
```

## Plug-in use

It can be used independently from the Vue application environment, for example, when developing plug-ins.

```js
import Store from "@cutting-mat/director";
const $store = Store({
  someKey: 123,
});

$store.get("someKey"); // 123
```

## License

MIT
