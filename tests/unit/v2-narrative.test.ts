import { describe, expect, it } from 'vitest';
import { getV2Narrative, NARRATIVE_DEMO_REFERENCE, narrativeBeatAt, narrativeDuration } from '@/content/v2-narrative';
import { FEATURED_UNIT_CODE, UNIT_BY_CODE } from '@/fixtures/units';
import type { Locale } from '@/i18n';
import { readFileSync } from 'node:fs';

const componentSource = readFileSync(new URL('../../src/components/story/StoryPlayer.astro', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../../src/components/story/story-player.css', import.meta.url), 'utf8');

describe('v2 narrative contract', () => {
  it('does not collide with the existing count-up enhancement that replaces container text', () => {
    expect(componentSource).not.toMatch(/\bdata-count\s*=/);
    expect(styleSource).not.toMatch(/\[data-count(?:=|\])/);
    expect(componentSource).toContain('data-chapter-count={story.chapters.length}');
    expect(styleSource).toContain('[data-chapter-count="6"]');
  });
  it('preserves structural parity, identifiers and shared timing in ES and EN', () => {
    const es = getV2Narrative('es');
    const en = getV2Narrative('en');
    expect(Object.keys(es.ui)).toEqual(Object.keys(en.ui));
    expect(es.stories.map((story) => story.id)).toEqual(en.stories.map((story) => story.id));
    es.stories.forEach((story, index) => {
      const other = en.stories[index];
      expect(story.chapters.map((chapter) => chapter.id)).toEqual(other.chapters.map((chapter) => chapter.id));
      expect(story.beats.map(({ id, chapter, kind, durationMs }) => ({ id, chapter, kind, durationMs })))
        .toEqual(other.beats.map(({ id, chapter, kind, durationMs }) => ({ id, chapter, kind, durationMs })));
      story.beats.forEach((beat, beatIndex) => {
        expect(beat.rows.length).toBe(other.beats[beatIndex].rows.length);
        expect(beat.transcript.length).toBe(other.beats[beatIndex].transcript.length);
      });
    });
  });

  it('links to an existing fixture and does not invent dates or a public identifier', () => {
    const unit = UNIT_BY_CODE.get(FEATURED_UNIT_CODE)!;
    expect(NARRATIVE_DEMO_REFERENCE.code).toBe(unit.code);
    expect(NARRATIVE_DEMO_REFERENCE.issuedAt).toBe(unit.signature.issuedAt);
    expect(NARRATIVE_DEMO_REFERENCE.registeredAt).toBe(unit.registry.registeredAt);
    expect(Number.isFinite(Date.parse(NARRATIVE_DEMO_REFERENCE.issuedAt!))).toBe(true);
    expect(Number.isFinite(Date.parse(NARRATIVE_DEMO_REFERENCE.registeredAt!))).toBe(true);
    expect(JSON.stringify(getV2Narrative('es'))).not.toMatch(/TRZ-DEMO-|\b20\d{2}-\d{2}-\d{2}\b/);
    expect(JSON.stringify(getV2Narrative('en'))).not.toMatch(/TRZ-DEMO-|\b20\d{2}-\d{2}-\d{2}\b/);
  });

  for (const locale of ['es', 'en'] as Locale[]) {
    describe(locale, () => {
      const { ui, stories } = getV2Narrative(locale);
      const [product, programme] = stories;

      it('keeps four product chapters and six programme chapters, with all eight programme steps', () => {
        expect(product.chapters).toHaveLength(4);
        expect(programme.chapters).toHaveLength(6);
        expect(programme.beats).toHaveLength(8);
        expect(product.beats.map((beat) => beat.id)).toEqual([
          'a0-unit', 'a1-registration', 'a2-issued', 'a3-applied', 'a3-activated',
          'a4-aggregation', 'a4-disaggregation', 'a5-events', 'a6-lookup', 'a7-review',
        ]);
      });

      it('gives every chapter usable beats and every beat full accessible copy', () => {
        Object.values(ui).forEach((text) => expect(text.trim().length).toBeGreaterThan(0));
        stories.forEach((story) => {
          story.chapters.forEach((chapter) => expect(story.beats.some((beat) => beat.chapter === chapter.id)).toBe(true));
          expect(new Set(story.beats.map((beat) => beat.id)).size).toBe(story.beats.length);
          story.beats.forEach((beat) => {
            [beat.title, beat.summary, beat.actor, beat.change, beat.limit, ...beat.transcript]
              .forEach((text) => expect(text.trim().length).toBeGreaterThan(0));
            expect(story.chapters.some((chapter) => chapter.id === beat.chapter)).toBe(true);
            expect(beat.transcript).toContain(beat.limit);
            beat.rows.forEach((row) => expect(beat.transcript).toContain(`${row.label}: ${row.detail}`));
          });
        });
      });

      it('uses a reading budget for everything visible, with at least 32 seconds for A6', () => {
        expect(product.beats.find((beat) => beat.id === 'a6-lookup')!.durationMs).toBeGreaterThanOrEqual(32000);
        stories.forEach((story) => story.beats.forEach((beat) => {
          const words = [beat.title, beat.summary, beat.actor, beat.change, beat.limit, ui.actor, ui.change,
            ...beat.rows.flatMap((row) => [row.label, row.detail])].join(' ').trim().split(/\s+/u).length;
          expect(beat.durationMs).toBeGreaterThanOrEqual(Math.ceil((words / 2.5 + 1.6) * 1000));
        }));
      });

      it('includes all four C.1 checks and the physical-authenticity limitation', () => {
        const beat = product.beats.find((item) => item.id === 'a6-lookup')!;
        expect(beat.rows.map((row) => row.label)).toEqual(locale === 'es'
          ? ['Firma', 'Registro', 'Datos', 'Señales'] : ['Signature', 'Registry', 'Data', 'Signals']);
        expect(beat.rows[0].detail).toContain(locale === 'es' ? 'Simulada; no evita copias físicas.' : 'Simulated; does not prevent physical copies.');
        expect(beat.rows[2].detail).toContain(locale === 'es' ? 'La persona revisa' : 'The person checks');
        expect(beat.rows[3].detail).toContain(locale === 'es' ? 'Sin alertas no significa sin riesgos.' : 'No alerts does not mean no risks.');
        expect(beat.transcript).toContain(locale === 'es'
          ? 'Consulta simulada. No certifica autenticidad física.' : 'Simulated lookup. Does not certify physical authenticity.');
      });

      it('uses corrected C.1 missing-event language and keeps the causes non-exhaustive', () => {
        const beat = product.beats.find((item) => item.id === 'a5-events')!;
        expect(beat.summary).toBe(locale === 'es'
          ? 'El registro está incompleto. Revisemos el motivo y la cobertura esperada.'
          : 'The record is incomplete. Let us review the reason and the expected coverage.');
        expect(beat.limit).toContain(locale === 'es' ? 'es un estado, no una causa' : 'is a state, not a cause');
        expect(beat.rows[1].detail).toContain(locale === 'es' ? 'u otro motivo' : 'or another reason');
      });

      it('distinguishes private and public routes and labels possible audit outcomes', () => {
        expect(programme.beats[0].rows).toHaveLength(2);
        const audit = programme.beats.find((beat) => beat.id === 'b5-evaluation')!;
        expect(audit.limit).toContain(locale === 'es' ? 'puede aprobar sin hallazgos' : 'may approve without findings');
        expect(audit.rows[1].label).toContain(locale === 'es' ? 'Ejemplo' : 'Example');
        expect(programme.beats.find((beat) => beat.id === 'b6-scale')!.limit)
          .toContain(locale === 'es' ? 'empresa privada' : 'private company');
      });

      it('maps the shared timeline at boundaries and clamps invalid positions safely', () => {
        stories.forEach((story) => {
          expect(narrativeBeatAt(story, -1)).toBe(0);
          expect(narrativeBeatAt(story, Number.NaN)).toBe(0);
          expect(narrativeBeatAt(story, 0)).toBe(0);
          expect(narrativeBeatAt(story, story.beats[0].durationMs - 1)).toBe(0);
          expect(narrativeBeatAt(story, story.beats[0].durationMs)).toBe(1);
          expect(narrativeBeatAt(story, narrativeDuration(story))).toBe(story.beats.length - 1);
          expect(narrativeBeatAt(story, narrativeDuration(story) + 5000)).toBe(story.beats.length - 1);
        });
      });
    });
  }
});
