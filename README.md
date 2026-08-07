# Thinking cubes

Dotted thought-cube loading indicators for AI and agent UIs. Nine hand-tuned animated states ship at two purpose-tuned sizes, all rendered on a plain 2D canvas with a consistent isometric cube orientation.

[Live demo](https://orbs.jakubantalik.com) · [Repository](https://github.com/Jakubantalik/thinking-orbs) · [Report an issue](https://github.com/Jakubantalik/thinking-orbs/issues)

## Install

```bash
npm install thinking-orbs
```

## Quick start

```tsx
import { ThinkingCube } from 'thinking-orbs';

function Status() {
  return <ThinkingCube state="searching" size={64} />;
}
```

## States

Each state keeps its original behavior while using cube faces, edges, or shells:

```tsx
<ThinkingCube state="working" />
<ThinkingCube state="searching" />
<ThinkingCube state="solving" />
<ThinkingCube state="listening" />
<ThinkingCube state="connecting" />
<ThinkingCube state="weaving" />
<ThinkingCube state="composing" />
<ThinkingCube state="breathing" />
<ThinkingCube state="shaping" />
```

- `working`: particles run along a dotted cube wireframe.
- `searching`: a scan plane sweeps across the cube faces.
- `solving`: cube layers make quarter turns and click back into place.
- `listening`: a waveform ripples through the cube surface.
- `connecting`: a moving network links nodes on the cube surface.
- `weaving`: three strands plait around the cube.
- `composing`: an undulating multi-band sash wraps the cube.
- `breathing`: nested wireframe cube shells expand and contract.
- `shaping`: a wire cube reshapes along three axes.

## Sizes

Two separately tuned presets ship: `64` for chat-avatar scale and `20` for inline-text scale.

```tsx
<ThinkingCube state="working" size={64} />
<ThinkingCube state="working" size={20} />
```

## Theme

The monochrome canvas renders light marks for dark backgrounds and dark marks for light backgrounds.

```tsx
<ThinkingCube theme="auto" />
<ThinkingCube theme="dark" />
<ThinkingCube theme="light" />
```

`auto` reacts to ancestor `data-theme="dark|light"` attributes, `dark` or `light` classes, and `prefers-color-scheme`.

## Other props

```tsx
<ThinkingCube
  state="solving"
  size={20}
  speed={1.5}
  paused={false}
  aria-label="Analysing repository…"
/>
```

All other `<canvas>` props pass through. `ThinkingOrb` and the `OrbState`, `OrbSize`, `OrbTheme`, and `ThinkingOrbProps` types remain available as backward-compatible aliases and render the same cube designs.

## Accessibility and performance

- Every canvas has `role="img"` and a state-specific default `aria-label`.
- Reduced-motion users receive a static representative cube frame.
- Instances pause while offscreen or while the tab is hidden.
- Rendering uses plain 2D canvas fills and strokes with device-pixel-ratio capped at 2.

## License

MIT © Jakub Antalik