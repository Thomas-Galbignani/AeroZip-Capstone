import { useEffect, useState } from 'react';
import {
  changeUserPassword,
  deleteUser,
  getUserData,
  updateUserData,
} from '../../services/userService';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const loadUserData = async () => {
    const user = await getUserData();
    if (user) {
      setUser(user);
      setFormData(user);
    }
  };

  const onLogoutClick = () => {
    authService.removeToken();
    document.dispatchEvent(new CustomEvent('login'));
    navigate('/');
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSave = async () => {
    const newUser = await updateUserData(formData);
    if (newUser) {
      console.log('Dati salvati:', formData);
      setFormData(newUser);
      setUser(newUser);
      setIsEditing(false);
    } else {
      alert('Error');
    }
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert('Le password non corrispondono!');
      return;
    }

    if (await changeUserPassword(oldPassword, password)) {
      console.log('Password modificata');
      alert('Password modificata con successo');
      setIsChangingPassword(false);
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleDelete = async () => {
    if (await deleteUser()) {
      authService.removeToken();
      document.dispatchEvent(new CustomEvent('login'));
      console.log('Account eliminato');
      alert('Account eliminato');
      navigate('/');
    }
  };

  if (isChangingPassword) {
    return (
      <div className="container my-5">
        <div
          className="card mx-auto shadow-sm bg-purple-white border-grey-400"
          style={{ maxWidth: '500px' }}
        >
          <div className="card-body">
            <h2 className="text-purple-dark mb-4">Modifica Password</h2>

            <div className="mb-3">
              <label className="form-label text-grey-900">
                Vecchia Password:
              </label>
              <input
                type="password"
                className="form-control border-grey-400 bg-purple-white-light"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-grey-900">
                Nuova Password:
              </label>
              <input
                type="password"
                className="form-control border-grey-400 bg-purple-white-light"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-grey-900">
                Conferma Password:
              </label>
              <input
                type="password"
                className="form-control border-grey-400 bg-purple-white-light"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="d-grid d-md-flex gap-2 mt-3">
              <button
                className="aero-zip-button__turquoise aero-zip-button__turquoise--medium"
                onClick={handlePasswordChange}
              >
                Cambia Password
              </button>
              <button
                className="aero-zip-button__secondary aero-zip-button__secondary--medium"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (showDeleteConfirm) {
    return (
      <div className="container my-5">
        <div
          className="card mx-auto shadow-sm bg-purple-white border-grey-400"
          style={{ maxWidth: '500px' }}
        >
          <div className="card-body">
            <h2 className="text-purple-dark mb-3">Conferma Eliminazione</h2>
            <p>Sei sicuro di voler eliminare il tuo account?</p>
            <p className="text-red fw-bold">Questa azione è irreversibile!</p>
            <div className="d-grid d-md-flex gap-2 mt-3">
              <button
                className="aero-zip-button__red aero-zip-button__red--medium"
                onClick={handleDelete}
              >
                Elimina Definitivamente
              </button>
              <button
                className="aero-zip-button__secondary aero-zip-button__secondary--medium"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isEditing) {
    return (
      <div className="container my-5">
        <div
          className="card mx-auto shadow-sm bg-purple-white border-grey-400"
          style={{ maxWidth: '500px' }}
        >
          <div className="card-body">
            <h2 className="text-purple-dark mb-4">Modifica Profilo</h2>

            <div className="mb-3">
              <label className="form-label text-grey-900">Nome:</label>
              <input
                type="text"
                className="form-control border-grey-400 bg-purple-white-light"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-grey-900">Cognome:</label>
              <input
                type="text"
                className="form-control border-grey-400 bg-purple-white-light"
                value={formData.surname}
                onChange={e =>
                  setFormData({ ...formData, surname: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-grey-900">Email:</label>
              <input
                type="email"
                className="form-control border-grey-400 bg-purple-white-light"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-grey-900">Telefono:</label>
              <input
                type="tel"
                className="form-control border-grey-400 bg-purple-white-light"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="d-grid d-md-flex gap-2 mt-3">
              <button
                className="aero-zip-button aero-zip-button--medium"
                onClick={handleSave}
              >
                Salva
              </button>
              <button
                className="aero-zip-button__secondary aero-zip-button__secondary--medium"
                onClick={() => setIsEditing(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container my-5">
      <div
        className="card mx-auto shadow-sm bg-purple-white border-grey-400"
        style={{ maxWidth: '500px' }}
      >
        <div className="card-body">
          <h2 className="text-purple-dark mb-4">Il Mio Profilo</h2>

          <p>
            <strong>Nome:</strong> {user?.name}
          </p>
          <p>
            <strong>Cognome:</strong> {user?.surname}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Telefono:</strong> {user?.phone}
          </p>

          <div className="d-grid d-md-flex gap-2 mt-3">
            <button
              className="aero-zip-button aero-zip-button--medium"
              onClick={() => setIsEditing(true)}
            >
              Modifica
            </button>
            <button
              className="aero-zip-button__turquoise aero-zip-button__turquoise--medium"
              onClick={() => setIsChangingPassword(true)}
            >
              Cambia Password
            </button>
            <button
              className="aero-zip-button__secondary--medium"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          </div>
          <div className="d-grid d-md-flex gap-2 mt-2">
            <button
              className="aero-zip-button__red aero-zip-button__red--medium"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Elimina Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
