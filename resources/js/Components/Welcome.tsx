import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome() {
  return (
    <div>
      <div className="p-6 lg:p-8 bg-white dark:bg-gray-800 dark:bg-gradient-to-bl dark:from-gray-700/50 dark:via-transparent border-b border-gray-200 dark:border-gray-700">

        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex justify-center">
            <img className='w-32' src="https://usagif.com/wp-content/uploads/2022/4hv9xm/dancing-duck-acegifcom-37.gif" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
