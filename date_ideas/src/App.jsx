import React, { useEffect, useState } from "react";
import { Roulette, useRoulette } from "react-hook-roulette";
import "./App.css";
// firebase.js
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

// Initialize Firestore
const db = getFirestore(app);
const options = {
  size: 400,
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
      size: 16,
    },
    label: {
      font: "12px Arial",
      align: "right",
      baseline: "middle",
      offset: 0.8,
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
  const [currentResult, setCurrentResult] = useState(null); // State to track the current result

  useEffect(() => {
    // Function to fetch data from Firestore
    const fetchData = async () => {
      try {
        const ideasCollection = collection(db, "ideas");
        const ideasSnapshot = await getDocs(ideasCollection);
        const ideasData = ideasSnapshot.docs.map((doc) => ({
          name: doc.data().activity,
          type: doc.data().type,
        }));
        setItems(ideasData);
      } catch (error) {
        console.error("Error fetching ideas: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const { roulette, onStart, onStop, result } = useRoulette({ items, options });

  useEffect(() => {
    if (result) {
      console.log("Roulette result:", result); // Log the result to see its structure
      setCurrentResult(result);
    }
  }, [result]);

  return (
    <div className="container">
      <h1>Welcome to date ideas roulette</h1>
      <Roulette roulette={roulette} />
      <br />
      {currentResult && <p className="roulette-result"> {currentResult}</p>}
      <button type="button" onClick={onStart} disabled={items.length === 0}>
        Start
      </button>
      <button type="button" onClick={onStop} disabled={items.length === 0}>
        Stop
      </button>
    </div>
  );
}

export default App;
