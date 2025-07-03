export default class AddStoryPage {
    async render() {
        return `
            <section class="add-story-container">
                <div class="add-story__form">
                    <h2>Add New Story</h2>
                    <form id="story-form" enctype="multipart/form-data">
                    
                        <div class="form-group">
                            <label for="photo">Foto</label>
                            <input type="file" id="photo" name="photo" accept="image/*" required />
                            <small>Maks. 1MB, hanya gambar</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Deskripsi</label>
                            <textarea id="description" name="description" placeholder="Tulis deskripsi cerita..." required></textarea>
                        </div>
                    
                        <div class="form-group">
                            <label for="lat">Latitude (opsional)</label>
                            <input type="number" id="lat" name="lat" step="any" placeholder="-6.200000" />
                        </div>

                        <div class="form-group">
                            <label for="lon">Longitude (opsional)</label>
                            <input type="number" id="lon" name="lon" step="any" placeholder="106.816666" />
                        </div>

                        <button type="submit" class="btn">Kirim Cerita</button>
                    </form>
                </div>
            </section>
        `;
    }

    async afterRender() {
        // Do your job here
    }
}