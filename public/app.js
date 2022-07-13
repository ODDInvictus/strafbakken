let token = localStorage.getItem('token') || '';

$(document).ready( _ => {
   if (token === '') { 
      $('#login').click( _ => {
         token = $('#pass')[0].value;
         localStorage.setItem('token', token);
         getData();
      });
   } else {
      getData();
   }
});

function getData() {
   fetch('/bakken/', {
      method: 'GET',
      headers: {
         token: token,
         'content-type': 'application/json'
      }
   })
   .then( res => {
      if (res.status === 200) {
         res.json().then(data => {
            viewBakken(data);
         });
      } else {
         localStorage.removeItem('token');
         location.reload();
      }
   })
   .catch( error => {throw error});
}

function viewBakken(data) {
   $('main')[0].innerHTML = '';
   data.forEach( person => {
      let div = $('<div>', {class: 'row'});

      let buttons = $('<div>', {class: 'buttons'});
      let plus = $('<p>', {
         onclick: `addBak('${person.name}')`
      }).text('+');
      let min = $('<p>', {
         class: 'min',
         onclick: `removeBak('${person.name}')`
      }).text('-');

      let name = $('<p>').text(person.name);
      let bakken = $('<p>').text(person.bakken);

      buttons.append(plus);
      buttons.append(min);

      div.append(buttons);
      div.append(name);
      div.append(bakken);

      $('main').append(div);
   })
}

function addBak(name) {
   fetch('/bakken/', {
      method: 'POST',
      headers: {
         token: token,
         'Content-Type': 'application/json',
         name: name
      }
   })
   .catch( error => {throw error});
   location.reload();
}

function removeBak(name) {
   fetch('/bakken/', {
      method: 'DELETE',
      headers: {
         token: token,
         'Content-Type': 'application/json',
         name: name
      }
   })
   .catch( error => {throw error});
   location.reload();
}