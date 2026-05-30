async function fazerLogin() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const resposta = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usuario, password: senha })
  });

  if (resposta.ok) {
    const dados = await resposta.json();
    localStorage.setItem('token', dados.token);

    await Swal.fire({
      icon: 'success',
      title: 'Bem-vindo!',
      text: 'Login realizado com sucesso',
      background: '#1a1a1a',
      color: '#fff',
      confirmButtonColor: '#c9a84c',
      timer: 1500,
      showConfirmButton: false
    });

    window.location.href = 'dashboard.html';

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Usuário ou senha inválidos',
      background: '#1a1a1a',
      color: '#fff',
      confirmButtonColor: '#c9a84c'
    });
  }
}
