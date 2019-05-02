$(function() {
  function range10(start, end) {
    let yearList = [];

    for(item = start - start%10; item<=end - end%10 + 10; item+=10){
      yearList.push(String(item));
    }

    return yearList;
  }

  function extract_data(dict) {
    let i=2;
    let minimum = 3000;
    let maximum = 0;

    let listOfPeople =[];

    while(dict['A'+i] !=undefined || dict['B'+i] !=undefined || dict['C'+i]!=undefined){
      
      let pObj = {}

      pObj['Nume'] = dict['A'+i]['v'];
      pObj['Nastere'] = dict['B'+i]['v'];
      pObj['Deces'] = dict['C'+i]['v'];
      listOfPeople.push(pObj);

      if(dict['B'+i]['v']>maximum)
        maximum = dict['B'+i]['v'];
      if(dict['B'+i]['v']<minimum)
        minimum = dict['B'+i]['v'];
      if(dict['C'+i]['v']>maximum)
        maximum = dict['C'+i]['v'];
      if(dict['C'+i]['v']<minimum)
        minimum = dict['C'+i]['v'];

      i++;
    }

    listOfPeople.sort(function(a, b) {
      return a.Nastere - b.Nastere;
    });

    console.log(listOfPeople);

    let years = range10(minimum, maximum);
    yearAxis(years);
    $( document ).ready(bars(listOfPeople, years)); 
  }

  function yearAxis(yearList){
    let container = $('.axis');

    if(yearList.length<=40) {
      for(let i=0; i < yearList.length; i++) {
        let paragraph = $('<p/>').text(yearList[i]);
        let line = $('<hr/>').addClass('vertical-line');
        let div = $('<div id="axis_element"></div>');
        paragraph.appendTo(div);
        line.appendTo(div);
        
        div.appendTo(container);
      }
    }
    else {
      $('.axis').css("justify-content", "");
      for(let i=0; i < yearList.length; i++) {
        let paragraph = $('<p/>').text(yearList[i]);
        let line = $('<hr/>').addClass('vertical-line');
        let div = $('<div id="axis_element" style="padding-left: 5px; padding-right: 5px"></div>'); //0.5%
        paragraph.appendTo(div);
        line.appendTo(div);
        
        div.appendTo(container);
      }
    }

    $('#bar_id').css('margin-top', $('p').height());
    
  }

  function bars(listOfPeople, yearList) {
    let container = $('#bar_id');
    let unit = $('#axis_element').outerWidth() + 4.9188; //width of year-bar element
    //unit = 39.37;
    let width = unit * yearList.length; //width of container
    let margin = unit/2; //add to everything
    
    for(let i=0; i<listOfPeople.length; i++) {
      let span = (listOfPeople[i]['Deces'] - listOfPeople[i]['Nastere']) / 10 * unit //life span in pixels (65 years = 6.5 units => 6.5* unit= pixels)
      let percentage = span / width * 100; //width of bar in percentage
      let yearPos = yearList.indexOf(String(listOfPeople[i]['Nastere']- listOfPeople[i]['Nastere']%10));
  
      //recalculate margin-left = margin + (indexof year00 in list + what's left)*unit
      let mgLeft = margin +  (yearPos + (listOfPeople[i]['Nastere']%10)/10) * unit;
      let mgLeftPc = mgLeft * (100/width);

      let person = $('<p></p>').addClass('person')
      .css('margin-left', String(mgLeft)+'px')
      .text(listOfPeople[i]['Nume']+' ('+listOfPeople[i]['Nastere']+'-'+listOfPeople[i]['Deces']+')')
      .appendTo(container);
      let arrow = $('<div/>').addClass('arrow').appendTo(person);
      let drop = $('<div/>').addClass('drop').appendTo(arrow);
      $('<div/>').addClass('pic').prepend($('<img>',{class:'theImage',src: listOfPeople[i]['Nume'].split(' ')[1]+'.jpg'})).appendTo(drop);
      $('<div/>').addClass('line one').text(listOfPeople[i]['Nume']).appendTo(drop);
      $('<div/>').addClass('line two').text('filozof').appendTo(drop);
      //$('<div/>').addClass('line three').appendTo(drop);
      //$('<div/>').addClass('line four').appendTo(drop);
      
      
      let bar = $('<hr></hr>').addClass('bars');
      bar.css('width', String(span) + 'px');
      bar.css('margin-left', String(mgLeft)+'px');
      bar.appendTo(container);
    }

    if ($('#bar_id').height() > $('.axis').height()) {
      $('.vertical-line').css('height', $('#bar_id').height()+ 10 + 'px');
    }

  }

  $.getScript('JS/xlsx.full.min.js', function() {
    console.log('Load performed.');
  });
  
  $('#upload_button').click(function() {

    $('#file_browser').click();
    
    $('#file_browser').change(function() {
      let file = document.getElementById('file_browser').files[0];
      if (file) {
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function(file) {
            let data = new Uint8Array(reader.result);
            let wb = XLSX.read(data,{type:'array'});
            extract_data(wb['Sheets']['Frâncu']);
          }
      }
    }); 
  });

  //let yearList = rangeOf(2001, 2040);

  let bar_lengths = [2, 2,4,2,4];
  let people = ['John Doe', 'Jane Doe', 'Jim Brown', 'Jane Smith', 'Max Brown'];
  //yearAxis(yearList);
  //bars(bar_lengths, people, yearList.length);
});
