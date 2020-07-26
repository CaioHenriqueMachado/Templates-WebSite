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