import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle} from 'react-icons/fi';
import './new.css';
import {useState, useEffect, useContext, useCallback} from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import {toast} from 'react-toastify';
import {useParams, useHistory, Link} from 'react-router-dom';

export default function New(){

    const {id} = useParams();
    const history = useHistory(); 

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const {user} = useContext(AuthContext);


    useEffect(()=>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=> {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                   // console.log('NENHUMA EMPRESA ENCONTRADA!');
                    setCustomers([{id: '1', nomeFantasia: 'FREELA'}]);
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);    
                setLoadCustomers(false);
                
                if(id){
                    loadId(lista);
                }

            })
            .catch((error)=>{
               // console.log(error);
                setLoadCustomers(false);
                setCustomers([{id: '1', nomeFantasia: ''}]);
            })

        }

        loadCustomers();
    }, []);

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);


        })
        .catch((error)=>{
            console.logo(error);
            setIdCustomer(false);
        })
    }


    function handleChangeCustomers(e){
        setCustomerSelected(e.target.value);
        
    }

    function handleOptinChange(e){
        setStatus(e.target.value);
       // console.log(e.target.target);

    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado editado com sucesso!');
                setComplemento('');
                setCustomerSelected(0);
                history.push('/dashboard');
            })
            .catch((error)=>{
                console.log(error);
                toast.error('Ops! Erro ao editar a solicitação. Tente mais tarde!')
            })
            return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado criado com sucesso!');
            setCustomerSelected(0);
            setComplemento('');
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops! Algo deu errado!')
        })
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value);
        //console.log(e.target.value);
    }



    return(
        <div>
            <Header/>
            <div className='content'>
            <Title name={'Novo chamado'}>
                <FiPlusCircle size={25}/>

            </Title>

            <div className='conteiner'>

                <form className='form-profile' onSubmit={handleRegister}>
                    <label>Clientes</label>

                    {loadCustomers ? (
                        <input type="text" disabled={true} value="Carregando clientes..."/>
                    ) : (
                        <select value={customerSelected} onChange={handleChangeCustomers}>
                        {customers.map((item, index)=>{
                            return(
                            <option key={item.id} value={index}>
                              {item.nomeFantasia}      
                            </option>
                            )
                        })}

                    </select>

                    )   
                }


                    <label>Assunto</label>
                    <select value={assunto} onChange={handleChangeSelect}>
                        <option value="Suporte">Suporte</option>
                        <option value="Visita Tecnica">Visita Técnica</option>
                        <option value="Financeiro">Financeiro</option>
                    </select>

                    <label>Status</label>
                    <div className='status'>
                        <input type="radio" name="radio" value="Aberto" onChange={handleOptinChange} checked={status === 'Aberto'}/>
                        <span>Em aberto</span>
                        
                        <input type="radio" name="radio" value="Progresso" onChange={handleOptinChange} checked={status === 'Progresso'}/>
                        <span>Em Progresso</span>

                        <input type="radio" name="radio" value="Finalizado" onChange={handleOptinChange} checked={status === 'Finalizado'}/>
                        <span>Finalizado</span>

                    </div>

                    <label>Complemento</label>
                    <textarea type="text" placeholder='Descreva seu problema (opcional)' value={complemento} onChange={(e)=> setComplemento(e.target.value)}/>

                    <button type='submit'>Registrar</button>
                </form>

            </div>


            </div>
            
        </div>
    )
}