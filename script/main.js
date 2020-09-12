'use strict';

class CreatePage {
    constructor(filterSelector, cardsSelector) {
        this.filterFilm = document.querySelector(filterSelector);
        this.cardsBlock = document.querySelector(cardsSelector);
        this.dataBase;
        this.filmArr = [];
    }

    getData() {
        const request = new XMLHttpRequest();

        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                this.dataBase = JSON.parse(request.responseText);
                this.init();
            }
        });

        request.open('GET', '../db/dbHeroes.json');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
    }

    renderCard() {
        this.cardsBlock.textContent = '';
        this.dataBase.forEach(hero => {
            this.cardsBlock.insertAdjacentHTML('beforeEnd', `
            <div class="card">
                <img src="db/${hero.photo}" alt="${hero.name}" class="card-img">
                <span class="name">
                    <strong class="title">Name:</strong> ${hero.name}
                </span>
                <span class="original-name">
                    <strong class="title">Original name:</strong> ${hero.realName ? hero.realName : hero.name}
                </span>
                <span class="film">
                    <strong class="title">Films:</strong> 
                    <p>${hero.movies ? hero.movies.join(', ') : 'фильм не найден'}</p>
                </span>
                <span class="status">
                    <strong class="title">Status:</strong> ${hero.status}
                </span>
            </div>
            `);
        });
    }

    createFilter() {
        this.dataBase.forEach(item => {
            if (item.movies) {
                item.movies.forEach (movie => {
                    if(!this.filmArr.some(elem => elem === movie)) {
                        this.filmArr.push(movie);
                    }
                });
            }
        });
        this.filmArr.sort();

        this.filmArr.forEach(film => {
            this.filterFilm.insertAdjacentHTML('beforeend',`<option value="${film}">${film}</option>`);
        });
    }

    filmFilter(value) {
        const card = document.querySelectorAll('.card');
        if (value !== 'Все фильмы') {
            card.forEach(item => {
                const cardMovies = item.querySelector('.film p').textContent.split(', ');
                if (!cardMovies.some(movie => movie === value)) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
                
            });
            
        } else {
            card.forEach(item => item.style.display = '');
        }
    }

    init() {
        this.renderCard();
        this.createFilter();
        this.filterFilm.addEventListener('change', () => this.filmFilter(this.filterFilm.value));
    }
}

const createPage = new CreatePage('.filter', '.cards-block');
createPage.getData();