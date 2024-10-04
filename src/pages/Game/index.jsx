// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Config JSON:
import config from '../../../public/configApp.json';

// Components:
// import { TelaHorario } from '../../components/TelaHorario/TelaHorario'
import { AframeGame } from '../../components/aframe-game';
import confetti from 'canvas-confetti';
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoHeader from '../../assets/logo-header.png';
import MaoInstrucao from '../../assets/mao-instrucao.png';
import ConstelacaoInstrucao from '../../assets/constelacao-instrucao.png';
import MotoStart from '../../assets/moto-start.png';

// Estilo:
// import './style.css';


export default function Game() {
    const [jogoLiberado, setJogoLiberado] = useState(true);
    const [statusPermissoes, setStatusPermissoes] = useState('');

    const [enableGame, setEnableGame] = useState(true);
    const [startGame, setStartGame] = useState(false);

    const BASE_URL = config.base_url;
    console.log(BASE_URL);
    const navigate = useNavigate();
    const hasVoucher = Cookies.get('voucher99');
    const horaInicial = config.hora_inicio;
    const horaTermino = config.hora_termino;


    
    const acaoFimJogo = useCallback(() => {
        //confetti
        var defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
        };
        
        function shoot() {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ['star']
            });
            
            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ['circle']
            });
        }
        
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
        //confetti
        
        setTimeout(()=> navigate('/voucher'), 1000);
    }, [navigate]);

    const verificaPermissoes = useCallback((e) => {
        console.log('EVENTOOO', e.detail);
        if(e.detail.orientacao == "Permitida" && e.detail.localizacao == "Permitida") {
            let status = 'permissao-minima';

            if(e.detail.camera == "Permitida") {
                status = 'permissao-total';
            }

            console.log(e.detail.camera == "Permitida" ? 'PERMISSAO TOTAL' : 'PERMISSAO MINIMA');
            setStatusPermissoes(status);
        } 
        else {
            console.log('PERMISSOES INSUFICIENTES');
            if(e.detail.orientacao == "Negada") {
                setStatusPermissoes('negada');
            }
            else {
                setStatusPermissoes('geo negada');
            }
        }
        // else {
        //     //logica caso não siga quando orientacao e camera for negadas
        // }
    }, []);

    const initListenerEvents = useCallback(()=> {
        console.log('useCallback initListenerEvents');

        const handleIframeMessage = (event)=> {
            // Filtra a origem da mensagem por questões de segurança
            if(event.origin !== BASE_URL) {
                return;
            }

            if(event.data == 'ACABOU') {
                console.log('Mensagem recebida do iframe:', event.data);
                acaoFimJogo();
            }
        };
        // Escuta as mensagens enviadas do iframe
        window.addEventListener('message', handleIframeMessage);
        
        // Adiciona o listener no documento
        document.addEventListener("fimJogo", acaoFimJogo); //// achou estrela solitaria
        document.addEventListener("permissaoStatus", verificaPermissoes);

    
        // Limpa o listener quando o componente desmontar
        return () => {
            window.removeEventListener('message', handleIframeMessage);
            document.removeEventListener("permissaoStatus", verificaPermissoes);
        };
    }, [acaoFimJogo, verificaPermissoes, BASE_URL]);

    useEffect(()=> {
        function verificacaoInicial() {
            console.log('Effect /Game');

            // if(!hasVoucher) {
            //     const atual = new Date(); //cria uma nova instância do objeto Date 
            //     const horaAtual = atual.getHours();
            //     // const minutoAtual = atual.getMinutes();
            //     console.log(horaAtual);
                
            //     if(horaAtual < horaInicial && horaAtual >= horaTermino) {
            //         console.log('BLOQUEIA');
            //         setJogoLiberado(false);
            //     }
            // }
            // else {
            //     console.log('rota /voucher');
            // }
        }
        verificacaoInicial();
    }, [hasVoucher, horaInicial, horaTermino]);



    function handleEntrarGame() 
    {
        if(jogoLiberado) {
            initListenerEvents();
            setEnableGame(true);
        }
        else {
            initListenerEvents();
            setEnableGame(true);
            ////setShowTelaBloqueio(true);
        }
    }

    function handleStartGame() 
    {
        if(statusPermissoes == 'permissao-minima' || statusPermissoes == 'permissao-total') {
            console.log('Começa o jogo!');
            setStartGame(true);
        }

        if(statusPermissoes == 'negada') {
            console.log('Permissão de movimento/orientação do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
            alert('Permissão de movimento e/ou localização do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
        }
        if(statusPermissoes == 'geo negada') {
            console.log('Permissão de localização foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
            alert('Permissão de localização foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
        }
    }

    


    return (
        <main className='Page Home'>

            {!startGame && 
            <div className={`Welcome ${enableGame} grid ${statusPermissoes}`}>
                <div className="bg-welcome">
                    {/* <img src={BgApp} alt="" /> */}
                </div>
                
                <div className="top">
                    <img src={LogoHeader} alt="Logo da campanha" />
                </div>

                <div className='mid'>
                    <p>Aponte o <br /> dispositivo pra cima.</p>

                    <img src={MaoInstrucao} alt="" />

                    <div className="text-constelacao">
                        <p>
                            Quando achar  a constelação
                            <span> guie a moto  pelos pontos.</span>
                        </p>

                        <img src={ConstelacaoInstrucao} alt="" />
                    </div>
                </div>

                <div className='bottom' onClick={handleStartGame}>
                    <img src={MotoStart} alt="" />
                    <p>Começar</p>
                </div>                
            </div>
            }

            {enableGame &&
            <AframeGame startGame={startGame} setStartGame={setStartGame} statusPermissoes={statusPermissoes} />
            }  
                  
        </main>
    )
}