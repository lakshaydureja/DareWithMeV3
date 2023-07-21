

//? Random Functions
function random1() {
  //*Code For More than 2 player functionality
    // var randombtn = document.getElementById('randombtn');
    // var friendsbtn = document.getElementById('friendsbtn');

    // randombtn.classList.add('hide-animation');
    // friendsbtn.classList.add('hide-animation');
    // randombtn.remove();
    // friendsbtn.remove();

    // var dis1 = document.getElementsByClassName('dis1');
    // for(var i=0;i<dis1.length;i++){
    //     dis1[i].style.display = 'inline-block';
    // }
  
    // var text = document.getElementById('content1');
    // text.textContent = "Select number of players";

    const roomUrl = `http://localhost:3030/random/playzone`;
    window.location.href = roomUrl;



  }


//   function NumSelect(btn){
//     var numUsers = btn.value;
//   console.log( numUsers);

//   var dis1 = document.getElementsByClassName('dis1');
//     for(var i=0;i<dis1.length;i++){
//         dis1[i].classList.add('hide-animation');
//          }
// // now go to playzone page 
// var text = document.getElementById('content1');
//     text.textContent = "Loading...";


   
//   }


//? Friends Functions

function friends1(){
    var randombtn = document.getElementById('randombtn');
    var friendsbtn = document.getElementById('friendsbtn');

    randombtn.classList.add('hide-animation');
    friendsbtn.classList.add('hide-animation');

    
        randombtn.remove();
        friendsbtn.remove();
      

    
    var dis2 = document.getElementsByClassName('dis2');
    for(var i=0;i<dis2.length;i++){
        dis2[i].style.display = 'inline-block';
    }

    
    var text = document.getElementById('content1');
    text.textContent = "Create a Room or Join one";

}

function createroom(){

    var dis2 = document.getElementsByClassName('dis2');
    for(var i=0;i<dis2.length;i++){
        dis2[i].classList.add('hide-animation');
         }

    var text = document.getElementById('content1');
    text.textContent = "Loading...";

// going to server

fetch('http://localhost:3030/createroom', {
  method: 'POST',
 
})
.then(response => response.json())
.then(data => {
  const roomUrl = data.roomUrl;
  const creator = data.creator;
  console.log(creator);
  window.location.href = `${roomUrl}?creator=${creator}`; // Redirect the user to the room URL
})
.catch(error => {
  console.error('Error creating room:', error);
});


}

function joinroom(){

    var dis2 = document.getElementsByClassName('dis2');
    for(var i=0;i<dis2.length;i++){
        dis2[i].classList.add('hide-animation');
         }
         dis2[1].remove();
         dis2[0].remove();
         var dis3 = document.getElementById('join-room2');
dis3.style.display= 'inline-block';

var inputcode = document.getElementById('inputcode');
inputcode.style.display= 'inline-block';

}

function joinroom2(){
    var roomcode = document.getElementById("inputcode");
   var roomcodevalue = roomcode.value;
   console.log(roomcodevalue);

   sendJoinRoomReq(roomcodevalue);

   var dis3 = document.getElementById('join-room2');
dis3.remove();
roomcode.remove();

   var text = document.getElementById('content1');
   text.textContent = "Loading...";

// now go to playzone with room /roomcodevalue if not found the return 404 form server
}

function sendJoinRoomReq(roomCode) {
  fetch('http://localhost:3030/checkRoomCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomCode }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        
        const roomUrl = `http://localhost:3030/${roomCode}`;
  window.location.href = roomUrl;
        console.log('Room code exists on the server');
      } else {
        const roomUrl2 = `http://localhost:3030/404`;
        window.location.href = roomUrl2;
        
        console.log('Room code does not exist on the server');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}