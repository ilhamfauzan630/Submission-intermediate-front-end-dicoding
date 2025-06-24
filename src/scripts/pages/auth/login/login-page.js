import * as StoryAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';
import LoginPresenter from './login-presenter';

export default class LoginPage {
    #presenter = null;

    async render() {
        return `
        <section class="login-container">
            <article class="login-form-container">
                <div class="login-item">
                    <img class="login__image" src="./images/login-image-cut.jpg" alt="Login Image" />
                </div>
                <div class="login-item">
                    <h1 class="login__title">Login</h1>

                    <form id="login-form" class="login-form">
                        <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Masukkan email" required />
                        </div>

                        <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Masukkan password" required />
                        </div>

                        
                        <div id="submit-button-container">
                            <button type="submit" class="btn">Login</button>
                        </div>
                        <p class="register-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
                    </form>
                </div>
                
            </article>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new LoginPresenter({
            view: this,
            model: StoryAPI,
            authModel: AuthModel,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('login-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            this.#presenter.getLogin({ email, password });
        });
    }

    loginSuccessfully(message, data) {
        console.log('Login successfully:', message, data);

        location.hash = '/';
    }

    loginFailed(message) {
        alert(message);
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