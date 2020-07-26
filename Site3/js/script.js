document.querySelector("#items-carousel")
.addEventListener("wheel", event => {
  if(event.deltaY > 0) {
    console.log('+');
    event.target.scrollBy(1000,0);
  }else {
    console.log('-');
    event.target.scrollBy(-1000,0);
  }
  });

let count = 0
setInterval(function(){
  count += 1000
  if(count > 3000) count = 0
  document.querySelector("#items-carousel").scrollTo(count, 0)
  console.log('moveu')
}, 1000)