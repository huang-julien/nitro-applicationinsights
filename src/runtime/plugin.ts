import type { NitroAppPlugin } from 'nitropack'
import type { TNitroAppInsightsConfig } from '../types'
import { useRuntimeConfig } from '#imports'
import _Applicationinsights from 'applicationinsights'
import { metrics, trace, } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { SEMATTRS_HTTP_URL, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_STATUS_CODE, OTEL_STATUS_CODE_VALUE_OK, OTEL_STATUS_CODE_VALUE_ERROR } from "@opentelemetry/semantic-conventions"
import { getResponseStatus, getRequestURL, getRequestProtocol } from 'h3'
import { defu } from 'defu';

const instrumentations = [
  new UndiciInstrumentation(),
  new HttpInstrumentation()
];
const loadInstrumentations = () => {
  registerInstrumentations({
    instrumentations,
  });
}
loadInstrumentations()


const Applicationinsights = _Applicationinsights as typeof import('applicationinsights')

export default <NitroAppPlugin>(async (nitro) => {
  const { applicationinsights: config } = useRuntimeConfig()

  await nitro.hooks.callHook('applicationinsights:config', defu(config, {}))

  const configuration = Applicationinsights.setup(config.connectionString)

  await nitro.hooks.callHook('applicationinsights:setup', { client: Applicationinsights.defaultClient, configuration })
  configuration.start()
  await nitro.hooks.callHook('applicationinsights:ready', { client: Applicationinsights.defaultClient })

  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
  });
  
  nitro.hooks.hook('otel:span:end', ({event}) => {
    event.otel.span.setAttributes({
      [SEMATTRS_HTTP_STATUS_CODE]: getResponseStatus(event),
    })
  })

  // azure app insights seems to be relying on the deprecated attributes
  nitro.hooks.hook('request', async (event) => {
    const requestURL = getRequestURL(event)
    event.otel.span.setAttributes({
      [SEMATTRS_HTTP_ROUTE]: (await nitro.h3App.resolve(event.path))?.route || event.path,
      [SEMATTRS_HTTP_URL]: event.path,
      [SEMATTRS_HTTP_METHOD]: event.method,
      [SEMATTRS_HTTP_SCHEME]: getRequestProtocol(event),
      [SEMATTRS_HTTP_HOST]: requestURL.host, 
    })
  })
})
