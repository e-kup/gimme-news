import type { FC } from 'react';
import { useLocation, useNavigate } from '@remix-run/react';

interface LoginModalProps {
  id: 'login' | 'login-feed';
}

const content = {
  login: {
    title: 'Login to have access to bookmarks',
    description:
      'Article bookmarks are available for registered users. Login to unlock bookmarks.',
  },
  'login-feed': {
    title: 'Login to create personal feed',
    description:
      'Registered users can select topics of their interests. Login to unlock personal feed.',
  },
};

const LoginModal: FC<LoginModalProps> = ({ id }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateWithRedirect = () => {
    const searchParams = new URLSearchParams([
      ['redirectTo', location.pathname],
    ]);
    navigate(`/login?${searchParams}`);
  };

  const text = content[id];

  return (
    <div>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <div className="modal-box relative text-center">
          <h3 className="text-lg font-bold">{text.title}</h3>
          <p className="py-4 text-left">{text.description}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={navigateWithRedirect}
          >
            Login
          </button>
        </div>
      </label>
    </div>
  );
};

export default LoginModal;
