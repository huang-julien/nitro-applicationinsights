---
seo:
  title: nitro-applicationinsights
  description: nitro-applicationinsights is a nitro module for Azure applicationinsights
navigation: false
---

::u-page-hero
---
orientation: horizontal
---
  :::prose-pre
  ---
  code: pnpm install nitro-applicationinsights
  filename: Terminal
  ---
  ```bash
  pnpm install nitro-applicationinsights
  ```
  :::

#title
nitro-applicationinsights

#description
[Application Insights](https://learn.microsoft.com/fr-fr/azure/azure-monitor/app/app-insights-overview?tabs=net) integration for [nitro](https://nitro.unjs.io/).

#links
  :::u-button
  ---
  size: xl
  to: /guide/getting-started
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

::

::u-page-section
#title
A ready to use module to integrate Applicationinsights in your Nitro App.


#features
  :::u-page-feature
  ---
  icon: devicon:opentelemetry
  ---
  #title
  Integrates nitro-opentelemetry
  
  #description
  Comes with nitro-opentelemetry and OTEL's API
  :::


  :::u-page-feature
  ---
  icon: cil:loop-circular
  ---
  #title
  Auto track request
  
  #description
  All your outgoing responses are tracked automatically. Responses are correlated to the incoming request.
  :::

  
  :::u-page-feature
  ---
  icon: fluent-emoji:hook
  ---
  #title
  Customisable with Hooks
  
  #description
  Configure nitro-opentelemetry and applicationinsights with hooks
  :::
 
::

