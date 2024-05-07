import react from 'react';

interface LabelProps {
  icon: string;
  color: 'blue' | 'yellow';
  text: string | undefined;
}

export const Label: React.FC<LabelProps> = ({icon, color, text}) => {
  return (
      <div className={`flex items-center flex-row gap-4 bg-${color}-100 text-${color}-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
        <div className={`fas ${icon}`}/>
        {text}
      </div>
  ); 
}
  
