import { API_BASE_URL } from "../constants"
import type { User } from "../pages/profile/Profile";
import { authService } from "./authService";

export const getUserData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: new Headers({
        'Authorization': `Bearer ${authService.getToken()}`
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as User;
  } catch (error) {
    console.error('Errore nel caricamento dell utente:', error);
    return null;
  }
}

export const updateUserData = async (user: User) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "PATCH",
      headers: new Headers({
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(user)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as User;
  } catch (error) {
    console.error('Errore nel caricamento dell utente:', error);
    return null;
  }
}

export const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me/password`, {
      method: "PUT",
      headers: new Headers({
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error('Errore nel caricamento dell utente:', error);
    return false;
  }
}

export const deleteUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "DELETE",
      headers: new Headers({
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json'
      })
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error('Errore nel caricamento dell utente:', error);
    return null;
  }
}