//AUTOMATIC SEARCH USER BUTTON CLICKKER
const socket = io();


const pointer = document.querySelector("#bottle");
const spinbtn = document.querySelector("#spinbtn");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
var angle = 0;
var turn = 0;


let videoTrack;    //this is access to  own vedio
let audioTrack;   //own audio
let GlobalRoomCode; //this is room code
let localStream;
//To initilaize our vedio.
navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (stream) {
        localStream = stream;
        localVideo.srcObject = stream;
        videoTrack = localVideo.srcObject.getVideoTracks()[0];
        audioTrack = localVideo.srcObject.getAudioTracks()[0];

    });

//? -------------peer new code-----------
    let peer;
    let peerConnection;




   // Function to set up the PeerJS connection
   function initializePeer(isUser1,roomId) {

    // If the current user is user 1, use the provided room ID as the Peer ID
    if (isUser1) {
        
        peer = new Peer(roomId,{
            // host: 'localhost',
            // port: 5001,
            // path: '/', 
            config: {
                iceServers: [
                  // Add your STUN and TURN servers here
                  { urls: "stun:stun.relay.metered.ca:80", }, // Replace with your STUN server URL
                  {
                    urls: "turn:a.relay.metered.ca:443?transport=tcp",
                    username: "578c2e59bed97dca6a6d3768",
                    credential: "1u7rgzXK2xaw8VHp",
                  },
                ],
              },
          });
    }else{
        peer = new Peer({
            // host: 'localhost',
            // port: 5001,
            // path: '/', 
            config: {
                iceServers: [
                  // Add your STUN and TURN servers here
                  { urls: "stun:stun.relay.metered.ca:80",}, // Replace with your STUN server URL
                  {
                    urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "578c2e59bed97dca6a6d3768",
        credential: "1u7rgzXK2xaw8VHp",
                  },
                ],
              },
          });

    }


    

    peer.on("open", () => {
        console.log("Your peer ID: " + peer.id);
        
        if (!isUser1) {
            // Connect to user 1 if the current user is user 2
            setTimeout(() => {
                connectToUser1(roomId);
              }, 2000);

        }


    });

    peer.on("call", (incomingCall) => {
        // Answer incoming call
        console.log("call agyi");
        // incomingCall.answer(localStream);

        // // Set up the remote video stream when the call is answered
        // incomingCall.on("stream", (stream) => {
        //     remoteVideo.srcObject = stream;
        //     remoteStream = stream;
        // });
    });

    // Error handling for the PeerJS connection
    peer.on("error", (error) => {
        console.error("PeerJS error:", error);
    });

}

   // Function to start the video call
   function startCall(isUser1,roomId) {
   
            

        
            initializePeer(isUser1,roomId);
            // if (!isUser1) {
            //     // Connect to user 1 if the current user is user 2
            //     connectToUser1(roomId);
            // }
       
}

 // Function to connect to user 1 (host)
 function connectToUser1(roomId) {
    // Connect to the remote user with the same room ID (user 1)
    var call = peer.call(roomId, localStream);

    call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });

    call.on("error", (error) => {
        console.error("Call error:", error);
    });
}


  // Function to end the video call
  function endCall() {
    if (peer) {
        peer.destroy();
    }

    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
    }

    if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}






















//?------------------------------------------

socket.on('UserFound', (data) => {
    console.log('User ID:', data.userId);
    console.log('isfirst:', data.isfirst);
    hideLoadingText();
    GlobalRoomCode = data.userId;
    startCall(data.isfirst,GlobalRoomCode);


});
//?-------------------------------------------
socket.on('empty', (stat) => {
    console.log(stat);
    //on user not present then we are already showing waiting.
    //when users comes pairing method automatically emits UserFound.
});














// Function to show the loading text
function showLoadingText() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = 'inline-block'; // Set display to 'block' to make it appear
}

// Function to hide the loading text
function hideLoadingText() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = 'none'; // Set display to 'none' to hide it
}







//!----------------------------------------------











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






//? test

