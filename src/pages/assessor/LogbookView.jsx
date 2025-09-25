import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout"; // ✅ adjust path if needed
// import "./LogbookView.css"; // optional for styling

const LogbookView = () => {
  const [logbookData, setLogbookData] = useState([]);

  useEffect(() => {
    fetch("/Nvq_2357_13.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.units)) {
          setLogbookData(data.units); // ✅ always set the array
        } else {
          setLogbookData([]); // fallback
        }
      })
      .catch((err) => console.error("Failed to load logbook JSON", err));
  }, []);

  return (
    <Layout>
      <div className="logbook-container">
        <h1>NVQ Logbook</h1>

        {logbookData.map((unit) => (
          <div key={unit.unit} className="unit-block">
            <h2>
              Unit {unit.unit}: {unit.title}
            </h2>

            {unit.learningOutcomes.map((lo) => (
              <div key={lo.LO_number} className="lo-block">
                <h3>
                  Learning Outcome {lo.LO_number}: {lo.description}
                </h3>

                <table className="logbook-table">
                  <thead>
                    <tr>
                      <th>Evidence</th>
                      <th>Summary</th>
                      <th>Method</th>
                      <th>Assessment Criteria</th>
                      <th>Range Statement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lo.criteria.map((criteria, idx) => (
                      <tr key={idx}>
                        {/* 6 empty Evidence slots */}
                        <td className="evidence-slots">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="evidence-slot">
                              {/* Later: portfolio link goes here */}
                            </div>
                          ))}
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          {criteria.AC_number}: {criteria.description}
                        </td>
                        <td>*</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default LogbookView;
