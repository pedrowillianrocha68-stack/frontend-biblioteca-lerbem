const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

async function carregarUsuarios() {
  const res = await fetch('http://localhost:8080/usuarios', { headers });
  const usuarios = await res.json();
  const tbody = document.getElementById('tabelaUsuarios');

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhum usuário cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.cpf}</td>
      <td>${u.telefone}</td>
      <td><button onclick="deletarUsuario(${u.idUsuario})">🗑️</button></td>
    </tr>
  `).join('');
}

async function cadastrarUsuario() {
  const body = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpf: document.getElementById('cpf').value,
    telefone: document.getElementById('telefone').value,
    endereco: document.getElementById('endereco').value,
    senha: document.getElementById('senha').value
  };

  const res = await fetch('http://localhost:8080/usuarios', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (res.ok) {
    Swal.fire({ icon: 'success', title: 'Cadastrado!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
    carregarUsuarios();
  } else {
    Swal.fire({ icon: 'error', title: 'Erro ao cadastrar!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
  }
}

async function deletarUsuario(id) {
  const confirm = await Swal.fire({
    icon: 'warning',
    title: 'Deletar usuário?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
    background: '#1a1a1a',
    color: '#fff',
    confirmButtonColor: '#e05555'
  });

  if (confirm.isConfirmed) {
    await fetch(`http://localhost:8080/usuarios/${id}`, { method: 'DELETE', headers });
    carregarUsuarios();
  }
}

function sair() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

carregarUsuarios();