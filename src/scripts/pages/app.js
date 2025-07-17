import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateUnauthenticatedNavigationListTemplate,
  generateAuthenticatedNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate
} from '../templates';
import { getAccessToken, getLogout } from '../utils/auth';
import { isServiceWorkerAvailable, setupSkipToContent, transitionHelper } from '../utils';
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe, } from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton;


  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    setupSkipToContent(this.#skipLinkButton, this.#content);
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

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();

      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      window.location.hash = '/login';
      return;
    }

    const page = route();

    if (!page || typeof page.render !== 'function') {
      console.warn('Page tidak valid atau redirect sedang terjadi.');
      return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });

  }
}

export default App;
