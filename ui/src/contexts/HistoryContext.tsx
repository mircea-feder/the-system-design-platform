import React, { createContext, useContext, useState, useRef } from 'react';

// Create a context
// @ts-ignore
const HistoryContext = createContext();

// Custom hook to use history context
export const useHistory = () => useContext(HistoryContext);

// Create a provider component
export const HistoryProvider = ({ children }) => {
    const HISTORY_SIZE = 32;

    const [stateHistory, setStateHistory] = useState([]);
    const stateHistoryPos = useRef(0);

    const prevNodesRef = useRef(null);
    const prevEdgesRef = useRef(null);

    // This is the function that we want to provide via the context
    const addToHistory = (nodes, edges) => {
        prevNodesRef.current = nodes;
        prevEdgesRef.current = edges;

        if (stateHistoryPos.current !== stateHistory.length)
            stateHistory.splice(stateHistoryPos.current - stateHistory.length);
        if (stateHistory.length === HISTORY_SIZE) {
            stateHistory.shift();
            stateHistoryPos.current = HISTORY_SIZE - 1;
        }
        stateHistory.push([prevNodesRef.current, prevEdgesRef.current]);
        setStateHistory([...stateHistory]);
        stateHistoryPos.current++;
    };

    return (
        <HistoryContext.Provider value={{ addToHistory, stateHistory, setStateHistory, stateHistoryPos }}>
            {children}
        </HistoryContext.Provider>
    );
};
