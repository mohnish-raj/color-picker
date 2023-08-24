"use strict";
const colorpad = document.getElementById('colorpad'),
  loader = document.getElementById('loader'),
  slider = document.querySelectorAll('.slider'),
  btnInc = document.querySelectorAll('.btn-inc'),
  btnDec = document.querySelectorAll('.btn-dec');

var bg = 'rgb(255,255,255)',
  options = {},

  defaultSettings = {
    theme: 'light',
    holdLength: 1000,
    randomize: 'true',
    colorMode: 'hex'
  },

  colorComponents = {
    red: 255,
    green: 255,
    blue: 255
  },

  colors = [],
  selectedColors = [],
  colorCount = 0;
  
///////////// Open collection on swipe /////////////
var slideCoords = {
  startX: undefined,
  endX: undefined,
  startY: undefined,
  endY: undefined
};

window.addEventListener('touchstart', e => {
  slideCoords.startX = e.touches[0].pageX;
});

window.addEventListener('touchmove', e => {
  slideCoords.endX = e.touches[0].pageX;
});

window.addEventListener('touchend', function() {
  (slideCoords.startX < 20 && slideCoords.endX > 100 && slideCoords.endX < 200) ?
  document.getElementById('open-collection').click(): null;
});
//////////////////////////

slider.forEach(slider => { // setup range sliders
  slider.setAttribute('min', 0);
  slider.setAttribute('max', 255);
  slider.setAttribute('value', 255);

  slider.addEventListener('touchstart', function() {
    this.classList.add('active');
  });

  slider.addEventListener('touchend', function() {
    this.classList.remove('active');
  });

  slider.addEventListener('mousedown', function() {
    this.classList.add('active');
  });

  slider.addEventListener('mouseup', function() {
    this.classList.remove('active');
  });

  slider.addEventListener('input', function() {
    rangeOnInput(this);
    preview();
    convert();
  });
});

document.getElementById('menu-btn').addEventListener('click', function() {
  document.getElementById('menu').classList.toggle('active');
});

document.getElementById('menu').addEventListener('click', e => {
  if (e.target === document.getElementById('menu')) document.getElementById('menu').classList.remove('active');
});

document.getElementById('open-collection').addEventListener('click', function() {
  document.getElementById('collection').classList.toggle('active');
  document.getElementById('menu').classList.remove('active')
});

document.getElementById('open-collection').addEventListener('click', function() {
  document.getElementById('collection').classList.add('active');
});

document.getElementById('collection-close').addEventListener('click', function() {
  document.getElementById('collection').classList.remove('active');
});

document.getElementById('collection').addEventListener('click', e => {
  if (e.target === document.getElementById('collection')) {
    document.getElementById('collection').classList.remove('active');

    if (document.querySelectorAll('.color-card.selected').length !== 0) {
      document.querySelectorAll('.color-card.selected').forEach(card => {
        card.click();
      });
    }
  }
});

///////////// Set options /////////////
localStorage.getItem('theme') === null ? localStorage.setItem('theme', 'light') : null;
localStorage.getItem('holdLength') === null ? localStorage.setItem('holdLength', 1000) : null;
localStorage.getItem('randomize') === null ? localStorage.setItem('randomize', 'true') : null;
localStorage.getItem('colorMode') === null ? localStorage.setItem('colorMode', 'hex') : null;

window.addEventListener('DOMContentLoaded', function() {
  // loader
  loader.style.opacity = 0;

  loader.addEventListener('transitionend', () => loader.remove());
  ///////

  setOptions({
    theme: localStorage.getItem('theme'),
    holdLength: localStorage.getItem('holdLength'),
    randomize: localStorage.getItem('randomize'),
    colorMode: localStorage.getItem('colorMode')
  });

  options.randomize == 'true' ? document.getElementById('random').click() : null;
});

function setOptions({
  theme,
  holdLength,
  randomize,
  colorMode
} = {}) {
  options.holdLength = holdLength;
  options.randomize = randomize;
  options.colorMode = colorMode;
  options.theme = theme;

  localStorage.setItem('holdLength', holdLength)
  localStorage.setItem('randomize', randomize);
  localStorage.setItem('colorMode', colorMode);
  localStorage.setItem('theme', theme);

  if (theme == 'light') {
    document.getElementById('theme-stylesheet').setAttribute('href', 'Themes/css/theme1.css');
    document.getElementById('theme-light').setAttribute('checked', 'checked');
  } else {
    document.getElementById('theme-stylesheet').setAttribute('href', 'Themes/css/theme1-dark.css');
    document.getElementById('theme-dark').setAttribute('checked', 'checked');
  }

  if (randomize == 'true') {
    document.getElementById('chk-randomize').setAttribute('checked', 'checked');
  } else {
    document.getElementById('chk-randomize').removeAttribute('checked');
  }

  if (colorMode == 'hex') {
    document.getElementById('mode-hex').click();
  } else if (colorMode == 'rgb') {
    document.getElementById('mode-rgb').click();
  } else {
    document.getElementById('mode-hsl').click();
  }

  document.getElementById('input-hold-len').value = holdLength;
}

document.getElementById('chk-randomize').addEventListener('click', function() {
  if (this.checked) {
    options.randomize = 'true';
    localStorage.setItem('randomize', 'true');
  } else {
    options.randomize = 'false';
    localStorage.setItem('randomize', 'false');
  }
});

document.getElementById('mode-rgb').addEventListener('click', function() {
  options.colorMode = 'rgb';
});

document.getElementById('mode-hsl').addEventListener('click', function() {
  options.colorMode = 'hsl';
});

document.getElementById('theme-light').addEventListener('click', function() {
  options.theme = 'light';
});

document.getElementById('theme-dark').addEventListener('click', function() {
  options.theme = 'dark';
});

document.getElementById('save-options').addEventListener('click', function() {
  options.holdLength = document.getElementById('input-hold-len').value;
  setOptions(options);
});
///////////////////////////

function rangeOnInput(ran) {
  // set style to ranges oninput
  let val = ran.value;
  let max = ran.max;
  let percent = (val / max) * 100;
  ran.style.background = `linear-gradient(90deg, var(--slider-color) ${percent}%, ${ran.dataset.bg} ${percent}%)`;
}

function preview() {
  // set color to colorpad
  colorComponents.red = document.getElementById('slider-red').value;
  colorComponents.green = document.getElementById('slider-green').value;
  colorComponents.blue = document.getElementById('slider-blue').value;
  bg = `rgb(${colorComponents.red}, ${colorComponents.green}, ${colorComponents.blue})`;
  document.getElementById('colorpad').style.background = bg;
  document.getElementById('rgb-value').value = bg;
}

function rgbToHex() {
  // convert rgb to hexadecimal
  let r, g, b, hex;
  r = Number(colorComponents.red).toString(16);
  g = Number(colorComponents.green).toString(16);
  b = Number(colorComponents.blue).toString(16);
  (r.length == 1) ? r = 0 + r: null;
  (g.length == 1) ? g = 0 + g: null;
  (b.length == 1) ? b = 0 + b: null;
  hex = `#${r}${g}${b}`;
  document.getElementById('hex-value').value = hex;
}

function rgbToHsl() {
  // convert rgb to hsl
  let r, g, b;
  r = colorComponents.red / 255;
  g = colorComponents.green / 255;
  b = colorComponents.blue / 255;
  let min = Math.min(r, g, b),
    max = Math.max(r, g, b);
  let h, s, l, hsl;
  l = Math.round(((min + max) / 2) * 100);

  if (min === max) {
    h = 0;
    s = 0;
  } else {

    if (l < 50) {
      s = Math.round(((max - min) / (max + min)) * 100);
    } else {
      s = Math.round(((max - min) / (2.0 - max - min)) * 100);
    }

    switch (max) {
      case r:
        h = Math.round(((g - b) / (max - min)) * 60);
        break;

      case g:
        h = Math.round(((b - r) / (max - min) + 2) * 60);
        break;

      case b:
        h = Math.round(((r - g) / (max - min) + 4) * 60);
        break;
    }
  }

  (h < 0) ? h += 360: null;
  hsl = `hsl(${h}, ${s}%, ${l}%)`;
  document.getElementById('hsl-value').value = hsl;
}

function convert() {
  // convert rgb to other color spaces
  rgbToHex();
  rgbToHsl();
}

for (let i = 0, len = btnInc.length; i < len; i++) {
  btnInc[i].addEventListener('click', function() {
    rangeOnInput(slider[i]);
    slider[i].value = Number(slider[i].value) + 1;
    preview();
    convert();
  });
}
for (let i = 0, len = btnDec.length; i < len; i++) {
  btnDec[i].addEventListener('click', function() {
    rangeOnInput(slider[i]);
    slider[i].value = Number(slider[i].value) - 1;
    preview();
    convert();
  });
}

///////////// copy btns /////////////
document.getElementById('copy-hex').addEventListener('click', function() {
  document.getElementById('hex-value').select();
});
document.getElementById('copy-rgb').addEventListener('click', function() {
  document.getElementById('rgb-value').select();
});
document.getElementById('copy-hsl').addEventListener('click', function() {
  document.getElementById('hsl-value').select();
})
document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', function() {
    document.execCommand('copy');
  })
});
//////////////////////////

document.getElementById('random').addEventListener('click', function() {
  // generate random color
  document.getElementById('slider-red').value = Math.floor(Math.random() * 255);
  document.getElementById('slider-green').value = Math.floor(Math.random() * 255);
  document.getElementById('slider-blue').value = Math.floor(Math.random() * 255);
  preview();

  slider.forEach(range => {
    rangeOnInput(range);
  });

  convert();
});

document.getElementById('enter-value').addEventListener('input', function() {
  // Input from user
  colorpad.style.backgroundColor = this.value;
  let color = getComputedStyle(colorpad).getPropertyValue('background-color').replace(/(rgb|rgba)\(/i, '').replace(')', '').split(',');
  document.getElementById('slider-red').value = color[0].trim();
  document.getElementById('slider-green').value = color[1].trim();
  document.getElementById('slider-blue').value = color[2].trim();
  preview();

  slider.forEach(slider => {
    rangeOnInput(slider);
  });

  convert();
});

function createCard(data_color) {
  // Color card
  let colorCard = document.getElementById('saved-colors').appendChild(document.createElement('div')),
    previewColor = colorCard.appendChild(document.createElement('span')),
    cardSpan = colorCard.appendChild(document.createElement('span')),
    cardMore = colorCard.appendChild(document.createElement('span')),
    btnMore = colorCard.appendChild(document.createElement('button')),
    btnRemove = cardMore.appendChild(document.createElement('span')),
    btnAddFav = cardMore.appendChild(document.createElement('span'));

  for (let i = 0; i < 3; i++) {
    btnMore.appendChild(document.createElement('span'));
  }

  colorCard.dataset.color = data_color;
  previewColor.style.background = data_color;
  colorCard.className = 'color-card';
  previewColor.className = 'preview-color';
  cardSpan.className = 'card-span';
  cardMore.className = 'card-more';
  btnMore.classList.add('btn', 'btn-card-more', 'ripple-effect');
  btnRemove.classList.add('btn-remove', 'ripple-effect');
  btnAddFav.classList.add('btn-add-to-fav', 'ripple-effect');
  setupRippleBtn(btnMore, btnRemove, btnAddFav);

  let cardHexVal = cardSpan.appendChild(document.createElement('input')),
    cardRgbVal = cardSpan.appendChild(document.createElement('input')),
    cardHslVal = cardSpan.appendChild(document.createElement('input'));

  cardHexVal.value = document.getElementById('hex-value').value;
  cardRgbVal.value = document.getElementById('rgb-value').value;
  cardHslVal.value = document.getElementById('hsl-value').value;

  document.querySelectorAll('.card-span input').forEach(child => {
    child.className = 'input-field';
    child.setAttribute('readonly', 'readonly');
    child.addEventListener('click', function() {
      // Copy the value of input by clicking on it
      this.select();
      document.execCommand('copy');
      toast(document.getElementById('toast-copied'));
    });
  });

  let x, y, timeout, numSelected;

  colorCard.addEventListener('touchstart', function(e) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    if (!this.closest('#saved-colors').classList.contains('selection-active')) {
      timeout = setTimeout(() => {
        this.classList.add('selected');
        this.closest('#saved-colors').classList.add('selection-active');
        numSelected = document.querySelectorAll('.color-card.selected').length;
        document.getElementById('num-selected').textContent = numSelected;
      }, options.holdLength);
    }
  });
  colorCard.addEventListener('mousedown', function() {
    if (!this.closest('#saved-colors').classList.contains('selection-active')) {
      timeout = setTimeout(() => {
        this.closest('#saved-colors').classList.add('selection-active');
        numSelected = document.querySelectorAll('.color-card.selected').length;
        document.getElementById('num-selected').textContent = numSelected;
      }, options.holdLength);
    }
  });

  window.addEventListener('mouseup', function() {
    clearTimeout(timeout);
  });

  window.addEventListener('touchend', function() {
    clearTimeout(timeout);
  });

  colorCard.addEventListener('touchmove', function(e) {
    if (
      e.touches[0].clientX > x + 30 &&
      e.touches[0].clientY > y &&
      e.touches[0].clientY < y + 10
    ) this.classList.add('remove-active');
    else if (
      e.touches[0].clientX < x - 30 &&
      e.touches[0].clientY > y &&
      e.touches[0].clientY < y + 10
    ) this.classList.remove('remove-active');
  });

  colorCard.addEventListener('click', function() {
    if (this.closest('#saved-colors').classList.contains('selection-active')) {
      this.classList.toggle('selected');
      numSelected = document.querySelectorAll('.color-card.selected').length;
      document.getElementById('num-selected').textContent = numSelected;
    }

    (numSelected == 0) ? this.closest('#saved-colors').classList.remove('selection-active'): null;
  });

  btnMore.addEventListener('click', function() {
    colorCard.classList.toggle('remove-active');
  });

  btnRemove.addEventListener('click', function() {
    colorCard.style.animation = 'remove-card 300ms linear 1 forwards';

    setTimeout(function() {
      removeCard(colorCard);
    }, 300);
  });
}
// Selection
document.getElementById('select-all').addEventListener('click', function() {
  document.querySelectorAll('.color-card').forEach(card => {
    card.classList.add('selected');
    document.getElementById('num-selected').textContent = document.querySelectorAll('.color-card.selected').length;
  });
});

document.getElementById('delete-all').addEventListener('click', function() {
  document.getElementById('clear-collection').classList.add('active');
});

document.getElementById('clear-sure').addEventListener('click', function() {
  document.querySelectorAll('.color-card.selected').forEach(card => {
    card.style.animation = 'remove-card 300ms linear 1 forwards';

    setTimeout(function() {
      removeCard(card);
      let numSelected = document.querySelectorAll('.color-card.selected').length;
      document.getElementById('num-selected').textContent = numSelected;
      (numSelected == 0) ? document.getElementById('saved-colors').classList.remove('selection-active'): null;
    }, 300);
  });
});

function removeCard(card) {
  card.remove();
  colorCount -= 1;
  document.getElementById('no-of-colors').innerHTML = colorCount;
  let index = colors.indexOf(card.dataset.color);
  delete colors[index];
  toast(document.getElementById('toast-deleted'))
}

document.getElementById('add-color').addEventListener('click', function() {
  if (colors.includes(document.getElementById('hex-value').value))
    document.getElementById('already-present').classList.add('active')
  else {
    let col = document.getElementById('hex-value').value;
    colors.push(col);
    createCard(col);
    colorCount++;
    document.getElementById('no-of-colors').innerHTML = colorCount;
    toast(document.getElementById('toast-added-coll'));
  }
});

// modal box script
const modal = document.querySelectorAll('.modal'),
  modalBox = document.querySelectorAll('.modal-box'),
  modalCloseBtn = document.querySelectorAll('.modal .btn-close-modal'),
  modalReject = document.querySelectorAll('.modal .reject-modal'),
  modalAccept = document.querySelectorAll('.modal .accept-modal');

modal.forEach(modal => {
  // Close modal if clicked outside
  modal.addEventListener('click', e => {
    (e.target === modal) ? modal.classList.remove('active'): null;
  });
});

modalCloseBtn.forEach(btn => {
  btn.addEventListener('click', closeModal);
});

modalReject.forEach(btn => {
  btn.addEventListener('click', closeModal);
});

modalAccept.forEach(btn => {
  btn.addEventListener('click', closeModal);
});

function closeModal() {
  modal.forEach(modal => {
    modal.classList.remove('active');
  });
}
//////

function toast(elem) {
  // function for toasts
  elem.classList.add('active');

  setTimeout(() => {
    elem.classList.remove('active');
  }, 2000);
}

document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', function() {
    toast(document.getElementById('toast-copied'));
  });
});

// copy color modal
document.getElementById('copy-all').addEventListener('click', function() {
  selectedColors = [];

  document.querySelectorAll('.color-card.selected').forEach(card => {
    selectedColors.push(card.dataset.color);
  });

  document.getElementById('copy-color-values').value = selectedColors;
  document.getElementById('copy-colors').classList.add('active');
});

document.getElementById('copy-sure').addEventListener('click', function() {
  document.getElementById('copy-color-values').select();
  document.execCommand('copy');
});

// Settings
document.getElementById('open-settings').addEventListener('click', function() {
  document.getElementById('settings').classList.add('active');
  document.getElementById('menu').classList.remove('active');
});

document.getElementById('close-settings').addEventListener('click', function() {
  document.getElementById('settings').classList.remove('active');
});

document.getElementById('reset-settings').addEventListener('click', function() {
  document.getElementById('reset-settings-modal').classList.add('active');
});

document.getElementById('reset-sure').addEventListener('click', function() {
  localStorage.clear();
  setOptions(defaultSettings);
});

// Favourites
document.getElementById('open-favourites').addEventListener('click', function() {
  document.getElementById('favourites').classList.add('active');
  document.getElementById('menu').classList.remove('active');
});

document.getElementById('close-favourites').addEventListener('click', function() {
  document.getElementById('favourites').classList.remove('active');
});