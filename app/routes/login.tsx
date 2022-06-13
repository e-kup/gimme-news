import { FC, useState } from 'react';
import { useActionData, useSearchParams } from '@remix-run/react';
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';

import {
  createUserSession,
  getUserSession,
  login,
  register,
} from '~/lib/session.server';
import FormAlert from '~/components/FormAlert';
import PageLayout from '~/components/PageLayout';
import { validatePassword, validateUsername } from '~/utils/validation';
import { db } from '~/lib/db.server';

export type LoginActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: LoginActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/';
  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Username/Password combination is incorrect`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case 'register': {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (typeof userId === 'string') {
    throw redirect('/');
  }
  return null;
};

const LoginRoute: FC = () => {
  const actionData = useActionData<LoginActionData>();
  const [searchParams] = useSearchParams();
  const isLoginType =
    !actionData?.fields?.loginType || actionData?.fields?.loginType === 'login';
  const [isLoginForm, setIsLoginTypeForm] = useState<boolean>(isLoginType);

  return (
    <PageLayout hideSidebar user={null}>
      <div className="w-full flex justify-center">
        <div className="card w-full lg:w-3/5 bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title mb-5 font-poppins text-2xl">Login</h2>
            <form method="post" autoComplete="off">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
              />
              <fieldset className="flex">
                <input
                  type="hidden"
                  name="loginType"
                  value={isLoginForm ? 'login' : 'register'}
                />
                <div className="tabs mb-3 ">
                  <button
                    className={`tab tab-bordered text-inherit ${
                      isLoginForm ? 'tab-active' : ''
                    }`}
                    type="button"
                    onClick={() => setIsLoginTypeForm(true)}
                  >
                    Login
                  </button>
                  <button
                    className={`tab tab-bordered text-inherit ${
                      !isLoginForm ? 'tab-active' : ''
                    }`}
                    type="button"
                    onClick={() => setIsLoginTypeForm(false)}
                  >
                    Register
                  </button>
                </div>
              </fieldset>
              <div className="mb-5">
                <div className="form-control">
                  <label className="label" htmlFor="username-input">
                    <span className="label-text text-inherit">
                      Your Username
                    </span>
                  </label>
                  <div className="relative">
                    <label className="input-group" htmlFor="username-input">
                      <span>Username</span>
                      <input
                        type="text"
                        id="username-input"
                        name="username"
                        autoComplete="off"
                        className="input input-bordered grow"
                        aria-invalid={Boolean(
                          actionData?.fieldErrors?.username,
                        )}
                        aria-errormessage={
                          actionData?.fieldErrors?.username
                            ? 'username-error'
                            : undefined
                        }
                      />
                    </label>
                    {actionData?.fieldErrors?.username && (
                      <FormAlert>{actionData.fieldErrors.username}</FormAlert>
                    )}
                  </div>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="password-input">
                    <span className="label-text text-inherit">
                      Your Password
                    </span>
                  </label>
                  <div className="relative">
                    <label className="input-group" htmlFor="password-input">
                      <span>Password</span>
                      <input
                        type="password"
                        id="password-input"
                        name="password"
                        autoComplete="off"
                        className="input input-bordered grow"
                        defaultValue={actionData?.fields?.password}
                        aria-invalid={
                          Boolean(actionData?.fieldErrors?.password) ||
                          undefined
                        }
                        aria-errormessage={
                          actionData?.fieldErrors?.password
                            ? 'password-error'
                            : undefined
                        }
                      />
                    </label>
                    {actionData?.fieldErrors?.password && (
                      <FormAlert>{actionData.fieldErrors.password}</FormAlert>
                    )}
                  </div>
                </div>
                <div id="form-error-message">
                  {actionData?.formError && (
                    <FormAlert>{actionData.formError}</FormAlert>
                  )}
                </div>
              </div>
              <div className="card-actions justify-end">
                <button type="submit" className="btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginRoute;
