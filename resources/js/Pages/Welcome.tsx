import { Link } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();
  const page = useTypedPage();

  return (
    <>
      <Head title="Bienvenidos" />

      <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
        {canLogin ? (
          <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
            {page.props.auth.user ? (
              <Link
                href={route('dashboard')}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="font-semibold text-gray-600  dark:text-gray-400 dark:hover:text-white bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Iniciar sesión
                </Link>

                {canRegister ? (
                  <Link
                    href={route('register')}
                    className="ml-4 font-semibold text-gray-600  dark:text-gray-400 dark:hover:text-white bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Registrarse
                  </Link>
                ) : null}
              </>
            )}
          </div>
        ) : null}
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="flex justify-center items-center">
            <img src="https://1.bp.blogspot.com/-umI_DVMtL8w/WJgb0H5VL5I/AAAAAAAAIEQ/nNB_m5uRZPoRQQsxiCkn8a3L_7EpUKDngCLcB/w851-h444-c/114608-dre-cusco-solicita-actualizacion-documentos-autorizacion-academias-pre.jpg" alt="Imagen Principal" className="w-full max-w-screen-lg rounded-lg shadow-lg" />
          </div>

          <div className="mt-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Academia Preuniversitaria</h1>
            <p className="mt-4 text-lg text-center text-gray-700 dark:text-gray-300">¡Prepárate para tu futuro académico con nosotros!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Proyecto:</p>
            <p>Academia Pre-universitaria</p>
            <p>Taller Desarrollo de Software</p>
          </div>
        </div>
      </div>
    </>
  );
}
