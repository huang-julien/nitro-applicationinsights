import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http" 

const instrumentations = [
  new UndiciInstrumentation(),
  new HttpInstrumentation()
];
const loadInstrumentations = () => {registerInstrumentations({
    instrumentations,
  });
}
  
export default loadInstrumentations;
