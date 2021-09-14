import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress
} from '@material-ui/core';
import './App.css';

const API_KEY = process.env.REACT_APP_NASA_API_KEY;
function App() {
  const [photos, setPhotos] = useState([]);
  const [photoLikeState, setPhotoLikeState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPhotos() {
      let response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=2021-09-10`
      );
      response = await response.json();
      setPhotos(response);

      let previouslyLikedPhotos = localStorage.getItem('likedPhotos');
      if (!previouslyLikedPhotos) {
        previouslyLikedPhotos = {};
      } else {
        previouslyLikedPhotos = JSON.parse(previouslyLikedPhotos);
      }

      response.forEach((photo) => {
        if (!previouslyLikedPhotos[photo.url]) {
          previouslyLikedPhotos[photo.url] = false;
        }
      });
      localStorage.setItem(
        'likedPhotos',
        JSON.stringify(previouslyLikedPhotos)
      );

      setPhotoLikeState(previouslyLikedPhotos);
      setLoading(false);
    }
    getPhotos();
  }, []);

  const likePhoto = (photo) => {
    let likeState = { ...photoLikeState };
    likeState[photo.url] = !likeState[photo.url];
    setPhotoLikeState(likeState);
    localStorage.setItem('likedPhotos', JSON.stringify(likeState));
  };

  return (
    <div className='app'>
      <h1>Spacetagram</h1>
      {loading ? (<CircularProgress />) : (
        <div>
          {photos.map((photo) => (
            <Card className='card' key={photo.url}>
              <CardHeader className='card-header' title={photo.title} subheader={photo.date} />
              <CardMedia
                className='card-image'
                image={photo.url}
                title={photo.title}
              />
              <CardContent style={{ paddingBottom: 0 }}>
                <p
                  className='card-explaination'
                >
                  {photo.explanation}
                </p>
              </CardContent>
              <CardActions disableSpacing>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => likePhoto(photo)}
                  className='like-button'
                >
                  {photoLikeState[photo.url] ? 'Unlike' : 'Like'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;
