import React, { useState } from "react";
import axios from "axios";

const Recommend = () => {
  const [skills, setSkills] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/recommend", { skills });
      setResults(res.data.recommended_careers);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Get AI-Powered Career Recommendations</h2>
      <textarea
        rows="5"
        cols="50"
        placeholder="Enter your skills..."
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>

      <ul>
        {results.map((career, i) => (
          <li key={i}>{career}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommend;
