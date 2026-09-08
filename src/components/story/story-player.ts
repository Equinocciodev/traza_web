type StoryUi = Record<'play' | 'pause' | 'resume' | 'replay' | 'manualStart' | 'next' | 'step' | 'pausedAway' | 'finished', string>;

/** Progressive enhancement. All frames and transcripts are already rendered by Astro. */
export function initStoryPlayers(): void {
  document.querySelectorAll<HTMLElement>('[data-story-player]').forEach((root) => {
    if (root.dataset.enhanced === 'true') return;
    let ui: StoryUi;
    try { ui = JSON.parse(root.dataset.ui ?? '{}') as StoryUi; } catch { return; }
    if (!ui.play || !ui.step) return;

    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-story-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-story-panel]'));
    const heading = root.querySelector<HTMLElement>('[data-story-heading]');
    const announcement = root.querySelector<HTMLElement>('[data-story-announcement]');
    const connection = root.querySelector<SVGSVGElement>('[data-story-connection]');
    const objectLabel = root.querySelector<HTMLElement>('[data-story-object-label]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedData = window.matchMedia('(prefers-reduced-data: reduce)');
    let panelIndex = 0;
    let beatIndex = 0;
    let engaged = false;
    let playing = false;
    let finished = false;
    let remaining = 0;
    let startedAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let inView = true;
    let pendingConnectionFrame = 0;
    let connectionShouldAnimate = false;

    const panel = () => panels[panelIndex];
    const steps = () => Array.from(panel().querySelectorAll<HTMLElement>('[data-story-step]'));
    const manualOnly = () => reduced.matches || reducedData.matches;
    const button = (key: string) => panel().querySelector<HTMLButtonElement>(`[data-story-${key}]`);
    const say = (text: string) => { if (announcement) announcement.textContent = text; };

    function positionConnection(replay = false): void {
      connectionShouldAnimate = connectionShouldAnimate || replay;
      if (pendingConnectionFrame) return;
      pendingConnectionFrame = requestAnimationFrame(() => {
        pendingConnectionFrame = 0;
        const animate = connectionShouldAnimate;
        connectionShouldAnimate = false;
        if (!connection || !objectLabel) return;
        const show = engaged && panel().dataset.storyPanel === 'product' && window.innerWidth > 900;
        connection.setAttribute('data-hidden', String(!show));
        objectLabel.hidden = !show;
        if (!show) return;
        const frame = steps()[beatIndex];
        const source = panel().querySelector<HTMLElement>('.story__main');
        const bottle = root.querySelector<HTMLImageElement>('.story__bottle');
        const bounds = connection.getBoundingClientRect();
        if (!source || !bottle || !bounds.width) return;
        const from = source.getBoundingClientRect();
        const productBounds = bottle.getBoundingClientRect();
        const startX = from.right - bounds.left;
        const startY = frame.getBoundingClientRect().top - bounds.top;
        // Measured point on the DEMO band of this exact 1024×1536 image, not a floating endpoint.
        const endX = productBounds.left - bounds.left + productBounds.width * .55;
        const endY = productBounds.top - bounds.top + productBounds.height * .74;
        objectLabel.style.left = `${Math.min(endX + 14, bounds.width * .81)}px`;
        objectLabel.style.top = `${endY - 20}px`;
        const elbow = startX + Math.max(20, (endX - startX) * .52);
        connection.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
        connection.querySelector('[data-story-connection-path]')?.setAttribute('d',
          `M ${startX} ${startY} C ${elbow} ${startY}, ${elbow} ${endY}, ${endX} ${endY}`);
        const start = connection.querySelector('[data-story-connection-start]');
        start?.setAttribute('cx', String(startX)); start?.setAttribute('cy', String(startY));
        const end = connection.querySelector('[data-story-connection-end]');
        end?.setAttribute('cx', String(endX)); end?.setAttribute('cy', String(endY));
        if (animate) {
          connection.classList.remove('story__connection--enter');
          objectLabel.classList.remove('story__object-label--enter');
          void connection.getBoundingClientRect();
          connection.classList.add('story__connection--enter');
          objectLabel.classList.add('story__object-label--enter');
        }
      });
    }

    function updateControls(): void {
      const play = button('play');
      const label = panel().querySelector<HTMLElement>('[data-story-play-label]');
      if (label) label.textContent = manualOnly()
        ? !engaged ? ui.manualStart : beatIndex === steps().length - 1 ? ui.replay : ui.next
        : playing ? ui.pause : finished ? ui.replay : engaged ? ui.resume : ui.play;
      if (play) {
        play.setAttribute('aria-pressed', String(playing));
        play.disabled = false;
      }
      const previous = button('previous');
      const next = button('next');
      const restart = button('restart');
      if (previous) previous.disabled = !engaged || beatIndex === 0;
      if (next) next.disabled = !engaged || beatIndex >= steps().length - 1;
      if (restart) restart.disabled = !engaged;
      root.dataset.playing = String(playing);
      root.dataset.engaged = String(engaged);
      positionConnection();
      panels.forEach((item) => {
        const note = item.querySelector<HTMLElement>('[data-story-reduced]');
        if (note) note.hidden = !manualOnly();
      });
    }

    function stop(message?: string): void {
      if (playing) remaining = Math.max(0, remaining - (performance.now() - startedAt));
      clearTimeout(timer);
      timer = undefined;
      playing = false;
      updateControls();
      if (message) say(message);
    }

    function showStep(index: number, announce = true): void {
      const frames = steps();
      beatIndex = Math.max(0, Math.min(index, frames.length - 1));
      const current = frames[beatIndex];
      frames.forEach((frame, frameIndex) => { frame.hidden = frameIndex !== beatIndex; });
      panel().querySelectorAll<HTMLButtonElement>('[data-story-chapter]').forEach((chapter) => {
        if (chapter.dataset.storyChapter === current.dataset.chapter) chapter.setAttribute('aria-current', 'step');
        else chapter.removeAttribute('aria-current');
      });
      remaining = Number(current.dataset.duration) || 10000;
      finished = false;
      updateControls();
      positionConnection(true);
      if (announce) say(ui.step.replace('{current}', String(beatIndex + 1)).replace('{total}', String(frames.length))
        .replace('{title}', current.querySelector('[data-story-step-title]')?.textContent ?? ''));
    }

    function schedule(): void {
      if (!playing || manualOnly() || document.hidden || !inView) return;
      startedAt = performance.now();
      timer = setTimeout(() => {
        if (beatIndex >= steps().length - 1) {
          stop();
          finished = true;
          updateControls();
          say(ui.finished);
          return;
        }
        showStep(beatIndex + 1);
        schedule();
      }, Math.max(remaining, 1));
    }

    function goTo(index: number): void {
      stop();
      engaged = true;
      showStep(index);
    }

    function selectTab(index: number, focus = false): void {
      stop();
      panelIndex = index;
      engaged = false;
      finished = false;
      panels.forEach((item, itemIndex) => { item.hidden = itemIndex !== index; });
      tabs.forEach((tab, tabIndex) => {
        tab.setAttribute('aria-selected', String(tabIndex === index));
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
      if (heading) heading.textContent = panel().dataset.title ?? heading.textContent;
      showStep(0, false);
      if (focus) tabs[index].focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(index));
      tab.addEventListener('keydown', (event) => {
        let target = index;
        if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(target, true);
      });
    });

    panels.forEach((item) => {
      item.querySelector<HTMLButtonElement>('[data-story-play]')?.addEventListener('click', () => {
        if (playing) { stop(); return; }
        if (manualOnly()) {
          if (!engaged) { engaged = true; showStep(0); }
          else goTo(beatIndex >= steps().length - 1 ? 0 : beatIndex + 1);
          return;
        }
        if (!engaged || finished) { engaged = true; showStep(0); }
        if (document.hidden || !inView) { stop(ui.pausedAway); return; }
        playing = true;
        updateControls();
        schedule();
      });
      item.querySelector<HTMLButtonElement>('[data-story-previous]')?.addEventListener('click', () => goTo(beatIndex - 1));
      item.querySelector<HTMLButtonElement>('[data-story-next]')?.addEventListener('click', () => goTo(beatIndex + 1));
      item.querySelector<HTMLButtonElement>('[data-story-restart]')?.addEventListener('click', () => {
        stop();
        engaged = false;
        showStep(0, false);
        button('play')?.focus();
      });
      item.querySelectorAll<HTMLButtonElement>('[data-story-chapter]').forEach((chapter) => {
        chapter.addEventListener('click', () => goTo(steps().findIndex((step) => step.dataset.chapter === chapter.dataset.storyChapter)));
      });
      item.querySelector<HTMLDetailsElement>('[data-story-transcript]')?.addEventListener('toggle', (event) => {
        if ((event.currentTarget as HTMLDetailsElement).open && playing) stop();
      });
    });

    document.addEventListener('visibilitychange', () => { if (document.hidden && playing) stop(ui.pausedAway); });
    const motionChange = () => { stop(); updateControls(); };
    reduced.addEventListener('change', motionChange);
    reducedData.addEventListener('change', motionChange);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const currentEntry = entries.find((entry) => entry.target === panel().querySelector('[data-story-controls-view]'));
        if (!currentEntry) return;
        inView = currentEntry.isIntersecting;
        if (!inView && playing) stop(ui.pausedAway);
      }, { threshold: 0 });
      panels.forEach((item) => {
        const controls = item.querySelector('[data-story-controls-view]');
        if (controls) observer.observe(controls);
      });
      document.addEventListener('astro:before-swap', () => { stop(); observer.disconnect(); }, { once: true });
    }
    const resizeObserver = new ResizeObserver(() => positionConnection());
    resizeObserver.observe(root);
    document.addEventListener('astro:before-swap', () => {
      resizeObserver.disconnect(); cancelAnimationFrame(pendingConnectionFrame);
    }, { once: true });

    root.dataset.enhanced = 'true';
    root.querySelectorAll<HTMLButtonElement>('[data-story-tab], [data-story-chapter]').forEach((control) => { control.disabled = false; });
    panels.forEach((item) => {
      const transcript = item.querySelector<HTMLDetailsElement>('[data-story-transcript]');
      if (transcript) transcript.open = false;
    });
    selectTab(0);
  });
}
