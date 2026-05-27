import { getBookmakerLogo } from "../../constants/bookmakers";

interface BookmakerLogoProps {
  bookmakerName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BookmakerLogo({ bookmakerName, className = "", size = "md" }: BookmakerLogoProps) {
  const logo = getBookmakerLogo(bookmakerName);

  // If no logo found, render the bookmaker name as text fallback
  if (!logo) {
    return (
      <span
        className={className}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "#a1a1aa",
          letterSpacing: "-0.2px",
        }}
      >
        {bookmakerName}
      </span>
    );
  }

  // Height-based sizing so horizontal brand logos aren't distorted.
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { height: "20px", width: "auto", maxWidth: "100px" },
    md: { height: "24px", width: "auto", maxWidth: "100px" },
    lg: { height: "30px", width: "auto", maxWidth: "100px" },
  };

  return (
    <img
      src={logo}
      alt={bookmakerName}
      className={`object-contain block ${className}`}
      style={sizeStyles[size]}
    />
  );
}