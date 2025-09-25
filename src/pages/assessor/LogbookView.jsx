import React, { useEffect, useState } from 'react';
import Layout from '../../Layout';
import NvqData from '../../Nvq_2357_13.json';

const LogbookView = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await fetch('/api/portfolios/user-portfolios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setPortfolios(data);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
      }
    };
    fetchPortfolios();
  }, []);

  // render up to 6 evidence slots
  const renderEvidenceCells = (acNumber) => {
    const matches = portfolios.filter((p) => p.criteria?.number === acNumber);
    const cells = Array(6).fill('—');
    matches.forEach((p, i) => {
      if (i < 6) {
        cells[i] = (
          <a href={`/portfolio/view/${p._id}`} target="_blank" rel="noreferrer">
            {p.title || `Portfolio ${p._id}`}
          </a>
        );
      }
    });
    return cells.map((c, i) => <td key={i}>{c}</td>);
  };

  return (
    <Layout user={{ role: 'assessor' }}>
      <div className="container">
        {NvqData.performance_units.map((unit) => (
          <div key={unit.unit} className="mb-5">
            <h3 className="mb-3">
              Unit {unit.unit} – {unit.title}
            </h3>

            {unit.learning_outcomes.map((lo) => (
              <div key={lo.LO_number} className="mb-4">
                <h5>Outcome {lo.LO_number}: {lo.description}</h5>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Assessment Criteria</th>
                      <th colSpan="6">Evidence</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lo.assessment_criteria.map((ac) => {
                      const methods = portfolios
                        .filter((p) => p.criteria?.number === ac.AC_number)
                        .map((p) => p.method)
                        .filter(Boolean);

                      return (
                        <tr key={ac.AC_number}>
                          <td>{ac.AC_number} – {ac.description}</td>
                          {renderEvidenceCells(ac.AC_number)}
                          <td>{methods.join(', ') || '—'}</td>
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

export default LogbookView;
