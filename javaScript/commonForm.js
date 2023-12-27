
var classes = [];
var currentClass="";
fetch('commonForm.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('commonFormContainer').innerHTML = data;
    onload();
  })
  .catch(error => console.error('Error fetching commonForm.html:', error));

// 儲存筆記本內容到本地存儲
function onclickCreateClass() {
  let newClass = {
    cName: document.getElementById("classInput").value,
    cStudents: []
  };
  //確認無重複班級名
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].cName == newClass.cName) {
      alert("班級名稱重複!!");
      return;
    }
  }

  if (newClass.cName != "") {
    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    location.reload();
  }
}

// 頁面刷新時呼叫
function onload() {
  if(JSON.parse(localStorage.getItem('classes'))!=null){
    classes = JSON.parse(localStorage.getItem('classes'));
  }
  if(localStorage.getItem("currentClass")!=null){
    currentClass = localStorage.getItem("currentClass");
  }
  document.getElementById("currentClass").innerText = "目前班級: "+ currentClass;
  for (let i = 0; i < classes.length; i++) {
    createClassButton(classes[i].cName);
    createDeleteButton(classes[i].cName);
  }
  if (document.getElementById("studentTable") != null) {
    onloadCreateStudentMessage();
  }
  if (document.getElementById("scoreTable") != null) {
    onloadCreateScoreTable();
  }
  if (document.getElementById("scoreArea") != null) {
    onloadCreateScoreButton();
  }
  //console.log(classes);
  //console.log(currentClass);
}

//刷新頁面時產生班級按鈕
function createClassButton(className) {
  var classBoard = document.getElementById("classBoard");
  var classButton = document.createElement("div");
  classButton.innerText = className;
  classButton.className = "classButton"
  classButton.addEventListener('click', function () {
    localStorage.setItem("currentClass", className);
    location.reload();
  });
  classBoard.appendChild(classButton);
}

//刷新頁面時產生刪除按鈕
function createDeleteButton(className) {
  var classBoard = document.getElementById("deleteBoard");
  var classButton = document.createElement("div");
  classButton.innerText = className;
  classButton.className = "deleteButton"
  classButton.addEventListener('click', function () {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].cName == className) {
        classes.splice(i, 1);
        break;
      }
    }
    if (currentClass == className) {
      localStorage.setItem("currentClass", "");
    }
    localStorage.setItem('classes', JSON.stringify(classes));
    location.reload();
  });
  classBoard.appendChild(classButton);
}

//得到目前班級物件
function getCurrentClass() {
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].cName == currentClass) {
      return classes[i];
    }
  }
  return null;
}
function onclickHeadBoard(i) {
  let boards = document.getElementsByClassName("headBoard");
  let board;
  if (i == 0) {
    board = document.getElementById("createBoard");
  }
  else if (i == 1) {
    board = document.getElementById("classBoard");
  }
  else if (i == 2) {
    board = document.getElementById("deleteBoard");
  }
  else if (i == 3) {
    board = document.getElementById("randomBoard");
  }
  else {
    return;
  }

  let bDisplay = (board.style.display == "none" || board.style.display == "") ? "block" : "none";
  let count = 0;
  while (count < boards.length) {
    boards[count].style.display = "none";
    count++;
  }
  board.style.display = bDisplay;
}

function onclickRandomBoard(i) {
  let openTitle;
  let closeTitle;
  let openBlock;
  let closeBlock;
  if (i == 0) {
    openTitle = document.getElementById("randomStudentTitle");
    closeTitle = document.getElementById("randomNumberTitle");
    openBlock = document.getElementById("randomStudent");
    closeBlock = document.getElementById("randomNumber");
  }
  else {
    closeTitle = document.getElementById("randomStudentTitle");
    openTitle = document.getElementById("randomNumberTitle");
    closeBlock = document.getElementById("randomStudent");
    openBlock = document.getElementById("randomNumber");
  }

  openTitle.style.backgroundColor = "rgb(107, 189, 107)";
  openTitle.style.color = "white";
  openTitle.style.fontWeight = "bold";
  closeTitle.style.backgroundColor = "azure";
  closeTitle.style.color = "rgb(169, 170, 170)";
  closeTitle.style.fontWeight = "normal";
  openBlock.style.display = "block";
  closeBlock.style.display = "none";
}

function onclickRandomStudent() {
  let pCount = document.getElementById("person").value;
  let pGroup = document.getElementById("group").value;
  let pResult = document.getElementById("pResult");
  pResult.innerText = "";
  if (getCurrentClass() == null) {
    pResult.innerText = "沒有目前班級";
    return;
  }
  let mystudents = getCurrentClass().cStudents;
  if (pCount == "" || pGroup == "") {
    pResult.innerText = "欄位尚未輸入"
    return;
  }
  let idResults = [];
  let count = parseInt(pCount);
  let group = parseInt(pGroup);
  for (let i = 0; i < group; i++) {
    let a;
    //計算第一個用
    let maxCountPerGroup;
    //以下兩行為總人數小於時才會用到
    let avgCount = Math.floor(mystudents.length / group);
    let remainderCount = mystudents.length % group;
    if (mystudents.length >= count * group) {
      a = count;
      maxCountPerGroup = a;
    }
    else {
      //比餘數小就多一人
      a = (i < remainderCount) ? avgCount + 1 : avgCount;
      maxCountPerGroup = a;   
    }
    while (a > 0) {
      let rStudent = mystudents[Math.floor(Math.random() * mystudents.length)];
      let sRandom = rStudent.sName;
      let sRandomID = rStudent.sID;
      if (idResults.includes(sRandomID)) {
        continue;
      }
      idResults.push(sRandomID);
      if (a == maxCountPerGroup) {
        pResult.innerText += (i + 1) + ": " + sRandom;
        if (a == 1) {
          pResult.innerText += "\n";
        }
      }
      else {
        if (a == 1) {
          pResult.innerText += "," + sRandom + "\n";
        }
        else {
          pResult.innerText += "," + sRandom
        }
      }
      a--;
    }
  }

}

function onclickRandomNumber() {
  let nFrom = parseInt(document.getElementById("rNumber1").value);
  let nEnd = parseInt(document.getElementById("rNumber2").value);
  let nCount = parseInt(document.getElementById("rNumber3").value);
  let nResult = document.getElementById("nResult");
  nResult.innerText = "";
  if (document.getElementById("rNumber1").value == "" ||
    document.getElementById("rNumber2").value == "" ||
    document.getElementById("rNumber3").value == "") {
    nResult.innerText = "欄位尚未輸入"
    return;
  }
  else if (nFrom >= nEnd) {
    nResult.innerText = "請輸入正確範圍"
    return;
  }
  else if (nCount > nEnd - nFrom + 1) {
    nResult.innerText = "範圍比個數小"
    return;
  }
  let count = nCount;//計算第一輪
  let results = [];//看是否有重複
  while (count > 0) {
    let a = Math.floor(Math.random() * (nEnd - nFrom + 1) + nFrom);
    if (results.includes(a)) {
      continue;
    }
    results.push(a);
    if (count == nCount) {
      nResult.innerText += a;
    }
    else {
      nResult.innerText += " ," + a;
    }
    count--;
  }
}
function filterSpecialCharacters(inputString) {
  // 使用正則表達式過濾特殊符號
  return inputString.replace(/[^\u4E00-\u9FA5a-zA-Z0-9]/g, '');
}
function filterChineseAndEnglish(inputString) {
  // 使用正則表達式過濾特殊符號和數字
  return inputString.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, '');
}
function filterNumber(inputString) {
  // 使用正則表達式將非數字替換為空字串
  return inputString.replace(/\D/g, '');
}
