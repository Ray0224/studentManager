let isUpdateScore = false;
let isAddScore = false;
let updateColumn = 0;
let addColumn = 0;
let editThisColumn = function () {
    if (isUpdateScore || isAddScore) {
        return;
    }
    isUpdateScore = true;
    document.getElementById("updateBoard").style.display = "block"
    let studentTable = document.getElementById("scoreTable");
    let rows = studentTable.rows;
    let firstRow = studentTable.rows[0].cells;
    //取得是第幾欄
    for (let a = 0; a < firstRow.length; a++) {
        if (firstRow[a] == this) {
            updateColumn = a;
            break;
        }
    }
    for (let i = 1; i < rows.length; i++) {
        let cell = rows[i].cells[updateColumn];
        cell.contentEditable = true;
        cell.style.color = "rgb(255, 72, 0)";
        cell.style.fontWeight = "bold";
        cell.style.fontSize = "25px";
    }
}
function onclickUpdate() {
    let rows = document.getElementById("scoreTable").rows;
    let mystudents = getCurrentClass().cStudents;
    for (let i = 0; i < mystudents.length; i++) {
        mystudents[i].Scores[updateColumn - 2].sName = rows[0].cells[updateColumn].innerText;
        mystudents[i].Scores[updateColumn - 2].sScore = rows[i + 1].cells[updateColumn].innerText;
    }
    console.log(updateColumn);
    console.log(classes);
    localStorage.setItem('classes', JSON.stringify(classes));
    location.reload();
}
function onclickEdit() {
    isAddScore = true;
    if (getCurrentClass().cStudents.length == 0) {
        alert("尚未建立學生");
        window.location.href = "studentMessage.html";
        return;
    }
    if (isUpdateScore) {
        return;
    }
    let board = document.getElementsByClassName("sFunction")[0];
    if (board.style.display == "none" || board.style.display == "") {
        document.getElementsByClassName("sFunction")[0].style.display = "block";
    }
    else {
        return;
    }
}
function onclickReadBoard() {
    let board = document.getElementById("readBoard");
    board.style.display = (board.style.display == "none" || board.style.display == "") ? "block" : "none";
}

function readExcel() {
    const input = document.getElementById('excelFile');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        //讀取成功時觸發function
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 取得第一個工作表名稱
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];          
            //最後一列
            const lastRow = XLSX.utils.decode_range(sheet['!ref']).e.r;
            let currentcolumn = 1;
            while(currentcolumn>0){
                //資料選取範圍鎖定在第currentcolumn行
                let options = { 
                    range: { s: { r: 0, c: currentcolumn }, e: { r:lastRow, c: currentcolumn } },
                };
               let columnData = XLSX.utils.sheet_to_json(sheet,options);
               if(columnData.length == 0){
                break;
               }
               let newColumn = onclickAddScore();
               if(newColumn.length != columnData.length +1){
                alert("資料格式不符，請重新檢查匯入檔案!!")
                location.reload();
                return;
               }
               //代入測驗名稱
               let keyName = Object.keys(columnData[0])[0]
               newColumn[0].innerText = keyName;
               for(let i = 1;i<newColumn.length;i++){
                newColumn[i].innerText = columnData[i-1][keyName];
               }
               currentcolumn++;
            }   
        };
        reader.readAsArrayBuffer(file)
    } 
    else {
        alert("請選擇一個檔案!!")
    }
}
function onclickAddScore() {
    let newColumn = [];
    let rows = document.getElementById("scoreTable").rows;
    if (addColumn == 0) {
        addColumn = rows[0].cells.length;
    }
    for (let i = 0; i < rows.length; i++) {
        let newOne;
        if (i != 0) {
            newOne = document.createElement("td");
            newOne.oninput = function () {
                this.textContent = this.textContent.replace(/\D/g, '');
            };
        }
        else {
            newOne = document.createElement("th");
        }
        newColumn.push(newOne);
        newOne.contentEditable = true;
        rows[i].appendChild(newOne);
    }
    return newColumn;
}
function onclickSave() {
    if (addColumn == 0) {
        return;
    }
    let rows = document.getElementById("scoreTable").rows;
    let lastColumn = rows[0].cells.length;
    let mystudents = getCurrentClass().cStudents;
    //看新考試間有無相同名稱
    let newTestName = [];
    for (let a = addColumn; a < lastColumn; a++) {
        let testName = filterSpecialCharacters(rows[0].getElementsByTagName("th")[a].innerText);
        //檢查考試名稱是否為空
        if (testName == "") {
            alert("未輸入測驗名稱!!");
            return;
        }
        //檢查有無和之前的測驗名稱相同
        for (let i = 0; i < mystudents[0].Scores.length; i++) {
            if (mystudents[0].Scores[i].sName == testName) {
                alert("重複的測驗名稱!!");
                return;
            }
        }    
        for (let i = 0;i<newTestName.length;i++){
            if(newTestName[i] == testName){
                alert("重複的測驗名稱!!");
                return;
            }
        }
        newTestName.push(testName);
    }
    for (let a = addColumn; a < lastColumn; a++){
        let testName = filterSpecialCharacters(rows[0].getElementsByTagName("th")[a].innerText);
        for (let i = 0; i < mystudents.length; i++) {
            let newScore = {
                sName: testName,
                sScore: filterNumber(rows[i + 1].getElementsByTagName("td")[a].innerText)
            };
            mystudents[i].Scores.push(newScore);
        }
    }
    localStorage.setItem('classes', JSON.stringify(classes));
    location.reload();
}

function onclickDiscard() {
    location.reload();
}
function onloadCreateScoreTable() {
    if (getCurrentClass() == null) {
        alert("尚未選擇班級!!")
        window.location.href = "homePage.html";
        return;
    }
    let studentTable = document.getElementById("scoreTable");
    let mystudents = getCurrentClass().cStudents;
    if (mystudents.length == 0) {
        alert("尚未新增學生!!")
        window.location.href = "studentMessage.html";
        return;
    }
    //若有學生新加入,初始化前面的成績用
    let testCount = mystudents[0].Scores.length;
    //初始化標題欄
    for (let i = 0; i < mystudents[0].Scores.length; i++) {
        let newOne = document.createElement("th")
        newOne.addEventListener("click", editThisColumn);
        newOne.className = "tdEdit";
        newOne.innerText = mystudents[0].Scores[i].sName;
        studentTable.rows[0].appendChild(newOne);
    }
    //初始化內容
    for (let i = 0; i < mystudents.length; i++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = studentTable.rows.length;
        let td2 = document.createElement("td");
        td2.innerText = mystudents[i].sName;
        tr.appendChild(td1);
        tr.appendChild(td2);
        //判斷是否前面有缺少成績
        if (mystudents[i].Scores.length < testCount) {
            for (let a = 0; a < testCount; a++) {
                let newScore = {
                    sName: mystudents[0].Scores[a].sName,
                    sScore: ""
                };
                mystudents[i].Scores.push(newScore);
            }
            localStorage.setItem('classes', JSON.stringify(classes));
            location.reload();
        }
        for (let a = 0; a < mystudents[i].Scores.length; a++) {
            let newOne = document.createElement("td");
            newOne.innerText = mystudents[i].Scores[a].sScore;
            newOne.oninput = function () {
                this.textContent = this.textContent.replace(/\D/g, '');
            };
            tr.appendChild(newOne);
        }
        studentTable.appendChild(tr);
    }
}



//測試使用
function clearScore() {
    if (getCurrentClass() == null) {
        console.log("沒有目前班級");
        return;
    }
    let mystudents = getCurrentClass().cStudents;
    for (let i = 0; i < mystudents.length; i++) {
        while (mystudents[i].Scores.length > 0) {
            mystudents[i].Scores.pop();
        }
    }
    localStorage.setItem('classes', JSON.stringify(classes));
}




