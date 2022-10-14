import React from 'react';
import { Search } from '@mui/icons-material';
import { ProductCatalogue } from '../../models/types';
import { useNavigate } from 'react-router';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ProductCatalogueCellAction from '../../components/catalogue/ProductCatalogueCellAction';
import { Button, TextField } from '@mui/material';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import { getAllProductCatalogues } from '../../services/productCatalogueService';

const columns: GridColDef[] = [
  {
    field: 'sku',
    headerName: 'SKU',
    valueGetter: (params: GridValueGetterParams) => params.row.product.sku,
    flex: 1
  },
  {
    field: 'name',
    headerName: 'Product Name',
    // valueFormatter: (params) => params.value.name,
    valueGetter: (params: GridValueGetterParams) => params.row.product.name,
    flex: 2
  },
  {
    field: 'brand',
    headerName: 'Brand',
    valueGetter: (params: GridValueGetterParams) =>
      params.row.product.brand.name,
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: (params) => params.value.toFixed(2),
    flex: 1
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ProductCatalogueCellAction
  }
];

const AllCatalogueProducts = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [productCatalogueData, setProductCatalogueData] = React.useState<
    ProductCatalogue[]
  >([]);
  const [filteredData, setFilteredData] = React.useState<ProductCatalogue[]>(
    []
  );

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllProductCatalogues(),
      (res) => {
        setLoading(false);
        setProductCatalogueData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? productCatalogueData.filter((productCatalogueItem) => {
            const searchFieldLower = searchField.toLowerCase().trim();
            return (
              productCatalogueItem.product.name
                ?.toLowerCase()
                .includes(searchFieldLower) ||
              // productCatalogueItem.description
              //   .toLowerCase()
              //   .includes(searchFieldLower) ||
              productCatalogueItem.price
                .toString()
                .toLowerCase()
                .includes(searchFieldLower) ||
              productCatalogueItem.product.brand.name
                .toLowerCase()
                .includes(searchFieldLower) ||
              productCatalogueItem.product.sku
                .toLowerCase()
                .includes(searchFieldLower)
            );
          })
        : productCatalogueData
    );
  }, [searchField, productCatalogueData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  return (
    <div className='product-inventory'>
      <h1>Manage Product Catalogue</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() =>
            navigate({ pathname: '/catalogue/createCatalogueProduct' })
          }
        >
          Create Catalogue Product
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        loading={loading}
        autoHeight
      />
    </div>
  );
};

export default AllCatalogueProducts;
