var chirps = [];
var Chirp = function (chirpTweet) {
    this.chirpTweet = chirpTweet;
    this.timeStamp = Math.floor(new Date().getTime() / 1000); //timestamp in seconds
};

var newChirp = function () {
    var chirpTweet = $('#chirpTweet').val();
    var chirpObj = new Chirp(chirpTweet);
    $('#myModal').modal('hide');
    PostAJAX(chirpObj); //un-comment later when PostAJAX [eventually call MasterAJAX
};

var displayChirps = function () {
    $('#chirpDiv').html('');
    var chirpString = '';
    //chirps = sortChirps(chirps); //*not working
    chirps = chirps.sort(function (x, y) {
        return y.timeStamp - x.timeStamp;
    });

    for (var i = 0; i < chirps.length; i++) {
        chirpString += '<div class = "well"><h4>' + chirps[i].chirpTweet + '</h4><br/>'
            + (Number(Math.floor(new Date().getTime() / 1000)) - Number(chirps[i].timeStamp)) + 'sec <br/>'
            + '<button class="btn btn-primary" onclick="editChirp(' + i + ')">Edit</button>'
            + '<button class="btn btn-danger" onclick="deleteChirp(' + i + ')">Delete</button></div>'
    }
    $('#chirpDiv').html(chirpString);
};
//Sort the chirps 
var sortChirps = function (data) {
    data.sort()(function (x, y) {
        return y.timeStamp - x.timeStamp;
    });
}


var PostAJAX = function (data) {
    var request = new XMLHttpRequest();
    //request.open('POST', 'https://chirptweet.firebaseio.com/.json', true);
    request.open('POST', 'https://ccampchirper.firebaseio.com/.json', true);
    request.onload = function () {
        if (this.status < 400 && this.status >= 200) {
            var response = JSON.parse(this.response);
            data.key = response.chirpTweet;
            chirps.push(data);
            displayChirps();
        } else {
            console.error(this.response);
        }
    };
    request.send(JSON.stringify(data));
};

var editChirp = function (i) {
    $('#chirpTweet').val(chirps[i].chirpTweet);
    $('#ModalSaveButton').html('<button class="btn btn-default" onclick="saveEdit(' + i + ')">Save</button>');
    $('#myModalEdit').modal('toggle');
}
//Save changes
var saveEdit = function (i) {
    var chirpObj = chirps[i];
    chirpObj.chirpTweet = $('#EditChirp').val();
    $('#myModalEdit').modal('hide');
    putAJAX(chirpObj);
}
//Update changes
var putAJAX = function (data) {
    var request = new XMLHttpRequest();
    request.open('PUT', 'https://ccampchirper.firebaseio.com/' + data.key + '.json', true);
    request.onload = function () {
        if (this.status < 400 && this.status >= 200) {
            for (var i = 0; i < chirps.length; i++) {
                if (chirps[i].key === data.key) {
                    chirps[i].chirpTweet = data.chirpTweet;
                    break;
                }
            }
            displayChirps();
        }
        else {
            console.error(this.response);
        }
    }
    request.send(JSON.stringify(data));
}

var deleteChirp = function (i) {
    var request = new XMLHttpRequest();
    request.open('DELETE', 'https://ccampchirper.firebaseio.com/' + chirps[i].key + '/.json', true);
    request.onload = function () {
        if (this.status < 400 && this.status >= 200) {
            console.log(this.response);
            chirps.splice(i, 1);
            displayChirps();
        }
        else {
            console.error(this.response);
        }
    }
    request.send(JSON.stringify(chirps[i]));
}

var getChirps = function () {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://ccampchirper.firebaseio.com/.json', true);
    request.onload = function () {
        if (this.status < 400 && this.status >= 200) {
            var response = JSON.parse(this.response);
            chirps = [];
            for (var prop in response) {
                response[prop].key = prop;
                chirps.push(response[prop]);
            }
            //polling goes here
        }
        else {
            console.log(this.response);
        }
        displayChirps();
    }
    request.send();
}
//display user's Chirps on load
getChirps();