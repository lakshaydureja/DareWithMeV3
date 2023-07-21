
const pointer = document.querySelector("#bottle");
const spinbtn = document.querySelector("#spinbtn");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
var angle = 0;
var turn;


var videoTrack;
var audioTrack;


// Access the element with id "codenum"
const codenumElement = document.getElementById('codenum');

// Get the roomNumber value from the HTML element
const GlobalRoomCode = codenumElement.textContent;

// Manipulate the roomNumber value as needed
console.log(GlobalRoomCode);


const urlParams = new URLSearchParams(window.location.search);
var creatorstatus = urlParams.get('creator');
if (creatorstatus == "yes") {
} else {
    creatorstatus = "no";
}

console.log(creatorstatus);
// ***PEERJS CODE***

if (creatorstatus == "yes") {
    let localStream;
    turn = 0;
    // Create a PeerJS connection.
    const peer = new Peer(GlobalRoomCode);




    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {

            localStream = stream;
            localVideo.srcObject = localStream;
            videoTrack = localVideo.srcObject.getVideoTracks()[0];
            audioTrack = localVideo.srcObject.getAudioTracks()[0];

        });

    peer.on("open", function () {
        console.log("Room created with user ID:", GlobalRoomCode);

        peer.on("connection", function (conn) {


            conn.on("open", function () {
                console.log("Connection established with", conn.peer);

                peer.on("call", function (call) {
                    // Answer the incoming call
                    call.answer(localStream);

                    // Display remote video stream
                    const remoteVideo = document.getElementById("remoteVideo");
                    call.on("stream", function (remoteStream) {
                        remoteVideo.srcObject = remoteStream;
                    });
                });





                // Send a message
                const sendMessage = function (message) {
                    conn.send({ type: "message", message: message });
                };

                // Send angle and turn data
                const sendAngleTurnData = function (angle, turn) {
                    conn.send({ type: "angleTurnData", angle: angle, turn: turn });
                };

                // Handle data received from the other peer
                conn.on("data", function (data) {
                    // Handle received data
                    if (data.type === "message") {
                        // Handle message
                        const receivedMessage = data.message;
                        recieveMsg(receivedMessage);
                        console.log("Received message:", receivedMessage);

                        // Send response back to the other peer
                        // conn.send({ type: "response", message: "Response from the receiver" });
                    } else if (data.type === "angleTurnData") {
                        // Handle angle and turn data
                        const receivedAngle = data.angle;
                        const receivedTurn = data.turn;
                        console.log("Received angle:", receivedAngle);
                        console.log("Received turn:", receivedTurn);

                        spin(receivedAngle);
                        turn = receivedTurn;
                        remoteVideo.classList.remove("turn");
                        localVideo.classList.add("turn");

                        // Send response back to the other peer
                        // conn.send({ type: "response", message: "Response from the receiver" });
                    }
                });


//message part
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('msg');
const sendButton = document.getElementById('send-button');



//add and send message 
function addMessage() {
    const messageText = messageInput.value;

    if (messageText.trim() === '') {
        return; // Ignore empty messages
    }

    const messageElement = document.createElement('li');
    messageElement.textContent = messageText;

    messageElement.classList.add('sender');
   
   sendMessage(messageText);
    

    messageList.appendChild(messageElement);

    messageInput.value = '';
    scrollToBottom(); // Scroll to bottom after appending the message

}
//recive msg and add it

function recieveMsg(msgx){
    const messageElement = document.createElement('li');
    messageElement.textContent = msgx;
    messageElement.classList.add('receiver');
    messageList.appendChild(messageElement);
    scrollToBottom();
}


function scrollToBottom() {
    var messageScreen = document.querySelector('.message-screen');
    messageScreen.scrollTop = messageScreen.scrollHeight;
}



sendButton.addEventListener('click', () => {
    addMessage();

});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {

        addMessage();
    }
});




                // angle turn part
                spinbtn.addEventListener("click", function () {


                    if (turn == 0) {
                        angle   = 10*360+generateRandomAngle();
                        console.log("angle2",angle);
                        sendAngleTurnData(angle, 1);
                        spin(angle);
                        turn = 1;
                        localVideo.classList.remove("turn");
                        remoteVideo.classList.add("turn");

                    } else if (turn == 1) {
                        showModalPopup("Wait!!!👀 It's not your Turn");

                        console.log("its not your turn");
                    } else {
                        console.log("Some Error");
                    }


                });
            });


        });


    });


} else if (creatorstatus == "no") {
    turn = 0;
    spinbtn.classList.add("after");

    const peer = new Peer();

    peer.on("open", function () {
        const conn = peer.connect(GlobalRoomCode);


        conn.on("open", function () {
            console.log("Connected to room", GlobalRoomCode);

            // Initiate video call
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(function (stream) {
                    localVideo.srcObject = stream;
                    videoTrack = localVideo.srcObject.getVideoTracks()[0];
                    audioTrack = localVideo.srcObject.getAudioTracks()[0];

                    const call = peer.call(GlobalRoomCode, stream);

                    // Answer the incoming call
                    call.answer(stream);

                    // Display remote video stream
                    const remoteVideo = document.getElementById("remoteVideo");
                    call.on("stream", function (remoteStream) {
                        remoteVideo.srcObject = remoteStream;
                    });
                })
                .catch(function (error) {
                    console.error("Error accessing media devices:", error);
                });





            // Send a message
            const sendMessage = function (message) {
                conn.send({ type: "message", message: message });
            };

            // Send angle and turn data
            const sendAngleTurnData = function (angle, turn) {
                conn.send({ type: "angleTurnData", angle: angle, turn: turn });
            };

            // Handle data received from the other peer
            conn.on("data", function (data) {
                // Handle received data
                if (data.type === "message") {
                    // Handle message
                    const receivedMessage = data.message;
                    recieveMsg(receivedMessage);

                    console.log("Received message:", receivedMessage);

                    // // Send response back to the other peer
                    // conn.send({ type: "response", message: "Response from the receiver" });
                } else if (data.type === "angleTurnData") {
                    // Handle angle and turn data
                    const receivedAngle = data.angle;
                    const receivedTurn = data.turn;
                    console.log("Received angle:", receivedAngle);
                    console.log("Received turn:", receivedTurn);

                    spin(receivedAngle);
                    turn = receivedTurn;
                    localVideo.classList.remove("turn");
                    remoteVideo.classList.add("turn");


                    // Send response back to the other peer
                    // conn.send({ type: "response", message: "Response from the receiver" });
                }
            });






//message part
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('msg');
const sendButton = document.getElementById('send-button');



//add and send message 
function addMessage() {
    const messageText = messageInput.value;

    if (messageText.trim() === '') {
        return; // Ignore empty messages
    }

    const messageElement = document.createElement('li');
    messageElement.textContent = messageText;

    messageElement.classList.add('sender');
   
   sendMessage(messageText);
    

    messageList.appendChild(messageElement);

    messageInput.value = '';
    scrollToBottom(); // Scroll to bottom after appending the message

}
//recive msg and add it

function recieveMsg(msgx){
    const messageElement = document.createElement('li');
    messageElement.textContent = msgx;
    messageElement.classList.add('receiver');
    messageList.appendChild(messageElement);
    scrollToBottom();
}


function scrollToBottom() {
    var messageScreen = document.querySelector('.message-screen');
    messageScreen.scrollTop = messageScreen.scrollHeight;
}



sendButton.addEventListener('click', () => {
    addMessage();

});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {

        addMessage();
    }
});









            // Example usage
            spinbtn.addEventListener("click", function () {

                if (turn == 0) {


                    showModalPopup("Wait!!!👀 It's not your Turn");

                    console.log("its not your turn");



                } else if (turn == 1) {
                    
                    angle   = 12*360+generateRandomAngle();
                    console.log("angle1",angle);
                    sendAngleTurnData(angle, 0);
                    spin(angle);
                    turn = 0;
                    remoteVideo.classList.remove("turn");
                    localVideo.classList.add("turn");



                } else {
                    console.log("Some Error");
                }


            });


        });



    });


} else {
    //some error occured
}



//*left part
//?chat section

// // for sender
// const messageList = document.getElementById('message-list');
// const messageInput = document.getElementById('msg');
// const sendButton = document.getElementById('send-button');

// function addMessage(x) {
//     const messageText = messageInput.value;

//     if (messageText.trim() === '') {
//         return; // Ignore empty messages
//     }

//     const messageElement = document.createElement('li');
//     messageElement.textContent = messageText;

//     // Determine the sender or receiver and apply the appropriate class
//     if (x === '1') {
//         messageElement.classList.add('sender');
//     } else if (x === '2') {
//         messageElement.classList.add('receiver');
//     }
//     // You can use some condition here to differentiate the sender and receiver

//     messageList.appendChild(messageElement);

//     // Clear the input box after sending the message
//     messageInput.value = '';
//     scrollToBottom(); // Scroll to bottom after appending the message

// }

// sendButton.addEventListener('click', () => {
//     addMessage('1');
// });

// messageInput.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         addMessage('1');
//     }
// });

// function scrollToBottom() {
//     var messageScreen = document.querySelector('.message-screen');
//     messageScreen.scrollTop = messageScreen.scrollHeight;
// }







function spin(x) {
    pointer.style.transform = `rotate(${x}deg)`;
    



}


function toggleCamera() {
    var cameraIcon = document.getElementById("cam-on");
    videoTrack.enabled = !videoTrack.enabled;

    // Check the current image source
    if (cameraIcon.src.includes("/assests/cam-on.svg")) {
        // If the current source is camera-on.png, change it to camera-off.png
        cameraIcon.src = "/assests/cam-off.svg";
        cameraIcon.alt = "Camera Off";
    } else {
        // If the current source is camera-off.png, change it to camera-on.png
        cameraIcon.src = "/assests/cam-on.svg";
        cameraIcon.alt = "Camera On";
    }
}

function toggleMic() {
    var cameraIcon = document.getElementById("mic-on");
    audioTrack.enabled = !audioTrack.enabled;

    // Check the current image source
    if (cameraIcon.src.includes("/assests/mic-on.svg")) {
        // If the current source is camera-on.png, change it to camera-off.png
        cameraIcon.src = "/assests/mic-off.svg";
        cameraIcon.alt = "Microphone Off";
    } else {
        // If the current source is camera-off.png, change it to camera-on.png
        cameraIcon.src = "/assests/mic-on.svg";
        cameraIcon.alt = "Microphone On";
    }
}

// modal
var modal = document.getElementById('myModal');
var closeBtn = document.getElementsByClassName('close')[0];
var modalText = document.getElementById('modalText');

function showModalPopup(content) {
    modalText.textContent = content;
    modal.style.display = 'block';

    setTimeout(function () {
        closeModalPopup();
    }, 2000);
}

function closeModalPopup() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModalPopup);


function generateRandomAngle() {
    const initialAngle = 90; // Initial angle of the bottle cap

    const angleRange1 = Math.floor(Math.random() * 31) + 330; // Random angle between 330 and 360
    const angleRange2 = Math.floor(Math.random() * 61) + 150; // Random angle between 150 and 210
  
    const randomAngle = Math.random() < 0.5 ? angleRange1 : angleRange2;
  
    const finalAngle = Math.floor((randomAngle - initialAngle) / 360) * 360 + randomAngle;
  
    
    return finalAngle;
  }