
function onclickEdit() {
    document.getElementsByClassName("cFunction")[0].style.display = "block";
    let cTable = document.getElementById("studentTable")
    let cells = cTable.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].className == "tdEdit"){
            cells[i].contentEditable = true;
        }     
    }
}

function onclickReadBoard(){
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
            //取得A1資料個的STRING
            if(sheet.A1 == null){
                return;
            }
            const A1String = sheet.A1.h;
            //產生一個陣列,A2,A3,A4; A1的值為物件的屬性名稱
            const columnA = XLSX.utils.sheet_to_json(sheet);
            for(let i = 0;i<columnA.length;i++){
                addRow().innerText = columnA[i][A1String]
            }
        };
        reader.readAsArrayBuffer(file)
    } 
    else {
        alert("請選擇一個檔案!!")
    }
}

function onclickStudentCount() {
    let board = document.getElementById("studentCount");
    board.style.display = (board.style.display == "none" || board.style.display == "") ? "block" : "none";
}

function onclickCountConfirm() {
    let board = document.getElementById("studentCount");
    let cInput = document.getElementById("studentCountInput");
    if (cInput.value == "") {
        return;
    }
    else {
        let studentTable = document.getElementById("studentTable");
        let delta = Number(cInput.value) - studentTable.rows.length + 1;
        if (delta < 1) {
            return;
        }
        else {
            for (let i = 0; i < delta; i++) {
                addRow();
            }
        }
    }
    cInput.value = ""
    board.style.display = "none";
}
function addRow() {
    let studentTable = document.getElementById("studentTable");
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerText = studentTable.rows.length;
    let td2 = document.createElement("td");
    td2.className = "tdEdit";
    td2.contentEditable = true;
    tr.appendChild(td1);
    tr.appendChild(td2);
    studentTable.appendChild(tr);
    return td2;
}

function onclickSave() {
    let cells = document.getElementById("studentTable").getElementsByTagName("td");
    let myClass = getCurrentClass();
    for (let i = 0; i < cells.length; i++) {
        cells[i].contentEditable = false;
        //判斷是否為第一欄
        if (i % 2 == 0) {
            continue;
        }
        else {
            if (myClass.cStudents[(i-1)/2] == null) {
                let newStudent = {
                    sID: (i + 1) / 2,
                    sName: filterChineseAndEnglish(cells[i].innerText),
                    Scores: []
                };
                myClass.cStudents[(i - 1) / 2] = newStudent;
            }
            else {
                myClass.cStudents[(i - 1) / 2].sName = filterChineseAndEnglish(cells[i].innerText);
            }
        }
    }
    document.getElementsByClassName("cFunction")[0].style.display = "none";
    localStorage.setItem('classes', JSON.stringify(classes));
    location.reload();
}

function onclickDiscard(){
    location.reload();
}
function onloadCreateStudentMessage() {
    if (getCurrentClass() == null) {
        alert("尚未選擇班級!!")
        window.location.href = "homePage.html";
        return;
      }
    let mystudents = getCurrentClass().cStudents;
    let studentTable = document.getElementById("studentTable");
    for (let i = 0; i < mystudents.length; i++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = studentTable.rows.length;
        let td2 = document.createElement("td");
        td2.className = "tdEdit";

        td2.innerText = mystudents[i].sName;
        tr.appendChild(td1);
        tr.appendChild(td2);
        studentTable.appendChild(tr);
    }

}
