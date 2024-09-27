// Hooks / Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Components:
import { AframeGame } from '../../components/aframe-game';
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoBig from '../../assets/logoBig.png';

// Estilo:
import './style.css';


export default function Home() {
    const lastStep = 3;
    const [step, setStep] = useState(1);
    const [animateMode, setAnimateMode] = useState('');

    const [enableGame, setEnableGame] = useState(false);
    const [startGame, setStartGame] = useState(false);

    const navigate = useNavigate();

    // const tokenCookie = Cookies.get('userToken');

    
    useEffect(()=> {
        async function carregaProjetos()
        {
            console.log('Effect /home');

            // Adiciona o listener ao clicar no documento
            document.addEventListener("fimJogo", ()=> setTimeout(()=> navigate('/result'), 1000));
        
            // Limpa o listener quando o componente desmontar
            return () => {
                document.removeEventListener("fimJogo", ()=> setTimeout(()=> navigate('/result'), 1000));
            };
        }
        carregaProjetos();
    }, [navigate]);


    function handleBackStep() {
        if(step > 1) {
            setAnimateMode('fadeInLeft');
            setStep(step => step - 1);

            // limpa a animação depois de 600ms
            setTimeout(()=> setAnimateMode(''), 600); 
        }
    }
    function handleNextStep() { 
        if(step < lastStep) {
            setAnimateMode('fadeInRight');
            setStep(step => step + 1);

            // limpa a animação depois de 600ms
            setTimeout(()=> setAnimateMode(''), 600);    
        }
        if(step == 2) {
            setEnableGame(true);
        }
        if(step == lastStep) {
            console.log('Começa o jogo!');
            setStartGame(true);
        }    
    }
    


    return (
        <main className='Page Home'>

            {!startGame &&
            <div className="Welcome grid">
                <div className="top">
                    <img className={step == 1 ? 'hidden' : ''} src={LogoBig} alt="Logo da campanha" />
                </div>

                <div className={`mid ${animateMode}`}>
                    {step == 1 ? (

                    <h1>
                        Sabia que tem muitos vouchers de 99moto espalhados <br /> nas estrelas?
                    </h1>

                    ) : (
                    step == 2 ? (

                    <h1>
                        Para celebrar <br /> 1 bilhão <br /> de corridas, espalhamos vouchers em <br /> 1 bilhão <br /> de estrelas.
                    </h1>

                    ) : (

                    <h1>
                        Aponte <br /> seu dispositivo para cima <br /> e procure.
                    </h1>

                    )
                    )}
                </div>

                <div className={`bottom ${animateMode}`}>
                    {step == 1 ? (

                    <p>Aponte o celular para o céu <br /> e capture o seu.</p>

                    ) : (
                    step == 2 ? (

                    <p>Explore o céu <br /> e capture o seu.</p>

                    ) : (

                    <p>Quando encontrar, <br /> é só conduzir a moto <br /> pelos pontos sinalizados <br /> para capturar.</p>

                    )
                    )}
                </div>

                {/* Controle de steps */}
                <div className="controls">
                    <div className='back' onClick={handleBackStep}>
                        {step > 1 && <i className="bi bi-chevron-compact-left"></i>}
                    </div>
                    <div className='next' onClick={handleNextStep}>
                        {step < 3 && <i className={`bi bi-chevron-compact-right ${step == 1 ? 'movendoRight' : ''}`}></i>}
                    </div>
                </div>
            </div>
            }

            {enableGame &&
            <AframeGame startGame={startGame} setStartGame={setStartGame} /> 
            }  
                  
        </main>
    )
}