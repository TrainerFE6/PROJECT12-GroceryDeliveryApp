import React, { useEffect } from 'react';
import Profile from './components/Profile';
import { useNavigate } from 'react-router-dom';
import Transaction from './components/Transaction/List';
import useColorMode from '../../hooks/useColorMode';

const DashboardLanding = () => {
    const [colorMode, setColorMode] = useColorMode();

    const [tabActive, setTabActive] = React.useState('profile');
    const user = localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof setColorMode === 'function' && colorMode === 'dark') {
            // console.log('set to dark')
            setColorMode('light');
        }

        if (!user) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [])

    return (
        <main className='min-h-screen space-y-5 pt-20 mb-9 px-25'>

            <div className="mt-12 p-4 flex flex-col md:flex-row md:items-start gap-8">
                <div className="w-80 min-w-[200px] text-xs">
                    <div className="flex flex-col border rounded overflow-hidden divide-y divide-gray-200">
                        <button
                            onClick={() => setTabActive('profile')}
                            type="button"
                            className="text-left px-4 py-2 cursor-pointer focus:outline-none tracking-widest transition duration-200m ease-in-out relative"
                        >
                            <span className={`${tabActive === 'profile' ? 'absolute right-0 inset-y-0 w-1 bg-green-500' : ''}`}></span>
                            Account
                        </button>
                        <button
                            onClick={() => { setTabActive('transactions') }}
                            type="button"
                            className="text-left px-4 py-2 cursor-pointer focus:outline-none tracking-widest transition duration-200m ease-in-out relative"
                        >
                            <span className={`${tabActive === 'transactions' ? 'absolute right-0 inset-y-0 w-1 bg-green-500' : ''}`}></span>
                            Data Transaksi
                        </button>
                    </div>
                </div>
                {tabActive === 'profile' && (
                    <Profile />
                )}
                {tabActive === 'transactions' && (
                    <div>
                        <Transaction />
                    </div>
                )}
            </div>
        </main>
    );
};

export default DashboardLanding;