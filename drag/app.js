const msgPost = 'ACABOU';

AFRAME.registerComponent('teste', {
    schema: {},

    init: function () {
        console.log('Iframe Drag');
        
        this.fim = false;
        this.moto = document.querySelector('[click-drag]');
        this.seta = document.querySelector('#seta');
        

        // const a = new THREE.Vector3( -1.29, -1.24, -7 );
        // console.log(a);
        this.seta.object3D.position.set(-1.29, -1.24, -8.1);
        
    },
    update: function () {},
    tick: function () {
        // this.seta.object3D.rotation.z = Math.PI / 2;
        this.seta.object3D.position.set(this.moto.object3D.getWorldPosition().x, this.moto.object3D.getWorldPosition().y, -8.1);

        if(!this.fim) {
            if((this.moto.object3D.getWorldPosition().x >= -3.5 && this.moto.object3D.getWorldPosition().x <= -3.3) && (this.moto.object3D.getWorldPosition().y > 6.5 && this.moto.object3D.getWorldPosition().y <= 6.9)) {
                console.log('chegouuu');
                window.parent.postMessage(msgPost, '*');

                this.fim = true;
            }
        }
    },
    remove: function () {},
    pause: function () {},
    play: function () {}
});