---
title: 'create$fetchInterceptor'
description: 'track an outgoing request as a dependency'
---

# `create$fetchInterceptor`

Return an object for a `$fetch` request. This util allows to track a request as dependency.

If an event is passed as argument, the request will be tracked as a children dependency of the event.

## Parameters

- event:
  - **type**: `H3Event`