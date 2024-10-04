// Hooks / Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import 'aframe';
import 'aframe-look-at-component';

// Script A-frame customizados:
// import '../../aframe/aframeComponents';

// import { toast } from "react-toastify";

// Config JSON:
import config from '../../../public/configApp.json';

// Assets:
import starImage from '../../assets/Estrela.png';
import bgFake from '../../assets/360-image.jpg';
import miraMoto from '../../assets/mira-moto.png';
import setaMoto from '../../assets/seta-guia.png';
import logoHeader from '../../assets/logo-header.png';

// Estilo:
import './aframeGame.css';


export function AframeGame({ startGame, setStartGame }) {
    // const iframeRef = useRef(null);
    const IFRAME_URL = config.dominio_iframe;


    useEffect(()=> {
        console.log('Effect AframeGame.jsx');

        if(!AFRAME.components['detect-start-game']) 
        {
        AFRAME.registerComponent('detect-start-game', {
            schema: { type: 'boolean' },

            init: function() {
                // console.log(this.data)
                this.el.addEventListener("mouseenter", ()=> this.initGame());  
                
                document.addEventListener("permissaoStatus", (e)=> {
                    if(e.detail.orientacao == "Permitida" && e.detail.localizacao == "Permitida") {
                        setTimeout(()=> this.el.classList.add('collidable'), 4000);
                    }
                    //// else {
                    //     setTimeout(()=> alert('Permissão de movimento e/ou localização do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ative o acesso.'), 8000);
                    // }
                });
            },

            initGame: function() {
                if(this.data) {
                    console.log('START GAME COM MOVIMENTO');
                    setStartGame(true); 

                    this.el.setAttribute('detect-start-game', 'false');
                }
            },
        });
        }
    }, []);

    // useEffect(()=> {
    //     // console.log('postttt')
    //     async function postGeolocationAPI() {
    //         if(statusPermissoes == 'permissao-minima' || statusPermissoes == 'permissao-total') {
    //             console.log('postttt')
    //             const today = new Date();
    //             const month = today.getMonth() + 1;
    //             const year = today.getFullYear();
    //             const date = today.getDate();
    //             const hours = today.getHours();
    //             const minutes = today.getMinutes();
    //             const seconds = today.getSeconds();

    //             const currentDate = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
    //             const hoursFormated = currentDate.split(' ');
    //             const hoursFinal = hoursFormated[1];
                
    //             let { latitude, longitude } = JSON.parse(hasGeoLocation);
                

    //             if(latitude !== "" && longitude !== "" && currentDate !== "") {               
    //                 const response = await USER_COORDINATES(latitude, longitude, currentDate);
    //                 console.log(response);
                
    //                 if(hoursFinal < '17:45:00') {
    //                     console.log('fora do horário de participação');
    //                 }
                    
    //                 if(response.success === false) {
    //                     console.log('Erro: ', response.message);
    //                     console.log('ID do Usuário: ', response.idUser);
    //                     return; // Aqui estava faltando
    //                 }
                
    //                 if(response.success === true) {
    //                     console.log('Requisição bem-sucedida.');
    //                     console.log('ID do Usuário: ', response.idUser);
                
    //                     // Usando o idUser corretamente no navigate
    //                     const idUser = response.idUser;
    //                     // navigate(`/get-vouchers/${idUser}`);
    //                 }
    //             }
    //         }
    //         else {
    //             console.log('SEM LOCALIZAÇÃO PARA ENVIAR PARA API');
    //         }
    //     }
    //     postGeolocationAPI();
    // }, [hasGeoLocation, statusPermissoes]);



    return (
        <div className="Aframe-game">
            {/* <div className="bg-not-camera"> */}
                {/* <img src={BgApp} alt="" /> */}
            {/* </div> */}

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


            {/* iframe mini-game drag and drop */}
            {/* <iframe
                src={IFRAME_URL}
                loading="eager"
            >
            </iframe> */}
            {/* iframe mini-game drag and drop */}


            <div className={`rodape ${!startGame ? 'hidden' : ''}`}>
                <img src={logoHeader} alt="" />
            </div>

        </div>
    )
}