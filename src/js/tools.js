



/*  form2obj(form): A simple version for kortgebyr.dk */
function form2obj(form) {
  const obj = {};
  for (let i = 0; i < form.elements.length; i++) {
    const e = form.elements[i];
    if (!e.name || (e.type === 'radio' && !e.checked)) { continue; }
    if (e.type === 'checkbox') {
      const name = e.name.slice(0, -2);
      if (!obj[name]) { obj[name] = {}; }
      if (e.checked) { obj[name][e.value] = 1; }
    } else {
      obj[e.name] = (e.type === 'number') ? e.value | 0 : e.value;
    }
  }
  return obj;
}

/*  obj2form(obj): A simple version for kortgebyr.dk */
function obj2form(o, form) {
  for (let i = 0; i < form.elements.length; i++) {
    const e = form.elements[i];
    if (e.name) {
      if (e.type === 'checkbox') {
        e.checked = !!o[e.name.slice(0, -2)][e.value];
      } else {
        e.value = o[e.name];
      }
    }
  }
}

/*
Very simple fetch polyfill (for Safari < 10.1)
*/
if (!window.fetch) {
  window.fetch = url => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      resolve({
        body: xhr.response,
        json() {
          return JSON.parse(xhr.response);
        }
      });
    };

    xhr.onerror = () => reject(new TypeError('Network request failed'));
    xhr.ontimeout = () => reject(new TypeError('Network request failed'));
    xhr.open('GET', url, true);
    xhr.send();
  });
}

function showTooltip() {
  if (!this.firstElementChild) {
    const infobox = document.createElement('ul');
    const obj = this.ttdata;
    for (const prop in obj) {
      const li = document.createElement('li');
      li.textContent = prop + ': ' + obj[prop].print($currency);
      infobox.appendChild(li);
    }
    this.appendChild(infobox);
  }
}



function windowScroll(){
  $(document).ready(function () {
    var top = $('#the-top-offset').offset().top;

    $(window).scroll(function (event) {
      var heightOfDiv = $('#outer-div').height();
      var widthOfMenuControl = $('#menu-control').width();
      var y = $(this).scrollTop();
      var endOfTable = 1.7;
      if(widthOfMenuControl < 120){
        endOfTable = 1.5;
      }
      //if y > top, it means that if we scroll down any more, parts of our element will be outside the viewport
      //so we move the element down so that it remains in view.
      var difference = y - (top);
      if (y >= top && y > (top) && y < (heightOfDiv/endOfTable)) {
        $('#menu-control').css("top",difference );
      }
      else if (y <= 260){
        $('#menu-control').css("top",0);
      }
    });
  });
}
var $table = $('table.data-table');
$table.floatThead();
