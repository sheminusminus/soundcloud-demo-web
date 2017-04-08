$(function() {


 var input;
 var auth = firebase.auth();
 var storageRef = firebase.storage().ref();
 var dbRef = firebase.database().ref();
 var uid = '';
 var newImageKey = null;
 var imageDone = false;
 var songDone = false;
var audioURL = '';

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
	        uid = user.uid;
            //var displayName = user.displayName;
            //var email = user.email;
            //var emailVerified = user.emailVerified;
            //var photoURL = user.photoURL;
            //var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            //var providerData = user.providerData;
            console.log("User Signed In")
            console.log(window.location.pathname)
            console.log(window.location.href)
            if (window.location.href == '/')
            { window.location.assign('/upload.html'); }
/*
            dbRef.child('users').child(uid).child('images').on('value', function(snapshot) {
	           document.getElementById('list-uploads').innerHTML = '';
	           var userKeys = Object.keys(snapshot.val());
	           userKeys.forEach(function(key, idx) {
		          var link = document.createElement('A');
		          link.href = snapshot.val()[key]['url'];
		          link.textContent = 'Image #' + idx;
		          var p = document.createElement('P');
		          p.textContent = snapshot.val()[key]['description'];
		          document.getElementById('list-uploads').appendChild(link); 
		          document.getElementById('list-uploads').appendChild(p); 
	           });
	       
            });
*/
            
        } else {
            console.log("User Signed Out")
        }
    });

 function login(){
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
      }

      console.log(document.getElementById('email').value);
      console.log(document.getElementById('password').value);

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('login-firebase').disabled = false;
        });
   }



window.onload = function() {
     document.getElementById('progress').innerHTML = "";
}



$("#login-firebase").click(function(){
   login();
});



$(document).on('change', '.btn-file :file', function() {
  input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
});



$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
        
    });
});



function uploadFile(evt) {
	
     var file = document.getElementById('song-file').files[0];
      
      var metadata = {
        'contentType': file.type
      };
      console.log(file.type)
      console.log(file.type == 'audio/mp3')
      console.log(file.type == 'audio/mpeg')
        if(file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/x-m4a') {
                var uploadTask = storageRef.child('song/' + file.name).put(file, metadata);
                uploadTask.on('state_changed', function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                document.getElementById('progress').innerHTML = 'Upload is ' + Math.floor(progress) + '% done';
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
                }, function(error) {
                }, function() {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    audioURL = uploadTask.snapshot.downloadURL;
                    songDone = true;
/*
                    dbRef.child('users').child(uid).child('songs').child(newImageKey).set({
	                    url: downloadURL
	                });
*/
                    document.getElementById('linkbox').innerHTML = '<a href="' +  downloadURL + '">Click For File</a>';
                    document.getElementById('progress').innerHTML = "";
                    if (imageDone) { newImageKey = null; }
                });
        }else{
            document.getElementById('progress').innerHTML = 'Only mp3 files are allowed';
            return
        }


}

function uploadImage(evt) {

	  var songKey = dbRef.child('songs').push().key;

      var BASE_URL = 'users/' + uid + '/images/';
      var STORAGE_URL = 'images/';
	  var SONG_URL = 'songs/' + songKey;
	  
	  //=======
	  console.log(newImageKey);
	  //=======
	  	   
      console.log("Upload Calling")
      console.log(label);
	  var file = document.getElementById('image-file').files[0];
      
      var metadata = {
        'contentType': file.type
      };
      
      var songTitle = document.getElementById('song-title').value;
      var fileExtension = file.type.split('/')[1];
      BASE_URL += newImageKey;
      //SONG_URL += newImageKey;
      
      STORAGE_URL += songKey + '.' + fileExtension;
      
      //=======
	  console.log(BASE_URL, SONG_URL);
	  //=======
      
      //=========
      console.log(file.type)
      console.log(file.type == 'image/*')
      console.log(file.type == 'image/png')
      //=========      
      
      if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif') {
                var uploadTask = storageRef.child(STORAGE_URL).put(file, metadata);
                uploadTask.on('state_changed', function(snapshot){
	                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	                console.log('Upload is ' + progress + '% done');
	                document.getElementById('progress').innerHTML = 'Upload is ' + Math.floor(progress) + '% done';
	                switch (snapshot.state) {
	                    case firebase.storage.TaskState.PAUSED: // or 'paused'
	                    console.log('Upload is paused');
	                    break;
	                    case firebase.storage.TaskState.RUNNING: // or 'running'
	                    console.log('Upload is running');
	                    break;
	                }
	            }, function(error) {
		            console.log(error.message);
	            }, function() {
	                    var downloadURL = uploadTask.snapshot.downloadURL;
	                    var description = document.getElementById('descrip').value;
	                    var len = document.getElementById('time-input').value;
	                    var tag = document.getElementById('tag-input').value;
						imageDone = true;
/*
	                    dbRef.child(BASE_URL).set({
		                    url: downloadURL,
		                    description: description
	                    });;
*/
	                    dbRef.child(SONG_URL).set({
		                    title: songTitle,
		                    description: description,
		                    length: len,
		                    cover: downloadURL,
		                    searchItems: {
			                    0: tag
		                    },
		                    audioFile: audioURL != '' ? audioURL : 'https://firebasestorage.googleapis.com/v0/b/soundcloudapp-d5f93.appspot.com/o/Gimme%20Shelter%201969%20-%20The%20Rolling%20Stone.mp3?alt=media&token=03a3a76b-cac3-456a-b6d5-2e1b3d64d1ee',
		                    createdAt: (new Date().toLocaleDateString())
	                    });
	                    document.getElementById('image-linkbox').innerHTML = '<a href="' +  downloadURL + '">Click For File</a>';
	                    document.getElementById('image-progress').innerHTML = "";
	                    if (songDone) { newImageKey = null; }
                });
        }else{
            document.getElementById('progress').innerHTML = 'Only mp3 files are allowed';
            return
        }


}

function makeNewKey() {
	return dbRef.child('users').child('images').push().key;
}

$("#song-file").change(function(){
	if (!newImageKey) { newImageKey = makeNewKey(); }
	uploadFile();
	
});

$("#submit-image").click(function(){
	if (!newImageKey) { newImageKey = makeNewKey(); }
	uploadImage();
});


});

