export default class AddStoryPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showNewFormMap() {
        this.#view.showMapLoading();
        try {
            this.#view.initialMap();
        } catch (error) {
            console.error('ShowNewFormMap: error:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async postNewStory({ description, lat, lon, photo }) {
        this.#view.showSubmitLoadingButton();
        try {
            const data = {
                description: description,
                photo: photo,
                lat: lat,
                lon: lon,
            }

            const response = await this.#model.addNewStory(data);

            if (!response.ok) {
                console.error('PostNewStory: error:', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message, response.data);
        } catch (error) {
            console.error('postNewStory: error:', error);
            this.#view.storeFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}