function Log()
{
    window.location.href = "../Login/login.html";

}
function pwzeigen() {
    let pw = document.getElementById("password");


    if (pw.type === "text") {
        pw.type = "password";
        
    } else {
        pw.type = "text";
    }
}

function Log() {
    window.location.href = "../Login/login.html";
}