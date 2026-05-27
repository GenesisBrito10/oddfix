import svgPaths from "../../imports/Body/svg-l6ncabwu38";

interface OddFixLogoProps {
  size?: "sm" | "md" | "lg";
}

export function OddFixLogo({ size = "md" }: OddFixLogoProps) {
  const scales = {
    sm: { symbolW: 22, symbolH: 22, textW: 70, textH: 17 },
    md: { symbolW: 30, symbolH: 30, textW: 96, textH: 23 },
    lg: { symbolW: 38, symbolH: 38, textW: 120, textH: 28 },
  };

  const { symbolW, symbolH, textW, textH } = scales[size];

  return (
    <div className="flex items-center gap-2">
      {/* Symbol */}
      <svg
        width={symbolW}
        height={symbolH}
        viewBox="0 0 34.6265 34.2093"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g clipPath="url(#clip-oddfix-logo)">
          <path d={svgPaths.p2705be80} fill="white" />
          <path d={svgPaths.p2d322d00} fill="#8bf2c1" />
        </g>
        <defs>
          <clipPath id="clip-oddfix-logo">
            <rect fill="white" height="34.2093" width="34.6265" />
          </clipPath>
        </defs>
      </svg>

      {/* Text */}
      <svg
        width={textW}
        height={textH}
        viewBox="0 0 107.288 25.4484"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={svgPaths.p26f5a00} fill="white" />
        <path d={svgPaths.p2fe7d100} fill="white" />
        <path d={svgPaths.p24bb3b00} fill="white" />
        <path d={svgPaths.pbe3ec80} fill="white" />
        <path d={svgPaths.p367711e0} fill="white" />
      </svg>
    </div>
  );
}
