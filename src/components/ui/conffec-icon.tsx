interface ConffecIconProps {
  className?: string;
  size?: number;
}

export default function ConffecIcon({ className = "w-6 h-6", size }: ConffecIconProps) {
  return (
    <img 
      src="/lovable-uploads/a548bfe4-dc26-4f8b-8800-1caa5d60d0d5.png" 
      alt="Conffec Logo" 
      className={className}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}