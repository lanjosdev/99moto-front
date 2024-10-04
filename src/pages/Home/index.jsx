// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Config JSON:
import config from '../../../public/configApp.json';

// Components:
// import { TelaHorario } from '../../components/TelaHorario/TelaHorario'
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoBig from '../../assets/logoBig.png';
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './style.css';


export default function Home() {
    const [jogoLiberado, setJogoLiberado] = useState(true);

    const navigate = useNavigate();
    const hasVoucher = Cookies.get('voucher99');
    const horaInicial = config.hora_inicio;
    const horaTermino = config.hora_termino;



    useEffect(()=> {
        function verificacaoInicial() {
            console.log('Effect /Home');

            if(!hasVoucher) {
                const atual = new Date(); //cria uma nova instância do objeto Date 
                const horaAtual = atual.getHours();
                // const minutoAtual = atual.getMinutes();
                console.log(horaAtual);
                
                if(horaAtual < horaInicial && horaAtual >= horaTermino) {
                    console.log('BLOQUEIA');
                    setJogoLiberado(false);
                }
            }
            else {
                console.log('rota /voucher');
            }
        }
        verificacaoInicial();
    }, [hasVoucher, horaInicial, horaTermino]);



    function handleEntrarGame() 
    {
        navigate('/game');
        if(jogoLiberado) {
            //aqui é navigate(/game)
        }
        else {
            ////setShowTelaBloqueio(true);
        }
    }  


    return (
        <main className='Page Home'>

            <div className='Welcome grid'>
                <div className="bg-welcome">
                    {/* <img src={BgApp} alt="" /> */}
                </div>

                <div className="top">
                    <img src={LogoBig} alt="Logo da campanha" />
                </div>

                <div className='mid'>
                    <h2>Para celebrar <br /> 1 Bilhão de corridas, <br /> <span>espalhamos vouchers  nas estrelas</span></h2>

                    <button className='btn-primary' onClick={handleEntrarGame}>Entrar</button>
                    <a href="/game">Entrar</a>
                </div>

                <div className='bottom'>
                    <p>Explore o céu <br /> e capture o seu.</p>
                </div>                        
            </div>
                  
        </main>
    )
}