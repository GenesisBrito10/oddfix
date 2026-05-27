import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { User, Mail, Lock, Link2, Eye, EyeOff } from "lucide-react";
import svgPaths from "../../imports/Login/svg-a3ywtog005";
import { BOOKMAKERS } from "../constants/bookmakers";

// ─── Shared icons (same SVG assets as LoginPage) ─────────────────────────────

function OddfixLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[34.626px] h-[34.209px] relative shrink-0">
        <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 34.6265 34.2093">
          <g clipPath="url(#clip0_logo_reg)">
            <path d={svgPaths.p2705be80} fill="white" />
            <path d={svgPaths.p2d322d00} fill="#8BF2C1" />
          </g>
          <defs>
            <clipPath id="clip0_logo_reg">
              <rect fill="white" height="34.2093" width="34.6265" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="w-[107.288px] h-[25.448px] relative shrink-0">
        <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 107.288 25.4484">
          <path d={svgPaths.p26f5a00} fill="white" />
          <path d={svgPaths.p2fe7d100} fill="white" />
          <path d={svgPaths.p24bb3b00} fill="white" />
          <path d={svgPaths.pbe3ec80} fill="white" />
          <path d={svgPaths.p367711e0} fill="white" />
        </svg>
      </div>
    </div>
  );
}

function BookmakerTile({ image, alt }: { image: string; alt: string }) {
  return (
    <div
      className="rounded-[4px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#0e0e0e",
        border: "1px solid rgba(255,255,255,0.07)",
        height: "52px",
        padding: "8px",
      }}
    >
      <img src={image} alt={alt} className="object-contain block" style={{ height: "32px", width: "auto", maxWidth: "100%" }} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_google_reg" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="22">
        <path d="M21.7887 8.95924H11.2343V13.1884H17.2989C17.2014 13.7869 16.9825 14.3757 16.662 14.9126C16.2947 15.5277 15.8406 15.996 15.3752 16.3526C13.9811 17.4209 12.3557 17.6394 11.227 17.6394C8.3755 17.6394 5.93911 15.7964 4.99594 13.2922C4.95788 13.2013 4.9326 13.1074 4.90182 13.0147C4.6934 12.3773 4.57952 11.7023 4.57952 11.0007C4.57952 10.2705 4.70284 9.57159 4.92769 8.91147C5.81459 6.30796 8.3059 4.36339 11.229 4.36339C11.817 4.36339 12.3831 4.43337 12.9201 4.57297C14.1471 4.89198 15.0151 5.52028 15.547 6.01726L18.7562 2.87444C16.804 1.08457 14.2592 2.70616e-09 11.2237 2.70616e-09C8.79693 -5.2231e-05 6.55646 0.75605 4.72047 2.03389C3.23153 3.07018 2.0104 4.45764 1.18628 6.06903C0.419733 7.56311 0 9.21883 0 10.999C0 12.7793 0.420375 14.4523 1.18693 15.9325V15.9425C1.99659 17.514 3.1806 18.8671 4.61964 19.8987C5.87679 20.7998 8.13099 22 11.2237 22C13.0022 22 14.5785 21.6793 15.9686 21.0784C16.9714 20.6449 17.8599 20.0795 18.6643 19.3528C19.7272 18.3927 20.5597 17.205 21.1279 15.8386C21.6961 14.4722 22 12.927 22 11.2518C22 10.4716 21.9216 9.67927 21.7887 8.95916V8.95924Z" fill="white" />
      </mask>
      <g mask="url(#mask0_google_reg)">
        <g filter="url(#filter0_f_google_reg)">
          <path d="M-0.127075 11.0469C-0.115409 12.7991 0.383875 14.6069 1.13962 16.0663V16.0764C1.68569 17.1362 2.432 17.9734 3.28204 18.803L8.41606 16.9297C7.44473 16.4363 7.29652 16.1339 6.60024 15.5822C5.8887 14.8648 5.35838 14.0411 5.02812 13.0753H5.01482L5.02812 13.0652C4.81085 12.4274 4.78942 11.7504 4.7814 11.0469H-0.127075Z" fill="url(#paint0_radial_google_reg)" />
        </g>
        <g filter="url(#filter1_f_google_reg)">
          <path d="M11.2693 -0.106888C10.7618 1.67584 10.9559 3.40871 11.2693 4.41697C11.8553 4.4174 12.4198 4.48725 12.955 4.62641C14.1821 4.94542 15.05 5.57374 15.5818 6.07072L18.8732 2.84761C16.9234 1.05987 14.5769 -0.104071 11.2693 -0.106888Z" fill="url(#paint1_radial_google_reg)" />
        </g>
        <g filter="url(#filter2_f_google_reg)">
          <path d="M11.2583 -0.120987C8.76922 -0.121041 6.47124 0.654472 4.58812 1.96512C3.88892 2.45176 3.24727 3.01391 2.67592 3.63904C2.52625 5.04325 3.79638 6.76916 6.31165 6.75487C7.53204 5.33528 9.33697 4.41681 11.3459 4.41681C11.3477 4.41681 11.3495 4.41696 11.3513 4.41697L11.2693 -0.120666C11.2656 -0.120668 11.262 -0.120987 11.2583 -0.120987Z" fill="url(#paint2_radial_google_reg)" />
        </g>
        <g filter="url(#filter3_f_google_reg)">
          <path d="M19.4735 11.555L17.2519 13.0812C17.1544 13.6797 16.9353 14.2685 16.6147 14.8054C16.2475 15.4205 15.7934 15.8889 15.328 16.2455C13.9368 17.3116 12.3157 17.5311 11.1873 17.532C10.0208 19.5186 9.81635 20.5136 11.2693 22.117C13.0672 22.1157 14.661 21.7911 16.0669 21.1834C17.0832 20.7441 17.9836 20.1711 18.7988 19.4346C19.876 18.4616 20.7197 17.258 21.2955 15.8732C21.8714 14.4885 22.1793 12.9226 22.1793 11.2249L19.4735 11.555Z" fill="url(#paint3_radial_google_reg)" />
        </g>
        <g filter="url(#filter4_f_google_reg)">
          <path d="M11.1051 8.7717V13.3222H21.7939C21.8879 12.699 22.1989 11.8926 22.1989 11.2249C22.1989 10.4448 22.1206 9.49181 21.9877 8.7717H11.1051Z" fill="#3086FF" />
        </g>
        <g filter="url(#filter5_f_google_reg)">
          <path d="M2.7269 3.47839C2.06729 4.2001 1.50377 5.00789 1.05698 5.88151C0.290442 7.37559 -0.129272 9.19198 -0.129272 10.9722C-0.129272 10.9973 -0.127196 11.0218 -0.127029 11.0469C0.212446 11.6978 4.5622 11.5731 4.78145 11.0469C4.78117 11.0223 4.77841 10.9984 4.77841 10.9738C4.77841 10.2436 4.90176 9.70542 5.12661 9.04529C5.40399 8.23104 5.83831 7.48123 6.39368 6.8352C6.51957 6.67447 6.85538 6.32894 6.95335 6.12168C6.99068 6.04274 6.8856 5.99842 6.87972 5.97064C6.87315 5.93956 6.73227 5.96455 6.70071 5.9414C6.6005 5.86789 6.40205 5.82951 6.28155 5.79539C6.02399 5.72246 5.59714 5.56164 5.36006 5.39493C4.61064 4.86795 3.44111 4.23849 2.7269 3.47839Z" fill="url(#paint4_radial_google_reg)" />
        </g>
        <g filter="url(#filter6_f_google_reg)">
          <path d="M5.37617 5.97375C7.11399 7.02644 7.61376 5.4424 8.76917 4.94672L6.75929 0.778778C6.01995 1.08952 5.32142 1.47559 4.67329 1.92669C3.70537 2.60036 2.85061 3.42243 2.14453 4.35796L5.37617 5.97375Z" fill="url(#paint5_radial_google_reg)" />
        </g>
        <g filter="url(#filter7_f_google_reg)">
          <path d="M6.0834 16.6077C3.7506 17.4498 3.38539 17.4801 3.17065 18.9258C3.581 19.3262 4.02189 19.6966 4.4904 20.0324C5.74755 20.9336 8.16577 22.1338 11.2585 22.1338C11.2621 22.1338 11.2656 22.1335 11.2692 22.1335V17.4516C11.2669 17.4517 11.2642 17.4518 11.2618 17.4518C10.1037 17.4518 9.17828 17.1476 8.22942 16.6187C7.99547 16.4882 7.57102 16.8384 7.35526 16.6819C7.05767 16.466 6.34151 16.8679 6.0834 16.6077Z" fill="url(#paint6_radial_google_reg)" />
        </g>
        <g opacity="0.5" filter="url(#filter8_f_google_reg)">
          <path d="M9.90308 17.3042V22.0524C10.3358 22.103 10.7861 22.1338 11.2585 22.1338C11.7321 22.1338 12.1903 22.1095 12.6355 22.0648V17.3362C12.1366 17.4215 11.6667 17.4518 11.2619 17.4518C10.7957 17.4518 10.3424 17.3975 9.90308 17.3042Z" fill="url(#paint7_linear_google_reg)" />
        </g>
      </g>
      <defs>
        <filter id="filter0_f_google_reg" x="-0.342528" y="10.8314" width="8.974" height="8.18698" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter1_f_google_reg" x="10.7418" y="-0.322341" width="8.3468" height="6.60852" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter2_f_google_reg" x="2.44861" y="-0.33644" width="9.11816" height="7.30685" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter3_f_google_reg" x="10.03" y="11.0095" width="12.3647" height="11.323" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter4_f_google_reg" x="10.8896" y="8.55624" width="11.5247" height="4.98141" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter5_f_google_reg" x="-0.344725" y="3.26294" width="7.52148" height="8.44204" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter6_f_google_reg" x="0.629808" y="-0.735945" width="9.65408" height="8.57823" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.757361" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter7_f_google_reg" x="2.9552" y="16.3735" width="8.52942" height="5.97578" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <filter id="filter8_f_google_reg" x="9.68762" y="17.0887" width="3.16333" height="5.26053" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_reg" /></filter>
        <radialGradient id="paint0_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-0.457161 -10.9559 16.4368 -0.657455 8.31328 18.6379)" gradientUnits="userSpaceOnUse"><stop offset="0.141612" stopColor="#1ABD4D" /><stop offset="0.860566" stopColor="#FFCE0A" /></radialGradient>
        <radialGradient id="paint1_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(7.76386 -1.86594e-05 -1.09124e-05 9.81682 18.5653 5.83751)" gradientUnits="userSpaceOnUse"><stop offset="0.408458" stopColor="#FB4E5A" /><stop offset="1" stopColor="#FF4540" /></radialGradient>
        <radialGradient id="paint2_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-10.8777 5.89868 8.17553 14.4521 14.3253 -1.54201)" gradientUnits="userSpaceOnUse"><stop offset="0.231273" stopColor="#FF4541" /><stop offset="1" stopColor="#FF8C18" /></radialGradient>
        <radialGradient id="paint3_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-19.7271 -25.2127 -9.50551 7.12939 11.431 20.6931)" gradientUnits="userSpaceOnUse"><stop offset="0.131546" stopColor="#0CBA65" /><stop offset="0.858506" stopColor="#3086FF" /></radialGradient>
        <radialGradient id="paint4_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-1.39604 11.7812 16.6376 1.88988 10.3052 1.95685)" gradientUnits="userSpaceOnUse"><stop offset="0.366013" stopColor="#FF4E3A" /><stop offset="1" stopColor="#FDCD01" /></radialGradient>
        <radialGradient id="paint5_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-4.03528 4.36954 -12.5879 -11.1435 8.34205 1.83465)" gradientUnits="userSpaceOnUse"><stop offset="0.315904" stopColor="#FF4C3C" /><stop offset="1" stopColor="#FF9F13" /></radialGradient>
        <radialGradient id="paint6_radial_google_reg" cx="0" cy="0" r="1" gradientTransform="matrix(-10.8777 -5.89867 8.17553 -14.4521 14.3253 23.488)" gradientUnits="userSpaceOnUse"><stop offset="0.231273" stopColor="#0FBC5F" /><stop offset="1" stopColor="#86C504" /></radialGradient>
        <linearGradient id="paint7_linear_google_reg" x1="9.90308" y1="19.719" x2="12.6355" y2="19.719" gradientUnits="userSpaceOnUse"><stop stopColor="#0FBC5C" /><stop offset="1" stopColor="#0CBA65" /></linearGradient>
      </defs>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 22 22">
      <g clipPath="url(#clip0_apple_reg)">
        <path d={svgPaths.p31c8f500} fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_apple_reg">
          <rect fill="white" height="22" width="22" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MailOAuthIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 22 22">
      <path d={svgPaths.p3fc94c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p12f6c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

// ─── Field input ──────────────────────────────────────────────────────────────

function FieldInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  trailingButton,
  optional,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  trailingButton?: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label
        style={{
          display: "block",
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.55px",
          color: "#71717a",
        }}
      >
        {label}
        {optional && (
          <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, marginLeft: "6px", color: "#525252" }}>
            (opcional)
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            backgroundColor: "rgba(8,11,15,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "40px",
            paddingRight: trailingButton ? "44px" : "12px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#ffffff",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8bf2c1"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
        />
        <div
          className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#525252" }}
        >
          {icon}
        </div>
        {trailingButton && (
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
            {trailingButton}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const bookmakers = BOOKMAKERS.map((b) => ({ image: b.img, alt: b.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#525252", padding: 0, lineHeight: 0 }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#a1a1aa"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#525252"; }}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#080b0f" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
        <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-[12px]" style={{ backgroundColor: "rgba(1,200,150,0.1)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <div
          className="hidden lg:flex w-1/2 flex-col justify-center p-10"
          style={{ backgroundColor: "#0d0d0d" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OddfixLogo />

            <div className="mt-20 space-y-5">
              <div className="space-y-2">
                <h1
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "43px",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: "1.1",
                  }}
                >
                  <span style={{ color: "#ffffff" }}>Lucre em qualquer resultado.</span>
                  <br />
                  <span style={{ color: "#8bf2c1" }}>Não importa quem ganhar.</span>
                </h1>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "18px",
                    color: "#71717a",
                    lineHeight: "1.6",
                    maxWidth: "480px",
                  }}
                >
                  A Oddfix identifica oportunidades de arbitragem esportiva em tempo real, em 134 casas de apostas. Seu lucro é matemático, não sorte.
                </p>
              </div>

              <div className="grid grid-cols-6 gap-2" style={{ maxWidth: "480px" }}>
                {bookmakers.map((b, i) => (
                  <BookmakerTile key={i} image={b.image} alt={b.alt} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────────── */}
        <div
          className="w-full lg:w-1/2 flex flex-col"
          style={{ backgroundColor: "#080b0f", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
            <motion.div
              className="w-full"
              style={{ maxWidth: "400px" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {/* Title block */}
              <div className="space-y-1 mb-8">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                    color: "#8bf2c1",
                  }}
                >
                  Crie sua conta
                </p>
                <h2
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "30px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Comece a lucrar hoje.
                </h2>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#71717a",
                  }}
                >
                  Crie sua conta gratuitamente.
                </p>
              </div>

              <div className="space-y-7">
                {/* OAuth buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <GoogleIcon />, label: "Google" },
                    { icon: <AppleIcon />, label: "Apple" },
                    { icon: <MailOAuthIcon />, label: "E-mail" },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center justify-center rounded-lg transition-colors"
                      style={{
                        backgroundColor: "rgba(8,11,15,0.5)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        height: "48px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,242,193,0.5)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="relative flex items-center">
                  <div className="flex-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
                  <span
                    className="px-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#525252",
                    }}
                  >
                    Ou continue com
                  </span>
                  <div className="flex-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FieldInput
                    label="Nome completo"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="João Silva"
                    icon={<User size={14} />}
                  />

                  <FieldInput
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="nome@email.com"
                    icon={<Mail size={14} />}
                  />

                  <FieldInput
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    placeholder="Mínimo 8 caracteres"
                    icon={<Lock size={14} />}
                    trailingButton={
                      <EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                    }
                  />

                  <FieldInput
                    label="Confirmar senha"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Repita a senha"
                    icon={<Lock size={14} />}
                    trailingButton={
                      <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
                    }
                  />

                  <FieldInput
                    label="Código de indicação"
                    type="text"
                    value={referralCode}
                    onChange={setReferralCode}
                    placeholder="Código de afiliado (opcional)"
                    icon={<Link2 size={14} />}
                    optional
                  />

                  {/* Terms checkbox */}
                  <label
                    className="flex items-start gap-3 cursor-pointer"
                    style={{ marginTop: "8px" }}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className="flex items-center justify-center rounded"
                        style={{
                          width: "18px",
                          height: "18px",
                          backgroundColor: acceptedTerms ? "#8bf2c1" : "rgba(8,11,15,0.5)",
                          border: `1px solid ${acceptedTerms ? "#8bf2c1" : "rgba(255,255,255,0.2)"}`,
                          borderRadius: "4px",
                          transition: "all 0.15s",
                        }}
                      >
                        {acceptedTerms && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#080b0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        color: "#71717a",
                        lineHeight: "1.5",
                      }}
                    >
                      Li e aceito os{" "}
                      <a href="#" style={{ color: "#8bf2c1", textDecoration: "none" }}>Termos de uso</a>
                      {" "}e{" "}
                      <a href="#" style={{ color: "#8bf2c1", textDecoration: "none" }}>Política de privacidade</a>
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      backgroundColor: "#8bf2c1",
                      color: "#080b0f",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      borderRadius: "4px",
                      height: "56px",
                      border: "none",
                      cursor: "pointer",
                      marginTop: "8px",
                      boxShadow: "0px 10px 15px -3px rgba(139,242,193,0.1), 0px 4px 6px -4px rgba(139,242,193,0.1)",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    Criar conta
                  </button>
                </form>

                {/* Login link */}
                <div className="text-center">
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#71717a",
                    }}
                  >
                    Já tem uma conta?{" "}
                    <Link
                      to="/login"
                      style={{
                        color: "#8bf2c1",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Entrar
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-t-lg"
            style={{
              backgroundColor: "rgba(8,11,15,0.5)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <motion.div
              animate={{ opacity: [0.75, 0.3, 0.75] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#8bf2c1",
                boxShadow: "0 0 8px rgba(67,229,177,0.6)",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                color: "#71717a",
                letterSpacing: "0.025em",
              }}
            >
              274 oportunidades de arbitragem ao vivo agora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
