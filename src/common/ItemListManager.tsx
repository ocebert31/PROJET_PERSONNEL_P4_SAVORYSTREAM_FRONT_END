import React, { useState } from 'react';
import { ItemListManagerProps } from '../types/Sauce';

function ItemListManager({ label, id, list, field, setValue, error }: ItemListManagerProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedInput = inputValue.trim();
            checkInputNotEmpty(trimmedInput);
        }
    };

    const checkInputNotEmpty = (trimmedInput: string) => {
        if (trimmedInput !== '') {
            return checkItem(trimmedInput);
        }
    };

    const checkItem = (trimmedInput: string) => {
        if (trimmedInput.length > 30) {
            alert("L'élément ne doit pas dépasser 30 caractères");
        } else {
            return checkExistingItem(trimmedInput);
        }
    };

    const checkExistingItem = (trimmedInput: string) => {
        if (!list.includes(trimmedInput)) {
            const newItems = [...list, trimmedInput];
            setValue(field, newItems);
            setInputValue('');
        } else {
            alert("Cet élément existe déjà");
        }
    };

    const handleRemoveItem = (indexToRemove: number) => {
        const newItems = list.filter((_, index) => index !== indexToRemove);
        setValue(field, newItems);
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 flex items-center flex-wrap border border-gray-300 rounded-md shadow-sm px-3 py-2">
                {list.map((item, index) => (
                    <span key={index} className="bg-primary text-white text-sm px-2 py-1 rounded-full mr-2 flex items-center">
                        {item}
                        <button onClick={() => handleRemoveItem(index)} className="ml-2 text-xs text-white">x</button>
                    </span>
                ))}
                <div>
                    <input type="text" id={id} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Ajouter ${label.toLowerCase()}`} className="outline-none flex-grow text-sm"/>
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}

export default ItemListManager;