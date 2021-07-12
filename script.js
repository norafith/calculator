const calc_container = document.querySelector("#calc-container");
const button_container = document.querySelector("#button-container");
const output_field = document.querySelector("#output-field");
const operations = ["+", "-", "*", "/", "="];

let curr_num = '', curr_operation = '';

function create_buttons() {
    for (let i = 0; i < 10; i++) {
        let button = document.createElement("button");
        button.classList.add("number");
        button.textContent = i;
        button.value = i;
        button_container.appendChild(button);
    }
    for (let operation of operations) {
        button = document.createElement("button");
        button.classList.add("operation");
        button.textContent = operation;
        button.value = operation;
        button_container.appendChild(button);
    }
    button = document.createElement("button");
    button.setAttribute("id", "point");
    button.classList.add("number");
    button.textContent = "•";
    button.value = ".";
    button_container.appendChild(button);

    button = document.createElement("button")
    button.setAttribute("id", "clear-symb");
    button.textContent = "C";
    button_container.appendChild(button);

    button = document.createElement("button")
    button.setAttribute("id", "clear-all");
    button.textContent = "AC";
    button_container.appendChild(button);

    add_event_listeners();
}

function add_event_listeners() {
    const value_buttons = document.querySelectorAll(".operation, .number");
    const all_buttons = document.querySelectorAll("button");
    const clear_symb_button = document.querySelector("#clear-symb");
    const clear_all_button = document.querySelector("#clear-all");

    value_buttons.forEach(button => button.addEventListener("click", enter_value));
    all_buttons.forEach(button => button.addEventListener("click", transform_start));
    all_buttons.forEach(button => button.addEventListener("transitionend", transform_end));
    clear_symb_button.addEventListener("click", clear_symb);
    clear_all_button.addEventListener("click", clear_all);

    document.addEventListener("keydown", (e) => {
        if (!e.repeat) transform_start(e);
        if (e.key == "Backspace") clear_symb(e);
        else enter_value(e);
    })
}

function enter_value(e) {
    let key_value;
    if (e.target.value) key_value = e.target.value
    else key_value = e.key;
    if ((key_value == "=" || key_value == "Enter") && curr_operation && output_field.value) {
        output_field.value = evaluate();
        curr_num = output_field.value;
        curr_operation = "";
    } else if (key_value == "." && output_field.value && !output_field.value.includes(".")) {
        output_field.value += key_value;
    } else if (!isNaN(Number(key_value))) {
        if (output_field.value == "0" || output_field.value == "Infinity") output_field.value = "";
        output_field.value += key_value;
    } else if (!curr_operation && key_value != "=" && key_value != "." && operations.includes(key_value)) {
        curr_num = output_field.value;
        curr_operation = key_value;
        output_field.value = "";
    }
}

function clear_symb(e) {
    if (output_field.value == "Infinity") clear_all(e)
    else output_field.value = output_field.value.slice(0, output_field.value.length - 1);
}

function clear_all(e) {
    output_field.value = "";
    curr_num = "";
    curr_operation = "";
}

function evaluate() {
    num1 = Number(curr_num);
    num2 = Number(output_field.value);
    if (curr_operation == "+") {
        return num1 + num2;
    } else if (curr_operation == "-") {
        return num1 - num2;
    } else if (curr_operation == "*") {
        return num1 * num2;
    } else if (curr_operation == "/"){
        return num1 / num2;
    }
}

function transform_start(e) {
    if (e.constructor.name == "MouseEvent") { 
        e.target.classList.add("active");
    } else if (e.key == "." || operations.includes(e.key) || !isNaN(Number(e.key))) {
        let button = document.querySelector(`button[value="${e.key}"]`);
        button.classList.add("active");
    } else if (e.key == "Enter") {
        let button = document.querySelector(`button[value="="]`);
        button.classList.add("active");
    } else if (e.key == "Backspace") {
        let button = document.querySelector("#clear-symb");
        button.classList.add("active");
    }
}

function transform_end(e) {
    e.target.classList.remove("active");
}

create_buttons()
