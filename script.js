// 全局变量：当前编辑的图书ID
let currentEditId = null;

// 页面加载时渲染图书列表
window.onload = renderBookList;

// 保存图书（添加/编辑）
function saveBook() {
  // 获取表单数据
  const id = document.getElementById('bookId').value || Date.now().toString();
  const name = document.getElementById('bookName').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const type = document.getElementById('bookType').value;
  const status = document.getElementById('bookStatus').value;

  // 校验必填项
  if (!name || !author) {
    alert('书名和作者不能为空！');
    return;
  }

  // 构造图书对象
  const book = {
    id,
    name,
    author,
    type,
    status
  };

  // 获取现有图书列表
  let books = getBooks();

  // 判断是添加还是编辑
  if (currentEditId) {
    // 编辑：替换原有图书
    books = books.map(b => b.id === currentEditId ? book : b);
    currentEditId = null;
  } else {
    // 添加：新增图书
    books.push(book);
  }

  // 保存到本地存储
  saveBooks(books);
  // 重新渲染列表
  renderBookList();
  // 重置表单
  resetForm();
  alert('保存成功！');
}

// 渲染图书列表
function renderBookList(books = null) {
  // 如果没有传入筛选后的图书，就读取本地存储的全部图书
  const bookList = books || getBooks();
  const bookTable = document.getElementById('bookList');
  bookTable.innerHTML = '';

  // 无数据时提示
  if (bookList.length === 0) {
    bookTable.innerHTML = '<tr><td colspan="5" style="text-align:center;">暂无图书数据</td></tr>';
    return;
  }

  // 遍历渲染每一行
  bookList.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.type}</td>
      <td>${book.status}</td>
      <td class="oper-btn">
        <button class="edit-btn" onclick="editBook('${book.id}')">编辑</button>
        <button class="delete-btn" onclick="deleteBook('${book.id}')">删除</button>
      </td>
    `;
    bookTable.appendChild(tr);
  });
}

// 编辑图书
function editBook(id) {
  const books = getBooks();
  const book = books.find(b => b.id === id);
  if (!book) return;

  // 填充表单
  document.getElementById('bookId').value = book.id;
  document.getElementById('bookName').value = book.name;
  document.getElementById('bookAuthor').value = book.author;
  document.getElementById('bookType').value = book.type;
  document.getElementById('bookStatus').value = book.status;

  // 记录当前编辑的ID
  currentEditId = id;
}

// 删除图书
function deleteBook(id) {
  if (!confirm('确定要删除这本图书吗？')) return;

  let books = getBooks();
  books = books.filter(b => b.id !== id);
  saveBooks(books);
  renderBookList();
}

// 搜索图书
function searchBooks() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!keyword) {
    renderBookList(); // 无关键词时显示全部
    return;
  }

  const books = getBooks();
  // 按书名/作者模糊搜索
  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(keyword) || 
    book.author.toLowerCase().includes(keyword)
  );
  renderBookList(filteredBooks);
}

// 重置表单
function resetForm() {
  document.getElementById('bookId').value = '';
  document.getElementById('bookName').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookType').value = '小说';
  document.getElementById('bookStatus').value = '可借阅';
  currentEditId = null;
}

// 从本地存储读取图书
function getBooks() {
  const data = localStorage.getItem('books');
  return data ? JSON.parse(data) : [];
}

// 保存图书到本地存储
function saveBooks(books) {
  localStorage.setItem('books', JSON.stringify(books));
}