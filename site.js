const drawer = document.querySelector('#site-drawer');
const content = document.querySelector('#drawer-content');
const kicker = document.querySelector('#drawer-kicker');
const cards = [...document.querySelectorAll('[data-project]')];
const ids = cards.map((card) => card.dataset.project);

document.querySelectorAll('.case-video').forEach((player) => {
  const video = player.querySelector('video');
  const poster = player.querySelector('.case-video-poster');
  poster?.addEventListener('click', () => {
    player.classList.add('is-active');
    video.play().catch(() => player.classList.remove('is-active'));
  });
});

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function openDrawer() {
  if (!drawer.open) drawer.showModal();
  content.scrollTop = 0;
  content.focus({ preventScroll: true });
}

function showMenu() {
  kicker.textContent = '导航 / INDEX';
  const title = element('h2', '', '项目目录');
  title.id = 'drawer-title';
  const list = element('div', 'drawer-list');
  cards.forEach((card, index) => {
    const link = element('a');
    link.href = `#${ids[index]}`;
    link.append(element('span', 'list-number', String(index + 1).padStart(2, '0')));
    link.append(element('strong', '', card.querySelector('.card-title').textContent.trim()));
    link.append(element('small', '', card.querySelector('.project-type').textContent));
    link.append(element('span', 'list-arrow', '↗'));
    list.append(link);
  });
  const shortcuts = element('div', 'drawer-shortcuts');
  [['#about', '关于我'], ['#contact', '联系方式'], ['resume.pdf', '简历 PDF ↗']].forEach(([href, label]) => {
    const link = element('a', '', label);
    link.href = href;
    if (href.endsWith('.pdf')) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    shortcuts.append(link);
  });
  content.replaceChildren(title, list, shortcuts);
  openDrawer();
}

function showProject(id) {
  const index = ids.indexOf(id);
  if (index < 0) return;
  const section = document.getElementById(id);
  const card = cards[index];
  kicker.textContent = `项目速览 / ${String(index + 1).padStart(2, '0')} OF ${String(ids.length).padStart(2, '0')}`;
  const title = element('h2', '', section.querySelector('h2').textContent.trim());
  title.id = 'drawer-title';
  const lead = element('p', 'drawer-lead', section.querySelector('.case-lead').textContent);
  const facts = element('p', 'drawer-meta', section.querySelector('.case-facts').innerText);
  const image = card.querySelector('img');
  const cover = image?.cloneNode();
  if (cover) cover.className = 'drawer-cover';
  const details = element('div', 'drawer-details');
  section.querySelectorAll('.case-body > div').forEach((block) => {
    const item = element('section');
    item.append(element('h3', '', block.querySelector('h3').textContent));
    item.append(element('p', '', block.querySelector('p').textContent));
    details.append(item);
  });
  const actions = element('div', 'drawer-actions');
  const full = element('a', '', '查看完整案例 ↗');
  full.href = `#${id}`;
  const switches = element('div', 'drawer-switches');
  [-1, 1].forEach((step) => {
    const button = element('button', '', step < 0 ? '←' : '→');
    button.type = 'button';
    button.title = step < 0 ? '上一个项目' : '下一个项目';
    button.setAttribute('aria-label', button.title);
    button.dataset.switchProject = ids[index + step] || '';
    button.disabled = !button.dataset.switchProject;
    switches.append(button);
  });
  actions.append(switches, full);
  content.replaceChildren(...[title, lead, facts, cover, details, actions].filter(Boolean));
  openDrawer();
}

document.querySelectorAll('[data-open-menu]').forEach((button) => button.addEventListener('click', showMenu));
cards.forEach((card) => card.addEventListener('click', () => showProject(card.dataset.project)));
document.querySelector('[data-close-drawer]').addEventListener('click', () => drawer.close());
drawer.addEventListener('click', (event) => {
  if (event.target === drawer) drawer.close();
  const switchButton = event.target.closest('[data-switch-project]');
  if (switchButton?.dataset.switchProject) showProject(switchButton.dataset.switchProject);
  const link = event.target.closest('a');
  if (link) drawer.close();
});
