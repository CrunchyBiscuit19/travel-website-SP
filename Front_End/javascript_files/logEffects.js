var loggedIn = true;
if (loggedInUserId === null) {
    loggedIn = !loggedIn;
}

if (loggedIn) {
    $(".hide-logged-in").hide();
    axios.get(`${baseUrl}/users/${loggedInUserId}/`)
        .then((response) => {
            $("#account-button").text(response.data.username.toUpperCase());
        })    
        .catch((err) => {
            console.log(err);
        });
} else {
    $(".hide-logged-out").hide();
}