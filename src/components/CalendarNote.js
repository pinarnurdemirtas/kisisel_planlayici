import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { Calendar } from 'antd';
import axios from "axios";
import moment from 'moment'; 


const CalendarNote = () => {
  const { user } = useContext(UserContext);
  const [rutins, setRutins] = useState([]);
  const [todos, setTodos] = useState([]);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrlRutins = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa2";
  const apiUrlTodos = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa3";
  const apiUrlPlan = "https://v1.nocodeapi.com/pnurdemirtas/google_sheets/QhQmclkWghpxvaqH?tabId=sayfa4";


  useEffect(() => {
    const fetchRutins = async () => {
      try {
        const response = await axios.get(apiUrlRutins);
        const filteredRutins = response.data.data
          .filter(rutin => rutin.username === user.username)
          .map((rutin, index) => ({
            ...rutin,
            id: index + 1
          }));
        setRutins(filteredRutins);
        localStorage.setItem(`rutins_${user.username}`, JSON.stringify(filteredRutins));
        setLoading(false);
      } catch (error) {
        console.error("Rutinler getirilirken hata oluştu:", error);
        setLoading(false);
      }
    };

    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrlTodos);
        const filteredTodos = response.data.data
          .filter(todo => todo.username === user.username)
          .map((todo, index) => ({
            ...todo,
            id: index + 1
          }));
        setTodos(filteredTodos);
        localStorage.setItem(`todos_${user.username}`, JSON.stringify(filteredTodos));
        setLoading(false);
      } catch (error) {
        console.error("Todos getirilirken hata oluştu:", error);
        setLoading(false);
      }
    };

    const fetchPlan = async () => {
      try {
        const response = await axios.get(apiUrlPlan);
        const filteredPlan = response.data.data
          .filter((plan) => plan.username === user.username)
          .map((plan, index) => ({
            ...plan,
            id: index + 1,
          }));
        setPlan(filteredPlan);
        localStorage.setItem(`plan_${user.username}`, JSON.stringify(filteredPlan));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    if (user) {
      const storedRutins = JSON.parse(localStorage.getItem(`rutins_${user.username}`));
      if (storedRutins) {
        setRutins(storedRutins);
        setLoading(false);
      } else {
        fetchRutins();
      }

      const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.username}`));
      if (storedTodos) {
        setTodos(storedTodos);
        setLoading(false);
      } else {
        fetchTodos();
      }
      const storedPlans = JSON.parse(localStorage.getItem(`plan_${user.username}`));
      if (storedPlans) {
        setPlan(storedPlans);
        setLoading(false);
      } else {
        fetchPlan();
      }
    }
  }, [user]);


  
  
  

  const getListData = () => {
    if (!rutins.length) return [];

    const listData = rutins.map(rutin => ({
      type: 'info',
      content: rutin.rutins
    }));

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData();
    const updatedListData = [...listData]; // Make a copy of listData array to avoid mutating original

    todos.forEach(todo => {
      if (value.format('YYYY-MM-DD') >= todo.startDate && value.format('YYYY-MM-DD') <= todo.endDate) {
        updatedListData.push({
          type: 'success',
          content: todo.text,
        });
      }
    });

    plan.forEach(planItem => {
      if (value.format('YYYY-MM-DD') === planItem.date) { // Fixed comparison operator
        updatedListData.push({
          type: 'success',
          content: planItem.plan,
          time: planItem.time
        });
      }
    });

    return (
      <ul className="events">
        {updatedListData.map((item, index) => (
          <li key={index} style={{ backgroundColor: item.type === 'success' ? '#00008080' : 'transparent' }}>
            <span
              style={{
                fontWeight: item.type === 'success' ? 'bold' : 'normal',
              }}
            >
              {item.content}<br></br>
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    );
  };

 

  return (
    <div className="site-calendar-demo-card">
      <Calendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default CalendarNote;
