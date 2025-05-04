import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileModal from '../ProfileModal/ProfileModal';
import { useAuthSync } from '../../../useAuthSync';

const Header = () => {
    useAuthSync();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <header className="header">
            <h1>Реестр запросов на оформление ЗНО</h1>
            <div className="header-actions">
                <button
                    className="header-button"
                    onClick={() => setIsProfileOpen(true)}
                >
                    <span className="icon">🙍‍♂️</span>
                    <span>Профиль</span>
                </button>
                <button
                    className="header-button"
                    onClick={handleLogout}
                >
                    <span className="icon">🚪</span>
                    <span>Выход</span>
                </button>
            </div>

            {isProfileOpen && (
                <ProfileModal
                    onClose={() => setIsProfileOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;
