import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from './App.styled';
import * as API from 'services/Api';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';

const App = () => {
  const [imagesData, setImagesData] = useState([]);
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [tagsImg, setTagsImg] = useState('');

  useEffect(() => {
    if(value === '') {
      return;
    }

    getImages(value, page);
  }, [value, page]);

  const getImages = async (query, page) => {
    setIsLoading(true);
    try {
      const images = await API.getImages(query, page);
      if(images.hits.length === 0) {
        setIsLoading(false);

       return toast.error('Sorry, there are no images matching your search query. Please try again.');
      }

        setImagesData(state => [...state, ...images.hits]);
        setTotalImages(images.totalHits);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }   
  }

  const handleSearch = (query) => {
    if(query === '') {
      toast.warn('The input field cannot be empty.');
    }
    if(value === query) {
      return;
    }
    setValue(query);
    setPage(1);
    setImagesData([]); 
  } 

  const onLoadMore = () => {
    setPage(state => state + 1);
  }

  const onOpenModal = (largeImg, tagsImg) => {
    setShowModal(true);
    setLargeImg(largeImg);
    setTagsImg(tagsImg);
  }

  const onCloseModal = () => {
    setShowModal(false);
    setLargeImg('');
    setTagsImg('');
  }

  const totalPage = totalImages/imagesData.length;

    return (
      <Container>
        <Searchbar onSubmit={handleSearch}/>
        {imagesData.length > 0 && 
        (<ImageGallery images={imagesData} onOpenModal={onOpenModal}/>)}
        {totalPage > 1 && !isLoading && imagesData.length > 0 &&
            <Button onLoadMore={onLoadMore}/>}
        {showModal && <Modal onCloseModal={onCloseModal} largeImg={largeImg} tagsImg={tagsImg}/>}
        {isLoading && <Loader/>}
        {error && toast.error("Oops, an error occurred while loading the page. Please try reloading the page")}
        <ToastContainer autoClose={3000} theme="colored"/>
      </Container>
    );
};

export default App;
