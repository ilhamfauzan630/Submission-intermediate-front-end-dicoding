import {
    generateLoaderAbsoluteTemplate,
    generateStoryItemTemplate,
    generateStoryListEmptyTemplate,
    generateStoryListErrorTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';

export default class BookmarkPage {
    #presenter = null;

    async render() {
        return `
        <section class="container">
            <h1 class="page-title">Story Bookmarked</h1>
            <div class="story-list__container">
            <div id="story-list"></div>
            <div id="story-list-loading-container"></div>
            </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new BookmarkPresenter({
            view: this,
            model: Database,
        });


        await this.#presenter.initialGalleryAndMap();
    }

    populateStoryList(message, stories) {
        if (stories.length <= 0) {
            this.populateBookmarkedStoryListEmpty();
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

        document.getElementById('story-list').innerHTML = `<div class="story-list">${html}</div>`;
    }

    populateBookmarkedStoryListEmpty() {
        document.getElementById('story-list').innerHTML = generateStoryListEmptyTemplate();
    }

    populateBookmarkedStoryListError(message) {
        document.getElementById('story-list').innerHTML = generateStoryListErrorTemplate(message);
    }

    showLoading() {
        document.getElementById('story-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideLoading() {
        document.getElementById('story-list-loading-container').innerHTML = '';
    }
}
