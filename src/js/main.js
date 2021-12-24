// ================================================== исключение по наименованию страницы
// const contactsPage = window.location.pathname == '/contacts.html'
// if(contactsPage){
//     ...
// }

// ================================================== исключение по селектору
const body = document.querySelector('body')
const mainPage = body.querySelector('.main-page')
const newsPage = body.querySelector('.news-page')
const articlePage = body.querySelector('.article-page')
const categoryPage = body.querySelector('.category-page')
const contactsPage = body.querySelector('.contacts-page')
// ================================================== inputmask
$(document).ready(function () {
    $(":input").inputmask();
    $(".phone").inputmask({
        mask: "+7 999 999 99 99",
        clearIncomplete: true
    });
    $('.email').inputmask({
        mask: "*{1,20}[.*{1,20}]@*{1,20}.*{2,4}",
        greedy: false,
        clearIncomplete: true,
        onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
        },
        definitions: {
            '*': {
                validator: "[0-9A-Za-z-а-я-]",
                casing: "lower"
            }
        }
    }
    );
});
// ================================================== slick slider
document.addEventListener('DOMContentLoaded', function () {
    $('.slider-home').slick({
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });

    $('.slider-best').slick({
        infinite: false,
        fade: false,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 565,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.slider-best').on("afterChange", function (event, slick, currentSlide, nextSlide) {
        const dots = document.querySelectorAll('.best-price__slider .slick-dots li')
        const lastDot = dots.length - 1
        if (dots[lastDot].classList.contains('slick-active')) {
            document.querySelector('.best-price__slider .slick-list').style.transform = 'translateX(-5rem)'
        } else {
            document.querySelector('.best-price__slider .slick-list').style.transform = 'translateX(5rem)'
        }
    });
// ================================ карточка товара
    $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        asNavFor: '.slider-for',
        dots: false,
        arrows: false,
        focusOnSelect: true
    });
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });

});
// ================================================== параллакс элементов
const paralax = document.querySelectorAll(".decor");
/* коэфициент сдвига: 1 сдвиг равный смещению по оси Y, 0 без сдвига */
const moveCoef = 0.1;
window.addEventListener("scroll", scroll);
window.addEventListener("resize", scroll);
scroll();

function scroll() {
    paralax.forEach(item => {
        /* берём ограничивающий прямоугольник паралакса относительно окна (фрейма) */
        let r = item.getBoundingClientRect();
        /* центр паралакса */
        let paralaxYCenter = r.top + r.height / 2;
        /* центр экрана */
        let scrollYCenter = window.innerHeight / 2;
        /* Вычисляем смещение */
        let move = (paralaxYCenter - scrollYCenter) * moveCoef - 100;
        item.style.transform = `translateY(${move / 16}rem)`;
    })
}

// ================================================== отступ сверху у документа равный высоте хедера 
function autoPadding() {
    const header = document.querySelector('.header')
    body.style.paddingTop = `${header.scrollHeight}px`
}
window.addEventListener('DOMContentLoaded', autoPadding);
window.addEventListener('resize', autoPadding);
// ================================================== catalog menu - отступ сверху равный высоте хедера 
function autoTop() {
    const openHeaderCatalog = document.querySelector('#open-catalog')
    const headerCatalog = document.querySelector('#menu-catalog')
    let openHeaderCatalogBorderBottom = openHeaderCatalog.getBoundingClientRect().bottom
    headerCatalog.style.top = `${openHeaderCatalogBorderBottom}px`
}
window.addEventListener('DOMContentLoaded', autoTop);
window.addEventListener('resize', autoTop);

// ================================================== хедер и меню каталога 
window.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header')
    const openCatalogBtn = document.querySelector('#open-catalog')
    const menuCatalog = document.querySelector('#menu-catalog')
    const menuCatalogItem = document.querySelectorAll('.menu-catalog__item')
    // при скролле добавляем хедеру класс
    window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
            header.classList.add('active')
        } else {
            header.classList.remove('active')
        }
    })
    // появление каталога меню по клику
    openCatalogBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('no-scroll')
        this.classList.toggle('active')
        menuCatalog.classList.toggle('active')
        if (window.scrollY == 0) {
            header.classList.toggle('active')
        }
    })
    // эффект наведения на пунктах в каталоге меню
    menuCatalogItem.forEach(item => {
        const categoryListName = item.querySelector('.menu-catalog__name')
        const categorySublistName = item.querySelector('.catalog-sublist__name')
        categorySublistName.innerText = categoryListName.innerText // передаем наименование ссылки из меню в подменю сразу при открытии меню
        item.addEventListener('mouseover', function () {
            menuCatalogItem.forEach(elem => {
                elem.classList.remove('active')
            })
            item.classList.add('active')
        })
    })

})
// ================================================== страницы Новости, Статья, Категория - подгружаем элементы по клику
document.addEventListener('DOMContentLoaded', function () {

    function clickVisibleElem(correctPage, correctVisible, correctCounter) {

        if (correctPage) { // определяем корректную страницу (страницу, на которой нужен данный функционал)

            const items = document.querySelector('.js-items').querySelectorAll('.js-item')
            const itemsMoreBtn = document.querySelector('.js-more')
            let visibleElem

            visibleElem = correctVisible // кол-во элементов, видимых изначально

            let counter = correctCounter // по сколько элементов будет показываться по клику
            items.forEach(item => { // изначально скрываем все новости
                item.style.display = 'none'
            })
            iterating()
            // функция в которой перебираем и показываем то кол-во элементов, которое обновляется в переменной visibleElem
            function iterating() {
                for (let i = 0; i < visibleElem; i++) {
                    items[i].style.display = 'block'
                }
            }
            itemsMoreBtn.addEventListener('click', function () { // по клику на кнопку
                visibleElem += counter // увеличиваем кол-во видимых элементов на значение, обозначенное в переменной counter
                iterating()
                if (visibleElem == items.length) {
                    this.style.display = 'none' // если элементов закончились, то скрываем кнопку
                }
            })
        }
    }

    clickVisibleElem(newsPage, 8, 4)
    clickVisibleElem(articlePage, 4, 4)
    clickVisibleElem(categoryPage, 12, 6)

})
// ==================================================
// ================================================== 
// ================================================== 
// ================================================== 
// ================================================== 
// ================================================== 

// ================================================== map (отложенная загрузка)
if(contactsPage){
setTimeout(function() {
    var headID = document.getElementsByTagName("body")[0];         
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    headID.appendChild(newScript);
}, 1000);

setTimeout(function() {
    var myMap = new ymaps.Map('map', {
        center: [56.745981, 37.179787],
        zoom: 16
    }, {
        searchControlProvider: 'yandex#search'
    }),
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),
        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Московская обл., г. Дубна, ул. Строителей, дом № 12',
            balloonContent: 'Московская обл., г. Дубна, ул. Строителей, дом № 12'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'img/circle-logo.png',
            iconImageSize: [40, 40],
            iconImageOffset: [-5, -38]
        })
    myMap.geoObjects
        .add(myPlacemark)
}, 2000);
}