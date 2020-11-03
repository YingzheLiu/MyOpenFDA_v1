import "./App.css";
import React, { useState } from "react";
import { fetchReports } from "./fetchReports";
import { fetchDrug } from "./fetchDrug";
import { fetchAdverseEvent } from "./fetchAdverseEvent";
import { fetchReactions } from "./fetchReactions";

function App() {
  const [totalReport, setTotalReport] = useState();
  const [numOfDrugReport, setNumOfDrugReport] = useState();
  const [numOfEventReport, setNumOfEventReport] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [drugName, setDrugName] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [reactions, setReactions] = useState([]);
  const [error, setError] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    // Fetch the total number of reports in the database
    fetchReports().then((result) => {
      setTotalReport(result);
      console.log(result);
    });

    // Fetch the list of reactions given drug of interest and fetch number of reports associates with the drug and adverse event in the database
    fetchReactions(drugName)
      .then(
        (data) => {
          return data.map((reaction) => {
            let totalReaction;
            fetchAdverseEvent(reaction.term)
              .then(
                (result) => {
                  totalReaction = result;
                  return {
                    term: reaction.term,
                    count: reaction.count,
                    total: totalReaction,
                  };
                },
                (error) => {
                  return reaction;
                }
              )
              .then((newReaction) => {
                // console.log(newReaction);
                return newReaction;
              });
          });
        },
        (error) => {
          setError(error);
        }
      )
      .then((newReactions) => {
        setReactions(newReactions);
        console.log(newReactions);
        setIsLoading(false);
      });

    // fetchDrug(drugName).then((result) => {
    //   // setNumOfDrugReport(result);
    //   .then(()=> {
    //     fetchReactions(drugName)
    //     .then((data) => {
    //       setReactions(data);
    //     })
    //     .then(() => {
    //       console.log(reactions);
    //       let totalReaction;
    //       const newReactions = reactions.map((reaction) => {
    //         fetchAdverseEvent(reaction.term)
    //           .then((result) => {
    //             totalReaction = result;
    //           })
    //           .then(() => {
    //             console.log(totalReaction);
    //             return {
    //               term: reaction.term,
    //               count: reaction.count,
    //               total: totalReaction,
    //             };
    //           });
    //       });
    //       setReactions(newReactions);
    //       setIsLoading(false);
    //     });
    //   });
    // });

    // fetchAdverseEvent(adverseEvent).then((result) => {
    //   setNumOfEventReport(result);
    // });
  }

  function handleDrugChange(event) {
    setDrugName(event.target.value);
  }
  function handleAdverseEventChange(event) {
    setAdverseEvent(event.target.value);
  }
  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="drugName">Drugname</label>
            <input
              type="text"
              value={drugName}
              onChange={handleDrugChange}
              className="form-control"
              id="drugName"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        {!isLoading && (
          <>
            <h3>Total Number of Reports: {totalReport}</h3>
            <h3>Total Number of Drug Reports (a+b): {numOfDrugReport} </h3>
            <h3>
              Total Number of Adverse Event Reports (a+c): {numOfEventReport}
            </h3>
            {reactions.map((reaction) => {
              return (
                <>
                  <div className="posts" key={reaction.term}>
                    <table className="table table-bordered table-hover ">
                      <thead>
                        <tr>
                          <th scope="col">Drugname</th>
                          <th scope="col">Reaction</th>
                          <th scope="col">a</th>
                          <th scope="col">b</th>
                          <th scope="col">c</th>
                          <th scope="col">d</th>
                          <th scope="col">ROR</th>
                          <th scope="col">PRR</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{drugName}</td>
                          <td>{reaction.term}</td>
                          <td>{reaction.count}</td>
                          <td>{numOfDrugReport - reaction.count}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default App;
