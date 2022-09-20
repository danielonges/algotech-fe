import React, { FormEvent } from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material';
import '../../styles/pages/inventory/inventory.scss';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Brand } from '../../models/types';
import { createBrand } from '../../services/brandService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
 } from 'src/components/common/TimeoutAlert';

export type NewBrand = Partial<Brand>;

const CreateBrand = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newBrand, setNewBrand] = React.useState<NewBrand>({});

  const handleEditBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBrand((prev) => {
      if (prev) {
        return { ...prev, [e.target.name]: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newBrand) {
      setLoading(true);
      await asyncFetchCallback(
        createBrand(newBrand),
        () => {
          setLoading(false);
          setAlert({
            severity: 'success',
            message:
              'Brand successfully created! You will be redirected back to the All Brands page now.'
          });
          setTimeout(() => navigate('/inventory/allBrands'), 3500);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setLoading(false);
          setAlert({
            severity: 'error',
            message: `Error creating supplier: ${resData.message}`
          });
        }
      );
    }
  };
  return (
    <div>
      <Tooltip title='Return to Previous Page' enterDelay={300}>
        <IconButton size='large' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>

      <div className='create-product'>
        <Box className='create-product-box'>
          <div className='header-content'>
            <h1>Create Brand</h1>
          </div>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          <Paper elevation={2}>
            <Backdrop
              sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
              }}
              open={loading}
            >
              <CircularProgress color='inherit' />
            </Backdrop>
            <form onSubmit={handleSave}>
              <FormGroup className='create-product-form'>
                <div className='top-content'>
                  <div className='product-text-fields'>
                    <TextField
                      required
                      fullWidth
                      id='outlined-required'
                      label='Brand Name'
                      name='name'
                      value={newBrand?.name}
                      onChange={handleEditBrand}
                      placeholder='eg.: Kettle Gourmet'
                    />
                  </div>
                </div>
                <div className='button-group'>
                  <Button
                    variant='text'
                    className='cancel-btn'
                    color='primary'
                    onClick={() =>
                      navigate({ pathname: '/inventory/allBrands' })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    className='create-btn'
                    color='primary'
                  >
                    Create Brand
                  </Button>
                </div>
              </FormGroup>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CreateBrand;
