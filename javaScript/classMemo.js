// 儲存筆記本內容到本地存儲
function saveNote() {
    var content = document.getElementById('notebook').innerHTML;
    localStorage.setItem('noteContent', content);
  }

  // 讀取本地存儲中的筆記本內容
  function loadNote() {
    var content = localStorage.getItem('noteContent');
    if (content) {
      document.getElementById('notebook').innerHTML = content;
    }
  }

  // 在頁面載入時讀取筆記內容
  document.addEventListener('DOMContentLoaded', function() {
    loadNote();
  });

  // 在筆記內容發生變化時保存筆記
  document.getElementById('notebook').addEventListener('input', function() {
    saveNote();
  });