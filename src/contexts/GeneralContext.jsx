// src/contexts/GeneralContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { portuguese, english, spanish } from '@/public/texts';

// Criar o contexto
const GeneralContext = createContext();

// Hook personalizado para usar o contexto
export const useGeneralContext = () => useContext(GeneralContext);

// Provedor do contexto
export const GeneralProvider = ({ children }) => {
    const [language, setLanguage] = useState('pt');
    const [texts, setTexts] = useState(portuguese);

    const handleChangeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        if (newLanguage === 'pt') {
            setTexts(portuguese);
        } else if (newLanguage === 'en') {
            setTexts(english);
        } else if (newLanguage === 'es') {
            setTexts(spanish);
        }
    }

    useEffect(() => {
        handleChangeLanguage(language);
    }, [language]);

    // Valores e funções expostos pelo contexto
    const value = {
        language,
        setLanguage,
        texts,
        setTexts,
    };

    return (
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    );
};