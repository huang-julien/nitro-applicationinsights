import { ReadableSpan, Span, SpanProcessor} from "@opentelemetry/sdk-trace-node"


 class SpanEnrichingProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
    onStart(span: Span): void {
        return;
    }
    onEnd(span: ReadableSpan): void {
        console.log(span)
    }
    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}


export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('applicationinsights:setup', ({ client }) => {
        client.config.azureMonitorOpenTelemetryOptions = {
            spanProcessors : [
                new SpanEnrichingProcessor()
            ]
        }
        
    })
})