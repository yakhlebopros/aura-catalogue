const fs = require('fs');
const path = require('path');

const ALBUMS_DIR = path.join(__dirname, 'albums');
const DIST_DIR = path.join(__dirname, 'dist');
const DIST_ALBUMS_DIR = path.join(DIST_DIR, 'albums');

// Пароль для доступа к каталогу
const SITE_PASSWORD = 'aura';

// Флаг для GitHub Pages (абсолютные пути с учетом подпапки репозитория)
// Если тестируешь локально без сервера и хочешь открывать файлы двойным кликом — поставь false
const IS_GITHUB_PAGES = false; 
const REPO_NAME = 'aura-catalogue';

const TRENDING_PATHS = [
    'womens/shoes/hermes/oran',
    'womens/bags/bottega/jodie',
    'womens/bags/louisvuitton/neverfull',
    'womens/shoes/gucci/jordaan_horsebit',
];

const getCommonStyles = () => `
    :root {
        --bg-color: #faf9f6;
        --text-color: #1a1a1a;
        --accent-color: #8c7853;
        --card-bg: #ffffff;
        --border-color: #e5e3de;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: var(--bg-color); color: var(--text-color); line-height: 1.6; padding: 40px 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .nav-links { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
    .nav-link { display: inline-block; color: var(--accent-color); text-decoration: none; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }
    .nav-link:hover { text-decoration: underline; }
    header { margin-bottom: 40px; }
    header h1 { font-size: 2rem; letter-spacing: 2px; font-weight: 400; text-transform: uppercase; }
    .section-title { font-size: 1.4rem; letter-spacing: 1.5px; font-weight: 400; text-transform: uppercase; margin: 40px 0 20px 0; color: var(--accent-color); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
    
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    
    .gallery-item { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; transition: transform 0.2s ease; }
    .gallery-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
    
    .gallery-item > img { width: 100%; height: 320px; object-fit: cover; object-position: center; display: block; background-color: #f0efed; flex-shrink: 0; }
    
    .collage-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        grid-template-rows: 1fr 1fr; 
        width: 100%; 
        height: 320px; 
        background-color: #f0efed; 
        gap: 2px; 
        flex-shrink: 0; 
    }
    .collage-cell { 
        position: relative; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
        background-color: #f0efed; 
    }
    .collage-cell img { 
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        object-position: center; 
        display: block; 
    }
    
    .item-title { padding: 20px; font-size: 1rem; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; text-align: center; background-color: var(--card-bg); width: 100%; margin-top: auto; }

    #auth-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .auth-box {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 40px;
        border-radius: 6px;
        width: 100%;
        max-width: 380px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .auth-box h2 {
        font-size: 1.2rem;
        letter-spacing: 2px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 25px;
        color: var(--text-color);
    }
    .auth-box input[type="password"] {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid var(--border-color);
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 1rem;
        border-radius: 4px;
        margin-bottom: 15px;
        outline: none;
    }
    .auth-box input[type="password"]:focus {
        border-color: var(--accent-color);
    }
    .auth-remember {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 0.9rem;
        margin-bottom: 20px;
        color: #555;
        cursor: pointer;
    }
    .auth-box button {
        width: 100%;
        padding: 12px;
        background-color: var(--accent-color);
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-size: 0.9rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: pointer;
        transition: opacity 0.2s;
    }
    .auth-box button:hover {
        opacity: 0.9;
    }
    .auth-error {
        color: #c94a4a;
        font-size: 0.85rem;
        margin-top: 10px;
        display: none;
    }

    #lightbox-modal {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    #lightbox-modal.active {
        display: flex;
        opacity: 1;
    }
    #lightbox-img {
        max-width: 90%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.5);
    }
    .lightbox-btn {
        position: absolute;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: none;
        font-size: 2rem;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.2s;
        user-select: none;
    }
    .lightbox-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    #lightbox-prev { left: 30px; }
    #lightbox-next { right: 30px; }
    #lightbox-close { top: 20px; right: 30px; font-size: 2.5rem; background: transparent; }
`;

const getPasswordAndLightboxScript = (isProductPage) => `
    <div id="auth-overlay" style="display: none;">
        <div class="auth-box">
            <h2>Введите пароль</h2>
            <form id="auth-form" onsubmit="checkPassword(event)">
                <input type="password" id="auth-input" placeholder="Пароль" autocomplete="current-password" required>
                <label class="auth-remember">
                    <input type="checkbox" id="auth-remember-check" checked> Запомнить меня
                </label>
                <button type="submit">Войти</button>
                <div id="auth-error" class="auth-error">Неверный пароль</div>
            </form>
        </div>
    </div>

    ${isProductPage ? `
    <div id="lightbox-modal">
        <button id="lightbox-close" class="lightbox-btn">&times;</button>
        <button id="lightbox-prev" class="lightbox-btn">&#10094;</button>
        <img id="lightbox-img" src="" alt="Zoomed view">
        <button id="lightbox-next" class="lightbox-btn">&#10095;</button>
    </div>
    ` : ''}

    <script>
        (function() {
            const isAuthed = localStorage.getItem('aura_auth') === 'true' || sessionStorage.getItem('aura_auth') === 'true';
            if (!isAuthed) {
                document.getElementById('auth-overlay').style.display = 'flex';
            }
        })();

        function checkPassword(e) {
            e.preventDefault();
            const val = document.getElementById('auth-input').value;
            const remember = document.getElementById('auth-remember-check').checked;
            const inputHash = btoa(val);
            const correctHash = "${Buffer.from(SITE_PASSWORD).toString('base64')}";

            if (inputHash === correctHash) {
                if (remember) {
                    localStorage.setItem('aura_auth', 'true');
                } else {
                    sessionStorage.setItem('aura_auth', 'true');
                }
                document.getElementById('auth-overlay').style.display = 'none';
            } else {
                document.getElementById('auth-error').style.display = 'block';
            }
        }

        ${isProductPage ? `
        document.addEventListener('DOMContentLoaded', () => {
            const images = Array.from(document.querySelectorAll('.gallery-grid img'));
            if (images.length === 0) return;

            const modal = document.getElementById('lightbox-modal');
            const modalImg = document.getElementById('lightbox-img');
            const closeBtn = document.getElementById('lightbox-close');
            const prevBtn = document.getElementById('lightbox-prev');
            const nextBtn = document.getElementById('lightbox-next');
            let currentIndex = 0;

            images.forEach(img => {
                img.style.cursor = 'zoom-in';
            });

            function showImage(index) {
                currentIndex = index;
                modalImg.src = images[currentIndex].src;
            }

            images.forEach((img, index) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    showImage(index);
                });
            });

            function closeModal() {
                modal.classList.remove('active');
            }

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(newIndex);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            });

            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('active')) return;
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            });
        });
        ` : ''}
    </script>
`;

function createPage(filePath, title, backHref, backText, headerTitle, contentHtml, isProductPage = false) {
    let navLinksHtml = `<a href="${backHref}" class="nav-link">← ${backText}</a>`;

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - AURA</title>
    <style>${getCommonStyles()}</style>
</head>
<body>
    ${getPasswordAndLightboxScript(isProductPage)}
    <div class="container">
        <div class="nav-links">${navLinksHtml}</div>
        <header><h1>${headerTitle}</h1></header>
        ${contentHtml}
    </div>
</body>
</html>`;

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, html, 'utf-8');
}

function renderCoverHtml(htmlFilePath, targetDir) {
    if (!fs.existsSync(targetDir)) return `<img src="" alt="placeholder" loading="lazy">`;
    
    let candidateImages = findFirstImages(targetDir, 4);

    if (candidateImages.length === 0) {
        return `<img src="" alt="placeholder" loading="lazy">`;
    }
    
    if (candidateImages.length === 1) {
        const rel = computeRelativePath(htmlFilePath, candidateImages[0]);
        return `<img src="${rel}" alt="cover" loading="lazy">`;
    } 
    
    let collageImgs = '';
    candidateImages.slice(0, 4).forEach(img => {
        const rel = computeRelativePath(htmlFilePath, img);
        collageImgs += `<div class="collage-cell"><img src="${rel}" alt="cover" loading="lazy"></div>`;
    });
    
    return `<div class="collage-grid">${collageImgs}</div>`;
}

function buildSite() {
    if (!fs.existsSync(ALBUMS_DIR)) {
        console.error("Папка albums не найдена!");
        return;
    }

    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR);

    fs.cpSync(ALBUMS_DIR, DIST_ALBUMS_DIR, { recursive: true });

    const rootSections = fs.readdirSync(DIST_ALBUMS_DIR).filter(f => fs.statSync(path.join(DIST_ALBUMS_DIR, f)).isDirectory());
    const distIndex = path.join(DIST_DIR, 'index.html');

    let trendingGrid = '';
    TRENDING_PATHS.forEach(relPath => {
        const fullDirPath = path.join(DIST_ALBUMS_DIR, relPath);
        if (fs.existsSync(fullDirPath)) {
            const folderName = path.basename(fullDirPath);
            const coverHtml = renderCoverHtml(distIndex, fullDirPath);
            trendingGrid += `
                <a href="albums/${relPath}/index.html" class="gallery-item">
                    ${coverHtml}
                    <div class="item-title">${folderName}</div>
                </a>
            `;
        }
    });

    let trendingHtml = '';
    if (trendingGrid) {
        trendingHtml = `
            <div class="section-title">В тренде</div>
            <div class="gallery-grid" style="margin-bottom: 50px;">${trendingGrid}</div>
        `;
    }

    let sectionsGrid = '';
    rootSections.forEach(section => {
        const sectionPath = path.join(DIST_ALBUMS_DIR, section);
        const coverHtml = renderCoverHtml(distIndex, sectionPath);
        sectionsGrid += `
            <a href="albums/${section}/index.html" class="gallery-item">
                ${coverHtml}
                <div class="item-title">${section}</div>
            </a>
        `;
    });

    const homeContent = `
        ${trendingHtml}
        <div class="section-title">Разделы каталога</div>
        <div class="gallery-grid">${sectionsGrid}</div>
    `;

    createPage(distIndex, 'Главная', '', '', 'AURA Catalog', homeContent, false);

    rootSections.forEach(section => {
        const sectionDir = path.join(DIST_ALBUMS_DIR, section);
        const categories = fs.readdirSync(sectionDir).filter(f => fs.statSync(path.join(sectionDir, f)).isDirectory());
        const sectionHtmlPath = path.join(DIST_DIR, 'albums', section, 'index.html');

        let catGrid = '';
        categories.forEach(category => {
            const catPath = path.join(sectionDir, category);
            const coverHtml = renderCoverHtml(sectionHtmlPath, catPath);
            catGrid += `
                <a href="${category}/index.html" class="gallery-item">
                    ${coverHtml}
                    <div class="item-title">${category}</div>
                </a>
            `;
        });

        createPage(sectionHtmlPath, section, '../../index.html', 'На главную', section, `<div class="gallery-grid">${catGrid}</div>`, false);
        
        categories.forEach(category => {
            const catDir = path.join(sectionDir, category);
            const brands = fs.readdirSync(catDir).filter(f => fs.statSync(path.join(catDir, f)).isDirectory());
            const catHtmlPath = path.join(DIST_DIR, 'albums', section, category, 'index.html');

            let brandGrid = '';
            brands.forEach(brand => {
                const brandPath = path.join(catDir, brand);
                const coverHtml = renderCoverHtml(catHtmlPath, brandPath);
                brandGrid += `
                    <a href="${brand}/index.html" class="gallery-item">
                        ${coverHtml}
                        <div class="item-title">${brand}</div>
                    </a>
                `;
            });

            createPage(catHtmlPath, `${section} - ${category}`, '../index.html', `Назад в ${section.toUpperCase()}`, category, `<div class="gallery-grid">${brandGrid}</div>`, false);

            brands.forEach(brand => {
                const brandDir = path.join(catDir, brand);
                const models = fs.readdirSync(brandDir).filter(f => fs.statSync(path.join(brandDir, f)).isDirectory());
                const brandHtmlPath = path.join(DIST_DIR, 'albums', section, category, brand, 'index.html');

                let modelGrid = '';
                models.forEach(model => {
                    const modelPath = path.join(brandDir, model);
                    const coverHtml = renderCoverHtml(brandHtmlPath, modelPath);
                    modelGrid += `
                        <a href="${model}/index.html" class="gallery-item">
                            ${coverHtml}
                            <div class="item-title">${model}</div>
                        </a>
                    `;
                });

                createPage(brandHtmlPath, brand, '../index.html', `Назад в ${category.toUpperCase()}`, brand, `<div class="gallery-grid">${modelGrid}</div>`, false);

                models.forEach(model => {
                    const modelDir = path.join(brandDir, model);
                    const files = fs.readdirSync(modelDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
                    const modelHtmlPath = path.join(DIST_DIR, 'albums', section, category, brand, model, 'index.html');

                    let photoGrid = '';
                    files.forEach(file => {
                        const relImgPath = computeRelativePath(modelHtmlPath, path.join(modelDir, file));
                        photoGrid += `
                            <div class="gallery-item">
                                <img src="${relImgPath}" alt="${model}" loading="lazy">
                            </div>
                        `;
                    });

                    createPage(modelHtmlPath, `${brand} - ${model}`, '../index.html', `Назад в ${brand.toUpperCase()}`, model, `<div class="gallery-grid">${photoGrid}</div>`, true);
                });
            });
        });
    });

    console.log("Сайт успешно собран!");
}

function findAllImagesInDir(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let results = [];
    
    for (const entry of entries) {
        if (!entry.isDirectory() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
            results.push(path.join(dir, entry.name));
        }
    }
    return results;
}

function findFirstImages(dir, limit = 4) {
    if (!fs.existsSync(dir)) return [];
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const subDirs = entries.filter(e => e.isDirectory()).map(e => path.join(dir, e.name));
    const directImages = findAllImagesInDir(dir);
    
    if (subDirs.length === 0) {
        return directImages.slice(0, limit);
    }
    
    let branchImageLists = [];
    subDirs.forEach(subDir => {
        const subImages = findFirstImages(subDir, limit);
        if (subImages.length > 0) {
            branchImageLists.push(subImages);
        }
    });
    
    if (branchImageLists.length === 0) {
        return directImages.slice(0, limit);
    }
    
    let collectedImages = [];
    let round = 0;
    
    while (collectedImages.length < limit) {
        let addedInThisRound = 0;
        
        for (const list of branchImageLists) {
            if (list[round]) {
                if (!collectedImages.includes(list[round])) {
                    collectedImages.push(list[round]);
                    addedInThisRound++;
                }
                if (collectedImages.length >= limit) break;
            }
        }
        
        if (addedInThisRound === 0) {
            let flatAll = branchImageLists.flat();
            for (const img of flatAll) {
                if (!collectedImages.includes(img)) {
                    collectedImages.push(img);
                }
                if (collectedImages.length >= limit) break;
            }
            break;
        }
        
        round++;
    }

    return collectedImages.slice(0, limit);
}

function computeRelativePath(fromHtml, toFile) {
    const relFromDist = path.relative(DIST_DIR, toFile).replace(/\\/g, '/');
    if (IS_GITHUB_PAGES) {
        return `/${REPO_NAME}/${relFromDist}`;
    }
    const fromDir = path.dirname(fromHtml);
    return path.relative(fromDir, toFile).replace(/\\/g, '/');
}

buildSite();