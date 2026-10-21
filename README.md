# Tu socio más incómodo

![Relevo](https://img.shields.io/badge/Relevo-Academia%20de%20IA-1FE6AB?labelColor=050505)
![Acceso](https://img.shields.io/badge/Acceso-abierto%20%C2%B7%20sin%20registro-1FE6AB?labelColor=050505)
![Sin dependencias](https://img.shields.io/badge/Dependencias-ninguna-6E7376?labelColor=050505)
![Hecho en Colombia](https://img.shields.io/badge/Hecho%20en-Colombia%20🇨🇴-FCD116)

> Material de la charla de **Relevo** en FX Expo Medellín 2026.
> IA y trading: lo que sí sirve, y los seis errores que cuestan plata.

**[🌐 curso.relevo.academy](https://curso.relevo.academy/)** · **[📸 @relevo.academy](https://instagram.com/relevo.academy)**

---

## Qué hay acá

Cuatro herramientas y una plantilla, abiertas y sin registro. Se copian con un
clic y se bajan como archivo. Corren en Claude, ChatGPT o el asistente que uses.

| | Qué hace |
|---|---|
| **H1 · Escribe tus reglas** | Te entrevista una pregunta a la vez hasta que tu estrategia queda explícita. No sugiere valores ni activos: lo que no definas queda marcado como `[sin definir]` |
| **H2 · Rómpela** | Pre-mortem adversarial sobre tus reglas. Tiene prohibido validarte y prohibido proponerte otra estrategia |
| **H3A · Código de backtest** | Pine Script o Python a partir de tus reglas, con la lista de lo que el modelo **no pudo verificar** |
| **H3B · Tablero del histórico** | Tu CSV de operaciones convertido en una vista de tus propios patrones |

Más una **plantilla CSV** con su instructivo, para quien no tiene el histórico
en archivo.

### El ciclo tiene cuatro pasos, no tres

H1 → H2 → **corriges las reglas** → H3A.

Ese tercer paso es tuyo y es el que casi todo el mundo se salta. Si no lo
haces, H3A te convierte en código una estrategia que H2 acaba de demostrar que
está rota.

**H3B va aparte**, en una conversación nueva y con el CSV adjunto.

---

## Los seis errores

Los que cuestan plata al usar IA en trading. Ninguno es evidente y los seis son
verificables hoy mismo con tu propio asistente:

1. **No predice precios** — predice la siguiente palabra, no el siguiente precio
2. **No calcula: estima** — pídele la fórmula, no el número
3. **Inventa funciones e indicadores** — confirma cada una contra la documentación oficial
4. **Te da la razón** — hay que pedirle explícitamente que ataque
5. **Te sobreajusta el backtest** — los parámetros se fijan antes de ver el resultado
6. **Tu cuenta no se sube nunca** — ni credenciales, ni número de cuenta, ni extractos

---

## ⚠️ Nada de esto es asesoría de inversión

Material formativo sobre **proceso**: cómo escribir, atacar y medir tus propias
reglas. No hay recomendaciones de activos, ni cifras de rentabilidad, ni
sugerencias sobre qué operar. Las decisiones de inversión son tuyas y la
responsabilidad también.

Ninguna de las herramientas te pide credenciales, número de cuenta ni
extractos. Si alguna vez una herramienta te los pide, esa no es la herramienta.

---

## Correr localmente

Es un sitio estático: sin build, sin dependencias.

```bash
python -m http.server 4173
```

---

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La página completa |
| `relevo-taller.css` · `relevo-taller.js` | Hoja y script compartidos del formato de talleres de Relevo |
| `descargas/PLANTILLA-operaciones.csv` | Plantilla del histórico de operaciones |
| `descargas/LEEME-plantilla.txt` | Cómo llenarla, y qué **no** poner en ella |

---

© Relevo · Academia de IA · Colombia
