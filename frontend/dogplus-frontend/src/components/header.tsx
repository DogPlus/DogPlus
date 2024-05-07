import react from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  back?: boolean;
}

export const Header: React.FC<HeaderProps> = ({title, back}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md p-4 flex flex-row justify-center items-center h-14">
      {back &&
        <button className="absolute left-4 top-0 flex items-center h-14" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
        </button>
      }
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div></div> {/* This empty div will occupy the space to push the button all the way to the right */}
    </div>
  );
}

