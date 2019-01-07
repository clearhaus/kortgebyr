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

function insertGoogleAnalytics(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.querySelector('#google-script').innerHTML = this.responseText;
      loadFAQ(data.About_site);
    }
  };
  xhttp.open("GET","./google_analytics_" + country_code.toLowerCase() + ".html",true);
  xhttp.send();
}

  window.onload = function() {
    Promise.all([loadTable(),loadAbout(),insertGoogleAnalytics()]).then(function(){
      updateCurrency().then(() => build());
      windowScroll();
    });
  }
