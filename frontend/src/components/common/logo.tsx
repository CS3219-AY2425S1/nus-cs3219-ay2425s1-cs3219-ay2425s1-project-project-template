type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return <p className={`font-mono ${className}`}>PeerPrep</p>;
};
