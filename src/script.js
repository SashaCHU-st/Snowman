import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import {Sky} from 'three/addons/objects/Sky.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Flakes
let particles;
let position = [], velocities = []

const number = 25000

const maxRange = 1000, minRange = maxRange/2

//const minHeight = 150;

const geo = new THREE.BufferGeometry();
const textureLoader = new THREE.TextureLoader()
const minHeight = 0;
const maxHeight = 50; // Adjust as needed
function addSnow() {
    for (let i = 0; i < number; i++) {
        position.push(
            Math.floor(Math.random() * (skyBounds.maxX - skyBounds.minX) + skyBounds.minX),
            Math.floor(Math.random() * (skyBounds.maxY - skyBounds.minY) + skyBounds.minY),
            Math.floor(Math.random() * (skyBounds.maxZ - skyBounds.minZ) + skyBounds.minZ)
        );
        velocities.push(
            Math.floor(Math.random() * 6 - 3) * 0.05, // Reduced speed factor
            Math.floor(Math.random() * 5 + 0.12) * 0.09, // Reduced speed factor
            Math.floor(Math.random() * 6 - 3) * 0.05 // Reduced speed factor
        );
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    geo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    const flakeMat = new THREE.PointsMaterial({
        size: 4,
        map: textureLoader.load('./snow/snowflakes.png'),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7
    });
    particles = new THREE.Points(geo, flakeMat);
    scene.add(particles);
}





// addSnow();

//animate()

// function animate()
// {
//     requestAnimationFrame(animate)
//     OrbitControls.update()

//     updateParticles()
//     renderer.render(scene, camera)
// }


/**
 * Snowman
 */

const snowColorTexture = textureLoader.load('./snow/snow_02_diff_1k.jpg')
const snowArmTexture = textureLoader.load('./snow/snow_02_arm_1k.jpg')
const snowNormalTexture = textureLoader.load('./snow/snow_02_nor_gl_1k.jpg')
snowColorTexture.colorSpace = THREE.SRGBColorSpace

snowColorTexture.repeat.set(2,1)
snowArmTexture.repeat.set(2,1)
snowNormalTexture.repeat.set(2,1)

snowColorTexture.wrapS = THREE.RepeatWrapping
snowArmTexture.wrapS= THREE.RepeatWrapping
snowNormalTexture.wrapS= THREE.RepeatWrapping

const snowman = new THREE.Group()
scene.add(snowman)

const lower_part = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({
        map: snowColorTexture,  // Используем только карту цвета для теста
        normalMap: snowNormalTexture,  // Добавляем нормальную карту, если нужно
        roughness: 0.7  // Просто грубость поверхности (опционально)
    })
);
lower_part.position.y = 0.5;
snowman.add(lower_part);



const middle_part = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshStandardMaterial(
        {
            map: snowColorTexture, 
            normalMap: snowNormalTexture, 
            roughness: 0.7
        }
    )
)
middle_part.position.y = 2
snowman.add(middle_part)

const head_part = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshStandardMaterial(
        {
            map: snowColorTexture,  // Используем только карту цвета для теста
            normalMap: snowNormalTexture,  // Добавляем нормальную карту, если нужно
            roughness: 0.7,  // Просто грубость поверхности (опционально)
        }
    )
)
head_part.position.y = 3.1
snowman.add(head_part)

const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.4, 32),
    new THREE.MeshStandardMaterial(
        {
            color:'red'
        }
    )
)
nose.position.y = 3.1
nose.position.x = 0
nose.position.z = 0.6
nose.rotation.x = Math.PI *0.5
snowman.add(nose)

const eyes_right = new THREE.Mesh(
    new THREE.CircleGeometry( 0.04, 32 ),
    new THREE.MeshStandardMaterial({
        color:'black'
    })
)
eyes_right.position.z = 0.48
eyes_right.position.y = 3.2
eyes_right.position.x = 0.12
snowman.add(eyes_right)
const eyes_left = new THREE.Mesh(
    new THREE.CircleGeometry( 0.04, 32 ),
    new THREE.MeshStandardMaterial({
        color:'black'
    })
)
eyes_left.position.z = 0.48
eyes_left.position.y = 3.2
eyes_left.position.x = -0.12
snowman.add(eyes_left)
//snow
const floorAlphaTexture = textureLoader.load('./snow/alpha.jpg')
const floorColorTexture = textureLoader.load('./snow/snow_01_diff_1k.jpg')
const floorArmTexture = textureLoader.load('./snow/snow_01_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./snow/snow_01_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./snow/snow_01_disp_1k.jpg')
floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8,8)
floorArmTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorDisplacementTexture.repeat.set(8,8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorArmTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorArmTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 1000, 100),  // Изменяем размеры на 50x50
    new THREE.MeshStandardMaterial({
        //color:'red'
        alphaMap:floorAlphaTexture,
        transparent:true,
        map:floorColorTexture,
        aoMap:floorArmTexture,
        roughnessMap:floorArmTexture,
        metalnessMap:floorArmTexture,
        normalMap:floorNormalTexture,
        displacementMap:floorDisplacementTexture,
        displacementScale:0.2,
        displacementBias:-0.131
    })
)
floor.rotation.x = - Math.PI *0.5
scene.add(floor)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(10, 5, 5)
scene.add(directionalLight)

// Увеличение площади освещения 
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;

// Увеличение интенсивности
directionalLight.intensity = 2.0;


gui.addColor(ambientLight, 'color')
gui.addColor(directionalLight, 'color')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10  // прямо по центру
camera.position.y = 6 // на уровне головы снеговика
camera.position.z = 15  // на нужном расстоянии перед снеговиком
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


//shadow
directionalLight.castShadow = true
floor.receiveShadow = true
///snowman.castShadowm = true
lower_part.castShadow = true
middle_part.castShadow = true
head_part.castShadow = true
head_part.receiveShadow = true
nose.castShadow = true


directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20
//sky

const sky = new Sky()
sky.scale.set(200,200,200)
scene.add(sky)


// Adjust sky parameters
sky.material.uniforms['turbidity'].value = 5; // Lower for a clearer sky
sky.material.uniforms['rayleigh'].value = 5; // Lower for less blue tint
sky.material.uniforms['mieCoefficient'].value = 0.5; // Lower for less scattering
sky.material.uniforms['mieDirectionalG'].value = 1; // Higher for more diffuse light

// Optionally, adjust the sun position for effect
sky.material.uniforms['sunPosition'].value.set(0.5, 0.5, 0.5);


const skyBounds = {
    minX: -100, // Adjust based on your scene's scale
    maxX: 100,
    minY: 0,    // Minimum Y can be the floor level
    maxY: 1000, // Maximum Y is the height of the sky
    minZ: -100, // Adjust based on your scene's scale
    maxZ: 100
};

//fog
//scene.fog = new THREE.FogExp2('#08333e', 0.1)
/**
 * Animate
 */


function updateParticles() {
    if (!particles || !particles.geometry) {
        console.error('Particles or geometry not initialized');
        return;
    }

    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;

    for (let i = 0; i < number * 3; i += 3) {
        positions[i] -= velocities[i];
        positions[i + 1] -= velocities[i + 1];
        positions[i + 2] -= velocities[i + 2];

        // Check if the particle is out of the bounds
        if (positions[i] < skyBounds.minX || positions[i] > skyBounds.maxX ||
            positions[i + 1] < skyBounds.minY || positions[i + 1] > skyBounds.maxY ||
            positions[i + 2] < skyBounds.minZ || positions[i + 2] > skyBounds.maxZ) {
            
            // Reset position if out of bounds
            positions[i] = Math.floor(Math.random() * (skyBounds.maxX - skyBounds.minX) + skyBounds.minX);
            positions[i + 1] = Math.floor(Math.random() * (skyBounds.maxY - skyBounds.minY) + skyBounds.minY);
            positions[i + 2] = Math.floor(Math.random() * (skyBounds.maxZ - skyBounds.minZ) + skyBounds.minZ);
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;
}



function animate()
{
    requestAnimationFrame(animate);
    controls.update();
    updateParticles();
    renderer.render(scene, camera);
}

addSnow()
animate()
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()