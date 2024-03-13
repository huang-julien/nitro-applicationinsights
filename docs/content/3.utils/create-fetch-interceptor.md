---
title: create$fetchInterceptor
description: track an outgoing request as a dependency
---

# `create$fetchInterceptor`

Return an object for a `$fetch` request. This util allows to track a request as dependency.

If an event is passed as argument, the request will be tracked as a children dependency of the event.

## Parameters

- event: **type**: `H3Event`

## Return values

See [ofetch interceptors](https://github.com/unjs/ofetch?tab=readme-ov-file#%EF%B8%8F-interceptors)

- \`onRequest\`: Set the traceparent header
- \`onRequestError\`: Track the exception if the request fails
- \`onResponse\`: Track the response as dependency
- \`onResponseError\`: Track the response as a dependency failure

## Simple example

```ts
import { defineEventHandler } from "#imports"
import { create$fetchInterceptors } from "nitro-applicationinsights/runtime"

export default defineEventHandler((event) => {
    return $fetch('/dependency', {
        ...create$fetchInterceptors(event)
    })
})
```
