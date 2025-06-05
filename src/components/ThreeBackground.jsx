import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ThreeBackground = () => {
  const meshRef = useRef()
  const particlesRef = useRef()
  
  // Create particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 1000; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        ],
        scale: Math.random() * 0.5 + 0.1
      })
    }
    return temp
  }, [])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1
      meshRef.current.rotation.y += delta * 0.15
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4ecdc4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
      
      {/* Central rotating geometry */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshPhongMaterial 
          color="#4ecdc4" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Particles */}
      <group ref={particlesRef}>
        {particles.map((particle, index) => (
          <mesh key={index} position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshBasicMaterial 
              color={Math.random() > 0.5 ? '#4ecdc4' : '#ff6b6b'} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Background gradient */}
      <mesh position={[0, 0, -20]} scale={[100, 100, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color="#0a0a0a"
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}

export default ThreeBackground

