// UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  idNumber: string;
  userId: string;
}

interface AccountData {
  accountId: string;
  creditLimit: number;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  cardNumber: string;
  expiryDate: string;
  cardType: string; // exemple : 'Visa', 'Mastercard'
  status: 'active' | 'blocked' | 'expired';
}

interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  accountData: AccountData;
  setAccountData: (data: AccountData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    idNumber: '',
    userId: '',
  });

  const [accountData, setAccountData] = useState<AccountData>({
    accountId: '',
    creditLimit: 0,
    accountNumber: '',
    accountType: '',
    currency: '',
    balance: 0,
    cardNumber: '',
    expiryDate: '',
    cardType: '',
    status: 'active',
  });

  return (
    <UserContext.Provider value={{ userData, setUserData, accountData, setAccountData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
