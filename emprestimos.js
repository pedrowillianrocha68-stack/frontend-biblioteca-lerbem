const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

async function carregarSelects() {
  const [usuarios, livros] = await Promise.all([
    fetch('http://localhost:8080/usuarios', { headers }).then(r => r.json()),
    fetch('http://localhost:8080/livros', { headers }).then(r => r.json())
  ]);

  const selectUsuario = document.getElementById('usuarioId');
  usuarios.forEach(u => {
    selectUsuario.innerHTML += `<option value="${u.idUsuario}">${u.nome}</option>`;
  });

  const selectLivro = document.getElementById('livroId');
  livros.filter(l => l.disponivel).forEach(l => {
    selectLivro.innerHTML += `<option value="${l.idLivro}">${l.titulo}</option>`;
  });
}

async function carregarEmprestimos() {
  const res = await fetch('http://localhost:8080/emprestimos', { headers });
  const emprestimos = await res.json();
  const tbody = document.getElementById('tabelaEmprestimos');

  if (emprestimos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Nenhum empréstimo registrado</td></tr>';
    return;
  }

  tbody.innerHTML = emprestimos.map(e => `
    <tr>
      <td>${e.usuario.nome}</td>
      <td>${e.livro.titulo}</td>
      <td>${e.dataEmprestimo}</td>
      <td>${e.dataDevolucao}</td>
      <td>${e.devolvido ? '✅ Devolvido' : '⏳ Pendente'}</td>
      <td>
        ${!e.devolvido ? `<button onclick="devolver(${e.idEmprestimo})">Devolver</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function cadastrarEmprestimo() {
  const body = {
    usuario: { idUsuario: document.getElementById('usuarioId').value },
    livro: { idLivro: document.getElementById('livroId').value },
    dataEmprestimo: document.getElementById('dataEmprestimo').value,
    dataDevolucao: document.getElementById('dataDevolucao').value,
    devolvido: false
  };

  const res = await fetch('http://localhost:8080/emprestimos', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (res.ok) {
    Swal.fire({ icon: 'success', title: 'Empréstimo registrado!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
    carregarEmprestimos();
    carregarSelects();
  } else {
    Swal.fire({ icon: 'error', title: 'Erro ao registrar!', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#c9a84c' });
  }
}

async function devolver(id) {
  const confirm = await Swal.fire({
    icon: 'question',
    title: 'Confirmar devolução?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
    background: '#1a1a1a',
    color: '#fff',
    confirmButtonColor: '#c9a84c'
  });

  if (confirm.isConfirmed) {
    await fetch(`http://localhost:8080/emprestimos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ devolvido: true })
    });
    carregarEmprestimos();
  }
}

function sair() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

carregarSelects();
carregarEmprestimos();