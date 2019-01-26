const country = country_code;
var history = window.History.createBrowserHistory({basename:"./"});
let opts = {
    acquirer: 'auto',
    currency: country_currency,
    qty: 400,
    avgvalue: 300,
    cards: {visa: 1, mastercard: 1},
    features: {},
    modules: {}
};
var stateData = [];
let $dankortscale;
let $acqs;
let $avgvalue;
let $currency;
let $revenue;
let $qty;
function settings(o) {
    $qty = o.qty;
    $avgvalue = new Currency(o.avgvalue, o.currency);
    $revenue = $avgvalue.scale($qty);
    $acqs = (o.acquirer === 'auto') ? ACQs.slice() : (country === false)
        ? [ACQs[0], ACQs[o.acquirer]] : [ACQs[o.acquirer-1]];


    if (!o.cards.visa) {
        // disableCards(['diners', 'jcb', 'amex']);
    } else {
        disableCards([]);
    }

    if ($currency === o.currency) {
        build();
    } else {
        $currency = o.currency;
        updateCurrency().then(() => build());
        document.getElementById('selectedCountry').value = $currency;
    }
}

// Check if object-x' properties is in object-y.
function x_has_y(objx, objy) {
    for (const prop in objy) {
        if (!objx[prop]) { return false; }
    }
    return true;
}

function sum(obj) {
    let ret = new Currency();
    for (const fee in obj) {
        ret = ret.add(obj[fee]);
    }
    return ret;
}

function merge(o1, o2) {
    const obj = {};
    for (let i = 0; i < arguments.length; i++) {
        const costobj = arguments[i];
        for (const z in costobj) {
            if (obj[z]) {
                obj[z] = obj[z].add(costobj[z]);
            } else {
                obj[z] = costobj[z];
            }
        }
    }
    return obj;
}

// Find combination of acquirers that support all cards
function acqcombo(psp) {
    const A = $acqs;
    const acqarr = [];

    // Check if a single acq support all cards.
    for (let i = 0; i < A.length; i++) {
        const acq = A[i];
        if (psp.acquirers[acq.name]) {
            // Return acq if it support all cards.
            if (x_has_y(acq.cards, opts.cards)) { return [acq]; }
            acqarr.push(acq);
        }
    }

    // Nope. Then we'll need to search for a combination of acquirers.
    const len = acqarr.length;
    for (let i = 0; i < len; i++) {
        const primary = acqarr[i];
        const missingCards = {};

        for (const card in opts.cards) {
            if (!primary.cards[card]) { missingCards[card] = true; }
        }

        // Find secondary acquirer with the missing cards.
        for (let j = i + 1; j < len; j++) {
            const secondary = acqarr[j];
            if (x_has_y(secondary.cards, missingCards)) {
                return [primary, secondary];
            }
        }
    }
    return null;
}

function cost2obj(cost, obj, name) {
    for (const i in cost) {
        let value = cost[i];
        const type = typeof value;
        if (typeof value === 'function') {
            value = value(obj);
        }
        if (!value || typeof value !== 'object') { continue; }
        obj[i][name] = value;
    }
}

function sumTxt(obj) {
    const frag = document.createDocumentFragment();
    frag.textContent = sum(obj).print($currency);
    if(frag.textContent.startsWith("In.fin.ity,undefined") || frag.textContent.startsWith("NaN") ){
      frag.textContent = unknown_price+"*";
    }
    else if (Object.keys(obj).length) {
        const info = document.createElement('div');
        info.textContent = '?';
        info.className = 'info';
        info.ttdata = obj;
        info.addEventListener('mouseover', showTooltip);
        frag.appendChild(info);
    }
    return frag;
}
// Build table
function build(action) {
    const data = [];
    const frag = document.createDocumentFragment();

    // Calculate acquirer costs and sort by Total Costs.
    for (let i = 0; i < $acqs.length; i++) {
        const acq = $acqs[i];
        const cardscale = 1 - $dankortscale;
        acq.TC = acq.trnfees = acq.fees.trn().scale($qty).scale(1);

        if (acq.fees.monthly) {
            let monthly = acq.fees.monthly;
            if (typeof monthly === 'function') { monthly = monthly(); }
            acq.TC = acq.TC.add(monthly);
        }
    }
    $acqs.sort((obj1, obj2) => obj1.TC.order($currency) - obj2.TC.order($currency));

    psploop:
    for (let i = 0; i < PSPs.length; i++) {
        const psp = PSPs[i];
        var mail = psp.contactMail;
        if(!mail){
          mail = unknown_price;
        }
        const fees = { setup: {}, monthly: {}, trn: {} };
        cost2obj(psp.fees, fees, psp.name);
        // Check if psp support all enabled payment methods
        for (const card in opts.cards) {
            if (!psp.cards[card]) { continue psploop; }
        }

        // Check if psp support all enabled features
        for (const i in opts.features) {
            const feature = psp.features[i];
            console.log(feature);
            if (!feature) { continue psploop; }
            cost2obj(feature, fees, i);
        }

        // If an acquirer has been selected then hide the Stripes
        if ($acqs.length < 3 && !psp.acquirers) { continue; }
        const divmailfrag = document.createElement('div');
        const mailfrag = document.createElement('p');
        mailfrag.className = "mail_link";
        mailfrag.innerHTML = mail;
        divmailfrag.appendChild(mailfrag);
        const acqfrag = document.createDocumentFragment();
        const acqcards = {};
        let acqArr = [];
        if (psp.acquirers) {
            acqArr = acqcombo(psp); // Find acq with full card support

            if (!acqArr) { continue; }
            for (let j = 0; j < acqArr.length; j++) {
                const acq = acqArr[j];
                const acq_mail = acq.contactMail;
                cost2obj({
                    setup: acq.fees.setup,
                    monthly: acq.fees.monthly,
                    trn: acq.trnfees
                }, fees, acq.name);
                if (acq_mail) {
                  const acqMailFrag = document.createElement('p');
                  acqMailFrag.className = 'mail_link';
                  acqMailFrag.innerHTML = acq_mail;
                  divmailfrag.appendChild(acqMailFrag);
                }
                const acqlink = document.createElement('a');
                acqlink.href = acq.link;
                acqlink.className = 'acq';
                const acqlogo = new Image();
                acqlogo.src = './img/psp/' + acq.logo;
                acqlogo.alt = acq.name;
                //do to a large logo this logo will be downscaled in the css file
                if(acq.name == "PensoPay" || acq.name == "Swedbank"){
                  acqlogo.className = "acq-logo";
                }

                acqlink.appendChild(acqlogo);
                acqfrag.appendChild(acqlink);
                acqfrag.appendChild(document.createElement('br'));

                // Construct a new acqcards
                for (const card in acq.cards) { acqcards[card] = acq.cards[card]; }
            }
        } else {
            const acqtext = document.createElement('p');
            acqtext.classList.add('acquirer-included');
            acqtext.textContent = included;
            acqfrag.appendChild(acqtext);
        }
        const cardfrag = document.createDocumentFragment();
        for (const card in psp.cards) {
            if (psp.acquirers && !acqcards[card]) { continue; }

            //  Some cards/methods (e.g. mobilepay) add extra costs.
            if (typeof psp.cards[card] === 'object') {
                if (!opts.cards[card]) { continue; }
                cost2obj(psp.cards[card], fees, card);
            }
            const cardicon = new Image(22, 15);
            const applePayFrag = document.createElement('div');
            if(card == 'Apple Pay'){
              cardicon.src = './img/cards/' + card + '.svg?1';
              cardicon.alt = card;
              cardicon.className = 'card';
              applePayFrag.appendChild(cardicon);
              cardfrag.appendChild(applePayFrag);
            }

            else{
              cardicon.src = './img/cards/' + card + '.svg?1';
              cardicon.alt = card;
              cardicon.className = 'card';
              cardfrag.appendChild(cardicon);
            }
        }

        // Calculate TC and sort psps
        const totals = merge(fees.monthly, fees.trn);
        const totalcost = sum(totals);
        let sort;
        for (sort = 0; sort < data.length; ++sort) {
            if (totalcost.order($currency) < data[sort]) { break; }
        }
        data.splice(sort, 0, totalcost.order($currency));

        // Create PSP logo.
        const pspfrag = document.createDocumentFragment();
        const mailfragment = document.createDocumentFragment();
        const psplink = document.createElement('a');
        const pspPackage = document.createElement('a');

        psplink.target = '_blank';
        psplink.href = psp.link;
        psplink.className = 'psp';
        pspPackage.target = '_blank';
        pspPackage.href = psp.link;
        const psplogo = new Image();
        psplogo.src = './img/psp/' + psp.logo + '?{{ imgt }}';
        psplogo.alt = psp.name;
        const pspname = document.createElement('span');
        const link_ref = document.createElement('span');
        pspname.textContent = psp.name;
        link_ref.textContent = psp.name;
        psplink.appendChild(psplogo);
        pspPackage.appendChild(link_ref);
        pspfrag.appendChild(psplink);

        mailfragment.appendChild(divmailfrag);

        // cardfee calc.
        const cardfeefrag = document.createDocumentFragment();
        const p1 = document.createElement('p');
        const cardfee = totalcost.scale(1 / ($qty || 1));

        const cardfeepct = String(Math.round(cardfee.order($currency) * 10000 / $avgvalue
            .order($currency)) / 100);
        cardfeefrag.textContent = cardfee.print($currency);
        if(!cardfeefrag.textContent.startsWith("In.fin.ity")){
          p1.textContent = '(' + cardfeepct.replace('.', currency_map[$currency].d) + '%)';
        }
        if (cardfeefrag.textContent.startsWith("In.fin.ity")) {
          cardfeefrag.textContent = unknown_price+"*";
        }
        p1.className = 'procent';
        cardfeefrag.appendChild(p1);
        const tr = document.createElement('tr');
        tr.insertCell(-1).appendChild(pspfrag);
        tr.insertCell(-1).appendChild(pspPackage);
        tr.insertCell(-1).appendChild(acqfrag);
        tr.insertCell(-1).appendChild(cardfrag);
        tr.insertCell(-1).appendChild(sumTxt(fees.setup));
        tr.insertCell(-1).appendChild(sumTxt(fees.monthly));
        tr.insertCell(-1).appendChild(sumTxt(fees.trn));
        tr.insertCell(-1).appendChild(sumTxt(totals));
        tr.insertCell(-1).appendChild(cardfeefrag);
        tr.insertCell(-1).appendChild(mailfragment);
        frag.insertBefore(tr, frag.childNodes[sort]);
    }
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(frag);
}

function disableCards(arr) {
    const o = {};
    for (let card of arr) { o[card] = 1; }

    const ocards = document.getElementsByClassName('ocards');
    for (let elem of ocards) {
        if (o[elem.value]) {
            if (opts.cards[elem.value]) {
                // Deselect the card and remove from opts
                elem.checked = false;
                delete opts.cards[elem.value];
            }
            elem.disabled = true;
        } else {
            elem.disabled = false;
        }
    }
}

let cachedString;
function formEvent(evt) {
    opts = form2obj(this);
    const optsString = JSON.stringify(opts);
    if (optsString !== cachedString) {
        settings(opts);
    }
    cachedString = optsString;
}


(() => {
    const form = document.getElementById('form');
    if (form) {
        settings(opts);
        form.addEventListener('change', formEvent);
        form.addEventListener('input', formEvent);
        obj2form(opts, form);
    }
})();
