import svgPaths from "./svg-l6ncabwu38";
import imgImage14 from "./9559b066627952b9db6bae63d11fafc38d000512.png";
import imgImage35 from "./d3d28d72d5b34e59a563bb2f4da04ed97308757d.png";
import imgImage36 from "./b4bbe166d57c70a9a6b30650b81ae259c9104074.png";
import imgImage37 from "./e6a6ce120c07cfb8e531824432ed790d9aa19fae.png";
import imgImage38 from "./6d9adc2751cd6b85e4284ad34e35588f1aac967d.png";
import imgImage39 from "./359a2e5fef837b85f44471de8e980c07dcc01c2c.png";
import imgImage40 from "./dd3377e61058bd8c4cb3bc260717dc3415a45ba6.png";
import imgImage41 from "./875eb5dc230d6da6d474abdd7e1de8dfafa4f3be.png";
import imgImage42 from "./e6987a560771b83080400d88a72d64683692e4db.png";

function Oddfix() {
  return (
    <div className="col-1 h-[25.448px] ml-0 mt-0 relative row-1 w-[107.288px]" data-name="oddfix">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 107.288 25.4484">
        <g id="oddfix">
          <path d={svgPaths.p26f5a00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2fe7d100} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p24bb3b00} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pbe3ec80} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p367711e0} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[36.71px] mt-[6.26px] place-items-start relative row-1">
      <Oddfix />
    </div>
  );
}

function SimboloOddfix() {
  return (
    <div className="col-1 h-[34.209px] ml-0 mt-0 relative row-1 w-[34.626px]" data-name="SIMBOLO-ODDFIX 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6265 34.2093">
        <g clipPath="url(#clip0_1_388)" id="SIMBOLO-ODDFIX 1">
          <path d={svgPaths.p2705be80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2d322d00} fill="var(--fill-0, #8BF2C1)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_388">
            <rect fill="white" height="34.2093" width="34.6265" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group />
      <SimboloOddfix />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center leading-[0] not-italic p-[12px] relative size-full whitespace-nowrap">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[#71717a] text-[16px]">
            <p className="leading-[24px]">R$</p>
          </div>
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[18px] text-white">
            <p className="leading-[28px]">1.000,00</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function InvestmentInput() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Investment Input">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase w-full">
        <p className="leading-[16.5px]">Investimento por Cerco</p>
      </div>
      <Container />
    </div>
  );
}

function InvestmentInputMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Investment Input:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[20px] relative size-full">
        <InvestmentInput />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#8bf2c1] col-1 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative size-full">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#080b0f] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Maior Lucro</p>
          </div>
          <div className="h-[8px] relative shrink-0 w-[14px]" data-name="Icon">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path d={svgPaths.p1f2a9b50} fill="var(--fill-0, #080B0F)" id="Icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#0e1116] col-1 content-stretch flex items-center justify-self-start pl-[16px] pr-[181.25px] py-[12px] relative rounded-[8px] row-3 self-start shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Próx. Início</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#0e1116] col-1 content-stretch flex items-center justify-self-start pl-[16px] pr-[157.25px] py-[12px] relative rounded-[8px] row-2 self-start shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Mais Recentes</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[___44px_44px_44px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function SortToggles() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Sort Toggles">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase w-full">
        <p className="leading-[16.5px]">Ordenar por</p>
      </div>
      <Container1 />
    </div>
  );
}

function SortTogglesMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Sort Toggles:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <SortToggles />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#8bf2c1] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[8px] relative rounded-[4px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#080b0f] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">2 Opções</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[8px] relative rounded-[4px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">3 Opções</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#0e1116] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[4px] relative size-full">
          <Button3 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function OptionsCount() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Options Count">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase w-full">
        <p className="leading-[16.5px]">Quantidade de Opções</p>
      </div>
      <Background />
    </div>
  );
}

function OptionsCountMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Options Count:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <OptionsCount />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap">
        <p className="leading-[16.5px]">Faixa de Lucro</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8bf2c1] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">0.5% - 15%</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container3 />
    </div>
  );
}

function Container5() {
  return <div className="flex-[1_0_0] h-[16px] min-w-px" data-name="Container" />;
}

function Container4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 right-0 top-[-5px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#2c2f34] h-[6px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <Container4 />
    </div>
  );
}

function ProfitRange() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Profit Range">
      <Container2 />
      <Input />
    </div>
  );
}

function ProfitRangeMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Profit Range:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ProfitRange />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[11px] tracking-[0.55px] uppercase w-full">
        <p className="leading-[16.5px]">Casas de Apostas</p>
      </div>
    </div>
  );
}

function BookieItem() {
  return (
    <div className="bg-[#0e0e0e] col-1 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-1 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex h-[12.159px] items-center justify-center relative shrink-0 w-[62.79px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "18" } as React.CSSProperties}>
        <div className="-skew-x-10 flex-none scale-y-98">
          <div className="h-[12.346px] relative w-[60.646px]" data-name="image 14">
            <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage14} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem1() {
  return (
    <div className="bg-[#0e0e0e] col-2 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-1 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage35} />
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem2() {
  return (
    <div className="bg-[#0e0e0e] col-3 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-1 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem3() {
  return (
    <div className="bg-[#0e0e0e] col-1 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-2 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[36.04%] left-0 max-w-none top-[31.98%] w-full" src={imgImage37} />
        </div>
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem4() {
  return (
    <div className="bg-[#0e0e0e] col-2 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-2 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[82.48%] left-0 max-w-none top-[8.76%] w-full" src={imgImage38} />
        </div>
      </div>
      <div className="absolute bg-[#71717a] right-[7px] rounded-[12px] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem5() {
  return (
    <div className="bg-[#0e0e0e] col-3 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-2 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[58.25%] left-0 max-w-none top-[20.87%] w-full" src={imgImage39} />
        </div>
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem6() {
  return (
    <div className="bg-[#0e0e0e] col-1 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-3 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage40} />
      </div>
      <div className="absolute bg-[#71717a] right-[7px] rounded-[12px] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem7() {
  return (
    <div className="bg-[#0e0e0e] col-2 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-3 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage41} />
      </div>
      <div className="absolute bg-[#8bf2c1] right-[7px] rounded-[12px] shadow-[0px_0px_8px_0px_rgba(67,229,177,0.6)] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function BookieItem8() {
  return (
    <div className="bg-[#0e0e0e] col-3 content-stretch flex flex-col h-[54.159px] items-center justify-center px-[9px] py-[21px] relative rounded-[4px] row-3 shrink-0 w-[85px]" data-name="Bookie Item">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="h-[21.159px] relative shrink-0 w-[61px]" data-name="image 35">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage42} />
      </div>
      <div className="absolute bg-[#71717a] right-[7px] rounded-[12px] size-[6px] top-[7px]" data-name="Background+Shadow" />
    </div>
  );
}

function Container6() {
  return (
    <div className="gap-x-[8px] grid-cols-[repeat(3,fit-content(100%))] grid-rows-[repeat(3,fit-content(100%))] inline-grid relative shrink-0" data-name="Container">
      <BookieItem />
      <BookieItem1 />
      <BookieItem2 />
      <BookieItem3 />
      <BookieItem4 />
      <BookieItem5 />
      <BookieItem6 />
      <BookieItem7 />
      <BookieItem8 />
    </div>
  );
}

function BookmakersGrid() {
  return (
    <div className="relative shrink-0 w-full" data-name="Bookmakers Grid">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start relative size-full">
        <Label1 />
        <Container6 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[23px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <g id="Frame 1">
          <path d="M10.2222 17.0132H12.7778" id="Line 1" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.91667" />
          <path d={svgPaths.p37cbc340} id="Line 2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.91667" />
          <path d="M3.83333 6.791L19.1667 6.791" id="Line 3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.91667" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#8bf2c1] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#080b0f] text-[16px] text-center tracking-[-0.8px] uppercase whitespace-nowrap">
            <p className="leading-[24px]">Filtrar Resultados</p>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #A1A1AA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Account</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Container7 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #A1A1AA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Logout</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Container9 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute left-[24px] top-[1018px] w-[271px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(67,73,51,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[17px] relative size-full">
        <Link />
        <Link1 />
      </div>
    </div>
  );
}

function AsideSidebarFilterControls() {
  return (
    <div className="absolute bg-[#15181e] h-[1167px] left-0 top-0 w-[320px]" data-name="Aside - Sidebar - Filter Controls">
      <div className="content-stretch flex flex-col gap-[40px] items-start overflow-clip pl-[24px] pr-[25px] py-[24px] relative rounded-[inherit] size-full">
        <Group1 />
        <InvestmentInputMargin />
        <SortTogglesMargin />
        <OptionsCountMargin />
        <ProfitRangeMargin />
        <BookmakersGrid />
        <Button5 />
        <HorizontalBorder />
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.2)] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.5px] whitespace-nowrap">
        <p className="leading-[28px]">Lakers vs. Warriors</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[12px] shrink-0" data-name="Background">
      <div aria-hidden="true" className="absolute border border-[#8bf2c1] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-white tracking-[-0.55px] uppercase w-[77.36px]">
        <p className="leading-[16.5px]">+8.86% LUCRO</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Background1 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[20px]">NBA • Hoje às 22:00</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[0.5px] uppercase w-[112.72px]">
        <p className="leading-[15px]">Retorno Estimado</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#43e5b1] text-[18px] text-right tracking-[-0.9px] whitespace-nowrap">
        <p className="leading-[28px]">R$ 1.088,60</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112.72px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[11.308px] relative shrink-0 w-[6.708px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.70764 11.3076">
        <g id="Container">
          <path d={svgPaths.p69ffb00} fill="var(--fill-0, #E5E2E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#2c2f34] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container19 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Container16 />
      <Button6 />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Container12 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container22 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[57.78px]">
        <p className="leading-[20px]">BETANO</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container23 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Vencedor do Jogo (1)</p>
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container24 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">1.95</p>
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[1px] uppercase w-[47.38px]">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container25 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 558,26</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BetLeg() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Bet Leg 1">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container21 />
        <VerticalBorder />
        <VerticalBorder1 />
        <VerticalBorder2 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container27 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[70.98px]">
        <p className="leading-[20px]">PINNACLE</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container28 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[145.55px]">
          <p className="leading-[20px]">Vencedor do Jogo (2)</p>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container29 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.15</p>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[1px] uppercase w-[47.38px]">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container30 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 441,74</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BetLeg1() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Bet Leg 2">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container26 />
        <VerticalBorder3 />
        <VerticalBorder4 />
        <VerticalBorder5 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[24px] px-[24px] relative size-full">
        <BetLeg />
        <BetLeg1 />
      </div>
    </div>
  );
}

function ArticleOpportunityCard() {
  return (
    <div className="bg-[#15181e] relative rounded-[12px] shrink-0 w-full" data-name="Article - Opportunity Card 1">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container11 />
        <Container20 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.5px] whitespace-nowrap">
        <p className="leading-[28px]">Manchester City vs. Liverpool</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[12px] shrink-0" data-name="Background">
      <div aria-hidden="true" className="absolute border border-[#8bf2c1] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-white tracking-[-0.55px] uppercase w-[73.7px]">
        <p className="leading-[16.5px]">+5.12% LUCRO</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Background2 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[20px]">Premier League • Amanhã às 09:30</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[0.5px] uppercase w-[112.72px]">
        <p className="leading-[15px]">Retorno Estimado</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#43e5b1] text-[18px] text-right tracking-[-0.9px] whitespace-nowrap">
        <p className="leading-[28px]">R$ 1.051,20</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112.72px]" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[11.308px] relative shrink-0 w-[6.708px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.70764 11.3076">
        <g id="Container">
          <path d={svgPaths.p69ffb00} fill="var(--fill-0, #E5E2E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#2c2f34] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container39 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Container36 />
      <Button7 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Container32 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container42 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[20px]">BET365</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container43 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[98.84px]">
          <p className="leading-[20px]">Over 2.5 Goals</p>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container44 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.08</p>
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right uppercase whitespace-nowrap">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container45 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 505,38</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container41 />
        <VerticalBorder6 />
        <VerticalBorder7 />
        <VerticalBorder8 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container47 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[20px]">SUPERBET</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder9() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container48 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[107.78px]">
          <p className="leading-[20px]">Under 2.5 Goals</p>
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container49 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.12</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right uppercase whitespace-nowrap">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container50 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 494,62</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container46 />
        <VerticalBorder9 />
        <VerticalBorder10 />
        <VerticalBorder11 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[24px] px-[24px] relative size-full">
        <Overlay />
        <Overlay1 />
      </div>
    </div>
  );
}

function ArticleOpportunityCard1() {
  return (
    <div className="bg-[#15181e] relative rounded-[12px] shrink-0 w-full" data-name="Article - Opportunity Card 2">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container31 />
        <Container40 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.5px] whitespace-nowrap">
        <p className="leading-[28px]">Novak Djokovic vs. Carlos Alcaraz</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[12px] shrink-0" data-name="Background">
      <div aria-hidden="true" className="absolute border border-[#8bf2c1] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-white tracking-[-0.55px] uppercase w-[81.83px]">
        <p className="leading-[16.5px]">+12.45% LUCRO</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Background3 />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[20px]">ATP Paris • Começando em 15min</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[0.5px] uppercase w-[112.72px]">
        <p className="leading-[15px]">Retorno Estimado</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#43e5b1] text-[18px] text-right tracking-[-0.9px] whitespace-nowrap">
        <p className="leading-[28px]">R$ 1.124,50</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112.72px]" data-name="Container">
      <Container57 />
      <Container58 />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[11.308px] relative shrink-0 w-[6.708px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.70764 11.3076">
        <g id="Container">
          <path d={svgPaths.p69ffb00} fill="var(--fill-0, #E5E2E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#2c2f34] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container59 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Container56 />
      <Button8 />
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Container52 />
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start relative size-full">
        <Container62 />
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">PIXBET</p>
        </div>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container63 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Vencedor Set 1</p>
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container64 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.25</p>
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right uppercase whitespace-nowrap">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container65 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 500,00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlayVerticalBorder() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#8bf2c1] border-l-2 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex items-start pl-[18px] pr-[16px] py-[16px] relative size-full">
        <Container61 />
        <VerticalBorder12 />
        <VerticalBorder13 />
        <VerticalBorder14 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start relative size-full">
        <Container67 />
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">BLAZE</p>
        </div>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container68 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Vencedor Set 1</p>
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder16() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container69 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.25</p>
        </div>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right uppercase whitespace-nowrap">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder17() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container70 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 500,00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlayVerticalBorder1() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#8bf2c1] border-l-2 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex items-start pl-[18px] pr-[16px] py-[16px] relative size-full">
        <Container66 />
        <VerticalBorder15 />
        <VerticalBorder16 />
        <VerticalBorder17 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[24px] px-[24px] relative size-full">
        <OverlayVerticalBorder />
        <OverlayVerticalBorder1 />
      </div>
    </div>
  );
}

function ArticleOpportunityCard2() {
  return (
    <div className="bg-[#15181e] relative rounded-[12px] shrink-0 w-full" data-name="Article - Opportunity Card 3">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container51 />
        <Container60 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.5px] whitespace-nowrap">
        <p className="leading-[28px]">Lakers vs. Warriors</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[12px] shrink-0" data-name="Background">
      <div aria-hidden="true" className="absolute border border-[#8bf2c1] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-white tracking-[-0.55px] uppercase w-[77.36px]">
        <p className="leading-[16.5px]">+8.86% LUCRO</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Background4 />
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
        <p className="leading-[20px]">NBA • Hoje às 22:00</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container73 />
      <Container74 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[0.5px] uppercase w-[112.72px]">
        <p className="leading-[15px]">Retorno Estimado</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#43e5b1] text-[18px] text-right tracking-[-0.9px] whitespace-nowrap">
        <p className="leading-[28px]">R$ 1.088,60</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[112.72px]" data-name="Container">
      <Container77 />
      <Container78 />
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[11.308px] relative shrink-0 w-[6.708px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.70764 11.3076">
        <g id="Container">
          <path d={svgPaths.p69ffb00} fill="var(--fill-0, #E5E2E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#2c2f34] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container79 />
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Container76 />
      <Button9 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Container72 />
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container82 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[57.78px]">
        <p className="leading-[20px]">BETANO</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container83 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Vencedor do Jogo (1)</p>
        </div>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder19() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container84 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">1.95</p>
        </div>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[1px] uppercase w-[47.38px]">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container85 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 558,26</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BetLeg2() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Bet Leg 1">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container81 />
        <VerticalBorder18 />
        <VerticalBorder19 />
        <VerticalBorder20 />
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[15px]">Bookmaker</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.5px] items-start min-w-px relative" data-name="Container">
      <Container87 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[70.98px]">
        <p className="leading-[20px]">PINNACLE</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Mercado</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder21() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[3.5px] items-start pl-[17px] relative size-full">
        <Container88 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[145.55px]">
          <p className="leading-[20px]">Vencedor do Jogo (2)</p>
        </div>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Odds</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder22() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[17px] relative size-full">
        <Container89 />
        <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center leading-[0] not-italic relative shrink-0 text-[#e0ea87] text-[18px] whitespace-nowrap">
          <p className="leading-[28px]">2.15</p>
        </div>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-right tracking-[1px] uppercase w-[47.38px]">
          <p className="leading-[15px]">Aposta</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-end pl-[17px] relative size-full">
          <Container90 />
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white whitespace-nowrap">
            <p className="leading-[24px]">R$ 441,74</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BetLeg3() {
  return (
    <div className="bg-[rgba(8,11,15,0.5)] relative rounded-[8px] shrink-0 w-full" data-name="Bet Leg 2">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Container86 />
        <VerticalBorder21 />
        <VerticalBorder22 />
        <VerticalBorder23 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[24px] px-[24px] relative size-full">
        <BetLeg2 />
        <BetLeg3 />
      </div>
    </div>
  );
}

function ArticleOpportunityCard3() {
  return (
    <div className="bg-[#15181e] relative rounded-[12px] shrink-0 w-full" data-name="Article - Opportunity Card 4">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container71 />
        <Container80 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[352px] top-[88px] w-[1032px]">
      <ArticleOpportunityCard />
      <ArticleOpportunityCard1 />
      <ArticleOpportunityCard2 />
      <ArticleOpportunityCard3 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#8bf2c1] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8bf2c1] text-[16px] tracking-[-0.8px] uppercase whitespace-nowrap">
        <p className="leading-[24px]">Pre-Live</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[16px] tracking-[-0.8px] uppercase whitespace-nowrap">
        <p className="leading-[24px]">Live</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Nav">
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[8px]" data-name="Container">
      <div className="absolute bg-[#8bf2c1] inset-0 opacity-75 rounded-[12px]" data-name="Background" />
      <div className="bg-[#8bf2c1] rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8bf2c1] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">274 sinais</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#2c2f34] content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative rounded-[12px] shrink-0" data-name="Background">
      <Container92 />
      <Container93 />
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Container">
      <Nav />
      <Background5 />
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#8bf2c1] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0d0d0d] text-[10px] text-center uppercase whitespace-nowrap">
          <p className="leading-[15px]">Plataforma</p>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[10px] text-center uppercase whitespace-nowrap">
          <p className="leading-[15px]">Afiliados</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[#0e1116] content-stretch flex items-start p-[5px] relative rounded-[12px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Button10 />
      <Button11 />
    </div>
  );
}

function Container96() {
  return (
    <div className="h-[19.192px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9999 19.1922">
        <g id="Container">
          <path d={svgPaths.p1a177c00} fill="var(--fill-0, #A1A1AA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[19px] relative shrink-0 w-[18.792px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.7922 18.9999">
        <g id="Container">
          <path d={svgPaths.p32430b00} fill="var(--fill-0, #A1A1AA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-center relative shrink-0" data-name="Container">
      <Container96 />
      <Container97 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[16px] relative shrink-0" data-name="Margin">
      <Container95 />
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-right text-white w-[73.5px]">
        <p className="leading-[12px]">João Silva</p>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="relative shrink-0 w-[73.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container99 />
      </div>
    </div>
  );
}

function UserProfile() {
  return <div className="bg-[#2c2f34] rounded-[90px] shadow-[0px_0px_0px_2px_rgba(255,255,255,0.1)] shrink-0 size-[36px]" data-name="User profile" />;
}

function VerticalBorder24() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[17px] relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(67,73,51,0.2)] border-l border-solid inset-0 pointer-events-none" />
      <Container98 />
      <UserProfile />
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Margin />
      <VerticalBorder24 />
    </div>
  );
}

function HeaderTopNavigationBarSharedComponentStrategy() {
  return (
    <div className="absolute bg-[#080b0f] content-stretch flex h-[64px] items-center justify-between left-[320px] px-[32px] top-0 w-[1096px]" data-name="Header - Top Navigation Bar (Shared Component Strategy)">
      <Container91 />
      <OverlayBorder />
      <Container94 />
    </div>
  );
}

export default function Body() {
  return (
    <div className="bg-[#080b0f] relative size-full" data-name="Body">
      <AsideSidebarFilterControls />
      <Frame1 />
      <HeaderTopNavigationBarSharedComponentStrategy />
    </div>
  );
}