window.addEventListener('DOMContentLoaded', () => {
  const taskNameInput = document.getElementById('taskNameInput');
  const dueDateInput = document.getElementById('dueDateInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const removeCheckedTasksButton = document.getElementById('removeCheckedTasksButton');
  const taskList = document.getElementById('taskList');
  const trashCan = document.getElementById('trashCan');

  // タスク情報を管理する配列
  let tasks = [];

  //  (A) ゴミ箱アイコンアニメーション用の要素と制御
  // ドラッグ中に表示するゴミ箱アイコン要素を作成し、bodyに追加
  const dustboxIcon = document.createElement('img');
  dustboxIcon.id = 'dustboxIcon';

  // ★ゴミ箱アイコン (dustbox.*) を参照
  dustboxIcon.src = 'dustbox.jpg';

  document.body.appendChild(dustboxIcon);

  let animationFrameId = null; // requestAnimationFrame 用ID
  let scaleBase = 1.0;         // 拡大縮小の基本倍率
  let scaleRange = 0.15;       // ポワポワの振幅(±0.15)
  let animTime = 0;            // アニメーション用の時刻

  // ポワポワ(拡大縮小)アニメーション
  function animateDustbox() {
    animTime += 0.08; // ここはアニメーション速度に応じて調整
    const scale = scaleBase + scaleRange * Math.sin(animTime);
    // アイコンの中心がマウス位置に合うように
    dustboxIcon.style.transform = `translate(-50%, -50%) scale(${scale})`;
    animationFrameId = requestAnimationFrame(animateDustbox);
  }

  // ドラッグ中のゴミ箱アイコン表示を開始
  function startDustboxAnimation() {
    dustboxIcon.style.display = 'block';
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animateDustbox);
    }
  }

  // ドラッグ終了時のアイコンアニメーション停止
  function stopDustboxAnimation() {
    dustboxIcon.style.display = 'none';
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // ドラッグ中に dustboxIcon を追従させるため、マウス座標を更新
  function moveDustbox(x, y) {
    dustboxIcon.style.left = x + 'px';
    dustboxIcon.style.top = y + 'px';
  }

  // --------------------------------------
  //  (B) タスクの追加・描画
  // --------------------------------------
  function addTask() {
    const taskText = taskNameInput.value.trim();
    const dueDate = dueDateInput.value; // YYYY-MM-DD or ''

    if (!taskText) return;

    // 新しいタスクオブジェクト
    const newTask = {
      text: taskText,
      date: dueDate,
      checked: false,
    };

    tasks.push(newTask);

    // 日付順にソートして再描画
    sortTasksByDate();
    renderTasks();

    // 入力をリセット
    taskNameInput.value = '';
    dueDateInput.value = '';
  }

  // 日付順(早い→遅い)にソート
  function sortTasksByDate() {
    tasks.sort((a, b) => {
      const aTime = parseDateString(a.date);
      const bTime = parseDateString(b.date);
      return aTime - bTime;
    });
  }
  function parseDateString(dateStr) {
    if (!dateStr) return Infinity; // 期限なしは最後に回す
    return new Date(dateStr).getTime();
  }

  // タスクリストを描画
  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');

      // チェックボックス
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('task-checkbox');
      checkbox.checked = task.checked;
      checkbox.addEventListener('change', () => {
        task.checked = checkbox.checked;
      });

      // タスク名
      const spanText = document.createElement('span');
      spanText.textContent = task.text;
      spanText.classList.add('task-text');

      // 期限日
      const spanDate = document.createElement('span');
      spanDate.classList.add('task-date');
      if (task.date) {
        spanDate.textContent = `期限: ${task.date}`;
      } else {
        spanDate.textContent = '(期限なし)';
      }

      // liに追加
      li.appendChild(checkbox);
      li.appendChild(spanText);
      li.appendChild(spanDate);

      // --- ドラッグ&ドロップ関連 ---
      li.draggable = true;

      // dragstart
      li.addEventListener('dragstart', (e) => {
        // タスクのindexをDataTransferに仕込む
        e.dataTransfer.setData('text/plain', index.toString());

        // 既定のドラッグ画像を透明に(自前のdustboxIconを見せる)
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
        e.dataTransfer.setDragImage(img, 0, 0);

        // ゴミ箱アイコンアニメ開始
        startDustboxAnimation();
        moveDustbox(e.clientX, e.clientY);
      });

      // dragend
      li.addEventListener('dragend', () => {
        stopDustboxAnimation();
      });

      // リストに追加
      taskList.appendChild(li);
    });
  }

  // --------------------------------------
  //  (C) チェックされたタスクを一括削除
  // --------------------------------------
  function removeCheckedTasks() {
    tasks = tasks.filter(task => !task.checked);
    renderTasks();
  }

  // --------------------------------------
  //  (D) ゴミ箱にドロップで削除
  // --------------------------------------
  trashCan.addEventListener('dragover', (e) => {
    e.preventDefault();
    trashCan.classList.add('drag-over');
  });
  trashCan.addEventListener('dragleave', () => {
    trashCan.classList.remove('drag-over');
  });
  trashCan.addEventListener('drop', (e) => {
    e.preventDefault();
    trashCan.classList.remove('drag-over');
    const indexStr = e.dataTransfer.getData('text/plain');
    if (!indexStr) return;

    const index = parseInt(indexStr, 10);
    if (!Number.isNaN(index)) {
      tasks.splice(index, 1);
      renderTasks();
    }
  });

  // --------------------------------------
  //  (E) ドラッグ中のマウス移動に合わせてdustboxIconを動かす
  // --------------------------------------
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    moveDustbox(e.clientX, e.clientY);
  });

  // --------------------------------------
  //  (F) イベントリスナー登録
  // --------------------------------------
  addTaskButton.addEventListener('click', addTask);
  removeCheckedTasksButton.addEventListener('click', removeCheckedTasks);

  // Enterキーでもタスク追加
  taskNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});
