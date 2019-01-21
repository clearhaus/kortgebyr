var included = "";
var data = "";
var unknown_price = "";
//Fetch json feed
$.getJSON("./js/languages/"+ country_code.toLowerCase() + ".json",function(json){
}).then((respons) => {
  data = respons;
  var side = (window.location.href);
  if(!side.includes("meeting.html")){
    insertDataIntoFields(data.translations);
    loadFeatures(data.features);
    loadCardData(data.cards);
    loadKeywords(data.keywords);
    loadDescription(data.index_description);
    loadPrice(data.priceColumn);
  }
  else{
    loadContact(data.translations);
    loadMeeting(data.booking_meeting);
    loadKeywords(data.keywords);
  }
});

function insertDataIntoFields(data){
  try {
    for(key in data){
      if(data[key]){
        if(key == "cheapest_solution"){
          //this will set the values in the select menu
          var selectOptions = document.getElementById("acquirer");
          var option = document.createElement("option");
          var length = $('#acquirer > option').length;
          var acqsLength = ACQs.length;

          if(length < acqsLength){
            //option.text should be changed to the correct value
            option.text = data[key];
            option.value = "auto"
            selectOptions.add(option);

            for(i=0; i < ACQs.length; i++ ){
              var option = document.createElement("option");
              option.text = ACQs[i].name;
              option.value = i + 1;
              selectOptions.add(option);
            }
          }
        }
        else if(key == "included"){
          included = data[key];
        }
        else if(key.startsWith("total_per")){
          var breakrow = document.createElement('br');
          var splittedString = data[key].split(' ');
          var label = document.getElementById(key);
          label.innerHTML = splittedString[0];
          label.innerHTML += " " + splittedString[1];
          label.appendChild(breakrow);
          label.innerHTML += splittedString[2];

        }
        else {
              document.getElementById(key).innerHTML = data[key];
        }
      }
    }
  } catch (e) {
  }

}

function loadFeatures(data){
  try {
    var features_checkbox = document.getElementById('features_checkbox');
    for(key in data){
      var label = document.createElement('label');
      label_text = document.createTextNode(data[key]);
      label.setAttribute('class', 'acqlabel_subheader breakWord')
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.class = 'ofeatures';
      input.className = 'checkbox-space'
      input.value = key;
      input.name = 'features[]';
      label.appendChild(input);
      label.appendChild(label_text);
      features_checkbox.appendChild(label);
    }
  } catch (e) {

  }
}

function loadCardData(data){
  try {
    var labels_div = document.getElementById('cardInformation');
    for(key in data){
      //create label
      var label = document.createElement('label');
      var label_text = document.createTextNode(data[key]);
      label.setAttribute('class','label-spacing acqlabel_subheader');

      //create input-field
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'ocards';
      input.className += ' checkbox-space'
      input.value = key;
      input.name = 'cards[]';
      if(key =='visa'){
        input.checked = true;
      }
      label.appendChild(input);
      label.appendChild(label_text);

      labels_div.appendChild(label);
    }
  } catch (e) {

  }
}
function loadKeywords(data){
  var metakeywords = document.getElementById('meta-keywords');
  var i = 0;
  for(key in data){
    i++;
    if(i == 1) metakeywords.content += data[key];
    else metakeywords.content += ", " + data[key];
  }
}

function loadDescription(data){
  try {
    for(key in data){
      if(key){
        document.getElementById(key).content = data[key];
      }
    }
  } catch (e) {

  }
}

function loadFAQ(data){
  for(key in data){
    if(key == "sponsor-clearhaus"){
      var cc = country_code.toLowerCase();
      document.getElementById(key).innerHTML = data[key];
      document.getElementById(key).href = "//www.clearhaus.com/" + cc + "/";
    }
    else{
      document.getElementById(key).innerHTML = data[key];
    }
  }
}

function loadPrice(data){
  for(key in data){
    unknown_price = data[key];
  }
}

function loadContact(data){
  for(key in data){
    if(key === "title-header"){
      document.getElementById(key).innerHTML = data[key];
    }
    else if (key === "sub-title") {
      document.getElementById(key).innerHTML = data[key];
    }
  }
}

function loadMeeting(data){
  for(key in data){
    document.getElementById(key).innerHTML = data[key];
  }
}

// Temporary solution: convert arrays to objects
(() => {

  function arr2obj(arr) {
      const obj = {};
      for (let i = 0; i < arr.length; i++) {
          let key = arr[i];
          if (typeof key === 'object') { key = key.title; }
          obj[key] = arr[i];
      }
      return obj;
  }

  for (const i in ACQs) {
      ACQs[i].cards = arr2obj(ACQs[i].cards);
  }

  for (const i in PSPs) {
      const psp = PSPs[i];
      psp.cards = arr2obj(psp.cards);
      psp.features = arr2obj(psp.features);
      if (psp.acqs) {
          psp.acquirers = arr2obj(psp.acqs);
      }
  }
})();
