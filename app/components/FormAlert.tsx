import { FC } from 'react';
import ExclamationCircleIcon from '~/components/icons/ExclamationCircle';

const FormAlert: FC = ({ children }) => {
  return (
    <div className="flex items-center mt-2">
      <div>
        <ExclamationCircleIcon />
      </div>
      <div className="text-xs ml-2">{children}</div>
    </div>
  );
};

export default FormAlert;
