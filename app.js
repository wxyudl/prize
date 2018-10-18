;(function (window, $) {
  let personData = [];
  let totalCells = 0;

  attachEvent();

  function attachEvent () {
    $('#start')[0].addEventListener('click', (e) => {
      let number = $('#number')[0].value;

      if (number.trim()) {
        $('#settings')[0].style.display = 'none';
        fetchData();
      }
    });

    $('#restart')[0].addEventListener('click', (e) => {
      $('#result')[0].style.display = 'none';
      $('#settings')[0].style.display = 'block';

      $('#number')[0].value = '';
    });
  }

  function fetchData () {
    if (personData.length) {
      drawGrid();
    } else {
      fetch('./person.json').then((res, rej) => {
        return res.json();
      }).then((res, rej) => {
        personData = res;
        drawGrid();
      })
    }
  }

  function drawGrid () {
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

    renderCards();
  }

  function renderCards () {
    let newPersonData = upsetData();
    let totalPerson = newPersonData.length;
    let idx = 0;

    let liter = setInterval(() => {
      if (idx === totalCells) {
        fire();
        clearInterval(liter);
        return false;
      } else {
        let card = $('.card[data-id="'+ idx +'"]')[0];
        if (totalPerson > idx) {
          card.innerHTML = `<div class="avatar"><img src="${ newPersonData[idx].avatar }"></div>
                            <div class="name">${ newPersonData[idx].name }</div>
                            <div class="id"></div>`;
        } else {
          cards.classList.add('hide');
        }
      }

      idx++;
    }, 50);
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

      let result = getResult(number);
      clearInterval(liter);
      reset();

      for (let r of result) {
        $('.card[data-id="'+ r +'"]')[0].classList.add('highlight');
      }

      setTimeout(() => {
        let resultPersonsEl = $('#result-persons')[0];
        let _html = '';
        let prizeEl = $('#prize span')[0];
        
        $('#result')[0].style.display = 'block';

        for (let r of result) {
          _html += `<div>
                      <span class="avatar" style="background: url(${ personData[r].avatar }); background-size: cover;"></span>
                      <span class="name">${ personData[r].name }</span>
                    </div>`;
        }

        prizeEl.innerHTML = prize;
        resultPersonsEl.innerHTML = _html;
      }, 500);

    }, 5000);
  }

  function reset () {
    $('.card').forEach(e => {
      e.classList.remove('highlight');
    })
  }

  function upsetData () {
    return personData;
  }

  function getResult (num) {
    let arr = [];
    let totalPerson = personData.length;

    while(arr.length < num){
        var randomNumber = Math.floor(Math.random() * totalPerson);
        if(arr.indexOf(randomNumber) > -1) continue;
        arr[arr.length] = randomNumber;
    }

    return arr;
  }
})(window, (sel) => {
  return document.querySelectorAll(sel);
});