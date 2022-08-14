const filterPopup = document.querySelector(".filter_popup");
const filterBtn = document.querySelector(".filter_btn");
const newEmployeeBtn = document.querySelector(".add_new_employee");
const overlay = document.querySelector(".overlay");
const newEmployeePopup = document.querySelector(".new_employee_popup");
const employeeContainer = document.querySelector(".employee_container");
const errBox = document.querySelector(".err");
const msgBox = document.querySelector(".msg_box");
const searchIn = document.querySelector(".search");
let msgBoxBtn;

// from selector
const submitBtn = document.querySelector(".submit_btn");
const allInputs = document.querySelectorAll(".form_input");
const sex = document.querySelectorAll("input[name='gender']");

// functions
const getFormData = (inputs) => {
  const data = {};
  inputs.forEach((input) => {
    let atr = input.getAttribute("name");
    data[atr] = input.value;
  });

  return data;
};

const fectchUsers = (data) => {
  data.forEach((user) => {
    let date = new Date();
    let month = date.getMonth();
    let lastPayment = user.paymentDates[user.paymentDates.length - 1];
    let salaryStatus = "success";
    if (lastPayment) {
      let lastPaymentDate = new Date(lastPayment);
      if (lastPaymentDate.getMonth() !== month) {
        salaryStatus = "pending";
      }
    } else {
      lastPayment = user.joinedIn;
      let lastPaymentDate = new Date(lastPayment);
      if (lastPaymentDate.getMonth() !== month) {
        salaryStatus = "pending";
      }
    }
    const html = `<div class="employee_card">
    <div class="img_box">
        <img class="user_img"
            src="${user.imgUrl}"
            alt="">
        <img class="img_wave" src="./src/img/wave.svg" alt="">
    </div>
    <div class="name">${user.name}</div>
    <div class="id">${user.empId}</div>
    <div class="info">
        <div class="department"><span class="title">Department</span> <span class="value"> ${user.department}</span></div>
        <div class="role"><span class="title">Role </span><span class="value">${user.role}</span></div>
        <div class="salary_status"><span class="title">Salary Status</span> <span class="value ${salaryStatus}">
                ${salaryStatus}</span></div>
    </div>
    <div class="view_more_btn">
        <button>view more</button>
    </div>
</div>`;
    employeeContainer.innerHTML += html;
  });
};

const generateId = () => {
  const dataSet = [
    0,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1,
    "A",
    "Z",
    "X",
    "E",
    "D",
    "F",
    "H",
  ];
  let count = 8;
  const id = [];
  while (count > 0) {
    let char = Math.floor(Math.random() * dataSet.length);
    id.push(dataSet[char]);
    count--;
  }
  return id.join("");
};

const request = async (url) => {
  let res = await axios.get(url);
  if (!res) {
    errBox.querySelector(".err_msg").textContent = err.message;
    errBox.classList.add("active");
    return;
  }
  employeeContainer.innerHTML = "";
  fectchUsers(res.data.employees);
};
request("http://127.0.0.1:3000/stackers/employee");
// axios
//   .get("http://127.0.0.1:3000/stackers/employee")
//   .then((res) => {
//     employeeContainer.innerHTML = "";
//     fectchUsers(res.data.employees);
//   })
//   .catch((err) => {
//     errBox.querySelector(".err_msg").textContent = err.message;
//     errBox.classList.add("active");
//   });

const showMsg = (msg, color, fontSize = "initial") => {
  msgBox.textContent = msg;
  msgBox.style.color = color;
  msgBox.style.fontSize = fontSize;
  let btn = document.createElement("button");
  msgBoxBtn = btn;
  btn.innerText = "Ok";
  msgBox.appendChild(btn);
  msgBox.classList.add("active");
  btn.addEventListener("click", () => {
    msgBox.classList.remove("active");
  });
};
// listners
filterBtn.addEventListener("click", () => {
  filterPopup.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
  newEmployeePopup.classList.remove("active");
  document.body.classList.remove("freze");
});

newEmployeeBtn.addEventListener("click", () => {
  overlay.classList.add("active");
  newEmployeePopup.classList.toggle("active");
  document.body.classList.add("freze");
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let data = getFormData(allInputs);
  sex.forEach((gen) => {
    if (gen.checked) {
      data.gender = gen.value;
    }
  });
  axios
    .get("http://127.0.0.1:3000/stackers/employee/?sel=_id")
    .then((res) => {
      let arr = res.data.employees.map((id) => id.empId);
      let id;
      do {
        id = generateId();
      } while (arr.includes(id));
      data.empId = id;
      axios
        .post("http://127.0.0.1:3000/stackers/employee", data)
        .then((res) => {
          showMsg("Employee created successfully done ✔", "green", "1.1rem");
          console.log([res.data]);
          fectchUsers([res.data]);
          overlay.click();
        })
        .catch((err) => {
          // err.response.data.message
          // console.log(err);
          showMsg(err.response.data.message, "red");
        });
    })
    .catch((err) => {
      // console.log(err);
    });
});

// searching...
searchIn.addEventListener("input", (e) => {
  clearTimeout(this.delay);
  this.delay = setTimeout(function () {}.bind(this), 1000);
});
