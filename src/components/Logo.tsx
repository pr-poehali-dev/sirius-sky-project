export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* CS2-style shield icon */}
      <polygon points="16,4 30,10 30,26 16,36 2,26 2,10" fill="hsl(var(--primary))" opacity="0.9" />
      <polygon points="16,10 24,14 24,24 16,30 8,24 8,14" fill="#0a0a0a" />
      <text x="38" y="22" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="13" fill="white" letterSpacing="1">STRIKE</text>
      <text x="38" y="38" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="13" fill="hsl(var(--primary))" letterSpacing="1">FORCE</text>
    </svg>
  );
};
