import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Organization from './components/Organization';

const App = () => {
  const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  });

  const GET_ISSUES_OF_REPOSITORY = `
    query ($organization: String!, $repository: String!) {
      organization(login: $organization) {
        name
        url
        repository(name: $repository) {
          name
          url
          issues(last: 5) {
            edges {
              node {
                id
                title
                url
              }
            }
          }
        }
      }
    }
`;

  const [path, setPath] = useState(
    'the-road-to-learn-react/the-road-to-learn-react'
  );

  const [organization, setOrganization] = useState('');

  const [errors, setErrors] = useState('');

  const getIssuesOfRepository = () => {
    const [organization, repository] = path.split('/');

    return axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY,
      variables: { organization, repository },
    });
  };

  const onFetchFromGithub = path => {
    getIssuesOfRepository(path).then(result => {
      console.log(result);
      setOrganization(result.data.data.organization);
      setErrors(result.data.errors);
    });
  };

  useEffect(() => {
    onFetchFromGithub(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = event => {
    setPath(event.target.value);
  };

  const onSubmit = event => {
    onFetchFromGithub(path);

    event.preventDefault();
  };

  const TITLE = 'React GraphQL GitbHub Client';

  return (
    <div>
      <h1>{TITLE}</h1>

      <form onSubmit={onSubmit}>
        <label htmlFor="url">Show open issues for https://github.com</label>
        <input
          id="url"
          type="text"
          value={path}
          onChange={onChange}
          style={{ width: '300px' }}
        />
        <button type="submit">Search</button>
      </form>

      <hr />
      {organization ? (
        <Organization errors={errors} organization={organization} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
};

export default App;
