// TaskStatusContext.js
import React, { createContext, useState, useContext } from 'react';

const TaskStatusContext = createContext();

export const TaskStatusProvider = ({ children }) => {

    const TASKS = {
        NO_TASK: 'NO_TASK',
        PROCESSING: 'PROCESSING',
        WORKSHOP_INIT: 'WORKSHOP_INIT',
        WORKSHOP_PREVIEW: 'WORKSHOP_PREVIEW',
      };
    const [taskStatus, setTaskStatus] = useState("NO_TASK");

    return (
    <TaskStatusContext.Provider value={{ taskStatus, setTaskStatus }}>
        {children}
    </TaskStatusContext.Provider>
    );
};

export const useTaskStatus = () => useContext(TaskStatusContext);
