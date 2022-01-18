import './modal.css';
import {FiX} from 'react-icons/fi'
 

export default function Modal({conteudo, close}){
    return(
    <div className='modal'>
        <div className='conteiner'>
            <button className='close'>
                <FiX size={23} color='#FFF'onClick={close}/>
                Voltar
            </button>

            <div>
                <h2>Detalhes do chamado</h2>

                <div className='row'>
                    <span>
                        Cliente: <a>{conteudo.cliente}</a>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Assunto: <a>{conteudo.assunto}</a>
                    </span>
                    <span>
                        Cadatrado em: <a>{conteudo.createdFormated}</a>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Status: <a style={{color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999'}}>{conteudo.status}</a>
                    </span>
                </div>

                {conteudo.complemento !== '' &&(
                    <>
                    <h3>Complemento</h3>
                    <p>
                        {conteudo.complemento}
                    </p>
                    </>
                )}

            </div>
        </div>
    </div>
    )
}
