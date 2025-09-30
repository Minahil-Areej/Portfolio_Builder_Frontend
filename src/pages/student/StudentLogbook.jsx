// import { useEffect, useState } from "react";
// import Layout from "../../components/layout/Layout";
// import "../assessor/LogbookView.css"; // ✅ reuse the same styles

// const StudentLogbook = () => {
//   const [logbookData, setLogbookData] = useState([]);
//   const [portfolios, setPortfolios] = useState([]);

//   // Fetch NVQ logbook JSON
//   useEffect(() => {
//     fetch("/Nvq_2357_13.json")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && Array.isArray(data.performance_units)) {
//           setLogbookData(data.performance_units);
//         } else {
//           setLogbookData([]);
//         }
//       })
//       .catch((err) => console.error("Failed to load logbook JSON", err));
//   }, []);

//   // Fetch logged-in student portfolios
//   useEffect(() => {
//     fetch("/api/portfolios/user-portfolios", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ send token
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setPortfolios(data);
//         } else {
//           setPortfolios([]);
//         }
//       })
//       .catch((err) => console.error("Failed to load student portfolios", err));
//   }, []);

//   // Match AC with student portfolios
//   const getEvidenceForCriteria = (acNumber) => {
//     return portfolios.filter(
//       (p) => p.criteria && p.criteria.number === acNumber
//     );
//   };

//   return (
//     <Layout>
//       <div className="logbook-container">
//         <h1>My NVQ Logbook</h1>

//         {logbookData.map((unit) => (
//           <div key={unit.unit} className="unit-block">
//             <h2>
//               Unit {unit.unit}: {unit.title}
//             </h2>

//             {unit.learning_outcomes.map((lo) => (
//               <div key={lo.LO_number} className="lo-block">
//                 <h3>
//                   Learning Outcome {lo.LO_number}: {lo.description}
//                 </h3>

//                 <table className="logbook-table">
//                   <thead>
//                     <tr>
//                       <th>Evidence</th>
//                       <th>Summary</th>
//                       <th>Method</th>
//                       <th>Assessment Criteria</th>
//                       <th>Range Statement</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {lo.assessment_criteria.map((criteria, idx) => {
//                       const evidence = getEvidenceForCriteria(
//                         criteria.AC_number
//                       );
//                       return (
//                         <tr key={idx}>
//                           <td className="evidence-slots">
//                             {[...Array(6)].map((_, i) => (
//                               <div key={i} className="evidence-slot">
//                                 {evidence[i] ? (
//                                   <a
//                                     href={`/portfolio/${evidence[i]._id}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     {evidence[i].title}
//                                   </a>
//                                 ) : null}
//                               </div>
//                             ))}
//                           </td>
//                           <td>{evidence[0]?.statement || ""}</td>
//                           <td>{evidence[0]?.method || ""}</td>
//                           <td>
//                             {criteria.AC_number}: {criteria.description}
//                           </td>
//                           <td>*</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </Layout>
//   );
// };

// export default StudentLogbook;


import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import "../assessor/LogbookView.css"; // reuse same styles

const StudentLogbook = () => {
  const [logbookData, setLogbookData] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  // ✅ Fetch NVQ logbook JSON
  useEffect(() => {
    fetch("/Nvq_2357_13.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.performance_units)) {
          setLogbookData(data.performance_units);
        } else {
          setLogbookData([]);
        }
      })
      .catch((err) => console.error("Failed to load logbook JSON", err));
  }, []);

  // ✅ Fetch logged-in student portfolios
  useEffect(() => {
    fetch("/api/portfolios/user-portfolios", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // send JWT
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPortfolios(data);
        } else {
          setPortfolios([]);
        }
      })
      .catch((err) => console.error("Failed to load student portfolios", err));
  }, []);

  // ✅ Helper: match AC with student portfolios
  const getEvidenceForCriteria = (unit, lo, acNumber) => {
    return portfolios.filter(
      (p) =>
        p.unit?.number === unit.unit &&
        p.learningOutcome?.number === lo.LO_number &&
        p.criteria?.number === acNumber
    );
  };

  return (
    <Layout>
      <div className="logbook-container">
        <h1>My NVQ Logbook</h1>

        {logbookData.map((unit) => (
          <div key={unit.unit} className="unit-block">
            <h2>
              Unit {unit.unit}: {unit.title}
            </h2>

            {unit.learning_outcomes.map((lo) => (
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
                    {lo.assessment_criteria.map((criteria, idx) => {
                      const evidence = getEvidenceForCriteria(
                        unit,
                        lo,
                        criteria.AC_number
                      );
                      return (
                        <tr key={idx}>
                          <td className="evidence-slots">
                            {evidence.length > 0 ? (
                              evidence.map((p) => (
                                <a
                                  key={p._id}
                                  href={`/portfolio/${p._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {p.title}
                                </a>
                              ))
                            ) : (
                              <span>No evidence yet</span>
                            )}
                          </td>
                          <td>{evidence[0]?.statement || ""}</td>
                          <td>{evidence[0]?.method || ""}</td>
                          <td>
                            {criteria.AC_number}: {criteria.description}
                          </td>
                          <td>*</td>
                        </tr>
                      );
                    })}
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

export default StudentLogbook;
