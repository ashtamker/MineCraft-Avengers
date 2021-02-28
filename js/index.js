const hero = document.querySelector('.hero');
const slider = document.querySelector('.slider');
const logo = document.querySelector('#logo');
const inst = document.querySelector('.menu__btn');

const tl = new TimelineMax();
tl.fromTo(hero,1, {height: "0%"}, {height: "90%", ease: Power2.easeInOut})
.fromTo(hero, 1.2, {width: "100%"}, {width: "90%",ease: Power2.easeInOut});

// .formTo(slider, 1.2, {x: "-200%"}, {x: "0%", ease: Power2.easeInOut}, "-=1.2")
// .formTo(logo, 0.5, {opacity: 0, x:30}, {opacity: 1, x:0}, "-=0.5")
// .formTo(inst, 0.5, {opacity: 0, x:30}, {opacity: 1, x:0}, "-=0.5");

const gameBtn = document.querySelector('.menu-btn');

gameBtn.addEventListener('click', () =>{
    window.location.replace("../game.html") 
})

