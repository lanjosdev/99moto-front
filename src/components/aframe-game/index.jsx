// Hooks / Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import 'aframe';
import 'aframe-look-at-component';

// Script A-frame customizados:
import '../../aframe/aframeComponents';

// Assets:
import starImage from '../../assets/Estrela.png';
import bgFake from '../../assets/360-image.jpg';
import miraMoto from '../../assets/mira-moto.png';
import setaMoto from '../../assets/seta-guia.png';
import logoHeader from '../../assets/logo-header.png';

// Estilo:
import './style.css';


export function AframeGame({ startGame, setStartGame }) {
    // const [startGame, setStartGame] = useState(false);
    // const iframeRef = useRef(null);


    useEffect(()=> {
        AFRAME.registerComponent('detect-start-game', {
            schema: { type: 'boolean' },

            init: function() {
                // console.log(this.data)
                this.el.addEventListener("mouseenter", ()=> this.initGame());  
                
                document.addEventListener("orientacaoStatus", (e)=> {
                    if(e.detail.orientacao == "Permitida") {
                        setTimeout(()=> this.el.classList.add('collidable'), 4000);
                    }
                    else {
                        setTimeout(()=> alert('Permissão de movimento foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ative o acesso aos sensores.'), 8000);
                    }
                });
            },

            initGame: function() {
                if(this.data) {
                    setStartGame(true); 
                    console.log('START GAME');

                    this.el.setAttribute('detect-start-game', 'false');
                }
            },
        });

        // const elm = entityRef.current;
        // // Adiciona o listener ao clicar no documento
        // elm.addEventListener("mouseenter", (e) => console.log(e.target));
    
        // // Limpa o listener quando o componente desmontar
        // // return () => {
        // //     elm.removeEventListener("mouseenter", alerta);
        // // };
    }, []);


    return (
        <div className="Aframe-game">

            <video id='videoRef' autoPlay playsInline></video>

            <a-scene init-permissions>
                {/* Gerenciador de arquivos  */}
                <a-assets>
                    <img id="starTexture" src={starImage} />
                    <img id="bgTexture" src={bgFake} />
                </a-assets>
                {/* Gerenciador de arquivos  */}


                {/* Entidades da cena */}
                <a-camera id="camera-target" look-controls="reverseMouseDrag: true">
                    <a-cursor color="red" raycaster="far: 100; objects: .collidable;" visible="false"></a-cursor>
                </a-camera>


                {!startGame ? (

                <a-entity geometry="primitive: circle" position="0 7 0" visible="false" scale="25 25 1" rotation="90 0 0" detect-start-game></a-entity>

                ) : (

                <a-entity className="constelacao" position="0 0 0" visible="true" set-stars>
                    <a-image id="star1" class="collidable" src="#starTexture" width="5.5" height="5.5" opacity="0.2"></a-image>
                
                    <a-image id="star2" class="collidable" src="#starTexture" width="5.5" height="5.5" opacity="0.2"></a-image>

                    <a-image id="star3" class="collidable" src="#starTexture" width="5.5" height="5.5" opacity="0.2"></a-image>

                    <a-image id="star4" class="collidable" src="#starTexture" width="5.5" height="5.5" opacity="0.2"></a-image>

                    <a-image id="star5" class="collidable" src="#starTexture" width="5.5" height="5.5" opacity="0.2"></a-image>
                </a-entity>

                )}
                {/* Entidades da cena */}


                {/* <a-sky
                src="#bgTexture"
                >
                </a-sky> */}
                
            </a-scene>

            <div className={`text-mira ${!startGame ? 'hidden' : ''}`}>
                {startGame && <p className='invisible'>Siga a seta</p>}

                <div className='mira-container'>
                    {/* <div class="mira-seta"> */}
                        <img id="mira-moto" src={miraMoto} alt="" />
                        <img id="seta-moto" src={setaMoto} alt="" />
                    {/* </div> */}
                </div>
            </div>

            <iframe
                src="https://10.10.0.221:5173/drag/"
                loading="eager"
            >
            </iframe>

            <div className={`rodape ${!startGame ? 'hidden' : ''}`}>
                <img src={logoHeader} alt="" />
            </div>

        </div>
    )
}