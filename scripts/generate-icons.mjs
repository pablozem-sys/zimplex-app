import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('./public/favicon.svg')

// SVG escalado a 512x512
const svgLarge = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="zgrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#zgrad)"/>
  <path d="M128 152H384L128 360H384" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const svgBuf = Buffer.from(svgLarge)

await sharp(svgBuf).resize(512, 512).png().toFile('./public/pwa-512x512.png')
await sharp(svgBuf).resize(192, 192).png().toFile('./public/pwa-192x192.png')
await sharp(svgBuf).resize(180, 180).png().toFile('./public/apple-touch-icon.png')

console.log('Icons generated ✓')
