import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/Login/svg-a3ywtog005";
import { imgGroup } from "../../imports/Login/svg-oxgvh";
import { BOOKMAKERS } from "../constants/bookmakers";

function OddfixLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[34.626px] h-[34.209px] relative shrink-0">
        <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 34.6265 34.2093">
          <g clipPath="url(#clip0_logo)">
            <path d={svgPaths.p2705be80} fill="white" />
            <path d={svgPaths.p2d322d00} fill="#8BF2C1" />
          </g>
          <defs>
            <clipPath id="clip0_logo">
              <rect fill="white" height="34.2093" width="34.6265" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="w-[107.288px] h-[25.448px] relative shrink-0">
        <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 107.288 25.4484">
          <g>
            <path d={svgPaths.p26f5a00} fill="white" />
            <path d={svgPaths.p2fe7d100} fill="white" />
            <path d={svgPaths.p24bb3b00} fill="white" />
            <path d={svgPaths.pbe3ec80} fill="white" />
            <path d={svgPaths.p367711e0} fill="white" />
          </g>
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
      <img
        src={image}
        alt={alt}
        className="object-contain block"
        style={{ height: "32px", width: "auto", maxWidth: "100%" }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_google_login" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="22">
        <path d="M21.7887 8.95924H11.2343V13.1884H17.2989C17.2014 13.7869 16.9825 14.3757 16.662 14.9126C16.2947 15.5277 15.8406 15.996 15.3752 16.3526C13.9811 17.4209 12.3557 17.6394 11.227 17.6394C8.3755 17.6394 5.93911 15.7964 4.99594 13.2922C4.95788 13.2013 4.9326 13.1074 4.90182 13.0147C4.6934 12.3773 4.57952 11.7023 4.57952 11.0007C4.57952 10.2705 4.70284 9.57159 4.92769 8.91147C5.81459 6.30796 8.3059 4.36339 11.229 4.36339C11.817 4.36339 12.3831 4.43337 12.9201 4.57297C14.1471 4.89198 15.0151 5.52028 15.547 6.01726L18.7562 2.87444C16.804 1.08457 14.2592 2.70616e-09 11.2237 2.70616e-09C8.79693 -5.2231e-05 6.55646 0.75605 4.72047 2.03389C3.23153 3.07018 2.0104 4.45764 1.18628 6.06903C0.419733 7.56311 0 9.21883 0 10.999C0 12.7793 0.420375 14.4523 1.18693 15.9325V15.9425C1.99659 17.514 3.1806 18.8671 4.61964 19.8987C5.87679 20.7998 8.13099 22 11.2237 22C13.0022 22 14.5785 21.6793 15.9686 21.0784C16.9714 20.6449 17.8599 20.0795 18.6643 19.3528C19.7272 18.3927 20.5597 17.205 21.1279 15.8386C21.6961 14.4722 22 12.927 22 11.2518C22 10.4716 21.9216 9.67927 21.7887 8.95916V8.95924Z" fill="white" />
      </mask>
      <g mask="url(#mask0_google_login)">
        <g filter="url(#filter0_f_google_login)">
          <path d="M-0.127075 11.0469C-0.115409 12.7991 0.383875 14.6069 1.13962 16.0663V16.0764C1.68569 17.1362 2.432 17.9734 3.28204 18.803L8.41606 16.9297C7.44473 16.4363 7.29652 16.1339 6.60024 15.5822C5.8887 14.8648 5.35838 14.0411 5.02812 13.0753H5.01482L5.02812 13.0652C4.81085 12.4274 4.78942 11.7504 4.7814 11.0469H-0.127075Z" fill="url(#paint0_radial_google_login)" />
        </g>
        <g filter="url(#filter1_f_google_login)">
          <path d="M11.2693 -0.106888C10.7618 1.67584 10.9559 3.40871 11.2693 4.41697C11.8553 4.4174 12.4198 4.48725 12.955 4.62641C14.1821 4.94542 15.05 5.57374 15.5818 6.07072L18.8732 2.84761C16.9234 1.05987 14.5769 -0.104071 11.2693 -0.106888Z" fill="url(#paint1_radial_google_login)" />
        </g>
        <g filter="url(#filter2_f_google_login)">
          <path d="M11.2583 -0.120987C8.76922 -0.121041 6.47124 0.654472 4.58812 1.96512C3.88892 2.45176 3.24727 3.01391 2.67592 3.63904C2.52625 5.04325 3.79638 6.76916 6.31165 6.75487C7.53204 5.33528 9.33697 4.41681 11.3459 4.41681C11.3477 4.41681 11.3495 4.41696 11.3513 4.41697L11.2693 -0.120666C11.2656 -0.120668 11.262 -0.120987 11.2583 -0.120987Z" fill="url(#paint2_radial_google_login)" />
        </g>
        <g filter="url(#filter3_f_google_login)">
          <path d="M19.4735 11.555L17.2519 13.0812C17.1544 13.6797 16.9353 14.2685 16.6147 14.8054C16.2475 15.4205 15.7934 15.8889 15.328 16.2455C13.9368 17.3116 12.3157 17.5311 11.1873 17.532C10.0208 19.5186 9.81635 20.5136 11.2693 22.117C13.0672 22.1157 14.661 21.7911 16.0669 21.1834C17.0832 20.7441 17.9836 20.1711 18.7988 19.4346C19.876 18.4616 20.7197 17.258 21.2955 15.8732C21.8714 14.4885 22.1793 12.9226 22.1793 11.2249L19.4735 11.555Z" fill="url(#paint3_radial_google_login)" />
        </g>
        <g filter="url(#filter4_f_google_login)">
          <path d="M11.1051 8.7717V13.3222H21.7939C21.8879 12.699 22.1989 11.8926 22.1989 11.2249C22.1989 10.4448 22.1206 9.49181 21.9877 8.7717H11.1051Z" fill="#3086FF" />
        </g>
        <g filter="url(#filter5_f_google_login)">
          <path d="M2.7269 3.47839C2.06729 4.2001 1.50377 5.00789 1.05698 5.88151C0.290442 7.37559 -0.129272 9.19198 -0.129272 10.9722C-0.129272 10.9973 -0.127196 11.0218 -0.127029 11.0469C0.212446 11.6978 4.5622 11.5731 4.78145 11.0469C4.78117 11.0223 4.77841 10.9984 4.77841 10.9738C4.77841 10.2436 4.90176 9.70542 5.12661 9.04529C5.40399 8.23104 5.83831 7.48123 6.39368 6.8352C6.51957 6.67447 6.85538 6.32894 6.95335 6.12168C6.99068 6.04274 6.8856 5.99842 6.87972 5.97064C6.87315 5.93956 6.73227 5.96455 6.70071 5.9414C6.6005 5.86789 6.40205 5.82951 6.28155 5.79539C6.02399 5.72246 5.59714 5.56164 5.36006 5.39493C4.61064 4.86795 3.44111 4.23849 2.7269 3.47839Z" fill="url(#paint4_radial_google_login)" />
        </g>
        <g filter="url(#filter6_f_google_login)">
          <path d="M5.37617 5.97375C7.11399 7.02644 7.61376 5.4424 8.76917 4.94672L6.75929 0.778778C6.01995 1.08952 5.32142 1.47559 4.67329 1.92669C3.70537 2.60036 2.85061 3.42243 2.14453 4.35796L5.37617 5.97375Z" fill="url(#paint5_radial_google_login)" />
        </g>
        <g filter="url(#filter7_f_google_login)">
          <path d="M6.0834 16.6077C3.7506 17.4498 3.38539 17.4801 3.17065 18.9258C3.581 19.3262 4.02189 19.6966 4.4904 20.0324C5.74755 20.9336 8.16577 22.1338 11.2585 22.1338C11.2621 22.1338 11.2656 22.1335 11.2692 22.1335V17.4516C11.2669 17.4517 11.2642 17.4518 11.2618 17.4518C10.1037 17.4518 9.17828 17.1476 8.22942 16.6187C7.99547 16.4882 7.57102 16.8384 7.35526 16.6819C7.05767 16.466 6.34151 16.8679 6.0834 16.6077Z" fill="url(#paint6_radial_google_login)" />
        </g>
        <g opacity="0.5" filter="url(#filter8_f_google_login)">
          <path d="M9.90308 17.3042V22.0524C10.3358 22.103 10.7861 22.1338 11.2585 22.1338C11.7321 22.1338 12.1903 22.1095 12.6355 22.0648V17.3362C12.1366 17.4215 11.6667 17.4518 11.2619 17.4518C10.7957 17.4518 10.3424 17.3975 9.90308 17.3042Z" fill="url(#paint7_linear_google_login)" />
        </g>
      </g>
      <defs>
        <filter id="filter0_f_google_login" x="-0.342528" y="10.8314" width="8.974" height="8.18698" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter1_f_google_login" x="10.7418" y="-0.322341" width="8.3468" height="6.60852" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter2_f_google_login" x="2.44861" y="-0.33644" width="9.11816" height="7.30685" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter3_f_google_login" x="10.03" y="11.0095" width="12.3647" height="11.323" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter4_f_google_login" x="10.8896" y="8.55624" width="11.5247" height="4.98141" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter5_f_google_login" x="-0.344725" y="3.26294" width="7.52148" height="8.44204" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter6_f_google_login" x="0.629808" y="-0.735945" width="9.65408" height="8.57823" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.757361" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter7_f_google_login" x="2.9552" y="16.3735" width="8.52942" height="5.97578" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <filter id="filter8_f_google_login" x="9.68762" y="17.0887" width="3.16333" height="5.26053" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.107727" result="effect1_foregroundBlur_google_login" />
        </filter>
        <radialGradient id="paint0_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-0.457161 -10.9559 16.4368 -0.657455 8.31328 18.6379)" gradientUnits="userSpaceOnUse">
          <stop offset="0.141612" stopColor="#1ABD4D" />
          <stop offset="0.247515" stopColor="#6EC30D" />
          <stop offset="0.311547" stopColor="#8AC502" />
          <stop offset="0.366013" stopColor="#A2C600" />
          <stop offset="0.445673" stopColor="#C8C903" />
          <stop offset="0.540305" stopColor="#EBCB03" />
          <stop offset="0.615636" stopColor="#F7CD07" />
          <stop offset="0.699345" stopColor="#FDCD04" />
          <stop offset="0.771242" stopColor="#FDCE05" />
          <stop offset="0.860566" stopColor="#FFCE0A" />
        </radialGradient>
        <radialGradient id="paint1_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(7.76386 -1.86594e-05 -1.09124e-05 9.81682 18.5653 5.83751)" gradientUnits="userSpaceOnUse">
          <stop offset="0.408458" stopColor="#FB4E5A" />
          <stop offset="1" stopColor="#FF4540" />
        </radialGradient>
        <radialGradient id="paint2_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-10.8777 5.89868 8.17553 14.4521 14.3253 -1.54201)" gradientUnits="userSpaceOnUse">
          <stop offset="0.231273" stopColor="#FF4541" />
          <stop offset="0.311547" stopColor="#FF4540" />
          <stop offset="0.457516" stopColor="#FF4640" />
          <stop offset="0.540305" stopColor="#FF473F" />
          <stop offset="0.699346" stopColor="#FF5138" />
          <stop offset="0.771242" stopColor="#FF5B33" />
          <stop offset="0.860566" stopColor="#FF6C29" />
          <stop offset="1" stopColor="#FF8C18" />
        </radialGradient>
        <radialGradient id="paint3_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-19.7271 -25.2127 -9.50551 7.12939 11.431 20.6931)" gradientUnits="userSpaceOnUse">
          <stop offset="0.131546" stopColor="#0CBA65" />
          <stop offset="0.209784" stopColor="#0BB86D" />
          <stop offset="0.297297" stopColor="#09B479" />
          <stop offset="0.396257" stopColor="#08AD93" />
          <stop offset="0.477124" stopColor="#0AA6A9" />
          <stop offset="0.568425" stopColor="#0D9CC6" />
          <stop offset="0.667385" stopColor="#1893DD" />
          <stop offset="0.768727" stopColor="#258BF1" />
          <stop offset="0.858506" stopColor="#3086FF" />
        </radialGradient>
        <radialGradient id="paint4_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-1.39604 11.7812 16.6376 1.88988 10.3052 1.95685)" gradientUnits="userSpaceOnUse">
          <stop offset="0.366013" stopColor="#FF4E3A" />
          <stop offset="0.457516" stopColor="#FF8A1B" />
          <stop offset="0.540305" stopColor="#FFA312" />
          <stop offset="0.615636" stopColor="#FFB60C" />
          <stop offset="0.771242" stopColor="#FFCD0A" />
          <stop offset="0.860566" stopColor="#FECF0A" />
          <stop offset="0.915033" stopColor="#FECF08" />
          <stop offset="1" stopColor="#FDCD01" />
        </radialGradient>
        <radialGradient id="paint5_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-4.03528 4.36954 -12.5879 -11.1435 8.34205 1.83465)" gradientUnits="userSpaceOnUse">
          <stop offset="0.315904" stopColor="#FF4C3C" />
          <stop offset="0.603818" stopColor="#FF692C" />
          <stop offset="0.726837" stopColor="#FF7825" />
          <stop offset="0.884534" stopColor="#FF8D1B" />
          <stop offset="1" stopColor="#FF9F13" />
        </radialGradient>
        <radialGradient id="paint6_radial_google_login" cx="0" cy="0" r="1" gradientTransform="matrix(-10.8777 -5.89867 8.17553 -14.4521 14.3253 23.488)" gradientUnits="userSpaceOnUse">
          <stop offset="0.231273" stopColor="#0FBC5F" />
          <stop offset="0.311547" stopColor="#0FBC5F" />
          <stop offset="0.366013" stopColor="#0FBC5E" />
          <stop offset="0.457516" stopColor="#0FBC5D" />
          <stop offset="0.540305" stopColor="#12BC58" />
          <stop offset="0.699346" stopColor="#28BF3C" />
          <stop offset="0.771242" stopColor="#38C02B" />
          <stop offset="0.860566" stopColor="#52C218" />
          <stop offset="0.915033" stopColor="#67C30F" />
          <stop offset="1" stopColor="#86C504" />
        </radialGradient>
        <linearGradient id="paint7_linear_google_login" x1="9.90308" y1="19.719" x2="12.6355" y2="19.719" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0FBC5C" />
          <stop offset="1" stopColor="#0CBA65" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 22 22">
      <g clipPath="url(#clip0_apple)">
        <path d={svgPaths.p31c8f500} fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_apple">
          <rect fill="white" height="22" width="22" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 22 22">
      <g>
        <path d={svgPaths.p3fc94c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d={svgPaths.p12f6c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </g>
    </svg>
  );
}

function EmailIconSmall() {
  return (
    <svg className="w-[13.5px] h-[10.5px]" fill="none" viewBox="0 0 13.5 10.5">
      <path d={svgPaths.p29665200} fill="#525252" />
    </svg>
  );
}

function LockIconSmall() {
  return (
    <svg className="w-[10.5px] h-[13.5px]" fill="none" viewBox="0 0 10.5 13.5">
      <path d={svgPaths.p4d17d00} fill="#525252" />
    </svg>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const bookmakers = BOOKMAKERS.map((b) => ({ image: b.img, alt: b.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
        <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(1,200,150,0.1)] rounded-[12px] blur-[80px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-[55%] bg-gray-900 p-8 lg:p-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OddfixLogo />

            <div className="mt-12 lg:mt-20 space-y-5">
              <div className="space-y-2">
                <h1 className="text-[32px] lg:text-[43px] font-extrabold leading-tight tracking-[-0.04em]">
                  <span className="text-white">Lucre em qualquer resultado.</span>
                  <br />
                  <span className="text-green-500">Não importa quem ganhar.</span>
                </h1>
                <p className="text-[16px] lg:text-[18px] text-gray-400 leading-relaxed max-w-xl">
                  A Oddfix identifica oportunidades de arbitragem esportiva em tempo real, em 134 casas de apostas. Seu lucro é matemático, não sorte.
                </p>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 max-w-2xl">
                {bookmakers.map((bookie, idx) => (
                  <BookmakerTile key={idx} image={bookie.image} alt={bookie.alt} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-[45%] bg-gray-800 border-l border-gray-700/20 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
            <motion.div
              className="w-full max-w-[384px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2 mb-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-green-500">
                  Acesse sua conta
                </p>
                <h2 className="text-[30px] font-extrabold text-white tracking-[-0.025em]">
                  Bem-vindo de volta.
                </h2>
                <p className="text-[14px] text-gray-400">
                  Entre para ver as oportunidades ao vivo.
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-[rgba(8,11,15,0.5)] border border-gray-700/20 rounded-[8px] h-[48px] flex items-center justify-center hover:border-green-500/50 transition-colors">
                    <GoogleIcon />
                  </button>
                  <button className="bg-[rgba(8,11,15,0.5)] border border-gray-700/20 rounded-[8px] h-[48px] flex items-center justify-center hover:border-green-500/50 transition-colors">
                    <AppleIcon />
                  </button>
                  <button className="bg-[rgba(8,11,15,0.5)] border border-gray-700/20 rounded-[8px] h-[48px] flex items-center justify-center hover:border-green-500/50 transition-colors">
                    <MailIcon />
                  </button>
                </div>

                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-gray-700/5" />
                  <span className="px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                    Ou continue com
                  </span>
                  <div className="flex-1 border-t border-gray-700/5" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-400">
                      E-mail de acesso
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@email.com"
                        className="w-full bg-[rgba(8,11,15,0.5)] border border-gray-700/20 rounded-[8px] h-[48px] pl-10 pr-3 text-[14px] text-white placeholder:text-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                      />
                      <div className="absolute left-[14px] top-1/2 -translate-y-1/2">
                        <EmailIconSmall />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-end justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-400">
                        Senha
                      </label>
                      <Link to="/esqueci-senha" className="text-[11px] font-semibold text-green-600 hover:text-green-500 transition-colors">
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[rgba(8,11,15,0.5)] border border-gray-700/20 rounded-[8px] h-[48px] pl-10 pr-3 text-[14px] text-white placeholder:text-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                      />
                      <div className="absolute left-[15.75px] top-1/2 -translate-y-1/2">
                        <LockIconSmall />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold text-[16px] rounded-[4px] h-[56px] transition-colors shadow-[0px_10px_15px_-3px_rgba(139,242,193,0.1),0px_4px_6px_-4px_rgba(139,242,193,0.1)]"
                  >
                    Entrar na plataforma
                  </button>
                </form>

                <div className="pt-4 text-center">
                  <p className="text-[14px] text-gray-400">
                    Não tem uma conta?{" "}
                    <Link to="/cadastro" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                      Cadastre-se
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="backdrop-blur-sm bg-[rgba(8,11,15,0.5)] border-t border-gray-700/5 rounded-t-[8px] px-8 py-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-75 shadow-[0_0_8px_rgba(67,229,177,0.6)]" />
            <p className="text-[11px] font-medium text-gray-400 tracking-[0.025em]">
              274 oportunidades de arbitragem ao vivo agora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}