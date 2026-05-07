export default function AuthLayoutSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="800" fill="#0e2d1e" />
      <circle cx="520" cy="130" r="160" fill="#163d28" opacity="0.9" />
      <circle cx="520" cy="130" r="100" fill="#1a4e31" opacity="0.7" />
      <circle cx="520" cy="130" r="50" fill="#225e3c" opacity="0.6" />
      {[310, 330, 350, 370, 390].map((x) =>
        [60, 80, 100].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="3"
            fill="#7ecb9a"
            opacity="0.25"
          />
        )),
      )}
      <rect
        x="80"
        y="95"
        width="36"
        height="36"
        rx="4"
        fill="#f5c842"
        transform="rotate(45 98 113)"
      />
      <rect
        x="124"
        y="95"
        width="26"
        height="26"
        rx="3"
        fill="#f5c842"
        opacity="0.6"
        transform="rotate(45 137 108)"
      />
      {[200, 218, 236, 254].map((y, i) => (
        <path
          key={y}
          d={`M50 ${y} Q150 ${y - 15} 250 ${y} Q350 ${y + 15} 450 ${y} Q550 ${y - 15} 650 ${y}`}
          stroke="#3a8c5e"
          strokeWidth={i === 3 ? 8 : 10}
          fill="none"
          opacity="0.45"
        />
      ))}
      <polygon points="90,390 130,330 170,390" fill="#4db87a" opacity="0.85" />
      <polygon points="200,370 228,330 256,370" fill="#2a7a50" opacity="0.6" />
      <path
        d="M310 340 L318 360 L338 368 L318 376 L310 396 L302 376 L282 368 L302 360 Z"
        fill="#e8f5ec"
        opacity="0.95"
      />
      <line
        x1="420"
        y1="330"
        x2="420"
        y2="410"
        stroke="#5ab87a"
        strokeWidth="3"
        opacity="0.4"
      />
      <line
        x1="460"
        y1="330"
        x2="460"
        y2="410"
        stroke="#5ab87a"
        strokeWidth="3"
        opacity="0.4"
      />
      <line
        x1="390"
        y1="355"
        x2="490"
        y2="355"
        stroke="#5ab87a"
        strokeWidth="3"
        opacity="0.4"
      />
      <line
        x1="390"
        y1="385"
        x2="490"
        y2="385"
        stroke="#5ab87a"
        strokeWidth="3"
        opacity="0.4"
      />
      <g transform="translate(510,520)" opacity="0.9">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.sin(rad) * 36}
              y1={-Math.cos(rad) * 36}
              x2={Math.sin(rad) * 56}
              y2={-Math.cos(rad) * 56}
              stroke="#f5c842"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="0" cy="0" r="9" fill="#f5c842" />
      </g>
      <rect
        x="68"
        y="500"
        width="72"
        height="72"
        rx="6"
        fill="#3ecf82"
        opacity="0.25"
      />
      <rect
        x="80"
        y="512"
        width="48"
        height="48"
        rx="4"
        fill="#3ecf82"
        opacity="0.5"
      />
      <circle cx="440" cy="720" r="160" fill="#163d28" opacity="0.7" />
      <circle cx="440" cy="720" r="100" fill="#0a2318" opacity="0.5" />
      <circle cx="220" cy="580" r="7" fill="#3ecf82" opacity="0.9" />
      <circle cx="244" cy="580" r="7" fill="#3ecf82" opacity="0.4" />
      <circle cx="268" cy="580" r="7" fill="#3ecf82" opacity="0.4" />
      <circle cx="292" cy="580" r="7" fill="#3ecf82" opacity="0.4" />
      <path
        d="M160 640 C160 600 200 580 230 600 C260 620 250 670 210 680 C180 688 160 670 160 640Z"
        fill="#2d8a56"
        opacity="0.5"
      />
      <path
        d="M170 642 C170 615 200 600 222 615"
        stroke="#4db87a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <circle
        cx="340"
        cy="660"
        r="6"
        fill="none"
        stroke="#7ecb9a"
        strokeWidth="2"
        opacity="0.6"
      />
      <circle cx="356" cy="678" r="4" fill="#7ecb9a" opacity="0.4" />
      <line
        x1="500"
        y1="600"
        x2="560"
        y2="640"
        stroke="#5ab87a"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <line
        x1="520"
        y1="590"
        x2="580"
        y2="630"
        stroke="#5ab87a"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <line
        x1="540"
        y1="580"
        x2="600"
        y2="620"
        stroke="#5ab87a"
        strokeWidth="1.5"
        opacity="0.2"
      />
    </svg>
  );
}
