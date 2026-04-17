import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminAuth.module.css';

function AdminAuth() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminData', JSON.stringify(response.data.admin));
                navigate('/admin');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.Main}>
            <div className={styles.Modal}>
                <h2>Вход в админ-панель</h2>
                {error && <div className={styles.Error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username"
                        placeholder='Логин' 
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder='Пароль' 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAuth;