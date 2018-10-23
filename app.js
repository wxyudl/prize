;(function (window, $) {
  let personData = [];
  let totalCells = 0;
  let isFetchingData = true;

  attachEvent();
  fetchData();

  window.onload = function () {
    let startBtn = $('#start')[0];
    isFetchingData = false;

    startBtn.innerHTML = '开始抽奖';
    startBtn.classList.remove('disabled');
  }

  function attachEvent () {
    let startBtn = $('#start')[0];

    startBtn.addEventListener('click', (e) => {
      let number = $('#number')[0].value;

      if (number.trim() && !isFetchingData) {
        $('#settings')[0].style.display = 'none';
        drawGrid();
      }
    });

    $('#restart')[0].addEventListener('click', (e) => {
      $('#result')[0].style.display = 'none';
      $('#settings')[0].style.display = 'block';

      $('#number')[0].value = '';
    });
  }

  function fetchData () {
    if (personData.length === 0) {
      fetch('./person.json').then((res, rej) => {
        return res.json();
      }).then((res, rej) => {
        loadImages(res)

        personData = res;
      })
    }
  }

  function loadImages (data) {
    let tmpEl = $('#tmp')[0];

    for (let d of data) {
      let img = new Image();
      img.src  = d.avatar;

      tmpEl.appendChild(img);
    }
  }

  function drawGrid () {
    personData = upsetData();

    let totalPerson = personData.length;
    let multiple = Math.ceil(Math.sqrt(totalPerson / (2 * 1)));

    let [cols, rows] = [multiple * 2, multiple * 1];
    let cells = cols * rows;
    let cardsEl = $('#cards')[0];
    let cards = '';
    let columns = `${100 / cols}% `;
    
    totalCells = cells;
    console.table({'人数：': totalPerson, '单元格数：': cells, '行数：': rows, '列数：': cols});

    cardsEl.style.gridTemplateColumns = columns.repeat(cols);
    for (var i = 0; i < cells; i++) {
      if (totalPerson > i) {
        cards += `<div class="card" data-id="${ i }">
                    <div class="avatar"><img src="./300x300.png"></div>
                    <div class="name"></div>
                    <div class="id"></div>
                  </div>`;
      } else {
        cards += `<div class="card hide"></div>`;
      }
    }

    cardsEl.innerHTML = cards;

    // renderCards();
    renderCardsV2();
  }

  function renderCards () {
    let totalPerson = personData.length;
    let idx = 0;

    let liter = setInterval(() => {
      if (idx === totalCells) {
        fire();
        clearInterval(liter);
        return false;
      } else {
        let card = $('.card[data-id="'+ idx +'"]')[0];
        if (totalPerson > idx) {
          card.innerHTML = `<div class="avatar"><img src="${ personData[idx].avatar }" /></div>
                            <div class="name">${ personData[idx].name }</div>
                            <div class="id"></div>`;
        } else {
          cards.classList.add('hide');
        }
      }

      idx++;
    }, 50);
  }

  function renderCardsV2 () {
    let totalPerson = personData.length;
    let idx = 0;

    let liter = setInterval(() => {
      let deal = $('#deal')[0];

      if (idx === totalCells) {
        fire();
        clearInterval(liter);
        deal.innerHTML = `<p></p>`;
        return false;
      } else {
        if (totalPerson > idx) {
          let card = $('.card[data-id="'+ idx +'"]')[0];
          let offset = card.getBoundingClientRect();
          let dealInnerEl = deal.querySelector('p');

          dealInnerEl.style.transform = `translate(${ offset.x - dealInnerEl.getBoundingClientRect().x }px, ${ offset.y - dealInnerEl.getBoundingClientRect().y }px)`;

          card.innerHTML = `<div class="avatar"><img src="${ personData[idx].avatar }"></div>
                            <div class="name">${ personData[idx].name }</div>
                            <div class="id"></div>`;
                            
          setTimeout(() => {
            if (personData[idx]) {
              deal.innerHTML = `<p><img src="${ personData[idx].avatar }" /></p>`;
            } else {
              deal.innerHTML = `<p></p>`;
            }
          }, 50)
        } else {
          cards.classList.add('hide');
        }
      }

      idx++;
    }, 100);
  }

  function fire () {
    let liter = setInterval(() => {
      reset();
      let r = Math.floor(Math.random() * personData.length);
      $('.card[data-id="'+ r +'"]')[0].classList.add('highlight');
    }, 200);

    showResults(liter);
  }

  function showResults (liter) {
    setTimeout(() => {
      let number = $('#number')[0].value;
      let prize = $('#prizes')[0].value;

      let winners = getWinners(number);
      clearInterval(liter);
      reset();

      for (let r of winners) {
        $('.card[data-id="'+ r +'"]')[0].classList.add('highlight');
      }

      setTimeout(() => {
        let resultPersonsEl = $('#result-persons')[0];
        let _html = '';
        let prizeEl = $('#prize span')[0];
        
        $('#result')[0].style.display = 'block';

        for (let r of winners) {
          _html += `<div>
                      <span class="avatar" style="background: url(${ personData[r].avatar }); background-size: cover;"></span>
                      <span class="name">${ personData[r].name }</span>
                    </div>`;
        }

        prizeEl.innerHTML = prize;
        resultPersonsEl.innerHTML = _html;
        
        removeWinnersFromData(winners);
      }, 1000);

    }, 5000);
  }

  function reset () {
    $('.card').forEach(e => {
      e.classList.remove('highlight');
    })
  }

  function upsetData () {
    return randomArr(personData);
  }

  function getWinners (number) {
    let arr = [];
    let totalPerson = personData.length;
    number = (number < totalPerson) ? number : totalPerson;

    while (arr.length < number) {
        var randomNumber = Math.floor(Math.random() * totalPerson);
        if (arr.indexOf(randomNumber) > -1) {
          continue;
        };

        arr[arr.length] = randomNumber;
    }

    return arr;
  }

  function randomArr (arr) {
    let tempArr = [];

    while (tempArr.length < arr.length) {
      var randomNumber = Math.floor(Math.random() * arr.length);
      if (tempArr.indexOf(arr[randomNumber]) > -1) {
        continue;
      };

      tempArr.push(arr[randomNumber]);
    }

    return tempArr;
  }

  function removeWinnersFromData (winners) {
    // Sort winners by index desc
    winners.sort((a, b) => (b - a));

    let personCountBefore = personData.length;

    for (let w of winners) {
      personData.splice(w, 1);
    }

    console.table({'总人数（中奖前）': personCountBefore, '总人数（中奖后）': personData.length, '中奖人': winners});
  }
})(window, (sel) => {
  return document.querySelectorAll(sel);
});