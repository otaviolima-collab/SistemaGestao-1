const bcrypt = require('bcryptjs');
const fs = require('fs');

async function criar() {
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const senhaUser = await bcrypt.hash('user123', 10);

  const usuarios = [
    {
      id: 1,
      nome: 'Administrador',
      email: 'admin@sistema.com',
      senha: senhaAdmin,
      perfil: 'admin'
    },
    {
      id: 2,
      nome: 'Usuário Comum',
      email: 'usuario@sistema.com',
      senha: senhaUser,
      perfil: 'usuario'
    }
  ];

  fs.writeFileSync('./data/usuarios.json', JSON.stringify(usuarios, null, 2));
  console.log('Usuários criados com sucesso!');
  console.log('Admin → admin@sistema.com / admin123');
  console.log('User  → usuario@sistema.com / user123');
}

criar();