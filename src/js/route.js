function loadAbout(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.querySelector('#load_about_site').innerHTML = this.responseText;
      loadFAQ(data.About_site);
    }
  };
  xhttp.open("GET","./about_text.html",true);
  xhttp.send();
}


  window.onload = function() {
    if (!window.location.href.includes("/meeting.html")) {
      Promise.all([loadAbout()]).then(function(){
        updateCurrency().then(() => build());
        windowScroll();
      });
    }
  }
