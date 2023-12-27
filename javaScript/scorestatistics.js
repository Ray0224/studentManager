let myChart;
let myChart2;
let chartTitle;
let chartTitle2;
//#region 切換版面
function onclickSwitchBoard(i) {
    let openTitle;
    let closeTitle;
    let openBlock;
    let closeBlock;
    if (i == 0) {
        openTitle = document.getElementById("classStatisticsTitle");
        closeTitle = document.getElementById("studentStatisticsTitle");
        openBlock = document.getElementById("classStatistics");
        closeBlock = document.getElementById("studentStatistics");
    }
    else {
        closeTitle = document.getElementById("classStatisticsTitle");
        openTitle = document.getElementById("studentStatisticsTitle");
        closeBlock = document.getElementById("classStatistics");
        openBlock = document.getElementById("studentStatistics");
    }

    openTitle.style.backgroundColor = "rgb(231, 27, 27)";
    openTitle.style.color = "white";
    openTitle.style.fontWeight = "bold";
    closeTitle.style.backgroundColor = "white";
    closeTitle.style.color = "gray";
    closeTitle.style.fontWeight = "normal";
    openBlock.style.display = "block";
    closeBlock.style.display = "none";
}
//#endregion

//#region 圖表
// 生成圖表函數
let generateChart = function () {
    if (typeof myChart !== 'undefined' && myChart !== null) {
        // 如果存在，銷毀之
        myChart.destroy();
    }
    document.getElementById("downloadButton").style.display = "block";
    let inputData = [];
    chartTitle = this.innerText;
    let mystudents = getCurrentClass().cStudents;
    //先確認是第幾行的資料
    let testIndex;
    for (let i = 0; i < mystudents[0].Scores.length; i++) {
        if (this.innerText == mystudents[0].Scores[i].sName) {
            testIndex = i;
            break;
        }
    }
    let total = 0;
    let count = 0;
    for (let i = 0; i < mystudents.length; i++) {
        let score = mystudents[i].Scores[testIndex].sScore;
        if (score != "") {
            inputData.push(Number(score));
            total += Number(score);
            count++;
        }
    }
    if (count != 0) {
        let result = document.getElementById("result");
        result.style.display = "flex";
        let avg = Math.round((total/count)*10)/10; 
        result.innerText = `測驗人數 : ${count}人 ,平均分數 : ${avg}分`
    } 
    const intervalData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    // 創建一個包含相應區間內數據數量的陣列
    const dataInIntervals = intervalData.map(calculateDataInInterval);
    //console.log(dataInIntervals);
    // 定義一個函數，用於計算區間內的數據數量
    function calculateDataInInterval(interval) {
        return inputData.filter(isInInterval.bind(null, interval)).length;
    }

    // 定義一個函數，用於檢查數據是否在特定區間內
    function isInInterval(interval, value) {
        return value >= interval && value < interval + 10;
    }
    // 使用Chart.js創建分布圖
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intervalData.map(interval => {
                if (interval === 100) {
                    return '90-100';
                }
                return `${interval}-${interval + 10}`;
            }),
            datasets: [{
                label: chartTitle + "測驗統計表",
                data: dataInIntervals,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: '人數'
                    }
                }
            }
        }
    });
}

//生成折線圖
function generateChart2() {
    if (typeof myChart2 !== 'undefined' && myChart2 !== null) {
        // 如果存在，銷毀之
        myChart2.destroy();
    }
    document.getElementById("downloadButton2").style.display = "block";
    let data = [];
    let xLabels = [];
    chartTitle2 = this.innerText;
    let currentStudent = getCurrentClass().cStudents[Number(this.innerText.split(".")[0]) - 1];

    for (let i = 0; i < currentStudent.Scores.length; i++) {
        data.push(Number(currentStudent.Scores[i].sScore));
        xLabels.push(currentStudent.Scores[i].sName);
    }

    // Get the canvas element
    let ctx = document.getElementById('myChart2').getContext('2d');

    // Create the chart
    myChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [{
                label: chartTitle2,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category', // 使用 category 類型表示 x 軸是類別型別的資料
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true, // 是否從零開始
                    stepSize: 1,       // y 軸刻度的步長
                    precision: 0       // 數值精度
                }
            }
        }
    });
}
//#endregion
//#region 下載圖表
// 下載圖表函數
function downloadChart() {
    // 獲取圖表的Base64數據URL
    const chartDataURL = document.getElementById('myChart').toDataURL('image/png');

    // 創建一個隱藏的a元素
    const downloadLink = document.createElement('a');
    downloadLink.href = chartDataURL;
    downloadLink.download = chartTitle + '_chart.png';

    // 模擬點擊下載
    downloadLink.click();
}
function downloadChart2() {
    // 獲取圖表的Base64數據URL
    const chartDataURL = document.getElementById('myChart2').toDataURL('image/png');

    // 創建一個隱藏的a元素
    const downloadLink = document.createElement('a');
    downloadLink.href = chartDataURL;
    downloadLink.download = chartTitle2 + '_chart.png';

    // 模擬點擊下載
    downloadLink.click();
}
//#endregion
//#region 初始化
function onloadCreateScoreButton() {
    if (getCurrentClass() == null) {
        alert("尚未選擇班級!!")
        window.location.href = "homePage.html";
        return;
    }
    //全班統計區塊
    let scoreArea = document.getElementById("scoreArea");
    let mystudents = getCurrentClass().cStudents;
    if (mystudents.length == 0) {
        alert("尚未新增學生!!")
        window.location.href = "studentMessage.html";
        return;
    }
    for (let i = 0; i < mystudents[0].Scores.length; i++) {
        let newOne = document.createElement("button")
        newOne.addEventListener("click", generateChart);
        newOne.innerText = mystudents[0].Scores[i].sName;
        scoreArea.appendChild(newOne);
    }
    //  個別統計區塊
    let scoreArea2 = document.getElementById("scoreArea2");
    for (let i = 0; i < mystudents.length; i++) {
        let newOne = document.createElement("button")
        newOne.addEventListener("click", generateChart2);
        newOne.innerText = mystudents[i].sID + ". " + mystudents[i].sName;
        scoreArea2.appendChild(newOne);
    }
}
//#endregion