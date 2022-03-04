$(document).on("click", "#logout-button", () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("token");
    window.location.href = "/";
});