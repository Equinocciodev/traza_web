import type { Locale } from '@/i18n';
import { FEATURED_UNIT_CODE, UNIT_BY_CODE } from '@/fixtures/units';

/** Editorial copy only. This module never writes to the verification engine or its fixtures. */
export type StoryId = 'product' | 'programme';
type Copy = Record<Locale, string>;
export interface NarrativeRow { label: string; detail: string }
export interface NarrativeBeat {
  id: string;
  chapter: string;
  durationMs: number;
  title: string;
  summary: string;
  actor: string;
  change: string;
  limit: string;
  rows: NarrativeRow[];
  transcript: string[];
  kind: 'record' | 'state' | 'relations' | 'events' | 'checks' | 'decision';
}
export interface NarrativeStory {
  id: StoryId;
  title: string;
  tab: string;
  introduction: string;
  label: string;
  chapters: { id: string; label: string }[];
  beats: NarrativeBeat[];
}
interface SourceBeat {
  id: string;
  chapter: string;
  seconds: number;
  title: Copy;
  summary: Copy;
  actor: Copy;
  change: Copy;
  limit: Copy;
  rows?: { label: Copy; detail: Copy }[];
  extra?: Copy[];
  kind: NarrativeBeat['kind'];
}
const copy = (es: string, en: string): Copy => ({ es, en });

const PRODUCT: SourceBeat[] = [
  {
    id: 'a0-unit', chapter: 'identity', seconds: 6, kind: 'record',
    title: copy('Una unidad. Su propia historia.', 'One unit. Its own history.'),
    summary: copy('Todo el recorrido sigue al mismo producto y a su registro.', 'The whole journey follows the same product and its record.'),
    actor: copy('Participante del programa', 'Programme participant'),
    change: copy('Se define la unidad que se quiere identificar.', 'The unit to be identified is defined.'),
    limit: copy('Ilustración. No representa una instalación ni un producto real de Traza.', 'Illustration. It does not depict a real Traza installation or product.'),
  },
  {
    id: 'a1-registration', chapter: 'identity', seconds: 10, kind: 'record',
    title: copy('Antes del código, un responsable.', 'Before the code, an accountable party.'),
    summary: copy('El participante se incorpora y describe el producto.', 'The participant joins and describes the product.'),
    actor: copy('Participante y responsable del programa', 'Participant and programme owner'),
    change: copy('Se vinculan un responsable, la descripción y las reglas de identificación.', 'An accountable party, the description and the identification rules are linked.'),
    limit: copy('Dar de alta información no demuestra por sí solo que el objeto coincida con ella.', 'Registering information does not by itself prove that the object matches it.'),
    rows: [
      { label: copy('Participante', 'Participant'), detail: copy('Responsabilidad y permisos definidos.', 'Defined responsibilities and permissions.') },
      { label: copy('Producto', 'Product'), detail: copy('Descripción y datos declarados.', 'Description and declared data.') },
    ],
  },
  {
    id: 'a2-issued', chapter: 'identity', seconds: 10, kind: 'state',
    title: copy('La identidad se emite.', 'The identity is issued.'),
    summary: copy('El identificador queda vinculado al registro de la unidad.', 'The identifier is linked to the unit record.'),
    actor: copy('Emisor autorizado por el programa', 'Issuer authorised by the programme'),
    change: copy('Estado narrativo: emitida. Todavía no implica aplicación ni activación.', 'Narrative state: issued. This does not yet imply application or activation.'),
    limit: copy('La firma acredita emisor e integridad de los datos. No evita copias físicas.', 'The signature attests issuer and data integrity. It does not prevent physical copies.'),
    rows: [{ label: copy('Identidad', 'Identity'), detail: copy('Emitida · aún no aplicada.', 'Issued · not yet applied.') }],
  },
  {
    id: 'a3-applied', chapter: 'activation', seconds: 10, kind: 'state',
    title: copy('Aplicada no significa activa.', 'Applied does not mean active.'),
    summary: copy('La marca se aplica al objeto; su activación sigue pendiente.', 'The mark is applied to the object; activation is still pending.'),
    actor: copy('Responsable de aplicación en la línea', 'Person responsible for application on the line'),
    change: copy('La aplicación se registra por separado de la autorización para activar.', 'Application is recorded separately from authorisation to activate.'),
    limit: copy('Estos estados son una propuesta narrativa; no amplían el motor de verificación.', 'These states are a narrative proposal; they do not extend the verification engine.'),
    rows: [
      { label: copy('Aplicación', 'Application'), detail: copy('Marca aplicada al objeto.', 'Mark applied to the object.') },
      { label: copy('Activación', 'Activation'), detail: copy('Pendiente · aún no activa.', 'Pending · not yet active.') },
    ],
  },
  {
    id: 'a3-activated', chapter: 'activation', seconds: 10, kind: 'state',
    title: copy('La activación tiene una condición.', 'Activation has a condition.'),
    summary: copy('Al finalizar la producción, el responsable completa lote y vencimiento antes de activar.', 'After production, the owner completes lot and expiry before activation.'),
    actor: copy('Rol autorizado según las reglas del programa', 'Authorised role under the programme rules'),
    change: copy('El estado pasa de pendiente a activo y se documenta el cambio.', 'The state changes from pending to active and the change is documented.'),
    limit: copy('Transición ilustrada. No se inventa una fecha de activación ni una autorización real.', 'Illustrated transition. No activation date or real authorisation is invented.'),
    rows: [{ label: copy('Estado narrativo', 'Narrative state'), detail: copy('Activa · cambio documentado.', 'Active · change documented.') }],
  },
  {
    id: 'a4-aggregation', chapter: 'journey', seconds: 14, kind: 'relations',
    title: copy('Un lote. Identidades distintas.', 'One lot. Distinct identities.'),
    summary: copy('Cada envase de medicamento conserva su QR; el lote aporta contexto común.', 'Each medicine package keeps its own QR; the lot provides shared context.'),
    actor: copy('Fabricante o importador responsable', 'Responsible manufacturer or importer'),
    change: copy('La ficha vincula cada unidad con producto, lote y vencimiento.', 'The record links each unit to product, lot and expiry.'),
    limit: copy('Este vínculo no registra transporte, distribución ni ventas.', 'This link does not record transport, distribution or sales.'),
    rows: [
      { label: copy('Producto', 'Product'), detail: copy('Solución oral · 120 ml; concentración y registro sanitario declarados.', 'Oral solution · 120 ml; declared concentration and health registration.') },
      { label: copy('Lote', 'Lot'), detail: copy('Contexto compartido de producción y vencimiento.', 'Shared production and expiry context.') },
      { label: copy('Unidad', 'Unit'), detail: copy('Un QR propio en la caja o el frasco.', 'Its own QR on the carton or bottle.') },
    ],
  },
  {
    id: 'a4-disaggregation', chapter: 'journey', seconds: 10, kind: 'relations',
    title: copy('Cerrar la producción activa las unidades.', 'Closing production activates the units.'),
    summary: copy('El emisor confirma qué códigos se utilizaron al finalizar la corrida.', 'The issuer confirms which codes were used when the run ends.'),
    actor: copy('Responsable de producción', 'Production owner'),
    change: copy('Los códigos utilizados quedan activos; los sobrantes se anulan al cerrar la emisión.', 'Used codes become active; unused codes are voided when the issuance closes.'),
    limit: copy('Imprimir un código no demuestra por sí solo que la unidad está activada.', 'Printing a code alone does not show that the unit is activated.'),
    rows: [
      { label: copy('Código utilizado', 'Used code'), detail: copy('Activado tras completar la ficha.', 'Activated after completing the record.') },
      { label: copy('Código sobrante', 'Unused code'), detail: copy('Anulado al cerrar la emisión.', 'Voided when the issuance closes.') },
    ],
  },
  {
    id: 'a5-events', chapter: 'journey', seconds: 16, kind: 'events',
    title: copy('Un hueco necesita contexto.', 'A gap needs context.'),
    summary: copy('El registro está incompleto. Revisemos el motivo y la cobertura esperada.', 'The record is incomplete. Let us review the reason and the expected coverage.'),
    actor: copy('Participantes que aportan eventos y equipo de revisión', 'Participants providing events and the review team'),
    change: copy('Se compara lo recibido con lo que se esperaba registrar.', 'Received events are compared with what was expected to be recorded.'),
    limit: copy('Un evento no recibido es un estado, no una causa. Un hueco no prueba fraude.', 'An event not received is a state, not a cause. A gap does not prove fraud.'),
    rows: [
      { label: copy('Estado', 'State'), detail: copy('Evento no recibido.', 'Event not received.') },
      { label: copy('Revisión', 'Review'), detail: copy('Sincronización pendiente, excepción documentada u otro motivo por determinar.', 'Pending synchronisation, a documented exception or another reason to establish.') },
    ],
    extra: [copy('Se revisan emisión, impresión y cierre de la ficha. La falta de activación requiere contrastar la corrida; el registro no permite inferir movimientos logísticos.', 'Issuance, printing and record closure are reviewed. Missing activation requires checking the run; the registry cannot establish logistics movements.')],
  },
  {
    id: 'a6-lookup', chapter: 'lookup', seconds: 32, kind: 'checks',
    title: copy('Cuatro lecturas. Límites distintos.', 'Four readings. Different limits.'),
    summary: copy('La consulta separa la evidencia; no entrega una nota de autenticidad.', 'The lookup separates the evidence; it does not give an authenticity score.'),
    actor: copy('Persona que consulta y compara el producto', 'Person looking up and comparing the product'),
    change: copy('Se muestra la información disponible sin confundir las comprobaciones.', 'Available information is shown without conflating the checks.'),
    limit: copy('La consulta no certifica autenticidad física.', 'The lookup does not certify physical authenticity.'),
    rows: [
      { label: copy('Firma', 'Signature'), detail: copy('Emisor e integridad de datos firmados. No evita copias físicas.', 'Issuer and integrity of the signed data. It does not prevent physical copies.') },
      { label: copy('Registro', 'Registry'), detail: copy('Identificador encontrado y estado declarado. No demuestra ubicación.', 'Identifier found and declared status. Does not demonstrate location.') },
      { label: copy('Datos', 'Data'), detail: copy('Información para comparar. La persona revisa su coincidencia con el producto.', 'Information to compare. The person checks whether it matches the product.') },
      { label: copy('Señales', 'Signals'), detail: copy('Patrones en registros disponibles. Sin alertas no significa sin riesgos.', 'Patterns in the available records. No alerts does not mean no risks.') },
    ],
  },
  {
    id: 'a7-review', chapter: 'lookup', seconds: 16, kind: 'decision',
    title: copy('La misma unidad, con más historia.', 'The same unit, with more history.'),
    summary: copy('Una señal ayuda a priorizar la revisión. No acusa por sí sola.', 'A signal helps prioritise review. It does not make an accusation by itself.'),
    actor: copy('Rol de revisión o inspección, según el programa', 'Review or inspection role, according to the programme'),
    change: copy('La revisión y su resultado documentado se incorporan al registro.', 'The review and its documented outcome are added to the record.'),
    limit: copy('Ejemplo: el resultado puede confirmar o corregir el estado. No modifica el registro.', 'Example: the outcome may confirm or correct the state. It does not modify the record.'),
    rows: [
      { label: copy('Señal', 'Signal'), detail: copy('Una observación que merece revisión.', 'An observation that merits review.') },
      { label: copy('Resultado', 'Outcome'), detail: copy('Decisión humana documentada; no veredicto automático.', 'Documented human decision; not an automatic verdict.') },
    ],
  },
];

const PROGRAMME: SourceBeat[] = [
  {
    id: 'b0-scope', chapter: 'scope', seconds: 14, kind: 'decision',
    title: copy('Primero, definir la necesidad.', 'First, define the need.'),
    summary: copy('Se revisan los controles existentes y la visibilidad que falta.', 'Existing controls and visibility gaps are reviewed.'),
    actor: copy('Comprador y participantes del programa', 'Buyer and programme participants'),
    change: copy('Se acuerdan el alcance, los casos de uso y lo que se quiere medir.', 'Scope, use cases and what to measure are agreed.'),
    limit: copy('Ruta propuesta, no receta jurídica universal ni compromiso de despliegue.', 'Proposed route, not a universal legal formula or a deployment commitment.'),
    rows: [
      { label: copy('Ruta industrial', 'Industry route'), detail: copy('Acuerdo voluntario entre las partes.', 'Voluntary agreement between the parties.') },
      { label: copy('Programa público', 'Public programme'), detail: copy('Decisiones de autoridad y contratación según su jurisdicción.', 'Authority and procurement decisions under its jurisdiction.') },
    ],
  },
  {
    id: 'b1-rules', chapter: 'rules', seconds: 18, kind: 'record',
    title: copy('Las reglas preceden a la tecnología.', 'Rules come before technology.'),
    summary: copy('Qué se identifica, quién registra, qué es público y qué se protege.', 'What gets identified, who records, what is public and what is protected.'),
    actor: copy('Responsables del programa y participantes', 'Programme owners and participants'),
    change: copy('Se documentan datos, permisos, responsabilidades y costes a acordar.', 'Data, permissions, responsibilities and costs to agree are documented.'),
    limit: copy('La titularidad no se atribuye automáticamente al Estado ni a Traza.', 'Ownership is not automatically assigned to the state or to Traza.'),
    rows: [
      { label: copy('Datos y acceso', 'Data and access'), detail: copy('Titularidad, custodia y permisos definidos por programa.', 'Ownership, custody and permissions defined per programme.') },
      { label: copy('Operación', 'Operations'), detail: copy('Equipos, consumibles, integración y soporte: responsabilidades por acordar.', 'Equipment, consumables, integration and support: responsibilities to agree.') },
    ],
  },
  {
    id: 'b2-consultation', chapter: 'rules', seconds: 12, kind: 'events',
    title: copy('Escuchar también se documenta.', 'Listening is documented too.'),
    summary: copy('Consulta, documenta y responde a las observaciones.', 'Consult, document and respond to the comments received.'),
    actor: copy('Industria, operadores y responsable del programa', 'Industry, operators and programme owner'),
    change: copy('Las observaciones reciben una respuesta y quedan trazables.', 'Comments receive a response and remain traceable.'),
    limit: copy('La consulta puede ajustar o confirmar las decisiones; no obliga a cambiar todo.', 'Consultation may adjust or confirm decisions; it does not require changing everything.'),
  },
  {
    id: 'b3-authorisation', chapter: 'pilot', seconds: 20, kind: 'decision',
    title: copy('Autorizar. Medir. Después intervenir.', 'Authorise. Measure. Then intervene.'),
    summary: copy('El piloto requiere su autorización o contratación previa.', 'The pilot requires prior authorisation or contracting.'),
    actor: copy('Comprador, responsables del piloto y evaluación', 'Buyer, pilot owners and evaluation team'),
    change: copy('Se acuerda el método y se mide la situación inicial antes del piloto.', 'The method is agreed and the starting position is measured before the pilot.'),
    limit: copy('La vía pública depende del régimen aplicable; un acuerdo privado no sustituye esa autoridad.', 'The public route depends on the applicable regime; a private agreement does not replace that authority.'),
    rows: [
      { label: copy('Condición previa', 'Prerequisite'), detail: copy('Autorización o contratación del piloto.', 'Pilot authorisation or contracting.') },
      { label: copy('Línea base', 'Baseline'), detail: copy('Medición previa con método y comparación acordados.', 'Prior measurement with an agreed method and comparison.') },
    ],
  },
  {
    id: 'b4-pilot', chapter: 'pilot', seconds: 16, kind: 'events',
    title: copy('Probar con quienes lo van a operar.', 'Test with the people who will operate it.'),
    summary: copy('El piloto prueba aplicación, lectura, captura e integración.', 'The pilot tests application, reading, capture and integration.'),
    actor: copy('Participantes del piloto y proveedor técnico propuesto', 'Pilot participants and proposed technical supplier'),
    change: copy('Se vuelve a medir y se compara con la línea base.', 'Measure again and compare with the baseline.'),
    limit: copy('Atribuir una mejora es difícil. Comparar no demuestra por sí solo causalidad.', 'Attributing an improvement is difficult. Comparison alone does not establish causality.'),
    extra: [copy('La comparación puede apoyarse en un control o en despliegue escalonado, según el método acordado. No se muestran porcentajes, plazos ni resultados de Traza que no estén acreditados.', 'The comparison may use a control or a phased rollout, according to the agreed method. No unsubstantiated Traza percentages, deadlines or results are shown.')],
  },
  {
    id: 'b5-evaluation', chapter: 'evaluation', seconds: 18, kind: 'decision',
    title: copy('Evaluar con independencia.', 'Evaluate independently.'),
    summary: copy('El proveedor no escribe el dictamen de la auditoría independiente.', 'The supplier does not write the independent audit findings.'),
    actor: copy('Evaluador independiente y responsable del programa', 'Independent evaluator and programme owner'),
    change: copy('Se contrasta la evidencia con los criterios de aceptación.', 'Evidence is assessed against the acceptance criteria.'),
    limit: copy('Una auditoría puede aprobar sin hallazgos. La corrección mostrada es solo un ejemplo.', 'An audit may approve without findings. The correction shown is only an example.'),
    rows: [
      { label: copy('Posible resultado', 'Possible outcome'), detail: copy('Conforme con los criterios acordados.', 'Meets the agreed criteria.') },
      { label: copy('Ejemplo con observación', 'Example with a finding'), detail: copy('Ajustar una captura incompleta y volver a comprobarla.', 'Correct an incomplete capture and check it again.') },
    ],
  },
  {
    id: 'b6-scale', chapter: 'scale', seconds: 18, kind: 'decision',
    title: copy('Escalar es una decisión informada.', 'Scaling is an informed decision.'),
    summary: copy('La ampliación se apoya en aceptación medible, coste y capacidad.', 'Expansion rests on measurable acceptance, cost and capacity.'),
    actor: copy('Comprador y autoridad o partes competentes', 'Buyer and competent authority or parties'),
    change: copy('Se decide avanzar, ajustar o no ampliar; la incorporación puede hacerse por fases.', 'The decision is to proceed, adjust or not expand; onboarding may be phased.'),
    limit: copy('Traza es una empresa privada. Este relato no acredita una adjudicación ni un aval.', 'Traza is a private company. This story does not establish a contract award or endorsement.'),
    rows: [{ label: copy('Rol técnico de Traza · propuesta', 'Traza’s technical role · proposal'), detail: copy('Emisión, eventos, consulta, integración y portabilidad; alcance por acordar.', 'Issuance, events, lookup, integration and portability; scope to agree.') }],
  },
  {
    id: 'b7-continuity', chapter: 'continuity', seconds: 20, kind: 'record',
    title: copy('El programa debe poder continuar.', 'The programme must be able to continue.'),
    summary: copy('Titularidad, custodia, permisos y portabilidad: pactados en cada programa.', 'Ownership, custody, permissions and portability: agreed per programme.'),
    actor: copy('Responsable del programa, participantes y proveedores', 'Programme owner, participants and suppliers'),
    change: copy('Se prueba la exportación y la transición de proveedor sin perder registros ni permisos.', 'Export and supplier transition are tested without losing records or permissions.'),
    limit: copy('Continuidad propuesta, no capacidad desplegada acreditada. Requiere acuerdos y pruebas.', 'Proposed continuity, not an established deployed capability. It requires agreements and tests.'),
    rows: [
      { label: copy('Incorporación', 'Onboarding'), detail: copy('Fases, formación y soporte por acordar.', 'Phases, training and support to agree.') },
      { label: copy('Salida y continuidad', 'Exit and continuity'), detail: copy('Formatos abiertos, exportación completa y sustitución del proveedor.', 'Open formats, complete export and supplier replacement.') },
    ],
  },
];

const UI = {
  heading: copy('Cada producto\ntiene una historia.', 'Every product\nhas a story.'),
  region: copy('Recorridos ilustrados de trazabilidad', 'Illustrated traceability journeys'),
  tabs: copy('Elegir un recorrido', 'Choose a journey'),
  chapters: copy('Capítulos del recorrido', 'Journey chapters'),
  play: copy('Reproducir recorrido', 'Play journey'),
  pause: copy('Pausar', 'Pause'),
  resume: copy('Continuar recorrido', 'Resume journey'),
  replay: copy('Volver a reproducir', 'Replay journey'),
  restart: copy('Reiniciar', 'Restart'),
  previous: copy('Anterior', 'Previous'),
  next: copy('Siguiente', 'Next'),
  manualStart: copy('Explorar paso a paso', 'Explore step by step'),
  rhythm: copy('Tú controlas el ritmo', 'You set the pace'),
  reduced: copy('Movimiento reducido: avanza a tu ritmo con Anterior y Siguiente.', 'Reduced motion: use Previous and Next at your own pace.'),
  noScript: copy('Puedes leer los dos recorridos completos abajo. La reproducción necesita JavaScript.', 'Both complete journeys are readable below. Playback requires JavaScript.'),
  transcript: copy('Leer el recorrido completo', 'Read the complete journey'),
  actor: copy('Quién aporta o decide', 'Who contributes or decides'),
  change: copy('Qué cambia', 'What changes'),
  limit: copy('Límite de esta lectura', 'Limit of this reading'),
  record: copy('Registro relacionado', 'Related record'),
  recordNote: copy('El relato no modifica este registro.', 'The story does not modify this record.'),
  imageAlt: copy('Frasco ámbar de medicamento de 120 ml con una banda cian y código QR.', 'A 120 ml amber medicine bottle with a cyan band and QR code.'),
  step: copy('Paso {current} de {total}: {title}', 'Step {current} of {total}: {title}'),
  pausedAway: copy('En pausa al salir de la vista. Puedes continuar cuando quieras.', 'Paused when leaving the view. Resume whenever you are ready.'),
  finished: copy('Recorrido completado. Puedes repetirlo o explorar sus capítulos.', 'Journey completed. Replay it or explore its chapters.'),
  proposal: copy('Ilustración · propuesta', 'Illustration · proposal'),
  illustratedObject: copy('Objeto ilustrado', 'Illustrated object'),
  relation: copy('Relación ilustrada entre el producto y los datos de este paso. No es un escaneo ni una comprobación física.', 'Illustrated relationship between the product and this step’s data. This is not a scan or a physical check.'),
};

/** Both languages share a clock, sized for the longer visible reading, not for a short film target. */
function readingDuration(source: SourceBeat): number {
  const words = (locale: Locale) => [source.title[locale], source.summary[locale], source.actor[locale],
    source.change[locale], source.limit[locale], UI.actor[locale], UI.change[locale],
    ...(source.rows ?? []).flatMap((row) => [row.label[locale], row.detail[locale]])]
    .join(' ').trim().split(/\s+/u).length;
  const comfortableReadingMs = Math.ceil((Math.max(words('es'), words('en')) / 2.5 + 1.6) * 1000);
  return Math.max(source.seconds * 1000, comfortableReadingMs);
}

function localiseBeat(source: SourceBeat, locale: Locale): NarrativeBeat {
  const rows = (source.rows ?? []).map((row) => ({ label: row.label[locale], detail: row.detail[locale] }));
  return {
    id: source.id, chapter: source.chapter, kind: source.kind, durationMs: readingDuration(source),
    title: source.title[locale], summary: source.summary[locale], actor: source.actor[locale],
    change: source.change[locale], limit: source.limit[locale], rows,
    transcript: [source.summary[locale], `${UI.actor[locale]}: ${source.actor[locale]}.`,
      `${UI.change[locale]}: ${source.change[locale]}`, ...rows.map((row) => `${row.label}: ${row.detail}`),
      source.limit[locale], ...(source.extra ?? []).map((line) => line[locale])],
  };
}

/** One declarative narrative source for the web and a future independently verified video export. */
export function getV2Narrative(locale: Locale) {
  const ui = Object.fromEntries(Object.entries(UI).map(([key, value]) => [key, value[locale]])) as Record<keyof typeof UI, string>;
  const stories: NarrativeStory[] = [
    {
      id: 'product', title: ui.heading,
      tab: copy('Historia del producto', 'Product story')[locale],
      introduction: copy('Explora cómo se conecta una unidad con su registro.', 'Explore how a unit is connected to its record.')[locale],
      label: ui.proposal,
      chapters: [
        { id: 'identity', label: copy('Identidad', 'Identity')[locale] },
        { id: 'activation', label: copy('Activación', 'Activation')[locale] },
        { id: 'journey', label: copy('Recorrido', 'Journey')[locale] },
        { id: 'lookup', label: copy('Consulta', 'Lookup')[locale] },
      ],
      beats: PRODUCT.map((beat) => localiseBeat(beat, locale)),
    },
    {
      id: 'programme', title: copy('Un programa sólido\nse construye por etapas.', 'A sound programme\nis built in stages.')[locale],
      tab: copy('Implementación del programa', 'Programme implementation')[locale],
      introduction: copy('De la necesidad al piloto, la evaluación y la continuidad.', 'From the need to the pilot, evaluation and continuity.')[locale],
      label: copy('Ruta propuesta · sujeta al régimen aplicable', 'Proposed route · subject to the applicable regime')[locale],
      chapters: [
        { id: 'scope', label: copy('Alcance', 'Scope')[locale] },
        { id: 'rules', label: copy('Reglas', 'Rules')[locale] },
        { id: 'pilot', label: copy('Piloto', 'Pilot')[locale] },
        { id: 'evaluation', label: copy('Evaluación', 'Evaluation')[locale] },
        { id: 'scale', label: copy('Escala', 'Scale')[locale] },
        { id: 'continuity', label: copy('Continuidad', 'Continuity')[locale] },
      ],
      beats: PROGRAMME.map((beat) => localiseBeat(beat, locale)),
    },
  ];
  return { ui, stories };
}

/** Reference to an existing unit in the fixtures, not a new identifier or activation timestamp. */
export const NARRATIVE_UNIT_REFERENCE = {
  code: FEATURED_UNIT_CODE,
  issuedAt: UNIT_BY_CODE.get(FEATURED_UNIT_CODE)?.signature.issuedAt,
  registeredAt: UNIT_BY_CODE.get(FEATURED_UNIT_CODE)?.registry.registeredAt,
} as const;

export function narrativeDuration(story: NarrativeStory): number {
  return story.beats.reduce((total, beat) => total + beat.durationMs, 0);
}

/** Clamps a timeline position; useful to keep a separately verified video aligned with the web. */
export function narrativeBeatAt(story: NarrativeStory, elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;
  let end = 0;
  for (let index = 0; index < story.beats.length; index += 1) {
    end += story.beats[index].durationMs;
    if (elapsedMs < end) return index;
  }
  return Math.max(0, story.beats.length - 1);
}
