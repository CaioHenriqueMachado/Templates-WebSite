// FOR MENU
var menuIcon = document.getElementById("menu-icon");
var sideNav = document.getElementById("sideNav");
sideNav.style.right = "-110px";
menuIcon.onclick = function(){
	menuIcon.classList.toggle("change");
	
	if ( sideNav.style.right == "-110px" ) {
    sideNav.style.right = "0px"
	}
	else {
    sideNav.style.right = "-110px"
	}
}

// FORM CAROUSEL
let count = 0;

document.querySelector("#items-carousel")
.addEventListener("wheel", event => {
  if(event.deltaY > 0) {
    count += 300;
    event.target.scrollBy(300,0);
  }else {
    count -= 300;
    event.target.scrollBy(-300,0);
  }
  });

setInterval(function(){
  count += 300
  if(count > 2400) count = 0
  document.querySelector("#items-carousel").scrollTo(count, 0);
}, 2000);