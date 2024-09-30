console.log('Arquivo components aframe');
import Cookies from "js-cookie";

const eventoFimJogo = new Event("fimJogo");
const eventoPermissoesPermitidas = new CustomEvent('orientacaoStatus', {
    detail: { orientacao: 'Permitida', camera: 'Permitida' }
});
const eventoApenasOrientacao = new CustomEvent('orientacaoStatus', {
    detail: { orientacao: 'Permitida', camera: 'Negada' }
});
const eventoPermissoesNegadas = new CustomEvent('orientacaoStatus', {
    detail: { orientacao: 'Negada', camera: 'Negada' }
});

AFRAME.registerComponent('init-permissions', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        // Editar modal de solicitação de permissões:
        // device-orientation-permission-ui="denyButtonText: Rejeitar; allowButtonText: Aceitar; deviceMotionMessage: Texto aqui"
        this.el.setAttribute('device-orientation-permission-ui', "allowButtonText: Entendi; deviceMotionMessage: Para seguir com a experiência é necessário permitir o acesso ao sensor de movimento/orientação e câmera do dispositivo.");

        // this.el.addEventListener('deviceorientationpermissionrequested', ()=> alert('Para seguir com a experiência é necessario autorizar acesso ao movimento e câmera do celular.'));
        // Mensagem quando o acesso for negado:
        this.el.addEventListener('deviceorientationpermissionrejected', ()=> {
            document.dispatchEvent(eventoPermissoesNegadas);
            alert('Status: Permissão de movimento foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
        });
        
        
        if(window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
        // Para iOS 13+:
            Cookies.set('device99', 'iphone', { expires: 7 });
            this.el.addEventListener('deviceorientationpermissiongranted', ()=> {
                // Verifica se as permissões de movimento foi consedido
                DeviceMotionEvent.requestPermission()
                .then(response => {
                    if(response === 'granted') {
                        // Permissão aceita
                        this.initCamera();
                    }
                    else {
                        // Permissão negada
                        ////Não seguir no jogo
                        document.dispatchEvent(eventoPermissoesNegadas);
                        alert('Foi negado o acesso ao movimento/orientação do dispositivo. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao solicitar a permissão:', error);
                });
            });
        }
        else {
        // Para dispositivos que não solicita permissão de deviceorientation:
            Cookies.set('device99', 'android', { expires: 7 });
            this.initCamera();
        }
    },
    
    initCamera: function() {
        const videoRef = document.getElementById('videoRef');
        const videoConstraints = {
            width: { min: 1440, ideal: 1920, max: 1920 },
            height: { min: 960, ideal: 1080, max: 1080 },
            aspectRatio: 16 / 9,
            facingMode: "environment"
        };
        
        // Verifica se o navegador suporta getUserMedia
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // try {
            //     const stream = await navigator.mediaDevices.getUserMedia({ video:videoConstraints });
            //     videoRef.srcObject = stream;
            //     videoRef.play();
            // } 
            // catch(error) {
            //     console.error('Erro ao acessar a câmera:', error);
            //     // Exibir uma mensagem amigável para o usuário
            //     alert('Não foi possível acessar a câmera. Para permitir o acesso, vá para as configurações do navegador e ative o acesso.');
            // }
            navigator.mediaDevices.getUserMedia({ video: videoConstraints })
                .then(stream => {
                    videoRef.srcObject = stream;
                    videoRef.play();
                    document.dispatchEvent(eventoPermissoesPermitidas);
                })
                .catch(error => {
                    console.error('Erro ao acessar a câmera: ', error);
                    // Exibir uma mensagem amigável para o usuário
                    document.dispatchEvent(eventoApenasOrientacao);
                    alert('Não foi possível acessar a câmera. Para permitir o acesso, vá para as configurações do navegador e ative o acesso (após isso atualize a página).');
                });
        } 
        else {
            console.error('getUserMedia não é suportado no navegador.');
        }
    }
});


AFRAME.registerComponent('set-stars', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        this.miraMoto = document.getElementById('mira-moto');
        this.setaMoto = document.getElementById('seta-moto');
        this.camera = document.getElementById('camera-target');
        var coordenadas = [
            {
                estrela1: { x: 31.34, y: 25.02, z: -11.58 },
                estrela2: { x: 24.070, y: 34.85, z: 11.36 },
                estrela3: { x: 10.48, y: 40.51, z: -8.327 },
                estrela4: { x: -12.27, y: 42.94, z: -15.55 },
                estrela5: { x: -24.17, y: 42.70, z: 7.30 }
            }
        ];
        // Escolher uma coordenada ativa aleatória
        var coordenadaAtiva = coordenadas[Math.floor(Math.random() * coordenadas.length)];

        // Seta as posições da Constelação e estrelas
        // this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
        
        // Loop pela array this.estrelas
        this.estrelas = this.el.children;
        for (let i = 0; i < this.estrelas.length; i++) {
            this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i + 1)].x, coordenadaAtiva['estrela' + (i + 1)].y, coordenadaAtiva['estrela' + (i + 1)].z);

            this.estrelas[i].setAttribute('look-at', '#camera-target');
            this.estrelas[i].addEventListener('mouseenter', (e) => this.collisionStar(e));
        }

        // Seta a estrela alvo do momento
        this.targetStar = 0;
        this.activeStar(this.targetStar);
    },

    tick: function (time, timeDelta) {
        // Controla seta guia estrelar
        // let local = this.estrelas[this.targetStar].object3D.getWorldPosition();
        let local = this.estrelas[this.targetStar].object3D.position.clone();
        // console.log(local);
        this.camera.object3D.worldToLocal(local);

        let angleDeg = Math.atan2(-local.y - 0, local.x - 0) * 180 / Math.PI + 180;
        angleDeg -= 90;
        
        this.setaMoto.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    },

    activeStar: function (numStar) {
        this.targetStar = numStar;
        this.estrelas[numStar].setAttribute('opacity', 1);
        this.estrelas[numStar].setAttribute('animation', 'property: scale; to: 2 2 1; dir: alternate; dur: 1000; easing: easeInOutQuad; loop: true');
    },

    collisionStar: function (e) {
        console.log(e.target.id);
        console.log(this.estrelas[this.targetStar].id);

        if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
            this.miraMoto.classList.add("animate-brilho");
            this.estrelas[this.targetStar].removeAttribute('animation');
            this.targetStar++;
            this.activeStar(this.targetStar);
            setTimeout(()=> this.miraMoto.classList.remove("animate-brilho"), 800);
        }
        if(e.target.id == 'star5' && this.estrelas[this.targetStar].id == 'star5') {
            // alert('fim de jogo');
            document.dispatchEvent(eventoFimJogo);
        }
    }
});