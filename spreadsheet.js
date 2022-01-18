const refs = {
  rowInput: document.querySelector('#row-input'),
  columnInput: document.querySelector('#column-input'),
  form: document.querySelector('.form'),
  table: document.querySelector('#table-main'),
  thead: document.querySelector('#table-headers'),
  tbody: document.querySelector('#table-body'),
  container: document.querySelector('#container'),
  exportBtn: document.querySelector('#exportBtn'),
  input: document.querySelector('#inputFile'),
  textarea: document.querySelector('#textArea'),


}
refs.form.addEventListener('submit', onSubmit);
window.addEventListener('click', onCellClick);
window.addEventListener('keydown', onKeyPress);
refs.table.addEventListener('dblclick', onCellDblClick);
refs.exportBtn.addEventListener('click', exportJSON);
refs.input.addEventListener('change', importJSON);

let rowNumber;
let columnNumber;
let lastClicked = null;
let tableInput = null;
let tableInputCell = null;
let cellValue = '';



function createHeaderRow (columnNumber){
  const tr = document.createElement('tr')
  tr.setAttribute('id', 'h-0');

  for (let i = 0; i <= columnNumber; i = i+1) {
    const th = document.createElement('th');
    th.id = `h-0-${i}`;

    if(i === 0){
      th.classList.add('row-number');
      th.innerHTML = '№';
    }else{
      th.classList.add('column-header');
      th.innerHTML = `Col ${i}`
    }
    tr.appendChild(th)
  }
  refs.thead.appendChild(tr);
}

function createTableBody(rowNumber, columnNumber, cellValue = ''){

  for (let i = 0; i < rowNumber; i = i+1) {
    const tr = document.createElement('tr');
    for (let j = 0; j <= columnNumber; j = j +1){
      const td = document.createElement('td');
      if (j === 0) {
        td.classList.add('main-cell')
        td.innerHTML = `${i+1}`;
      }else{
        td.classList.add('cell')
        td.id = `row-${i+1}-col-${j}`;
        td.innerHTML = cellValue;
      }
      tr.appendChild(td)
    }
    refs.tbody.appendChild(tr)
  }
}

function onCellClick(e){
  // console.dir(e.target)
  if (e.target.localName === 'td'){
    if(e.target.innerText) {
      cellValue = e.target.innerText
    }else{
      cellValue = ''
    }
    e.target.classList.toggle('selected')

    if (lastClicked && (lastClicked !== e.target.id)){
      document.querySelector(`#${lastClicked}`).classList.remove('selected')
    }
    lastClicked = e.target.id
  }

  if (lastClicked && (e.target.localName !== 'td')){
    document.querySelector(`#${lastClicked}`).classList.remove('selected')
    lastClicked = null;
  }
  if (e.target.id === 'table-input'){
    tableInput = e.target.id;
    tableInputCell = e.target.parentElement.id;
  }
  if (tableInput && (e.target.id !== 'table-input')){

    const elem = document.querySelector(`#${tableInputCell}`);
    const input = document.querySelector(`#${tableInput}`)
    elem.innerHTML = input.value
    tableInput = undefined;
    tableInputCell = undefined;
    elem.removeChild(elem.lastElementChild)
  }
}

function onCellDblClick(e){
  if (e.target.localName === 'td'){
    const id = e.target.id;
    const elem = document.querySelector(`#${id}`)
    const input = document.createElement('input');
    const value = e.target.innerText
    e.target.innerText = '';
    input.type ='text';
    input.id =  'table-input';
    input.classList.add( 'input');
    input.value =  value;
    elem.appendChild(input);
  }
}

function onKeyPress(e){
  const pressedKey = e.key;
  if (lastClicked){
    switch (pressedKey){
      case 'ArrowLeft':
        const splitLeft = lastClicked.split('-');
        const newNumberLeft = Number(splitLeft[3]) -1;

        if(newNumberLeft < 1) return;

        document.querySelector(`#${lastClicked}`).classList.remove('selected')
        const sliceLeft = splitLeft.slice(0,3);
        const newArrLeft = sliceLeft.push(newNumberLeft.toString());
        const joinLeft = sliceLeft.join('-');
        lastClicked = joinLeft;
        document.querySelector(`#${lastClicked}`).classList.toggle('selected')
        break;
      case 'ArrowRight':
        const splitRight = lastClicked.split('-');
        const newNumberRight = Number(splitRight[3]) +1;

        if(newNumberRight > columnNumber) return;

        document.querySelector(`#${lastClicked}`).classList.remove('selected')
        const sliceRight = splitRight.slice(0,3);
        const newArrRight = sliceRight.push(newNumberRight.toString());
        const joinRight = sliceRight.join('-');

        lastClicked = joinRight;
        document.querySelector(`#${lastClicked}`).classList.toggle('selected')
        break;
      case 'ArrowUp':
        const splitUp = lastClicked.split('-')
        const newNumberUp = Number(splitUp[1]) -1;

        if(newNumberUp<1) return;

        document.querySelector(`#${lastClicked}`).classList.remove('selected')
        const spliceUp = splitUp.splice(1,1 )
        const newArrUp = splitUp.splice(1,0,newNumberUp.toString())
        const joinUp = splitUp.join('-')
        lastClicked = joinUp;
        document.querySelector(`#${lastClicked}`).classList.toggle('selected')
        break;
      case ('ArrowDown'):
        const splitDown = lastClicked.split('-')
        const newNumberDown = Number(splitDown[1]) +1;

        if (newNumberDown > rowNumber) return;

        document.querySelector(`#${lastClicked}`).classList.remove('selected')
        const spliceDown = splitDown.splice(1,1 )
        const newArrDown = splitDown.splice(1,0,newNumberDown.toString())
        const joinDown = splitDown.join('-')
        lastClicked = joinDown;
        document.querySelector(`#${lastClicked}`).classList.toggle('selected')
        break;
      case 'Delete':
        if(cellValue){
          const elem  = document.querySelector(`#${lastClicked}`)
          elem.innerHTML = '';
        }
    }
  }
    if(tableInput){
      if(pressedKey === 'Enter'){
        const elem = document.querySelector(`#${tableInputCell}`);
        const input = document.querySelector(`#${tableInput}`)
        elem.innerHTML = input.value;
        tableInput = undefined;
        tableInputCell = undefined;
        elem.removeChild(elem.lastElementChild)
        return;
      }
      if(pressedKey === 'Tab'){
        const elem = document.querySelector(`#${tableInputCell}`);
        const input = document.querySelector(`#${tableInput}`)
        elem.innerHTML = input.value;
        tableInput = undefined;
        tableInputCell = undefined;
        elem.removeChild(elem.lastElementChild)
        return;
      }

      if(pressedKey === 'Escape'){
        const elem = document.querySelector(`#${tableInputCell}`);
        tableInput = undefined;
        elem.removeChild(elem.lastElementChild)
      }
    }
}

function exportData(table){
  const data = [];
  for (let i = 1; i<table.rows.length; i = i+1){
    const tableRow = table.rows[i];
    let rowData = [];
    for (let j = 1; j<tableRow.cells.length; j = j+1){
      rowData.push(tableRow.cells[j].innerHTML) ;
    }
    data.push(rowData);
  }
  return data;
}

function exportJSON(){
  const data = JSON.stringify(exportData(refs.table));
  refs.textarea.value = data;
}

function importJSON(e){
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const read = new Promise(function(resolve) {
    let reader = new window.FileReader();
    reader.onload = () => {
      refs.textarea.value = reader.result;
      resolve(reader.result);
    };
    reader.readAsText(file);
  });

  read.then(value => {
    let columnNum;
    let rowNum;
    const data = JSON.parse(value);
    console.log(data.length)
    rowNum = data.length
    data.forEach(col=>{
      columnNum = col.length;
      })

    createHeaderRow(columnNum)
    createTableBody(rowNum, columnNum)
  })
}

function onSubmit(e){
  e.preventDefault();

  rowNumber = refs.rowInput.value;
  columnNumber = refs.columnInput.value;

  refs.thead.innerHTML = '';
  refs.tbody.innerHTML = '';

  createHeaderRow(columnNumber);
  createTableBody(rowNumber,columnNumber);

  refs.columnInput.value = '';
  refs.rowInput.value = '';
}


