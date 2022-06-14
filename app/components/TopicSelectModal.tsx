import { FC } from 'react';
import { useLocation, useNavigate } from '@remix-run/react';
import { Topic } from '~/types';

const ID = 'topic-select-modal';

interface TopicSelectProps {
  topics: Topic[];
}

export const TopicSelectModal: FC<TopicSelectProps> = ({ topics }) => {
  return (
    <div>
      <input type="checkbox" id={ID} className="modal-toggle" />
      <div className="modal cursor-pointer">
        <div className="modal-box relative text-center">
          <h3 className="text-lg font-bold mb-6">
            Select topic you want to follow
          </h3>
          <form method="post">
            <input type="hidden" name="formId" id="save-topic" />
            <ul className="text-left mb-6 grid grid-cols-2">
              {topics.map((t) => (
                <li key={t.id} className="grid grid-cols-2 py-1 px-3">
                  <span>{t.name}</span>
                  <input
                    key={t.id}
                    id={t.id}
                    type="checkbox"
                    className="toggle toggle-accent"
                    defaultChecked={t.selected}
                  />
                </li>
              ))}
            </ul>
            {/*<label htmlFor={ID}>*/}
            <button type="submit" className="btn btn-primary">
              Save selection
            </button>
            {/*</label>*/}
          </form>
        </div>
      </div>
    </div>
  );
};

export const TopicSelectModalTrigger: FC = ({ children }) => {
  return (
    <label className="cursor-pointer" htmlFor={ID}>
      {children}
    </label>
  );
};

export default TopicSelectModal;
