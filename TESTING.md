# Testing en Zimplex

100% de cobertura de tests es la clave para vibe coding real: los tests dejan avanzar rápido y confiar en el instinto, sin ellos vibe coding es solo yolo coding. Con tests, es un superpoder.

## Framework

- **Vitest** 4 (entorno `jsdom`, config en `vite.config.js` bajo la key `test`)
- **@testing-library/react** + **@testing-library/user-event** para componentes
- **@testing-library/jest-dom** para matchers extra (`toBeInTheDocument`, etc.)

## Cómo correr los tests

```bash
npm test          # corre todo una vez (vitest run)
npm run test:watch  # modo watch
```

## Capas de test

- **Unit tests** (`*.test.js`): funciones puras — lógica de negocio, formateo, helpers. Ej: `src/lib/plans.test.js`, `src/pages/Orders.test.jsx`.
- **Integration tests** (`*.test.jsx` con render): componentes que combinan varias piezas, mockeando Supabase/red.
- **Smoke tests**: cubiertos hoy por `/qa` en navegador (no hay suite dedicada aún).
- **E2E tests**: no configurado (evaluar Playwright si el proyecto crece).

## Convenciones

- Un archivo de test junto al código que testea (`Orders.jsx` → `Orders.test.jsx`)
- `describe` por función/componente, `it` con descripción en inglés de la conducta esperada
- Mockear siempre dependencias externas (Supabase, fetch, APIs de IA) — nunca pegarle a servicios reales en tests
- Nunca importar credenciales reales en archivos de test
