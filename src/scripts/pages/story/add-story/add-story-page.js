import AddStoryPresenter from './add-story-presenter';
import { convertBase64ToBlob } from '../../../utils/index';
import * as StoryApi from '../../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../../templates';
import Camera from '../../../utils/camera';
import Map from '../../../utils/map';

export default class AddStoryPage {
    #presenter;
    #form;
    #camera;
    #isCameraOpen = false;
    #takenPhoto = null;
    #map = null;

    async render() {
        return `
            <section class="add-story-container">
                <div class="add-story__form">
                    <h1>Add New Story</h1>
                    <form id="story-form" enctype="multipart/form-data">
                    
                        <div class="form-group">
                            <div class="add-story__photo__buttons">
                                <button id="photo-input-button" class="btn add btn--outline" type="button"> Ambil Gambar </button>
                                <input
                                    id="photo-input"
                                    class="add-form__photo__input"
                                    name="photo"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    aria-multiline="true"
                                    aria-describedby="photo-more-info"
                                >
                                <button id="open-photo-camera-button" class="btn add btn-outline" type="button">
                                    Buka Kamera
                                </button>
                            </div>
                            <div id="camera-container" class="new-form__camera__container">
                                <video id="camera-video" class="new-form__camera__video">
                                    Video stream not available.
                                </video>

                                <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
                
                                <div class="new-form__camera__tools">
                                    <select id="camera-select"></select>
                                    <div class="new-form__camera__tools_buttons">
                                        <button id="camera-take-button" class="btn" type="button">
                                        Ambil Gambar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="photo-taken-container" class="photo-preview"></div>

                        </div>
                        
                        <div class="form-group description">
                            <label for="description"><h2>Deskripsi</h2></label>
                            <textarea id="description" name="description" placeholder="Tulis deskripsi cerita..." required></textarea>
                        </div>
                    
                        <div class="form-group">
                            <div class="add-form__location__title"><h2>Lokasi</h2></div>

                            <div class="add-form__location__container">
                                <div class="add-form__location__map__container">
                                    <div id="map" class="add-form__location__map"></div>
                                    <div id="map-loading-container"></div>
                                </div>

                                <div class="add-form__location__lat-lng">
                                    <div class="latitude">
                                        <label for="lat">Latitude (opsional)</label>
                                        <input type="number" id="lat" name="lat" step="any" value="-7.8343462" disabled/>
                                    </div>
                                
                                    <div class="longitude">
                                        <label for="lon">Longitude (opsional)</label>
                                        <input type="number" id="lon" name="lon" step="any" value="110.38125" disabled/>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div id="submit-button-container">
                            <button id="submit-button" class="btn add" type="submit">Kirim Cerita</button>
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

            const latValue = this.#form.elements.namedItem('lat')?.value ?? '';
            const lonValue = this.#form.elements.namedItem('lon')?.value ?? '';

            const lat = latValue === '' ? null : Number(latValue);
            const lon = lonValue === '' ? null : Number(lonValue);

            const data = {
                description: this.#form.elements.namedItem('description').value,
                photo: this.#takenPhoto ? this.#takenPhoto.blob : null,
                lat: lat,
                lon: lon,
            }

            await this.#presenter.postNewStory(data);
        });

        document.getElementById('photo-input').addEventListener('change', async (event) => {
            const insertingPicturesPromises = Object.values(event.target.files).map(async (file) => {
                return await this.#addTakenPicture(file);
            });
            await Promise.all(insertingPicturesPromises);

            await this.#populateTakenPicture();
        });

        document.getElementById('photo-input-button').addEventListener('click', () => {
            this.#form.elements.namedItem('photo-input').click();
        });

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
        this.#map = await Map.build('#map', {
            zoom: 15,
            locate: true,
        });

        // Preparing marker for select coordinate
        const centerCoordinate = this.#map.getCenter();

        this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

        const draggableMarker = this.#map.addMarker(
            [centerCoordinate.latitude, centerCoordinate.longitude], {
                draggable: 'true'
            },
        );
        draggableMarker.addEventListener('move', (event) => {
            const coordinate = event.target.getLatLng();
            this.#updateLatLngInput(coordinate.lat, coordinate.lng);
        });

        this.#map.addMapEventListener('click', (event) => {
            draggableMarker.setLatLng(event.latlng);

            event.sourceTarget.flyTo(event.latlng);
        });
    }

    #updateLatLngInput(latitude, longitude) {
        this.#form.elements.namedItem('lat').value = latitude;
        this.#form.elements.namedItem('lon').value = longitude;
    }

    #setupCamera() {
        if (this.#camera) {
            return;
        }

        this.#camera = new Camera({
            video: document.getElementById('camera-video'),
            cameraSelect: document.getElementById('camera-select'),
            canvas: document.getElementById('camera-canvas'),
        });

        this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
            const image = await this.#camera.takePicture();
            await this.#addTakenPicture(image);
            await this.#populateTakenPicture();
        });
    }

    async #addTakenPicture(image) {
        let blob = image;

        if (typeof image === 'string') {
            blob = await convertBase64ToBlob(image, 'image/png');
        }

        this.#takenPhoto = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            blob: blob,
        };

        // Tampilkan gambar
        this.#populateTakenPicture();
    }

    async #populateTakenPicture() {
        const picture = this.#takenPhoto;
        const container = document.getElementById('photo-taken-container');

        if (!picture) {
            container.innerHTML = '';
            return;
        }

        const imageUrl = URL.createObjectURL(picture.blob);

        container.innerHTML = `
            <div class="photo-preview__item">
                <button type="button" data-deletepictureid="${picture.id}" class="photo-preview__delete-btn">
                    <img src="${imageUrl}" alt="Foto diambil" width="300px">
                </button>
            </div>
        `;

        container.querySelector('button[data-deletepictureid]').addEventListener('click', () => {
            this.#takenPhoto = null;
            this.#populateTakenPicture();
        });
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