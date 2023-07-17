// Import required libraries and components
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';
import {
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    FormControlLabel,
    Checkbox
  } from '@mui/material';

// Define the SearchPage component
function SearchPage() {
  // Define state variables
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]); 
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null);
  const [hasMatch, setHasMatch] = useState(false);
  const dogsPerPage = 12; // Define constant for dogs per page
  const navigate = useNavigate(); // Use navigate for page redirection

  // Define useEffect for fetchBreeds on component mount
  useEffect(() => {
    fetchBreeds();
  }, []);

  // Define useEffect for fetchDogs on selectedBreed or sortOrder change
  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortOrder]);

  // Define asynchronous function fetchDogs to get dogs data from server
  const fetchDogs = async () => {
    // Try-catch block to handle any errors
    try {
      const fromParam = nextCursor ? new URLSearchParams(nextCursor).get('from') : null;

      // Define params for axios request
      let params = {
        sort: `breed:${sortOrder}`,
        size: dogsPerPage,
        from: fromParam,
      };

      if (selectedBreed) {
        params.breeds = [selectedBreed];
      }

      // Define axios request for fetching dogs data
      const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/search', {
        withCredentials: true,
        params: params,
      });

      let dogIds = response.data.resultIds || [];

      const dogsResponse = await axios.post('https://frontend-take-home-service.fetch.com/dogs', dogIds, {
        withCredentials: true
      });

      // Update state variables based on received response
      setDogs(dogsResponse.data || []);
      setNextCursor(response.data.next);
      setPrevCursor(response.data.prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  };

  // Define asynchronous function fetchBreeds to get breed data from server
  const fetchBreeds = async () => {
    try {
      const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', {
        withCredentials: true,
      });
      
      setBreeds(response.data || []); // Update breeds state variable
    } catch (error) {
      console.error(error);
    }
  };
  
  // Define handlers for various events like input change, dog selection, page navigation, etc.

  const handleBreedChange = (e) => {
    setHasMatch(false);
    setSelectedBreed(e.target.value);
    fetchDogs();
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleDogSelect = (dogId) => {
    if (selectedDogs.includes(dogId)) {
      setSelectedDogs(selectedDogs.filter((id) => id !== dogId));
    } else {
      setSelectedDogs([...selectedDogs, dogId]);
    }
  };

  // Define asynchronous function for generating a match
  const generateMatch = async () => {
    try {
      console.log('Selected Dogs:', selectedDogs);

      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        selectedDogs,
        { withCredentials: true }
      );

      console.log('Full Response:', response.data);  // Logging full response for debugging
  
      // Check the structure of response.data
      console.log('response.data structure:', JSON.stringify(response.data, null, 2));

      if (response && response.data && response.data.match) {
        console.log('Match Data:', response.data); 
        setHasMatch(true);
        const matchId = response.data.match;
        const matchedDogObj = dogs.find((dog) => dog.id === matchId);
        setMatchedDog(matchedDogObj);
        console.log('Match ID:', matchId);
      } else {
        throw new Error('Response from server does not contain a match property');
      }
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  const goToNextPage = () => {
    setNextCursor(nextCursor);
    fetchDogs();
  };

  const goToPrevPage = () => {
    setNextCursor(prevCursor);
    fetchDogs();
  };

  const logout = async () => {
    try {
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, {
        withCredentials: true
      });

      if(response.status === 200) {
        setHasMatch(false);
        console.log("User logged out successfully");
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-page">
      <Typography variant="h2" className="title">
        Search for a new friend!
      </Typography>

      <div className="search-options">
        <div className="filter-options">
          <FormControl className="myFormControl" variant="outlined" size="large">
            <InputLabel id="breedLabel" >Filter by Breed</InputLabel>
            <Select
              labelId="breedLabel"
              id="breed"
              value={selectedBreed}
              onChange={handleBreedChange}
              label="Breed"
            >
            <MenuItem value="">None</MenuItem>
              {breeds.map((breed) => (
                <MenuItem value={breed} key={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="sort-options">
        <FormControl className = "myFormControl" variant="outlined" size="large">
          <InputLabel id="sortOrderLabel">Sort Order</InputLabel>
          <Select
            labelId="sortOrderLabel"
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            label="Sort Order"
          > 
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>
      </div>
      
      <div className='buttons'>
      <Button
          className='generate-button'
          variant="contained"
          color="primary"
          disabled={selectedDogs.length === 0}
          onClick={generateMatch}
        >
          Generate Match
        </Button>

        <Button
        className='logout-button'
        variant="contained"
        color="error"
        onClick={logout}
      >
        Logout
      </Button>
      </div>

      {matchedDog ? (
        <div>
          <Card className="matched-card">
            <CardMedia
              className="card-media"
              component="img"
              height="200"
              image={matchedDog.img}
              alt={matchedDog.name}
            />
            <CardContent className="card-content">
              <Typography variant="subtitle1" className="card-title">
                Matched Dog
              </Typography>
              <Typography variant="body1" className="card-details">
                Breed: {matchedDog.breed}
              </Typography>
              <Typography variant="body1" className="card-details">
                Name: {matchedDog.name}
              </Typography>
              <Typography variant="body1" className="card-details">
                Age: {matchedDog.age}
              </Typography>
              <Typography variant="body1" className="card-details">
                Zip Code: {matchedDog.zip_code}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <ul className="dog-list">
            {dogs.map((dog) => (
              <li key={dog.id} className="dog-item">
                <Card className="card">
                  <CardMedia
                    className="card-media"
                    component="img"
                    height="200"
                    image={dog.img}
                    alt={dog.name}
                  />
                  <CardContent className="card-content">
                    <Typography variant="subtitle1" className="card-title">
                      Breed: {dog.breed}
                    </Typography>
                    <Typography variant="body1" className="card-details">
                      Name: {dog.name}
                    </Typography>
                    <Typography variant="body1" className="card-details">
                      Age: {dog.age}
                    </Typography>
                    <Typography variant="body1" className="card-details">
                      Zip Code: {dog.zip_code}
                    </Typography>
                  </CardContent>
                  <CardActions className="card-actions">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedDogs.includes(dog.id)}
                          onChange={() => handleDogSelect(dog.id)}
                          color="primary"
                        />
                      }
                      label="Select"
                    />
                  </CardActions>
                </Card>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <Button
              className={`pagination-button ${!prevCursor && 'disabled-button'}`}
              onClick={goToPrevPage}
              disabled={!prevCursor}
            >
              &lt; Previous
            </Button>
            <Button
              className={`pagination-button ${!nextCursor && 'disabled-button'}`}
              onClick={goToNextPage}
              disabled={!nextCursor}
            >
              Next &gt;
            </Button>
          </div>
        </>
      )}
    </div>
);
}

// Export the SearchPage component
export default SearchPage;
