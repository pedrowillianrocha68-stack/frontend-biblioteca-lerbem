const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

async function carregarLivros() {
  const res = await fetch('http://localhost:8080/livros', { headers });
  const livros = await res.json();
  const tbody = document.getElementById('tabelaLivros');

  if (livros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">Nenhum livro cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = livros.map(l => `
    <tr>
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td>${l.isbn}</td>
      <td>${l.anoPublicacao}</td>
      <td>${l.categoria}</td>
      <td>${l.disponivel ? '✅' : '❌'}</td>
      <td><button onclick="deletarLivro(${l.idLivro})">🗑️</button></td>
    </tr>
  `).join('');
}

async function cadastrarLivro() {
  const body = {
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    isbn: document.getElementById('isbn').value,
    anoPublicacao: parseInt(document.getElementById('anoPublicacao').value),
    categoria: document.getElementById('categoria').value,
    disponivel: true
  };

  const res = await fetch('http://localhost:8080/livros', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (res.ok) {
    Swal.fire({ icon: 'success', title: 'Livro cadastrado!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
    carregarLivros();
  } else {
    Swal.fire({ icon: 'error', title: 'Erro ao cadastrar!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
  }
}

async function deletarLivro(id) {
  const confirm = await Swal.fire({
    icon: 'warning',
    title: 'Deletar livro?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
    background: '#1a1a1a',
    color: '#fff',
    confirmButtonColor: '#e05555'
  });

  if (confirm.isConfirmed) {
    await fetch(`http://localhost:8080/livros/${id}`, { method: 'DELETE', headers });
    carregarLivros();
  }
}

function sair() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

carregarLivros();