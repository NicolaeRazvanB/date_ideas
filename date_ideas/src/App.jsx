import React, { useEffect, useState } from "react";
import { Roulette, useRoulette } from "react-hook-roulette";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "date-ideas-9a482.firebaseapp.com",
  projectId: "date-ideas-9a482",
  storageBucket: "date-ideas-9a482.appspot.com",
  messagingSenderId: "446865522440",
  appId: "1:446865522440:web:88bb821c4323a4312bb6bd",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const options = {
  size: 300,
  maxSpeed: 100,
  rotationDirection: "clockwise",
  acceleration: 1,
  deceleration: 1,
  initialAngle: 0,
  determineAngle: 45,
  showArrow: true,
  style: {
    canvas: {
      bg: "#00ff5e",
    },
    arrow: {
      bg: "#000",
      size: 7,
    },
    label: {
      font: "9px Arial",
      align: "right",
      baseline: "middle",
      offset: 0.9,
      defaultColor: "#000",
    },
    pie: {
      border: false,
      borderColor: "#000",
      borderWidth: 2,
      theme: [
        {
          bg: "#e0e7ff",
        },
        {
          bg: "#a5b4fc",
        },
        {
          bg: "#6366f1",
          color: "#fff",
        },
        {
          bg: "#4338ca",
          color: "#fff",
        },
      ],
    },
  },
};

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ideasCollection = collection(db, "ideas");
        const ideasSnapshot = await getDocs(ideasCollection);
        const ideasData = ideasSnapshot.docs.map((doc) => ({
          name: doc.data().activity,
          type: doc.data().type,
          location: doc.data().location,
        }));
        setItems(ideasData);
      } catch (error) {
        console.error("Error fetching ideas: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.type === filter));
    }
  }, [items, filter]);

  let { roulette, onStart, onStop, result } = useRoulette({
    items: filteredItems,
    options,
  });

  useEffect(() => {
    if (result) {
      console.log("Roulette result:", result);
      setCurrentResult(result);
    }
  }, [result]);

  return (
    <div className="container">
      <h3>Welcome to date ideas roulette</h3>
      <Roulette roulette={roulette} />
      <br />
      {currentResult && <p className="roulette-result"> {currentResult}</p>}
      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
        <button onClick={onStart} disabled={filteredItems.length === 0}>
          Start
        </button>
        <button onClick={onStop} disabled={filteredItems.length === 0}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default App;
