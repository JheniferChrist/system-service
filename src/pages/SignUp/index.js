import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/auth';

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { SignUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(nome !== '' && password !== '' && email !== ''){
      SignUp(email, password, nome)
    }

  }

    return (
      <div className="conteiner">
        <div className="login">

          <div className="logo-area">
            <img src={logo} alt="Logo do sistema"/>
          </div>

          <form onSubmit={handleSubmit}>
            <h1>Cadastrar uma nova conta</h1>
            <input type="text" placeholder='Seu nome e sobrenome' value={nome} onChange={(e) => setNome(e.target.value)}/>
            <input type="text" placeholder='email@email.com.br' value={email} onChange={(e) => setEmail(e.target.value) }/>
            <input type="password" placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
          </form>

          <Link to="/">Já possui conta? Entre</Link>
        </div>
       
      </div>
    );
  }
  
  export default SignUp;