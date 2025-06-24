import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateUnauthenticatedNavigationListTemplate,
  generateAuthenticatedNavigationListTemplate
} from '../template';
import { getAccessToken, getLogout } from '../utils/auth';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navList = this.#navigationDrawer.querySelector('.nav-list');

    if (!isLogin) {
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = this.#navigationDrawer.querySelector('.logout-button');
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        getLogout();

        // Redirect
        location.hash = '/login';
      }
    })
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route();

    this.#content.innerHTML = await page.render();
    this.#setupNavigationList();

    await page.afterRender();
  }
}

export default App;
