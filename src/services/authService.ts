/**
 * Authentication Service - JWT-based authentication
 * 
 * Handles login, logout, token management, and session
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// RSA Public Key for password encryption
const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2+zrbVnD+qTmTNATGI6z
k3dtO+Zk0Oy3arf0QHLtt1fTI/EVfYLBWsYhlHJm8ygkTyi/MIKJGRL1pXJGAFMh
8otlBYiWsEKudJXNDqYaeRm99hIVD8DSN1RZCXfDvHM4aYin5s6wskoh2V2DKW7B
K/mifAFuWJ4A7+FgZ1dC3YDuNZ4+c+pOXg/algw+ZAy955QsPsHnDdiIWNVVKx6O
n9ITAWB3ZYvf5CTYOM33caU055KvhftzBBPsSX5qRV/ZvissukiKeIFTL7g9FNxu
3LFZKpmuVTo3WfPyc1aTwOAY/bt4h+WciBZ/oYGBYApkke+O8AX2V3xUoo+Zm/Ud
4QIDAQAB
-----END PUBLIC KEY-----`;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface InviteAdminData {
  email: string;
  full_name: string;
  mobile: string;
  location: string;
  note: string;
}

export interface InviteAdminResponse {
  message: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Convert PEM public key to CryptoKey
   */
  private async importRsaKey(pem: string): Promise<CryptoKey> {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length
    );
    const binaryDerString = window.atob(pemContents.replace(/\s/g, ''));
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return await window.crypto.subtle.importKey(
      'spki',
      binaryDer.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  }

  /**
   * Encrypt password using RSA public key
   */
  private async encryptPassword(password: string): Promise<string> {
    try {
      const publicKey = await this.importRsaKey(RSA_PUBLIC_KEY);
      const encodedPassword = new TextEncoder().encode(password);
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        encodedPassword
      );

      // Convert to hex string (not base64)
      const encryptedArray = new Uint8Array(encryptedBuffer);
      let hexString = '';
      for (let i = 0; i < encryptedArray.length; i++) {
        const hex = encryptedArray[i].toString(16).padStart(2, '0');
        hexString += hex;
      }
      return hexString;
    } catch (error) {
      console.error('Password encryption failed:', error);
      throw new Error('Failed to encrypt password');
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // console.log('Attempting login for:', credentials.email);
      
      // Encrypt password before sending
      const encryptedPassword = await this.encryptPassword(credentials.password);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: encryptedPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Invalid credentials');
      }

      const data: LoginResponse = await response.json();
      // console.log('Login successful:', data);

      // Store tokens and user data
      this.setAccessToken(data.access);
      this.setRefreshToken(data.refresh);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout - clear all session data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // console.log('User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set access token
   */
  private setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set refresh token
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Set user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Invite a new admin
   */
  async inviteAdmin(data: InviteAdminData): Promise<InviteAdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to send invitation');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Invite admin failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
