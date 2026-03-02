export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(24,25)">
        <g transform="rotate(-40)">
          <rect x="-1" y="-18" width="2" height="15" rx="1" fill="#ff6b00"/>
          <polygon points="0,-19 -1.5,-21 0,-26 1.5,-21" fill="#ff6b00"/>
          <rect x="-3" y="-4" width="6" height="2.5" rx="1" fill="#888"/>
        </g>
        <g transform="rotate(-20)">
          <rect x="-1" y="-18" width="2" height="15" rx="1" fill="#ff8c00"/>
          <polygon points="0,-19 -1.5,-21 0,-26 1.5,-21" fill="#ff8c00"/>
          <rect x="-3" y="-4" width="6" height="2.5" rx="1" fill="#888"/>
        </g>
        <g transform="rotate(0)">
          <rect x="-1.2" y="-20" width="2.4" height="17" rx="1" fill="#ffa500"/>
          <polygon points="0,-21 -2,-24 0,-29 2,-24" fill="#ffa500"/>
          <rect x="-3.5" y="-4" width="7" height="3" rx="1" fill="#aaa"/>
        </g>
        <g transform="rotate(20)">
          <rect x="-1" y="-18" width="2" height="15" rx="1" fill="#ff8c00"/>
          <polygon points="0,-19 -1.5,-21 0,-26 1.5,-21" fill="#ff8c00"/>
          <rect x="-3" y="-4" width="6" height="2.5" rx="1" fill="#888"/>
        </g>
        <g transform="rotate(40)">
          <rect x="-1" y="-18" width="2" height="15" rx="1" fill="#ff6b00"/>
          <polygon points="0,-19 -1.5,-21 0,-26 1.5,-21" fill="#ff6b00"/>
          <rect x="-3" y="-4" width="6" height="2.5" rx="1" fill="#888"/>
        </g>
        <circle cx="0" cy="0" r="5" fill="#1a1a1a" stroke="#ff8c00" strokeWidth="1.5"/>
        <circle cx="0" cy="0" r="2.5" fill="#ff8c00"/>
      </g>
      <text x="54" y="22" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="14" fill="white" letterSpacing="2">FIVE</text>
      <text x="54" y="40" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="14" fill="#ff8c00" letterSpacing="1">CUSTLASS</text>
    </svg>
  );
};
