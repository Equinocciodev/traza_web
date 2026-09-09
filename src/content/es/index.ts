/**
 * Agregador de contenido (es). NO editar la lista de módulos: cada módulo tiene un propietario.
 *  - common, home, platform, solutions, how-it-works, case-medicines, security, company, privacy, not-found → contenido institucional
 *  - codeSpec · integration · rationale → páginas de referencia técnica
 *  - verify · journey · institutional
 */
import type { SiteContent } from '../types';
import { common } from './common';
import { home } from './home';
import { platform } from './platform';
import { solutions, solutionsGovernment, solutionsIndustry, solutionsCitizens } from './solutions';
import { howItWorks } from './how-it-works';
import { caseMedicines } from './case-medicines';
import { codeSpec } from './code-spec';
import { integration } from './integration';
import { rationale } from './rationale';
import { security } from './security';
import { company } from './company';
import { privacy } from './privacy';
import { notFound } from './not-found';
import { verify } from './verify';
import { journey } from './journey';
import { institutional } from './institutional';

export const content: SiteContent = {
  common,
  home,
  platform,
  solutions,
  solutionsGovernment,
  solutionsIndustry,
  solutionsCitizens,
  howItWorks,
  caseMedicines,
  codeSpec,
  integration,
  rationale,
  security,
  company,
  privacy,
  notFound,
  verify,
  journey,
  institutional,
};
