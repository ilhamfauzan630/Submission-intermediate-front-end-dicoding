import AddStoryPresenter from './add-story-presenter';
import { convertBase64ToFile } from '../../../utils/index';
import * as StoryApi from '../../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../../templates';
import Camera from '../../../utils/camera';

export default class AddStoryPage {
    #presenter;
    #form;
    #camera;
    #isCameraOpen = false;
    #takenPhoto = null;

    async render() {
        return `
            <section class="add-story-container">
                <div class="add-story__form">
                    <h2>Add New Story</h2>
                    <form id="story-form" enctype="multipart/form-data">
                    
                        <div class="form-group">
                            <label for="photo">Foto</label>
                            <div class="add-story__photo__buttons">
                                <button id="phto-input-button" class="btn btn--outline" type="button"> Ambil Gambar </button>
                                <input
                                    id="documentations-input"
                                    class="add-form__photo__input"
                                    name="documentations"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    aria-multiline="true"
                                    aria-describedby="photo-more-info"
                                >
                                <button id="open-photo-camera-button" class="btn btn-outline" type="button">
                                    Buka Kamera
                                </button>
                            </div>
                            <div id="camera-container" class="new-form__camera__container">
                                <video id="camera-video" class="new-form__camera__video">
                                    Video stream not available.
                                </video>
                
                                <div class="new-form__camera__tools">
                                    <select id="camera-select"></select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Deskripsi</label>
                            <textarea id="description" name="description" placeholder="Tulis deskripsi cerita..." required></textarea>
                        </div>
                    
                        <div class="form-group">
                            <div class="add-form__location__title">Lokasi</div>

                            <div class="add-form__location__container">
                                <div class="add-form__location__map__container">
                                    <div id="map" class="add-form__location__map"></div>
                                    <div id="map-loading-container"></div>
                                </div>

                                <div class="add-form__location__lat-lng">
                                    <label for="lat">Latitude (opsional)</label>
                                    <input type="number" id="lat" name="lat" step="any" value="-6.200000" />
                                
                                    <label for="lon">Longitude (opsional)</label>
                                    <input type="number" id="lon" name="lon" step="any" value="106.816666" />
                                </div>
                            </div>

                        </div>

                        <div id"submit-button-container">
                            <button id="submit-button" class="btn" type="submit">Kirim Cerita</button>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new AddStoryPresenter({
            view: this,
            model: StoryApi,
        });
        this.#takenPhoto = null;

        this.#presenter.showNewFormMap();
        this.#setupForm();
    }

    #setupForm() {
        this.#form = document.getElementById('story-form');
        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            console.log('Form submitted:', this.#form);
        })

        const cameraContainer = document.getElementById('camera-container');
        document
        .getElementById('open-photo-camera-button')
        .addEventListener('click', async (event) => {
            cameraContainer.classList.toggle('open');
            this.#isCameraOpen = cameraContainer.classList.contains('open');
    
            if (this.#isCameraOpen) {
                event.currentTarget.textContent = 'Tutup Kamera';
                this.#setupCamera();
                this.#camera.launch();
        
                return;
            }
    
            event.currentTarget.textContent = 'Buka Kamera';
            this.#camera.stop();
        });
    }

    async initialMap() {
        // map
    }

    #setupCamera() {
        if (this.#camera) {
            return;
        }

        this.#camera = new Camera({
            video: document.getElementById('camera-video'),
            cameraSelect: document.getElementById('camera-select'),
        })
    }

    storeSuccessfully(message) {
        console.log(message);
        this.clearForm();

        location.href = '/';
    }

    storeFailed(message) {
        alert(message);
    }

    clearForm() {
        this.#form.reset();
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner loader-button"></i> Masuk
        </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit">Masuk</button>
        `;
    }
}