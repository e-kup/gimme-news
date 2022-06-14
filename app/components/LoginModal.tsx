import { FC } from 'react';
import { useLocation, useNavigate } from '@remix-run/react';

interface LoginModalProps {
  id: string;
}

const LoginModal: FC<LoginModalProps> = ({ id }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateWithRedirect = () => {
    // eslint-disable-next-line
    console.log(location.pathname);
    const searchParams = new URLSearchParams([
      ['redirectTo', location.pathname],
    ]);
    navigate(`/login?${searchParams}`);
  };

  return (
    <div>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <div className="modal-box relative text-center">
          <h3 className="text-lg font-bold">
            Login to have access to bookmarks
          </h3>
          <p className="py-4 text-left">
            Article bookmarks are available for registered users. Login to
            unlock bookmarks.
          </p>
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
