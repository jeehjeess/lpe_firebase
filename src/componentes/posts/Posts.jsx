import { useState, useEffect } from 'react';
import Tabela from './Tabela';
import PostsContext from './PostsContext';
import Formulario from './Formulario';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, addDoc, collection, query, onSnapshot, updateDoc, deleteDoc, where } from "firebase/firestore";

function Predios() {

    const [user, loading, error] = useAuthState(auth);

    const [listaObjetos, setListaObjetos] = useState([]);

    const [alerta, setAlerta] = useState({ status: "", message: "" });

    const [objeto, setObjeto] = useState({
        id: "", titulo: "", texto: "",
        uid: user?.uid, usuario: user?.displayName, email: user?.email
    });

    const novoObjeto = () => {
        setObjeto({
            id: 0, titulo: "", texto: "",
            uid: user?.uid, usuario: user?.displayName, email: user?.email
        });
    }

    useEffect(() => {
        if (user?.uid != null) {
            const uid = user?.uid;
            const colRef = collection(db, "posts");
            const q = query(colRef, where("uid", "==", uid))
            onSnapshot(q, (querySnapshot) => {
                setListaObjetos(querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    texto: doc.data().texto,
                    usuario: doc.data().usuario,
                    email: doc.data().email,
                    uid: doc.data().uid
                })))
            })
        }

    }, [user]);

    const [editar, setEditar] = useState(false);

    const acaoCadastrar = async (e) => {
        e.preventDefault();
        if (editar) {
            try {
                const postDocRef = doc(db, 'posts', objeto.id)
                await updateDoc(postDocRef, {
                    titulo: objeto.titulo,
                    texto: objeto.texto,
                    uid: objeto.uid,
                    usuario: objeto.usuario,
                    email: objeto.email
                })
                setAlerta({ status: "success", message: "Post atualizado com sucesso" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao atualizar o POST:" + err });
            }
        } else { // novo 
            try {
                addDoc(collection(db, 'posts'),
                    {
                        titulo: objeto.titulo,
                        texto: objeto.texto,
                        uid: objeto.uid,
                        usuario: objeto.usuario,
                        email: objeto.email
                    }).then(function (docRef) {
                        setObjeto({ ...objeto, id: docRef.id });
                    })
                setEditar(true);
                setAlerta({ status: "success", message: "Post criado com sucesso" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao criar o POST:" + err });
            }
        }
    };

    const acaoRemover = async (objeto) => {
        if (window.confirm("Remover este objeto?")) {
            try {
                const postDocRef = doc(db, 'posts', objeto.id)
                await deleteDoc(postDocRef);
                setAlerta({ status: "success", message: "Post removido com sucesso!" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao  remover: " + err });
            }

        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    return (
        <PostsContext.Provider value={
            {
                listaObjetos, setListaObjetos, acaoRemover,
                alerta, setAlerta,
                objeto, setObjeto,
                editar, setEditar,
                acaoCadastrar, handleChange, novoObjeto
            }}>
            <Tabela />
            <Formulario />
        </PostsContext.Provider>
    );
}

export default Predios;