import type { FC } from 'react';

interface LoginModalTriggerProps {
  id: string;
}

const LoginModalTrigger: FC<LoginModalTriggerProps> = ({ id, children }) => {
  return (
    <label className="cursor-pointer shrink-0" htmlFor={id}>
      {children}
    </label>
  );
};

export default LoginModalTrigger;
