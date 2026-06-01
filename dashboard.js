const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

async function carregarDados() {
  const [usuarios, livros, emprestimos] = await Promise.all([
    fetch('http://localhost:8080/usuarios', { headers }).then(r => r.json()),
    fetch('http://localhost:8080/livros', { headers }).then(r => r.json()),
    fetch('http://localhost:8080/emprestimos', { headers }).then(r => r.json())
  ]);

  document.getElementById('totalUsuarios').textContent = usuarios.length;
  document.getElementById('totalLivros').textContent = livros.length;
  document.getElementById('totalEmprestimos').textContent = emprestimos.filter(e => !e.devolvido).length;

  const pendentes = emprestimos.filter(e => !e.devolvido);
  const tbody = document.getElementById('tabelaPendentes');

  if (pendentes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhuma devolução pendente</td></tr>';
    return;
  }

  tbody.innerHTML = pendentes.map(e => `
    <tr>
      <td>${e.usuario.nome}</td>
      <td>${e.livro.titulo}</td>
      <td>${e.dataEmprestimo}</td>
      <td>${e.dataDevolucao}</td>
    </tr>
  `).join('');
}

function sair() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

carregarDados();