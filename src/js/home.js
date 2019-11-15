(async function load() {

    const BASE_API_YST = "https://yts.lt/api/v2";

    async function getData(url) {
        const response = await fetch(url);
        return await response.json();
    }

    const $form = document.getElementById('form');
    const $home = document.getElementById('home');
    const $featuringContainer = document.getElementById('featuring');

    function setAttributes($element, attributes) {
        for (const attribute in attributes) {
            $element.setAttribute(attribute, attributes[attribute]);
        }
    }

    function renderMovieFeaturing(movie) {
        return (`<div class="featuring">
            <div class="featuring-image">
                <img src="${movie.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="featuring-content">
                <p class="featuring-title">Pelicula encontrada</p>
                <p class="featuring-album">${movie.title}</p>
            </div>
        </div>`);

    }

    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        $home.classList.add('search-active');
        $featuringContainer.style.display = 'grid';
        const $loader = document.createElement('img');
        setAttributes($loader, {src: 'src/images/loader.gif', height: 50, weight: 50});
        $featuringContainer.append($loader);
        const data = new FormData($form);

        getData(`${BASE_API_YST}/list_movies.json?limit=1&query_term=${data.get('name')}`)
            .then(({data: {movies: pelicula}}) => {
                if (pelicula) {
                    $featuringContainer.innerHTML = renderMovieFeaturing(pelicula[0]);
                } else {
                    renderNotFoundMovie();
                }

            }).catch((error) => {
            console.log(error);
        });

    });

    const {data: {movies: actionList}} = await getData(`${BASE_API_YST}/list_movies.json?genre=action`);
    const {data: {movies: dramaList}} = await getData(`${BASE_API_YST}/list_movies.json?genre=drama`);
    const {data: {movies: animationList}} = await getData(`${BASE_API_YST}/list_movies.json?genre=animation`);

    function videoItemTemplate(movie, category) {
        return (
            `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
        )

    }


    function createTemplate(HTMLString) {
        const html = document.implementation.createHTMLDocument();
        html.body.innerHTML = HTMLString;
        return html.body.children[0];

    }

    function addEventClick($movieElement) {
        $movieElement.addEventListener('click', () => {
            showModal($movieElement);
        });

    }

    function renderMovieList(list, $container, category) {
        $container.children[0].remove();
        list.forEach((movie) => {
            const HTMLString = videoItemTemplate(movie, category);
            const movieElement = createTemplate(HTMLString);
            $container.append(movieElement);
            addEventClick(movieElement);
        })


    }

    const $actionContainer = document.getElementById('action');
    renderMovieList(actionList, $actionContainer, 'action');

    const $dramaContainer = document.getElementById('drama');
    renderMovieList(dramaList, $dramaContainer, 'drama');

    const $animationContainer = document.getElementById('animation');
    renderMovieList(animationList, $animationContainer, 'animation');


    // const $home = $('.home .list #item');
    const $modal = document.getElementById('modal');
    const $overlay = document.getElementById('overlay');
    const $hideModal = document.getElementById('hide-modal');

    const $modalTitle = $modal.querySelector('h1');
    const $modalImage = $modal.querySelector('img');
    const $modalDescription = $modal.querySelector('p');

    function findMovie(id, category) {
        actionList.find((movie) => {
            return movie.id == id;
        })
    }

    function showModal($element) {
        $overlay.classList.add('active');
        $modal.style.animation = 'modalIn .8s forwards';
        const id = $element.dataset.id;
        const category = $element.dataset.category;
        const data = findMovie(id, category);
    }


    $hideModal.addEventListener('click', () => {
        hideModal();
    });

    function hideModal() {
        $overlay.classList.remove('active');
        $modal.style.animation = 'modalOut .8s forwards';
    }

})();
