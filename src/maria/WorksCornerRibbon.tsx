export default function WorksCornerRibbon() {
  return <svg
    className="works-corner-ribbon"
    viewBox="0 0 180 180"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="works-ribbon-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff9dce" />
        <stop offset=".48" stopColor="#ff4fa6" />
        <stop offset="1" stopColor="#9b4bd4" />
      </linearGradient>
      <linearGradient id="works-ribbon-shadow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a13c83" />
        <stop offset="1" stopColor="#66329a" />
      </linearGradient>
    </defs>
    <path
      className="works-corner-ribbon__wrap works-corner-ribbon__wrap--back"
      d="M178 31C143 35 116 48 98 69C82 87 66 97 43 101"
      stroke="url(#works-ribbon-shadow)"
    />
    <path
      className="works-corner-ribbon__wrap works-corner-ribbon__wrap--front"
      d="M174 9C147 25 129 45 119 69C109 94 91 111 62 122"
      stroke="url(#works-ribbon-gradient)"
    />
    <g className="works-corner-ribbon__tail">
      <path d="M63 113C47 124 35 141 29 169C43 159 54 160 66 174C72 150 76 131 74 116Z" fill="url(#works-ribbon-gradient)" />
      <path d="M63 113C53 124 48 139 48 157" fill="none" stroke="#ffd2e9" strokeWidth="2.5" strokeLinecap="round" opacity=".68" />
    </g>
  </svg>
}
