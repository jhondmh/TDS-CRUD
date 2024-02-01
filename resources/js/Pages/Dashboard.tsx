import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Button } from '@mantine/core';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,

            text: 'Numero de Estudiantes',
        },
    },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const data = {
    labels,
    datasets: [
        {
            label: 'Inscritos',
            data: labels.map(() => generateRandomNumber(0, 500)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Asistentes',
            data: labels.map(() => generateRandomNumber(0, 500)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const numeroEstudantes = 500;
const numeroDocentes = 30;
const revenue = 20000;
const otherData = 12345;

//TORTA PS
export const optionsTorta = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,

            text: 'Porcentaje de Estudiantes por area',
        },
    },
};
export const dataTorta = {
    labels: ['Ingenieria', 'Sociales', 'Biomedicas'],
    datasets: [
        {
            label: 'Numero de Estudiantes por area',
            data: [40, 40, 20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        },
    ],
};
const DashboardPrueba: React.FC = () => {
    return (
        <AppLayout
            title="Dashboard"
            renderHeader={() => (
                <div className='flex justify-around'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Dashboard
                    </h2>
                    <Button component="a" size="md" href="https://academia.tdslaravelreact.xyz/pdf/notas" target="_blank">
                        Generar Reporte
                    </Button>
                </div>

            )}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">Número de estudiantes</h2>
                                <p className="text-3xl font-bold">{numeroEstudantes}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">Número de docentes</h2>
                                <p className="text-3xl font-bold">{numeroDocentes}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">Dinero recaudado</h2>
                                <p className="text-3xl font-bold">S/. {revenue}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">Otros datos</h2>
                                <p className="text-3xl font-bold">{otherData}</p>
                            </div>
                            {/* Puedes agregar más tarjetas para mostrar otros datos */}
                        </div>
                        <div className='flex mt-2'>
                            <div className='w-1/4 flex items-center'>
                                <Pie options={optionsTorta} data={dataTorta} />
                            </div>
                            <div className='w-3/4'>
                                <Line options={options} data={data} />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default DashboardPrueba;
