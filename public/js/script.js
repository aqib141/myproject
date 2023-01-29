try {
    document.getElementById("sign-up-button").addEventListener("click", function(){
        window.location.href = "signup";
    });
} catch (error) {
    console.log("Error: Button not found. Make sure the button ID is correct.");
}
try {
    document.getElementById("sign-in-button").addEventListener("click", function(){
        window.location.href = "login";
    });
} catch (error) {
    console.log("Error: Button not found. Make sure the button ID is correct.");
}
try {
    document.getElementById("log-out-button").addEventListener("click", async function(){
        console.log('logging out')
        var cookies = document.cookie.split(";");
        console.log(cookies)
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            console.log(name)
            document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            console.log(document.cookie)
        }
        console.log('logging out')
        window.location.href = "/";
    });
} catch (error) {
    console.log("Error: Button not found. Make sure the button ID is correct.");
}
try {
    document.getElementById("create-list-button").addEventListener("click", function(){
        window.location.href = "create-list";
    });
} catch (error) {
    console.log("Error: Button not found. Make sure the button ID is correct.");
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
}
try{
    var firstname = getCookie("firstname");
    document.getElementById("firstname").innerHTML = firstname;
    var email = getCookie("email");
    document.getElementById("email").innerHTML = email;
    var username = getCookie("username");
    document.getElementById("username").innerHTML = username;
    var lastname = getCookie("lastname");
    document.getElementById("lastname").innerHTML = lastname;
    var phone = getCookie("phone");
    document.getElementById("phone").innerHTML = phone;
} catch (error) {
    console.log("Cookie could not be retrieved!");
}

try{
    // document.getElementById("listname").addEventListener("click", function() {
        document.getElementById("email").value = getCookie("email");
        document.getElementById("username").value = getCookie("username");
    // });
} catch (error) {
    console.log("No list create form to fill");
}

try{
  document.getElementById('send-mail-button').addEventListener('click', (event) => {
    window.location.href = window.location.href + `/send-mail`;
  });
}catch{
    console.log("No button called send-mail")
}



