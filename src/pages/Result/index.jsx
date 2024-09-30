// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Components:
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
// import LogoBig from '../../assets/logoBig.png';

// Estilo:
// import './style.css';


export default function Result() {
    

    const navigate = useNavigate();

    // const tokenCookie = Cookies.get('userToken');  


    return (
        <main className='Page Result'>
            <h1>Result</h1>
        </main>
    )
}