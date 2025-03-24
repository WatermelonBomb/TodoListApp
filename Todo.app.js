window.addEventListener('DOMContentLoaded', () => {
  const taskNameInput = document.getElementById('taskNameInput');
  const dueDateInput = document.getElementById('dueDateInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const removeCheckedTasksButton = document.getElementById('removeCheckedTasksButton');
  const taskList = document.getElementById('taskList');
  const trashCan = document.getElementById('trashCan');

  // タスク情報を管理する配列
  let tasks = [];

  // 稲妻エフェクト用の要素を作成
  const lightningEffect = document.createElement('div');
  lightningEffect.className = 'lightning-effect';
  document.body.appendChild(lightningEffect);

  // アイコンの周りを回る稲妻エフェクト用の要素を作成
  const orbitingLightningEffect = document.createElement('div');
  orbitingLightningEffect.className = 'orbiting-lightning';
  document.body.appendChild(orbitingLightningEffect);

  // ダークモードオーバーレイ用の要素を作成
  const darkModeOverlay = document.createElement('div');
  darkModeOverlay.className = 'dark-mode-overlay';
  document.body.appendChild(darkModeOverlay);

  // ドロップ時の稲妻エフェクト用の要素を作成
  const dropLightningEffect = document.createElement('div');
  dropLightningEffect.className = 'drop-lightning';
  document.body.appendChild(dropLightningEffect);

  let lastLightningTime = 0; // 最後に稲妻を生成した時間
  const LIGHTNING_INTERVAL = 100; // 稲妻生成の間隔（ミリ秒）

  // ドラッグ中の稲妻エフェクトを生成する関数
  function createDraggingLightning(x, y) {
    const now = Date.now();
    if (now - lastLightningTime < LIGHTNING_INTERVAL) return;
    lastLightningTime = now;

    // メインの稲妻ライン
    const mainLine = document.createElement('div');
    mainLine.className = 'dragging-lightning-line';
    mainLine.style.left = x + 'px';
    draggingLightningEffect.appendChild(mainLine);

    // スパークエフェクト
    const sparkCount = Math.floor(Math.random() * 3) + 2; // 2-4個
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'dragging-lightning-spark';
      spark.style.left = (x + (Math.random() - 0.5) * 50) + 'px';
      spark.style.top = (y + (Math.random() - 0.5) * 50) + 'px';
      draggingLightningEffect.appendChild(spark);
    }

    // アニメーション終了後に要素を削除
    setTimeout(() => {
      mainLine.remove();
      const sparks = draggingLightningEffect.getElementsByClassName('dragging-lightning-spark');
      while (sparks.length > 0) {
        sparks[0].remove();
      }
    }, 500);
  }

  // アイコンの周りを回る稲妻エフェクトを生成する関数
  function createOrbitingLightning(x, y) {
    // メインの稲妻ライン（5本）
    for (let i = 0; i < 5; i++) {
      const mainLine = document.createElement('div');
      mainLine.className = 'orbiting-lightning-line';
      mainLine.style.left = x + 'px';
      mainLine.style.top = y + 'px';
      orbitingLightningEffect.appendChild(mainLine);
    }

    // スパークエフェクト（5個）
    for (let i = 0; i < 5; i++) {
      const spark = document.createElement('div');
      spark.className = 'orbiting-lightning-spark';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      orbitingLightningEffect.appendChild(spark);
    }
  }

  // アイコンの周りを回る稲妻エフェクトを更新する関数
  function updateOrbitingLightning(x, y) {
    const lines = orbitingLightningEffect.getElementsByClassName('orbiting-lightning-line');
    const sparks = orbitingLightningEffect.getElementsByClassName('orbiting-lightning-spark');
    
    for (let i = 0; i < lines.length; i++) {
      lines[i].style.left = x + 'px';
      lines[i].style.top = y + 'px';
    }
    
    for (let i = 0; i < sparks.length; i++) {
      sparks[i].style.left = x + 'px';
      sparks[i].style.top = y + 'px';
    }
  }

  // 稲妻エフェクトを生成する関数
  function createLightningEffect(x, y) {
    // メインの稲妻
    const mainLightning = document.createElement('div');
    mainLightning.className = 'lightning';
    mainLightning.style.left = x + 'px';
    lightningEffect.appendChild(mainLightning);

    // 枝分かれの稲妻を3-5本ランダムに生成
    const branchCount = Math.floor(Math.random() * 3) + 3; // 3-5本
    for (let i = 0; i < branchCount; i++) {
      const branch = document.createElement('div');
      branch.className = 'lightning-branch';
      branch.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
      branch.style.top = (y + Math.random() * 200) + 'px';
      branch.style.transform = `rotate(${(Math.random() - 0.5) * 90}deg)`;
      lightningEffect.appendChild(branch);
    }

    // アニメーション終了後に要素を削除
    setTimeout(() => {
      mainLightning.remove();
      const branches = lightningEffect.getElementsByClassName('lightning-branch');
      while (branches.length > 0) {
        branches[0].remove();
      }
    }, 300);
  }

  // ドロップ時の稲妻エフェクトを生成する関数
  function createDropLightning() {
    const dropLightningEffect = document.createElement('div');
    dropLightningEffect.className = 'drop-lightning';
    dropLightningEffect.style.display = 'block';

    // 垂直の稲妻を5本作成
    for (let i = 0; i < 5; i++) {
        const lightning = document.createElement('div');
        lightning.className = 'drop-lightning-line';
        dropLightningEffect.appendChild(lightning);
    }

    // 斜めの稲妻を4本作成
    for (let i = 0; i < 4; i++) {
        const lightning = document.createElement('div');
        lightning.className = 'drop-lightning-line diagonal';
        dropLightningEffect.appendChild(lightning);
    }

    // TASK KILLテキストを作成
    const taskKillText = document.createElement('div');
    taskKillText.className = 'task-kill-text';
    taskKillText.textContent = 'TASK KILL';
    document.body.appendChild(taskKillText);

    // ボーダー要素を作成
    const taskKillBorder = document.createElement('div');
    taskKillBorder.className = 'task-kill-border';
    document.body.appendChild(taskKillBorder);

    document.body.appendChild(dropLightningEffect);

    // 1.5秒後に要素を削除
    setTimeout(() => {
        dropLightningEffect.remove();
        taskKillText.remove();
        taskKillBorder.remove();
    }, 1500);
  }

  // ドロップ時のエフェクトを実行する関数
  function playDropEffect(x, y) {
    // ダークモードを有効化
    darkModeOverlay.classList.add('active');
    dropLightningEffect.style.display = 'block';

    // 稲妻エフェクトを生成
    createDropLightning();

    // 4秒後にダークモードを解除
    setTimeout(() => {
      darkModeOverlay.classList.remove('active');
      dropLightningEffect.style.display = 'none';
    }, 4000);
  }

  //  (A) ゴミ箱アイコンアニメーション用の要素と制御
  // ドラッグ中に表示するゴミ箱アイコン要素を作成し、bodyに追加
  const dustboxIcon = document.createElement('img');
  dustboxIcon.id = 'dustboxIcon';
  dustboxIcon.src = './dustbox.jpg';
  document.body.appendChild(dustboxIcon);

  let animationFrameId = null; // requestAnimationFrame 用ID
  let scaleBase = 1.0;         // 拡大縮小の基本倍率
  let scaleRange = 0.15;       // ポワポワの振幅(±0.15)
  let animTime = 0;            // アニメーション用の時刻

  // ポワポワ(拡大縮小)アニメーション
  function animateDustbox() {
    animTime += 0.08;
    const scale = scaleBase + scaleRange * Math.sin(animTime);
    const rotation = Math.sin(animTime * 0.5) * 5; // ゆっくりとした回転
    dustboxIcon.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
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

        // 稲妻エフェクトを表示
        lightningEffect.style.display = 'block';
        orbitingLightningEffect.style.display = 'block';
        createLightningEffect(e.clientX, e.clientY);
        createOrbitingLightning(e.clientX, e.clientY);

        // ゴミ箱アイコンアニメ開始
        startDustboxAnimation();
        moveDustbox(e.clientX, e.clientY);
      });

      // dragend
      li.addEventListener('dragend', () => {
        stopDustboxAnimation();
        lightningEffect.style.display = 'none';
        orbitingLightningEffect.style.display = 'none';
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

  // ゴミ箱エリアとの距離を計算
  function calculateDistanceToTrash(x, y) {
    const trashRect = trashCan.getBoundingClientRect();
    const trashCenterX = trashRect.left + trashRect.width / 2;
    const trashCenterY = trashRect.top + trashRect.height / 2;
    return Math.sqrt(
      Math.pow(x - trashCenterX, 2) + Math.pow(y - trashCenterY, 2)
    );
  }

  // ドラッグ中のマウス移動に合わせてdustboxIconを動かす
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    moveDustbox(e.clientX, e.clientY);

    // アイコンの周りを回る稲妻エフェクトを更新
    updateOrbitingLightning(e.clientX, e.clientY);

    // ゴミ箱エリアとの距離を計算
    const distance = calculateDistanceToTrash(e.clientX, e.clientY);
    const threshold = 200; // ゴミ箱エリアとの距離の閾値

    // ゴミ箱エリアに近づいた時の特別なエフェクト
    if (distance < threshold) {
      dustboxIcon.classList.add('near-trash');
    } else {
      dustboxIcon.classList.remove('near-trash');
    }
  });

  // ドロップ時のアニメーション
  trashCan.addEventListener('drop', (e) => {
    e.preventDefault();
    trashCan.classList.remove('drag-over');
    
    // ドロップ時のエフェクトを実行
    playDropEffect(e.clientX, e.clientY);

    const indexStr = e.dataTransfer.getData('text/plain');
    if (!indexStr) return;

    const index = parseInt(indexStr, 10);
    if (!Number.isNaN(index)) {
      tasks.splice(index, 1);
      renderTasks();
    }
  });

  // --------------------------------------
  //  (E) イベントリスナー登録
  // --------------------------------------
  addTaskButton.addEventListener('click', addTask);
  removeCheckedTasksButton.addEventListener('click', removeCheckedTasks);

  // Enterキーでもタスク追加
  taskNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // タスクのデータ構造を拡張
  class Task {
    constructor(id, text, completed = false, priority = 'medium', category = 'default', dueDate = null, subTasks = [], isRecurring = false, recurringInterval = null, assignedTo = null, comments = []) {
      this.id = id;
      this.text = text;
      this.completed = completed;
      this.priority = priority; // 'high', 'medium', 'low'
      this.category = category;
      this.dueDate = dueDate;
      this.subTasks = subTasks;
      this.isRecurring = isRecurring;
      this.recurringInterval = recurringInterval;
      this.assignedTo = assignedTo;
      this.comments = comments;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }

  // カテゴリーの定義
  const categories = [
    { id: 'work', name: '仕事', color: '#FF6B6B' },
    { id: 'personal', name: 'プライベート', color: '#4ECDC4' },
    { id: 'shopping', name: '買い物', color: '#45B7D1' },
    { id: 'default', name: 'その他', color: '#96CEB4' }
  ];

  // 優先度の定義
  const priorities = [
    { id: 'high', name: '高', color: '#FF6B6B' },
    { id: 'medium', name: '中', color: '#FFD93D' },
    { id: 'low', name: '低', color: '#6BCB77' }
  ];

  // タスクの保存と読み込み
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      tasks = parsedTasks.map(task => {
        const newTask = new Task(
          task.id,
          task.text,
          task.completed,
          task.priority,
          task.category,
          task.dueDate ? new Date(task.dueDate) : null,
          task.subTasks,
          task.isRecurring,
          task.recurringInterval,
          task.assignedTo,
          task.comments
        );
        newTask.createdAt = new Date(task.createdAt);
        newTask.updatedAt = new Date(task.updatedAt);
        return newTask;
      });
    }
  }

  // タスクの表示を更新
  function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // フィルターとソートの適用
    let filteredTasks = [...tasks];
    
    // 検索フィルター
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
      const searchTerm = searchInput.value.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
      );
    }

    // カテゴリーフィルター
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === categoryFilter.value);
    }

    // 優先度フィルター
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter && priorityFilter.value !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter.value);
    }

    // ソート
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
      switch (sortBy.value) {
        case 'priority':
          filteredTasks.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
          break;
        case 'dueDate':
          filteredTasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
          break;
        case 'createdAt':
          filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    }

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
      
      // タスクの表示内容を更新
      li.innerHTML = `
        <div class="task-content">
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-text">${task.text}</span>
          <div class="task-meta">
            <span class="task-category" style="background-color: ${categories.find(c => c.id === task.category)?.color || '#96CEB4'}">
              ${categories.find(c => c.id === task.category)?.name || 'その他'}
            </span>
            ${task.dueDate ? `<span class="task-due-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
            ${task.subTasks.length > 0 ? `<span class="subtask-count">${task.subTasks.filter(st => st.completed).length}/${task.subTasks.length}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="edit-btn">編集</button>
          <button class="delete-btn">削除</button>
        </div>
      `;

      // イベントリスナーの設定
      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => toggleTask(task.id));

      const editBtn = li.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => editTask(task.id));

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      taskList.appendChild(li);
    });

    // 統計情報の更新
    updateStatistics();
  }

  // 統計情報の更新
  function updateStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const statsContainer = document.getElementById('taskStats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">総タスク数</span>
          <span class="stat-value">${totalTasks}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完了タスク</span>
          <span class="stat-value">${completedTasks}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完了率</span>
          <span class="stat-value">${completionRate.toFixed(1)}%</span>
        </div>
      `;
    }
  }

  // タスクの編集機能
  function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
      <input type="text" value="${task.text}" class="edit-input">
      <select class="edit-priority">
        ${priorities.map(p => `
          <option value="${p.id}" ${task.priority === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('')}
      </select>
      <select class="edit-category">
        ${categories.map(c => `
          <option value="${c.id}" ${task.category === c.id ? 'selected' : ''}>${c.name}</option>
        `).join('')}
      </select>
      <input type="date" class="edit-due-date" value="${task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}">
      <button class="save-btn">保存</button>
      <button class="cancel-btn">キャンセル</button>
    `;

    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    taskItem.appendChild(editForm);

    const saveBtn = editForm.querySelector('.save-btn');
    saveBtn.addEventListener('click', () => {
      const newText = editForm.querySelector('.edit-input').value;
      const newPriority = editForm.querySelector('.edit-priority').value;
      const newCategory = editForm.querySelector('.edit-category').value;
      const newDueDate = editForm.querySelector('.edit-due-date').value;

      task.text = newText;
      task.priority = newPriority;
      task.category = newCategory;
      task.dueDate = newDueDate ? new Date(newDueDate) : null;
      task.updatedAt = new Date();

      saveTasks();
      updateTaskList();
    });

    const cancelBtn = editForm.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
      editForm.remove();
    });
  }

  // 初期化時にタスクを読み込む
  loadTasks();
  updateTaskList();
});
