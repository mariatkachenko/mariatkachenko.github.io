import type { CSSProperties } from 'react'
import { WORKS_MTS_PLACEHOLDER_INDEX } from './WorksCardCarousel'

const edgeSpray = [
  [58, 92, 5], [105, 58, 3], [148, 112, 4],
  [1452, 74, 4], [1506, 116, 3], [1562, 62, 5],
  [42, 838, 4], [92, 904, 3], [152, 862, 5],
  [1444, 892, 4], [1512, 846, 5], [1570, 918, 3],
] as const

export function shouldTriggerWorksPaintSplash(previousIndex: number | null, nextIndex: number) {
  return previousIndex !== WORKS_MTS_PLACEHOLDER_INDEX
    && nextIndex === WORKS_MTS_PLACEHOLDER_INDEX
}

export default function WorksPaintSplash({ activation }: { activation: number }) {
  if (activation === 0) return null

  return <div
    key={activation}
    className="works-paint-splash"
    data-activation={activation}
    aria-hidden="true"
  >
    <svg
      className="works-paint-splash__svg"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <defs>
        <linearGradient id="paint-edge-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb3d9" />
          <stop offset=".55" stopColor="#ff6cb5" />
          <stop offset="1" stopColor="#9f4c85" />
        </linearGradient>
        <linearGradient id="paint-edge-violet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfb2f7" />
          <stop offset=".55" stopColor="#a982df" />
          <stop offset="1" stopColor="#706dd1" />
        </linearGradient>
      </defs>

      <g className="works-paint-splash__edge works-paint-splash__edge--top-left">
        <path className="works-paint-splash__edge-fill" fill="url(#paint-edge-pink)" d="M-28 12c78-36 165-29 238 17 28 18 56 41 88 48-49 19-98 18-143 3-56-19-113-3-183 26V12Z" />
        <path className="works-paint-splash__graffiti-outline" d="M-12 58c70-38 145-37 226 2 28 14 55 19 82 15" />
      </g>
      <g className="works-paint-splash__edge works-paint-splash__edge--top-right">
        <path className="works-paint-splash__edge-fill" fill="url(#paint-edge-violet)" d="M1626-10c-93 7-164 39-218 92-23 23-52 39-87 47 51 15 99 8 144-22 43-28 93-40 161-38V-10Z" />
        <path className="works-paint-splash__graffiti-outline" d="M1611 28c-79 4-143 29-193 77-23 22-49 34-78 37" />
      </g>
      <g className="works-paint-splash__edge works-paint-splash__edge--bottom-left">
        <path className="works-paint-splash__edge-fill" fill="url(#paint-edge-violet)" d="M-30 1018V879c70-12 128 0 176 38 42 33 91 46 151 39-58 50-132 64-218 40-35-10-71-3-109 22Z" />
        <path className="works-paint-splash__graffiti-outline" d="M-8 924c68-18 127-6 178 36 30 24 68 31 113 22" />
      </g>
      <g className="works-paint-splash__edge works-paint-splash__edge--bottom-right">
        <path className="works-paint-splash__edge-fill" fill="url(#paint-edge-pink)" d="M1628 1018h-287c27-22 62-39 105-51 55-15 91-52 111-110 39 49 45 102 18 159l53 2Z" />
        <path className="works-paint-splash__graffiti-outline" d="M1327 1001c45-37 93-53 146-49 46 4 85-18 118-65" />
      </g>

      <g className="works-paint-splash__spray">
        {edgeSpray.map(([cx, cy, r], index) => <circle
          className="works-paint-splash__spray-dot"
          cx={cx}
          cy={cy}
          r={r}
          fill={index % 2 === 0 ? '#ff77b9' : '#9c83df'}
          key={index}
          style={{ '--spray-delay': `${index * 22}ms` } as CSSProperties}
        />)}
      </g>

      <g className="works-paint-splash__tag-lines">
        <path className="works-paint-splash__tag-stroke" d="M24 318c55-36 111-42 168-17-41 2-72 17-93 45" />
        <path className="works-paint-splash__tag-stroke works-paint-splash__tag-stroke--pink" d="M1412 690c58-31 113-28 164 9-43-10-82-1-116 26" />
      </g>
    </svg>
  </div>
}
