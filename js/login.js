const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

const showError = (input, message) => {
    const formControl = input.parentElement;
    formControl.className = "form-control error";

    const small = formControl.querySelector("small");
    small.innerText = message;
    
};

const showSuccess = (input) => {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
};

const checkRequired = (input) => {
    let isRequired = false;
    if (input.value === "") {
        showError(input, `Bitte eine ${getFieldName(input)} eingeben`);
        isRequired = true;
    } else {
        showSuccess(input);
    }
    return isRequired;
};

const checkLength = (input, min, max) => {
    if (!checkRequired(input)) {
        if (input.value.length < min) {
            showError(
                input,
                `${getFieldName(input)} muss mindestens ${min} Buchstaben haben`
            );
        } else if (input.value.length > max) {
            showError(
                input,
                `${getFieldName(input)} darf nicht mehr als ${max} Buchstaben haben`
            );
        } else {
            showSuccess(input);
        }
    }
};

const checkEmail = (input) => {
    if (!checkRequired(input)) {
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (re.test(input.value.trim())) {
            showSuccess(input);
        } else {
            showError(input, `${getFieldName(input)} ist nicht richtig`);
        }
    }
};

const checkPasswordsMatch = (input1, input2) => {
    if (!checkRequired(input2)) {
        if (input1.value !== input2.value) {
            showError(input2, "Passwörter stimmen nicht überein");
        } else {
            showSuccess(input2);
        }
    }
};

const getFieldName = (input) => input.dataset.name;

const isFormValid = () => {
    const formControls = form.querySelectorAll(".form-control");
    return [...formControls].every((formControl) =>
        formControl.classList.contains("success")
    );
};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    checkLength(username, 3, 10);
    checkEmail(email);
    checkLength(password, 8, 25);
    checkPasswordsMatch(password, password2);

    if (isFormValid()) {
        window.location.href = "/html/index.html";

    }
});
