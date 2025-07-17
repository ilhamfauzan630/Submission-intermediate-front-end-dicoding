import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import * as StoryAPI from '../../data/api';;

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Story For You</h1>
        <div class="story-list__container">
          <div id="story-list"></div>
          <div id="story-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStoryList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoryListEmpty();
      return;
    }

    const html = stories.reduce((acc, story) => {
      return acc.concat(
        generateStoryItemTemplate({
          ...story,
          storyName: story.name,
        }),
      );
    }, '');

    document.getElementById('story-list').innerHTML = `
      <div class="story-list">${html}</div>`;
  }

  populateStoryListEmpty() {
    document.getElementById('story-list').innerHTML = generateStoryListEmptyTemplate();
  }

  populateStoryListError(message) {
    document.getElementById('story-list').innerHTML = generateStoryListErrorTemplate(message);
  }

  showLoading() {
    document.getElementById('story-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('story-list-loading-container').innerHTML = '';
  }
}
