import { getContent } from '../src/content/index.ts';
const KEYS = ['platform','solutions','solutionsGovernment','solutionsIndustry','solutionsCitizens','howItWorks','caseSpirits','security','company','privacy','notFound','verify','journey','institutional'] as const;
for (const loc of ['es','en'] as const) {
  const d = getContent(loc) as any;
  console.log(`\n##### ${loc}`);
  for (const k of KEYS) {
    console.log(`[${k}] T(${d[k].meta.title.length}) ${d[k].meta.title}`);
    console.log(`      D(${d[k].meta.description.length}) ${d[k].meta.description}`);
  }
  console.log(`[home] D(${(d as any).home.meta.description.length}) ${(d as any).home.meta.description}`);
}
