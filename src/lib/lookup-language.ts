/** Keep all language links for the lookup in sync, including the footer. */
export function initLookupLanguage(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-preserve-lookup]');
  if (!links.length) return;
  const sync = () => {
    const current = new URL(location.href);
    const code = current.searchParams.get('c') ?? '';
    const tenant = current.searchParams.get('t') ?? '';
    for (const link of links) {
      const target = new URL(link.href);
      target.search = '';
      if (/^TRZ-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(code)) target.searchParams.set('c', code);
      if (tenant === 'traza' || tenant === 'medicamentos') target.searchParams.set('t', tenant);
      link.href = target.href;
    }
  };
  sync();
  window.addEventListener('traza:lookup-context', sync);
  for (const link of links) link.addEventListener('click', sync);
}
