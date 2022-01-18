import {  useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext=createContext({});

function AuthProvider({children}){
const [user, setUser] = useState(null);
const [loadingAuth, setLoadingAuth] = useState(false);
const [loading, setoLoading] = useState(true);


        useEffect(()=>{

            function loadingStorage(){
            const storageUser= localStorage.getItem('SistemaUser')
    
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setoLoading(false);
            }
    
            setoLoading(false);
        }
    
        loadingStorage();
    
        },[])

        async function signIn(email, password){
            setLoadingAuth(true);
            await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async(value)=>{
                let uid = value.user.uid;

                const userProfile = await firebase.firestore().collection('users')
                .doc(uid).get();

                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    avatarUrl: userProfile.data().avatarUrl,
                    email: value.user.email
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem vindo de volta!');


            })
            
            .catch((error)=>{
                console.log(error);
                setLoadingAuth(false)
                toast.error('Ops! Algo deu errado!')
            })
        }

        async function SignUp(email, password, nome){
            setLoadingAuth(true);
            await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(async (value) => {
                    let uid = value.user.uid;

                    await firebase.firestore().collection('users')
                    .doc(uid).set({
                        nome: nome,
                        avatarUrl: null,
                    })
                    .then( ()=> {
                        let data = {
                            uid: uid,
                            nome: nome,
                            email: value.user.email,
                            avatarUrl: null
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Bem vindo a plataforma!');
                    })
               
                })
                .catch((error)=>{
                    console.log(error);
                    setLoadingAuth(false);
                    toast.error('Ops! Algo deu errado!')
        })
    }

        function storageUser(data){
            localStorage.setItem('SistemaUser', JSON.stringify(data));
        }

        async function signOut(){
            await firebase.auth().signOut();
            localStorage.removeItem('SistemaUser');
            setUser(null);
            toast.info('Até logo!')
        }

    return(
        <AuthContext.Provider 
        value={{ signed: !!user,
        user,
        loading,
        SignUp,
        signOut,
        signIn,
        loadingAuth,
        storageUser,
        setUser
           }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
