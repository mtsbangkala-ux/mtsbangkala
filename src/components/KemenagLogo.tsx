import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const KemenagLogo: React.FC<LogoProps> = ({
  className = '',
  size = 80,
  showText = false,
}) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <defs>
          <path
            id="kemenagRibbonTextPath"
            d="M 140 435 Q 250 460 360 435"
            fill="none"
          />
        </defs>

        {/* 1. Outer Golden Pentagon Frame with Black Stroke */}
        <polygon
          points="250,12 485,160 395,496 105,496 15,160"
          fill="#FFD200"
          stroke="#000000"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* 2. Inner Green Pentagon with Black Stroke */}
        <polygon
          points="250,38 460,170 380,472 120,472 40,170"
          fill="#007138"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* 3. Golden Star at Top (5-point) */}
        <polygon
          points="250,90 262,126 300,126 270,148 281,184 250,162 219,184 230,148 200,126 238,126"
          fill="#FFB600"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* 4. Left Branch: Kapas (Cotton Flower - 17 blooms) */}
        {/* Curved Stem */}
        <path
          d="M 158 385 C 105 320, 102 210, 222 135"
          fill="none"
          stroke="#82C341"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Calyx & Buds along branch */}
        <g fill="#68A530">
          <circle cx="145" cy="355" r="4" />
          <circle cx="130" cy="318" r="4" />
          <circle cx="120" cy="275" r="4" />
          <circle cx="118" cy="235" r="4" />
          <circle cx="128" cy="195" r="4" />
          <circle cx="148" cy="162" r="4" />
          <circle cx="180" cy="142" r="4" />
        </g>
        {/* White Cotton Blooms with Black Border */}
        <g fill="#FFFFFF" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round">
          {/* Cluster 1 */}
          <circle cx="145" cy="365" r="9" />
          <circle cx="137" cy="356" r="8" />
          <circle cx="153" cy="356" r="8" />
          {/* Cluster 2 */}
          <circle cx="132" cy="328" r="9" />
          <circle cx="122" cy="319" r="8" />
          <circle cx="138" cy="317" r="8" />
          {/* Cluster 3 */}
          <circle cx="120" cy="285" r="9.5" />
          <circle cx="110" cy="276" r="8.5" />
          <circle cx="128" cy="274" r="8.5" />
          {/* Cluster 4 */}
          <circle cx="118" cy="242" r="9.5" />
          <circle cx="108" cy="233" r="8.5" />
          <circle cx="125" cy="230" r="8.5" />
          {/* Cluster 5 */}
          <circle cx="128" cy="202" r="9.5" />
          <circle cx="118" cy="193" r="8.5" />
          <circle cx="136" cy="190" r="8.5" />
          {/* Cluster 6 */}
          <circle cx="148" cy="168" r="9" />
          <circle cx="140" cy="158" r="8" />
          <circle cx="157" cy="156" r="8" />
          {/* Top Cluster 7 */}
          <circle cx="178" cy="146" r="8.5" />
          <circle cx="192" cy="140" r="8" />
          <circle cx="174" cy="138" r="7.5" />
        </g>

        {/* 5. Right Branch: Padi (Rice Grains - 45 grains) */}
        {/* Main Curved Stem */}
        <path
          d="M 342 385 C 395 320, 398 210, 278 135"
          fill="none"
          stroke="#DCA008"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Rice Grains (Golden with black outlines) */}
        <g fill="#FFB600" stroke="#000000" strokeWidth="2" strokeLinejoin="round">
          <ellipse cx="350" cy="368" rx="9" ry="5.5" transform="rotate(-30 350 368)" />
          <ellipse cx="340" cy="354" rx="9" ry="5.5" transform="rotate(-45 340 354)" />
          <ellipse cx="362" cy="345" rx="9.5" ry="5.5" transform="rotate(-20 362 345)" />

          <ellipse cx="355" cy="326" rx="9.5" ry="5.5" transform="rotate(-40 355 326)" />
          <ellipse cx="372" cy="310" rx="9.5" ry="5.5" transform="rotate(-15 372 310)" />
          <ellipse cx="362" cy="292" rx="9.5" ry="5.5" transform="rotate(-35 362 292)" />

          <ellipse cx="378" cy="272" rx="9.5" ry="5.5" transform="rotate(-15 378 272)" />
          <ellipse cx="365" cy="256" rx="9.5" ry="5.5" transform="rotate(-30 365 256)" />
          <ellipse cx="378" cy="235" rx="9.5" ry="5.5" transform="rotate(-10 378 235)" />

          <ellipse cx="365" cy="216" rx="9.5" ry="5.5" transform="rotate(-25 365 216)" />
          <ellipse cx="374" cy="196" rx="9.5" ry="5.5" transform="rotate(-5 374 196)" />
          <ellipse cx="358" cy="180" rx="9.5" ry="5.5" transform="rotate(-25 358 180)" />

          <ellipse cx="360" cy="162" rx="9" ry="5.5" transform="rotate(10 360 162)" />
          <ellipse cx="342" cy="154" rx="9" ry="5.5" transform="rotate(-20 342 154)" />
          <ellipse cx="334" cy="140" rx="9" ry="5.5" transform="rotate(20 334 140)" />

          <ellipse cx="316" cy="138" rx="8.5" ry="5" transform="rotate(-10 316 138)" />
          <ellipse cx="302" cy="128" rx="8.5" ry="5" transform="rotate(30 302 128)" />
          <ellipse cx="282" cy="130" rx="8" ry="4.8" transform="rotate(0 282 130)" />
        </g>

        {/* 6. Rehal (Book Stand - X Shape Base) */}
        <g id="rehal">
          {/* Black Under Leg Blocks */}
          <polygon
            points="200,310 290,365 272,376 182,320"
            fill="#000000"
          />
          <polygon
            points="300,310 210,365 228,376 318,320"
            fill="#000000"
          />

          {/* White Front Crossed Stand Face with Black Stroke */}
          <polygon
            points="185,296 295,364 280,374 170,306"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <polygon
            points="315,296 205,364 220,374 330,306"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* 7. Open Holy Book (Kitab Suci / Al-Qur'an) */}
        <g id="openBook">
          {/* Main Book Body & Outline */}
          <path
            d="M 188 220 Q 220 214 250 228 Q 280 214 312 220 L 320 285 Q 280 274 250 292 Q 220 274 180 285 Z"
            fill="#FFC700"
            stroke="#000000"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Spine Divider */}
          <line
            x1="250"
            y1="228"
            x2="250"
            y2="292"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Page Wavy Text Lines */}
          <g stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M 198 238 Q 212 235 238 240" />
            <path d="M 197 248 Q 212 245 238 250" />
            <path d="M 196 258 Q 212 255 238 260" />
            <path d="M 195 268 Q 212 265 236 270" />
          </g>

          {/* Right Page Wavy Text Lines */}
          <g stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M 262 240 Q 288 235 302 238" />
            <path d="M 262 250 Q 288 245 303 248" />
            <path d="M 262 260 Q 288 255 304 258" />
            <path d="M 264 270 Q 288 265 305 268" />
          </g>
        </g>

        {/* 8. White Ribbon with "IKHLAS BERAMAL" */}
        <g id="ribbon">
          {/* Black Back Ribbon Folds */}
          <polygon points="90,388 68,422 135,420" fill="#000000" />
          <polygon points="410,388 432,422 365,420" fill="#000000" />

          {/* Left Ribbon Tail with swallowtail notch */}
          <polygon
            points="90,384 145,386 130,438 70,438 85,411"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Right Ribbon Tail with swallowtail notch */}
          <polygon
            points="410,384 355,386 370,438 430,438 415,411"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Main Curved Front Ribbon Banner */}
          <path
            d="M 85 390 Q 250 435 415 390 L 398 446 Q 250 495 102 446 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Bold Black Text "IKHLAS BERAMAL" on Path */}
          <text
            fill="#000000"
            fontSize="26"
            fontWeight="900"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            letterSpacing="2"
          >
            <textPath
              href="#kemenagRibbonTextPath"
              startOffset="50%"
              textAnchor="middle"
            >
              IKHLAS BERAMAL
            </textPath>
          </text>
        </g>
      </svg>

      {showText && (
        <div className="mt-2 text-center select-none">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-950 leading-tight">
            Kementerian Agama RI
          </p>
          <p className="text-[10px] text-emerald-800 font-semibold">
            Ikhlas Beramal
          </p>
        </div>
      )}
    </div>
  );
};
