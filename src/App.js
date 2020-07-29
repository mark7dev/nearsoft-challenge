import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

function App() {

  const [ searchList, setSearchList ] = useState([]);
  const [ issues, setIssues ] = useState([]);
  const [ error, setError ] = useState(false);

  const searching = e => {
    let issueSearch = e.target.value.toLowerCase();
    let results = issues.filter( issue => issue.title.toLowerCase().search(issueSearch) !== -1);
    setSearchList(results);
  }

  const colorStyle = (labelColor) => {
    let color = `#${labelColor}`;
    return color
  }

  useEffect(() => {
    axios.get('https://api.github.com/repos/facebook/react/issues')
      .then(function (response) {
        // handle success
        setIssues(response.data);
        setSearchList(response.data);
      })
      .catch(function (error) {
        // handle error
        setError(true);
      })
  }, []);

  return (
    <div className="App">
      { error ? 
        <h1>Ups! Problems with API</h1>
        :
        <div className="container">
          <h1>React issues repository</h1>
          <div className="search__container">
            <i className="fa fa-search icons" aria-hidden="true"></i>
            <input
              className="searchInput" 
              type="text"
              onChange={searching}
              placeholder="Search an issue"
            />
          </div>
          <div className="issues__container">
            
            { searchList.map(issue => (
                <div
                  key={issue.id}
                  className="issue__box"
                >
                  <div className="main__box">
                    <div className="info__container">
                      <div className="warning__container">
                        <i className="fa fa-exclamation-circle warning" aria-hidden="true"></i>
                        <h4>{issue.title}</h4>
                      </div>
                      
                      { issue.labels.map((label, index) => (
                        <div 
                          className="label"
                          style={{ backgroundColor: colorStyle(label.color)}}
                          key={index}
                        >
                          {label.name}
                        </div>
                      ))}
                    </div>
                    { issue.comments !== 0 ?
                      <div className="comments">
                        <i className="fa fa-comment-o icons" aria-hidden="true"></i>
                        <span>{issue.comments}</span>
                      </div> : null
                    }
                  </div>
                  <p>#{issue.number} opened {moment(issue.updated_at).startOf().fromNow()} by {issue.user.login}</p>
                </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}

export default App;
