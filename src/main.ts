import './styles.css';
import { hats } from './catalog/hats';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('WEAR requires an #app element.');

const title = document.createElement('h1');
title.textContent = 'WEAR';
const intro = document.createElement('p');
intro.className = 'intro';
intro.textContent = 'Try your style, live on camera.';

const status = document.createElement('p');
status.className = 'status';
status.textContent = 'The project foundation is ready. Camera access and virtual try-on are not implemented yet.';

const panel = document.createElement('section');
panel.setAttribute('aria-labelledby', 'catalog-title');
const heading = document.createElement('h2');
heading.id = 'catalog-title';
heading.textContent = 'First milestone: hats';
panel.append(heading);

for (const hat of hats) {
  const item = document.createElement('article');
  const name = document.createElement('h3');
  name.textContent = hat.name;
  const description = document.createElement('p');
  description.textContent = hat.description;
  const action = document.createElement('button');
  action.type = 'button';
  action.disabled = true;
  action.textContent = 'Try-on is not available yet';
  item.append(name, description, action);
  panel.append(item);
}

const future = document.createElement('p');
future.className = 'future';
future.textContent = 'Planned next: hat variants, masks, necklaces, and clothing visible above the chest.';
app.append(title, intro, status, panel, future);
