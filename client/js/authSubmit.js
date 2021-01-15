'use strict'

const registerForm = document.querySelector("#registerForm")
const loginForm = document.querySelector("#loginForm")

registerForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    console.log(document.querySelector('input[name="email"]').value)
})
// loginForm.addEventListener("submit", evt => {
//     evt.preventDefault();
//     console.log(document.querySelector('input[name="email"]').value)
// })
