import { FC } from 'react';

interface LoginModalTriggerProps {
  id: string;
}

const LoginModalTrigger: FC<LoginModalTriggerProps> = ({ id, children }) => {
  return (
    <label className="cursor-pointer" htmlFor={id}>
      {children}
    </label>
  );
};

export default LoginModalTrigger;
