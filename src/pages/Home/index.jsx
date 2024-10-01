// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Components:
import { AframeGame } from '../../components/aframe-game';
import confetti from 'canvas-confetti';
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoBig from '../../assets/logoBig.png';
import LogoHeader from '../../assets/logo-header.png';
import MaoInstrucao from '../../assets/mao-instrucao.png';
import ConstelacaoInstrucao from '../../assets/constelacao-instrucao.png';
import MotoStart from '../../assets/moto-start.png';

// Estilo:
import './style.css';


export default function Home() {
    // const [animateMode, setAnimateMode] = useState('');
    const [statusPermissoes, setStatusPermissoes] = useState('');

    const [enableGame, setEnableGame] = useState(false);
    const [startGame, setStartGame] = useState(false);

    const navigate = useNavigate();

    // const tokenCookie = Cookies.get('userToken');

    
    const acaoFimJogo = useCallback(() => {
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
        
        setTimeout(()=> navigate('/result'), 1000);
    }, [navigate]);

    const verificaPermissoes = useCallback((e) => {
        if(e.detail.orientacao == "Permitida") {
            let status = 'permissao-minima';

            if(e.detail.camera == "Permitida") {
                status = 'permissao-total';
            }

            setStatusPermissoes(status);
        } 
        else {
            setStatusPermissoes('negada');
        }
        // else {
        //     //logica caso não siga quando orientacao e camera for negadas
        // }
    }, []);

    useEffect(()=> {
        async function initHome()
        {
            console.log('Effect /home');

            // Adiciona o listener no documento
            document.addEventListener("orientacaoStatus", verificaPermissoes);
            document.addEventListener("fimJogo", acaoFimJogo);

            // document.addEventListener('click', ()=> {
            //     // function requestFullScreen() {
            //         const elem = document.documentElement;
                  
            //         if(elem.requestFullscreen) {
            //           elem.requestFullscreen();
            //         } else if(elem.mozRequestFullScreen) { // Firefox
            //           elem.mozRequestFullScreen();
            //         } else if(elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
            //           elem.webkitRequestFullscreen();
            //         } else if(elem.msRequestFullscreen) { // IE/Edge
            //           elem.msRequestFullscreen();
            //         }
            //     //   }
                  
            // })
        
            // Limpa o listener quando o componente desmontar
            return () => {
                document.removeEventListener("orientacaoStatus", verificaPermissoes);
                document.removeEventListener("fimJogo", acaoFimJogo);
            };
        }
        initHome();
    }, [acaoFimJogo, verificaPermissoes]);


    function handleEntrarGame() 
    { 
        setEnableGame(true);
    }

    function handleStartGame() 
    {
        if(statusPermissoes == 'permissao-minima' || statusPermissoes == 'permissao-total') {
            console.log('Começa o jogo!');
            setStartGame(true);
        }

        if(statusPermissoes == 'negada'){
            alert('Permissão de movimento foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ative o acesso aos sensores.');
        }
    }

    


    return (
        <main className='Page Home'>

            {!startGame && (
                
            <div className={`Welcome ${enableGame} grid ${statusPermissoes}`}>
                <div className="bg-welcome">
                    {/* <img src={BgApp} alt="" /> */}
                </div>


                {!enableGame ? (

                <>
                <div className="top">
                    <img src={LogoBig} alt="Logo da campanha" />
                </div>

                <div className='mid'>
                    <h2>Para celebrar <br /> 1 Bilhão de corridas, <br /> <span>espalhamos vouchers  nas estrelas</span></h2>

                    <button className='btn-primary' onClick={handleEntrarGame}>Entrar</button>
                </div>

                <div className='bottom'>
                    <p>Explore o céu <br /> e capture o seu.</p>
                </div>                        
                </>

                ) : (

                <>
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
                </>

                )}
            </div>

            )}

            {enableGame &&
            <AframeGame startGame={startGame} setStartGame={setStartGame} /> 
            }  
                  
        </main>
    )
}