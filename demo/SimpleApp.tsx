import { useEffect, useState } from 'react';
import type { CubeState } from 'thinking-orbs';
import { ThinkingCube } from 'thinking-orbs';

const STATES: Array<{ state: CubeState; blurb: string }> = [
  { state: 'working', blurb: 'particles run along the cube edges' },
  { state: 'searching', blurb: 'a scan plane sweeps the cube faces' },
  { state: 'solving', blurb: 'cube layers scramble, then click back' },
  { state: 'listening', blurb: 'a waveform rolls through the cube' },
  { state: 'connecting', blurb: 'a cube-surface network wires itself' },
  { state: 'weaving', blurb: 'three strands wrap around the cube' },
  { state: 'composing', blurb: 'an undulating sash wraps the cube' },
  { state: 'breathing', blurb: 'nested cube shells slowly breathe' },
  { state: 'shaping', blurb: 'a wire cube reshapes in three axes' }
];

export function App() {
  const [dark, setDark] = useState(true);

  // drive the ancestor `data-theme` attribute — the same signal the
  // library's auto detection reads in a host project
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="page">
      <header>
        <span className="mono">THINKING-CUBES · NINE STATES · TWO SIZES · AUTO THEME</span>
        <button className="mono theme-btn" type="button" onClick={() => setDark((d) => !d)}>
          {dark ? 'LIGHT' : 'DARK'}
        </button>
      </header>

      <section className="grid">
        {STATES.map(({ state, blurb }) => (
          <div key={state} className="card">
            <div className="pair">
              <ThinkingCube state={state} size={64} />
              <ThinkingCube state={state} size={20} />
            </div>
            <div className="text">
              <span className="title">{state}</span>
              <span className="sub">{blurb}</span>
            </div>
          </div>
        ))}
      </section>

      <footer className="mono faint">
        SIZE 64 / 20 · THEME AUTO (data-theme · .dark · prefers-color-scheme) · REDUCED-MOTION SAFE
      </footer>
    </div>
  );
}
