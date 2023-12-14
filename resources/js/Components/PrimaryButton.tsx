import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function PrimaryButton({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-sky-600 border border-transparent rounded-md font-semibold text-sm text-white dark:text-white-800  hover:bg-gray-500 dark:hover:bg-sky-500 focus:bg-gray-700 dark:focus:bg-sky-500 active:bg-gray-900 dark:active:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-600 transition ease-in-out duration-150 rounded-lg',
        props.className,
      )}
    >
      {children}
    </button>
  );
}
