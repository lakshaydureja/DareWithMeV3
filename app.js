//const site = "http://localhost:3030";
const site = "https://darewithmetest.onrender.com";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require('body-parser');
const admin = require('firebase-admin');


app.use(bodyParser.json());
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
app.use(express.json());

app.use(express.static("public"));


var roomCodes = [];


//FireBase 
const serviceAccount = require('./configs/darewithmegame.json'); 
const { userInfo } = require("os");
const { copyFileSync } = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://darewithmegame-default-rtdb.firebaseio.com'
});
const db = admin.database();




io.on('connection', (socket) => {
  // Assign a random 5-digit number to the user and store it in the users object
  const userId = random5();
  const socketId = socket.id; //socket ID of the connected user
  WriteRandom(userId,socketId);
  console.log(`User with ID ${socketId} connected.`);
  pairUsers(userId,socketId);


  
});









app.get("/", (req, res) => {

  const userAgent = req.headers['user-agent'];
  const isPC = /Windows|Mac|Linux/.test(userAgent);

  if (isPC) {
    // Allow access to the website

    res.render("home")   
     // Continue with your regular website logic
  } else {
    // Display a limitation message
    res.send('This website is only accessible from a PC.');
    // You may also redirect the user to a different page or display a custom error page
  }


});




app.post('/createroom', (req, res) => {
    // Perform the desired action here
    // console.log('Action performed on the server');
    
    const randomNumber = random6();
   // Store the room code in the array
   roomCodes.push(randomNumber);
    // Create the room URL using the random number
    const roomUrl = `${site}/${randomNumber}`;
    const creator = "yes";
  console.log(roomUrl);
    // Redirect the user to the room URL

    res.json({ roomUrl,creator});



    
  });
  
  app.get('/404', (req, res) => {
   
    res.send("error 404, room not found");
    
  });


  app.get('/:roomNumber', (req, res) => {
    const roomNumber =parseInt(req.params.roomNumber);
    console.log(typeof roomNumber);
    console.log(typeof roomCodes);

    if (roomCodes.includes(roomNumber)) {
        // Room exists, render the playzone view
        res.render("playzone" ,{ roomNumber });
      } else {
        // Room does not exist, send a 404 error message
        res.status(404).send("Error 404: Room not found");
      }
   
    
  });


  app.post('/checkRoomCode', (req, res) => {
    const roomCode = parseInt(req.body.roomCode);
    // Check if the room code exists in the array
    const exists = roomCodes.includes(roomCode);
  
    // Send the result as the response
    res.json({ exists });
});

app.get('/random/playzone', (req, res) => {
 
  res.render("playzone2");
  // var UniqId = random5();
  // WriteRandom(UniqId);
  // pairUsers();
  //check 

});


server.listen(process.env.PORT || 3030);

//pairUsers();   PAIRING IS WORKING
//?------------LOGIC TEST PART ---------------------
//Logic for matching 
 // Function to pair two users and remove their IDs from the database
 function pairUsers(userId,mySktId) {
 const ref = db.ref('Random');

 ref.once('value')
 .then((snapshot) => {
   const numberIds = snapshot.val();
   const numberIdsKeys = Object.keys(numberIds);   //output is like an array

    
         
         

   if (numberIdsKeys.length === 1) {
     // If no other users are present, console log "no one is here"
     console.log("No one is here");

     io.to(mySktId).emit('empty',"no one is here");
   } else {
   
    if (numberIdsKeys[1] != userId){
          console.log(`User ${userId} is paired with ${numberIdsKeys[1]}`);
        //both get paired and removed from the db
        //now i have to send both of them a id number that they are connected over 
        //here a number lets say temp
        const firstChildKey = Object.keys(snapshot.val())[1];
        const data2 = snapshot.child(firstChildKey).val()
        const Id = data2.Id;
        console.log(Id);  // this id(socket id) is of the user which was already and database and paired
        
        

        io.to(mySktId).emit('UserFound',{userId:userId,isfirst:false});
        io.to(Id).emit('UserFound',{userId:userId,isfirst:true});
    


       // Remove both users from the database
       ref.child(userId).remove();
       ref.child(numberIdsKeys[1]).remove();
    }else if (numberIdsKeys[0] != userId){
      console.log(`User ${userId} is paired with ${numberIdsKeys[0]}`);
    //both get paired and removed from the db
    //now i have to send both of them a id number that they are connected over 
    //here a number lets say temp
    const firstChildKey = Object.keys(snapshot.val())[0];
    const data2 = snapshot.child(firstChildKey).val()
    const Id = data2.Id;
    console.log(Id);  // this id(socket id) is of the user which was already and database and paired
    

    io.to(mySktId).emit('UserFound',{userId:userId,isfirst:false});
    io.to(Id).emit('UserFound',{userId:userId,isfirst:true});



   // Remove both users from the database
   ref.child(userId).remove();
   ref.child(numberIdsKeys[0]).remove();
}else{
  console.log("same same error")}

   }
 })
 .catch((error) => {
   console.error('Error reading data:', error);
 });
}



//?---------------------------------------------


//functions are 
// WriteRandom DelRandom ReadRandom ConnectRandom  GenRandom CheckIdRandom
//WriteFriend DelFriend
//WriteRandom("35");


//* How to loop around each child name and child data in our database
// const ref = db.ref('Random');

// ref.once('value')
//   .then((snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       // Get the child name and its data
//       const childName = childSnapshot.key;
//       const childData = childSnapshot.val();

//       console.log('Child Name:', childName);
//       console.log('Child Data:', childData);
//     });
//   })
//   .catch((error) => {
//     console.error('Error reading data:', error);
//   });
//*
//Check function is Ready (it returns boolean value)
//checkRandomId("35");
async function CheckIdRandom(CheckId) {
  let checkBool = false;
  const ref = db.ref('Random');

  try {
    const snapshot = await ref.once('value');
    snapshot.forEach((childSnapshot) => {
      const childName = childSnapshot.key;
      console.log('Child Name:', childName);

      if (childName === CheckId) {
        checkBool = true;
      }
    });
  } catch (error) {
    console.error('Error reading data:', error);
  }

  return checkBool;
}

async function checkRandomId(x) {
  const res = await CheckIdRandom(x);
  // console.log(res);
}


//Write function ready
//WriteRandom("44");
function WriteRandom(UserId,sktId){
  const ref = db.ref('Random');




//? Write data to the database
const newData = { Id: sktId };
// Your own custom unique ID
ref.child(UserId).set(newData)
  .then(() => {
    console.log('Data written to the database successfully.');
  })
  .catch((error) => {
    console.error('Error writing data:', error);
  });
 



}


//Read Function is Ready  ()
//ReadRandom();
function ReadRandom(){
  const ref = db.ref('Random');

//? Read data from the database
ref .orderByKey()
.limitToFirst(1)
.once('value')
  .then((snapshot) => {
    if (snapshot.exists()) {

    const data = snapshot.val();
    console.log('First item of the database:', data);
     
    // Get the first child data from the snapshot
    const firstChildKey = Object.keys(snapshot.val())[0];
    const data2 = snapshot.child(firstChildKey).val()
    
    const Id = data2.Id;
    console.log(Id);
    //id is used connect.
    
    }else {
      console.log('No data found in the database.');
      //show no one is there or WAIT For USers.
    }

  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });





}


//DeleteFirebase function ready
//DelRandom("xxx3");
function DelRandom(delId){


  const ref = db.ref('Random');
  let foundAndDeleted = false; // Flag to track whether the child was found and deleted
  
  ref.once('value')
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (!foundAndDeleted) {
          // Get the child name and its data
          const childName = childSnapshot.key;
          console.log('Child Name:', childName);
  
          if (childName === delId) {
            // Delete the child node and its data
            childSnapshot.ref.remove()
              .then(() => {
                console.log(`Child with ID ${delId} deleted successfully.`);
                foundAndDeleted = true; // Set the flag to true to exit the loop
              })
              .catch((error) => {
                console.error('Error deleting child:', error);
              });
          }
        }
      });
    })
    .catch((error) => {
      console.error('Error reading data:', error);
    });

}



//RandomNumberGENERATORS
//for friend room
function random6(){
   return Math.floor(100000 + Math.random() * 900000);
  }
//for random
  function random5() {
    return Math.floor(10000 + Math.random() * 90000);
  }