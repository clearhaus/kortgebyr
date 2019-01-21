function loadTable(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.querySelector('#outer-div').innerHTML = this.responseText;
      insertDataIntoFields(data.translations);
      insertDataIntoFields(data.index_description)
      var $table = $('table.data-table');
      $table.floatThead();

    }
  };
  xhttp.open("GET","./table.html",true);
  xhttp.send();
}

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
      Promise.all([loadTable(),loadAbout()]).then(function(){
        updateCurrency().then(() => build());
        windowScroll();
      });
    }
  }
