import * as StoryAPI from '../../../data/api';
import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
    #presenter = null;

    async render() {
        return `
        <section class="register-container">
            <article class="register-form-container">
                <div class="register-item">
                    <img class="register__image" src="./images/register-image-cut.jpg" alt="Register Image" />
                </div>
                <div class="register-item">
                    <h1 class="register__title">Register</h1>

                    <form id="register-form" class="register-form">
                        <div class="form-group">
                            <label for="name">Nama</label>
                            <input type="text" id="name" name="name" placeholder="Masukkan nama" required />
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Masukkan email" required />
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Masukkan password" required />
                        </div>

                        <div id="submit-button-container">
                            <button type="submit" class="btn">register</button>
                        </div>
                        <p class="register-link">Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
                    </form>
                </div>

            </article>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new RegisterPresenter({
            view: this,
            model: StoryAPI,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('register-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            }

            this.#presenter.getRegistered(data);
        });
    }

    registeredSuccessfully(message) {
        console.log(message);

        // Redirect
        location.hash = '/login';
    }

    registeredFailed(message) {
        alert(message);
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fas fa-spinner loader-button"></i> Daftar akun
            </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit">Daftar akun</button>
        `;
    }
}